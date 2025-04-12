const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const { CLIENT_LONG_PASSWORD } = require('mysql/lib/protocol/constants/client');
dotenv.config();
// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI;
// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

// Connect to MongoDB with retry logic
async function connectWithRetry() {
    try {
        await mongoose.connect(MONGODB_URI, options);
        console.log('Successfully connected to MongoDB');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(connectWithRetry, 5000);
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
}

// Start the connection
connectWithRetry();

// User/Computer Schema
const userSchema = new mongoose.Schema({
    computer_name: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    ip_address: { type: String },
    first_seen: { type: Date, default: Date.now },
    last_seen: { type: Date, default: Date.now },
    total_events: { type: Number, default: 0 },
    failed_attempts: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended', 'blocked'], default: 'active' }
});

// Event Schema
const eventSchema = new mongoose.Schema({
    event_id: { type: String, required: true },
    time: { type: Date, required: true },
    computer_name: { type: String, required: true },
    user_name: { type: String, required: true },
    event_type: { type: String, required: true },
    ip_address: { type: String, required: true },
    status: { type: String, required: true }
});

// Create indexes
userSchema.index({ computer_name: 1 });
userSchema.index({ user_name: 1 });
userSchema.index({ ip_address: 1 });
eventSchema.index({ computer_name: 1 });
eventSchema.index({ time: 1 });
eventSchema.index({ event_type: 1 });
eventSchema.index({ status: 1 });

// Create models
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

// Function to store events and update user information
async function storeEvents(events) {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            for (const event of events) {
                // Check if user/computer exists
                let user = await User.findOne({ computer_name: event.computer_name });
                
                if (!user) {
                    // Create new user/computer record
                    user = new User({
                        computer_name: event.computer_name,
                        user_name: event.user_name,
                        ip_address: event.ip_address,
                        first_seen: event.time,
                        last_seen: event.time,
                        total_events: 1,
                        failed_attempts: event.status === 'failure' ? 1 : 0
                    });
                } else {
                    // Update existing user/computer record
                    user.last_seen = event.time;
                    user.total_events += 1;
                    if (event.status === 'failure') {
                        user.failed_attempts += 1;
                    }
                    // Update user name and IP if they've changed
                    if (user.user_name !== event.user_name) {
                        user.user_name = event.user_name;
                    }
                    if (user.ip_address !== event.ip_address) {
                        user.ip_address = event.ip_address;
                    }
                }

                await user.save({ session });

                // Store the event
                const newEvent = new Event(event);
                await newEvent.save({ session });
            }

            await session.commitTransaction();
            console.log('Events stored and user information updated successfully');
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error storing events:', error);
        throw error;
    }
}

// Function to get all events
async function getAllEvents() {
    try {
        return await Event.find().sort({ time: -1 });
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
}

// Function to get events by user
async function getEventsByUser(username) {
    try {
        return await Event.find({ computer_name: username }).sort({ time: -1 });
    } catch (error) {
        console.error('Error getting events by user:', error);
        throw error;
    }
}

// Function to get events by IP
async function getEventsByIP(ip) {
    try {
        return await Event.find({ ip_address: ip }).sort({ time: -1 });
    } catch (error) {
        console.error('Error getting events by IP:', error);
        throw error;
    }
}

// Function to get events by type
async function getEventsByType(type) {
    try {
        return await Event.find({ event_type: type }).sort({ time: -1 });
    } catch (error) {
        console.error('Error getting events by type:', error);
        throw error;
    }
}

// Function to get events by time range
async function getEventsByTimeRange(startTime, endTime) {
    try {
        return await Event.find({
            time: {
                $gte: startTime,
                $lte: endTime
            }
        }).sort({ time: -1 });
    } catch (error) {
        console.error('Error getting events by time range:', error);
        throw error;
    }
}

// Function to get user information
async function getUserInfo(computerName) {
    try {
        return await User.findOne({ computer_name: computerName });
    } catch (error) {
        console.error('Error getting user information:', error);
        throw error;
    }
}

// Function to get all users
async function getAllUsers() {
    try {
        return await User.find().sort({ last_seen: -1 });
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}

// Function to update user status
async function updateUserStatus(computerName, status) {
    try {
        return await User.findOneAndUpdate(
            { computer_name: computerName },
            { status: status },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
}

module.exports = {
    storeEvents,
    getAllEvents,
    getEventsByUser,
    getEventsByIP,
    getEventsByType,
    getEventsByTimeRange,
    getUserInfo,
    getAllUsers,
    updateUserStatus
}; 