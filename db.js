const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

// Define event schema
const eventSchema = new mongoose.Schema({
    event_id: { type: Number, required: true },
    time: { type: String, required: true },
    computer_name: { type: String, required: true },
    user_name: { type: String, required: true },
    event_type: { type: String, required: true },
    ip_address: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create model
const Event = mongoose.model('Event', eventSchema);

// Function to store events
async function storeEvents(events) {
    try {
        const operations = events.map(event => ({
            event_id: event.event_id,
            time: event.time,
            computer_name: event.computer_name,
            user_name: event.user_name,
            event_type: event.event_type,
            ip_address: event.ip_address,
            status: event.status
        }));
        await Event.insertMany(operations);
    } catch (error) {
        console.error('Error storing events:', error);
        throw error;
    }
}

// Function to get all events
async function getAllEvents() {
    try {
        return await Event.find().sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
}

// Function to get events by user
async function getEventsByUser(username) {
    try {
        return await Event.find({ user_name: username }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting user events:', error);
        throw error;
    }
}

// Function to get events by IP
async function getEventsByIP(ip) {
    try {
        return await Event.find({ ip_address: ip }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting IP events:', error);
        throw error;
    }
}

// Function to get events by type
async function getEventsByType(eventType) {
    try {
        return await Event.find({ event_type: eventType }).sort({ timestamp: -1 });
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
        }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting events by time range:', error);
        throw error;
    }
}

async function getEventsByComputer(computername) {
    try {
        return await Event.find({ computer_name: computername }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting computer events:', error);
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
    getEventsByComputer
}; 