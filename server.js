const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const db = require('./db');

app.use(cors());
app.use(express.json());

// Function to print events in a readable format
async function printEvents() {
    try {
        const events = await db.getAllEvents();
        console.log('\n=== Events Report ===');
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log(`Total Events: ${events.length}`);
        
        // Print recent events
        console.log('\nRecent Events:');
        events.slice(0, 5).forEach(event => {
            console.log(`\nEvent ID: ${event.event_id}`);
            console.log(`Time: ${event.time}`);
            console.log(`Computer: ${event.computer_name}`);
            console.log(`User: ${event.user_name}`);
            console.log(`Type: ${event.event_type}`);
            console.log(`IP: ${event.ip_address}`);
            console.log(`Status: ${event.status}`);
        });
        
        console.log('\n' + '='.repeat(50));
    } catch (error) {
        console.error('Error printing events:', error);
    }
}

// Set up interval to print events every minute
// setInterval(printEvents, 60000); // 60000 ms = 1 minute

app.post('/api/events', async (req, res) => {
    try {
        const events = req.body.events;
        console.log('Received events:', events);
        await db.storeEvents(events);
        res.json({ message: 'Events stored successfully', count: events.length });
    } catch (error) {
        console.error('Error storing events:', error);
        res.status(500).json({ error: 'Failed to store events' });
    }
});

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await db.getAllEvents();
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// Get events by user
app.get('/api/events/user/:computername', async (req, res) => {
    try {
        const events = await db.getEventsByComputer(req.params.computername);
        res.json(events);
    } catch (error) {
        console.error('Error getting user events:', error);
        res.status(500).json({ error: 'Failed to get user events' });
    }
});

// Get events by IP
app.get('/api/events/ip/:ip', async (req, res) => {
    try {
        const events = await db.getEventsByIP(req.params.ip);
        res.json(events);
    } catch (error) {
        console.error('Error getting IP events:', error);
        res.status(500).json({ error: 'Failed to get IP events' });
    }
});

// Get events by type
app.get('/api/events/type/:type', async (req, res) => {
    try {
        const events = await db.getEventsByType(req.params.type);
        res.json(events);
    } catch (error) {
        console.error('Error getting events by type:', error);
        res.status(500).json({ error: 'Failed to get events by type' });
    }
});

// Get events by time range
app.get('/api/events/time-range', async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end times are required' });
        }
        const events = await db.getEventsByTimeRange(start, end);
        res.json(events);
    } catch (error) {
        console.error('Error getting events by time range:', error);
        res.status(500).json({ error: 'Failed to get events by time range' });
    }
});


app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        // await sendEmail(to, subject, text);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {       
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // Print initial events
    printEvents();
});

// apV2QvgjpScL8LFW