# Event Monitoring System API Documentation

This API provides endpoints for storing and retrieving event data from a MongoDB database. The system tracks various types of events with detailed information about users, computers, IP addresses, and event statuses.

## Base URL

```
http://localhost:3000
```

## API Endpoints

### 1. Store Events
Store new events in the database.

**Endpoint:** `POST /api/events`

**Request Body:**
```json
{
  "events": [
    {
      "event_id": 12345,
      "time": "2024-04-12T10:30:00",
      "computer_name": "DESKTOP-ABC123",
      "user_name": "john.doe",
      "event_type": "login",
      "ip_address": "192.168.1.100",
      "status": "success"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Events stored successfully",
  "count": 1
}
```

### 2. Get All Events
Retrieve all events from the database.

**Endpoint:** `GET /api/events`

**Response:**
```json
[
  {
    "event_id": 12345,
    "time": "2024-04-12T10:30:00",
    "computer_name": "DESKTOP-ABC123",
    "user_name": "john.doe",
    "event_type": "login",
    "ip_address": "192.168.1.100",
    "status": "success",
    "timestamp": "2024-04-12T10:30:00.000Z"
  }
]
```

### 3. Get Events by User
Retrieve all events associated with a specific user.

**Endpoint:** `GET /api/events/user/:username`

**Example:** `GET /api/events/user/john.doe`

**Response:**
```json
[
  {
    "event_id": 12345,
    "time": "2024-04-12T10:30:00",
    "computer_name": "DESKTOP-ABC123",
    "user_name": "john.doe",
    "event_type": "login",
    "ip_address": "192.168.1.100",
    "status": "success",
    "timestamp": "2024-04-12T10:30:00.000Z"
  }
]
```

### 4. Get Events by IP
Retrieve all events associated with a specific IP address.

**Endpoint:** `GET /api/events/ip/:ip`

**Example:** `GET /api/events/ip/192.168.1.100`

**Response:**
```json
[
  {
    "event_id": 12345,
    "time": "2024-04-12T10:30:00",
    "computer_name": "DESKTOP-ABC123",
    "user_name": "john.doe",
    "event_type": "login",
    "ip_address": "192.168.1.100",
    "status": "success",
    "timestamp": "2024-04-12T10:30:00.000Z"
  }
]
```

### 5. Get Events by Type
Retrieve all events of a specific type.

**Endpoint:** `GET /api/events/type/:type`

**Example:** `GET /api/events/type/login`

**Response:**
```json
[
  {
    "event_id": 12345,
    "time": "2024-04-12T10:30:00",
    "computer_name": "DESKTOP-ABC123",
    "user_name": "john.doe",
    "event_type": "login",
    "ip_address": "192.168.1.100",
    "status": "success",
    "timestamp": "2024-04-12T10:30:00.000Z"
  }
]
```

### 6. Get Events by Time Range
Retrieve all events within a specific time range.

**Endpoint:** `GET /api/events/time-range`

**Query Parameters:**
- `start`: Start time (ISO format)
- `end`: End time (ISO format)

**Example:** `GET /api/events/time-range?start=2024-04-12T00:00:00&end=2024-04-12T23:59:59`

**Response:**
```json
[
  {
    "event_id": 12345,
    "time": "2024-04-12T10:30:00",
    "computer_name": "DESKTOP-ABC123",
    "user_name": "john.doe",
    "event_type": "login",
    "ip_address": "192.168.1.100",
    "status": "success",
    "timestamp": "2024-04-12T10:30:00.000Z"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Start and end times are required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to [operation]"
}
```

## Data Structure

Each event object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| event_id | Number | Unique identifier for the event |
| time | String | Time of the event in ISO format |
| computer_name | String | Name of the computer where the event occurred |
| user_name | String | Username associated with the event |
| event_type | String | Type of event (e.g., login, logout) |
| ip_address | String | IP address associated with the event |
| status | String | Status of the event (e.g., success, failure) |
| timestamp | Date | Timestamp when the event was stored in the database |

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB server

3. Start the API server:
   ```bash
   node server.js
   ```

4. The server will run on `http://localhost:3000`

## Environment Variables

The following environment variables can be configured:

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/analytics_db) 