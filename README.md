# Event Monitoring System API Documentation

This API provides endpoints for monitoring and managing computer/user events and activities.

## Base URL
```
http://localhost:3000
```

## Endpoints

### Events

#### 1. Store Events
```http
POST /api/events
```
Store new events in the system.

**Request Body:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

**Response:**
```json
{
    "message": "Events stored successfully"
}
```

#### 2. Get All Events
```http
GET /api/events
```
Retrieve all events from the system.

**Response:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

#### 3. Get Events by User
```http
GET /api/events/user/:username
```
Retrieve all events for a specific user.

**Response:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

#### 4. Get Events by IP
```http
GET /api/events/ip/:ip
```
Retrieve all events from a specific IP address.

**Response:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

#### 5. Get Events by Type
```http
GET /api/events/type/:type
```
Retrieve all events of a specific type.

**Response:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

#### 6. Get Events by Time Range
```http
GET /api/events/time-range?startTime=2024-03-20T00:00:00.000Z&endTime=2024-03-20T23:59:59.999Z
```
Retrieve events within a specific time range.

**Query Parameters:**
- `startTime`: Start of the time range (ISO format)
- `endTime`: End of the time range (ISO format)

**Response:**
```json
[
    {
        "event_id": "123",
        "time": "2024-03-20T14:30:00.000Z",
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "event_type": "login_attempt",
        "ip_address": "192.168.1.100",
        "status": "success"
    }
]
```

### Users

#### 1. Get All Users
```http
GET /api/users
```
Retrieve all users/computers from the system.

**Response:**
```json
[
    {
        "computer_name": "PC-001",
        "user_name": "john_doe",
        "ip_address": "192.168.1.100",
        "first_seen": "2024-03-20T10:00:00.000Z",
        "last_seen": "2024-03-20T14:30:00.000Z",
        "total_events": 5,
        "failed_attempts": 1,
        "status": "active"
    }
]
```

#### 2. Get User Information
```http
GET /api/users/:computerName
```
Retrieve detailed information about a specific computer/user.

**Response:**
```json
{
    "computer_name": "PC-001",
    "user_name": "john_doe",
    "ip_address": "192.168.1.100",
    "first_seen": "2024-03-20T10:00:00.000Z",
    "last_seen": "2024-03-20T14:30:00.000Z",
    "total_events": 5,
    "failed_attempts": 1,
    "status": "active"
}
```

#### 3. Update User Status
```http
PUT /api/users/:computerName/status
```
Update the status of a specific computer/user.

**Request Body:**
```json
{
    "status": "suspended"
}
```

**Valid Status Values:**
- `active`: Normal operation
- `suspended`: Temporarily restricted
- `blocked`: Permanently restricted

**Response:**
```json
{
    "computer_name": "PC-001",
    "user_name": "john_doe",
    "ip_address": "192.168.1.100",
    "first_seen": "2024-03-20T10:00:00.000Z",
    "last_seen": "2024-03-20T14:30:00.000Z",
    "total_events": 5,
    "failed_attempts": 1,
    "status": "suspended"
}
```

### Email Notifications

#### Send Email
```http
POST /api/send-email
```
Send an email notification.

**Request Body:**
```json
{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email"
}
```

**Response:**
```json
{
    "message": "Email sent successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
    "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
    "error": "Failed to process request"
}
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/event_monitoring

# Email configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

3. Start the server:
```bash
node server.js
```

## Data Structure

### Event Object
```typescript
{
    event_id: string;
    time: Date;
    computer_name: string;
    user_name: string;
    event_type: string;
    ip_address: string;
    status: string;
}
```

### User Object
```typescript
{
    computer_name: string;
    user_name: string;
    ip_address: string;
    first_seen: Date;
    last_seen: Date;
    total_events: number;
    failed_attempts: number;
    status: 'active' | 'suspended' | 'blocked';
}
``` 