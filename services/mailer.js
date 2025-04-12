const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Function to send anomalous login alert
async function sendAnomalousLoginAlert(to, event) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: `⚠️ Security Alert: Unusual Login Activity Detected`,
            html: `
                <h2 style="color: #d9534f;">⚠️ Security Alert: Unusual Login Activity</h2>
                <p style="color: #333; font-weight: bold;">An unusual login attempt has been detected in the system:</p>
                <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Field</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Value</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Computer Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${event.computer_name}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">User Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${event.user_name}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">IP Address</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${event.ip_address}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Event Time</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${event.time}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Event Type</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${event.event_type}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Status</td>
                        <td style="border: 1px solid #ddd; padding: 8px; color: ${event.status === 'success' ? '#5cb85c' : '#d9534f'};">${event.status}</td>
                    </tr>
                </table>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #d9534f; margin-bottom: 20px;">
                    <p style="margin: 0;"><strong>Action Required:</strong> Please review this login attempt and take appropriate action if suspicious.</p>
                </div>
                <p style="color: #666; font-size: 12px;">This is an automated security alert. Please do not reply to this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Anomalous login alert sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending anomalous login alert:', error);
        throw error;
    }
}

// Function to send suspicious activity summary
async function sendSuspiciousActivitySummary(to, events) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: '⚠️ Daily Security Report: Suspicious Activities',
            html: `
                <h2 style="color: #d9534f;">⚠️ Daily Security Report</h2>
                <p style="color: #333;">Summary of suspicious activities detected in the last 24 hours:</p>
                
                <h3 style="color: #333; margin-top: 20px;">Activity Statistics</h3>
                <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Metric</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Value</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Total Suspicious Events</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${events.length}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Unique IPs</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${new Set(events.map(e => e.ip_address)).size}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Unique Users</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${new Set(events.map(e => e.user_name)).size}</td>
                    </tr>
                </table>

                <h3 style="color: #333; margin-top: 20px;">Recent Suspicious Activities</h3>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Time</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">User</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">IP</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Computer</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Event Type</th>
                    </tr>
                    ${events.slice(0, 5).map(event => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.time}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.user_name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.ip_address}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.computer_name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.event_type}</td>
                        </tr>
                    `).join('')}
                </table>

                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #d9534f; margin-top: 20px;">
                    <p style="margin: 0;"><strong>Note:</strong> These activities have been flagged as suspicious based on unusual patterns or known security risks.</p>
                </div>
                <p style="color: #666; font-size: 12px;">This is an automated security report. Please do not reply to this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Suspicious activity summary sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending suspicious activity summary:', error);
        throw error;
    }
}

// Function to send critical security alert
async function sendCriticalSecurityAlert(to, events) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: '🚨 CRITICAL: Multiple Failed Login Attempts Detected',
            html: `
                <h2 style="color: #d9534f;">🚨 CRITICAL SECURITY ALERT</h2>
                <p style="color: #333; font-weight: bold;">Multiple failed login attempts have been detected:</p>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Time</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">User</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">IP</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Computer</th>
                    </tr>
                    ${events.map(event => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.time}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.user_name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.ip_address}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${event.computer_name}</td>
                        </tr>
                    `).join('')}
                </table>
                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-top: 20px;">
                    <p style="margin: 0;"><strong>⚠️ Immediate Action Required:</strong></p>
                    <ul style="margin: 10px 0;">
                        <li>Review these login attempts immediately</li>
                        <li>Check if these are legitimate access attempts</li>
                        <li>Consider blocking the IP address if suspicious</li>
                        <li>Reset affected user passwords if necessary</li>
                    </ul>
                </div>
                <p style="color: #666; font-size: 12px;">This is an automated critical security alert. Please do not reply to this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Critical security alert sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending critical security alert:', error);
        throw error;
    }
}

module.exports = {
    sendAnomalousLoginAlert,
    sendSuspiciousActivitySummary,
    sendCriticalSecurityAlert
}; 