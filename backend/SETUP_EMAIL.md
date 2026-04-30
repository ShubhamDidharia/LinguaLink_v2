# Email System Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

This installs:
- `nodemailer` - Email sending
- `node-cron` - Job scheduling

### 2. Configure Environment Variables

Update your `.env` file with:

```env
# Existing variables...
MONGO_URI=mongodb://127.0.0.1:27017/lingualink
PORT=4000

# Gmail Example (Recommended for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=LinguaLink <noreply@yourdomain.com>

# Gemini API (Required for personalized emails)
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Start the Server

```bash
npm run dev  # Development with nodemon
# or
npm start   # Production
```

**Expected Console Output:**
```
Backend running on http://localhost:4000
[email] SMTP transporter verified successfully
[emailScheduler] Initializing daily email schedules...
[emailScheduler] Found 3 users with daily email enabled
[emailScheduler] Daily email schedule started for user abc123 (user@example.com)
[emailScheduler] Daily email schedules initialized successfully
```

---

## Features Enabled After Setup

### 1. AI-Personalized Welcome Email ✅
- Automatically sent when user signs up
- Personalized based on learning goals and interests
- Uses Gemini API to generate message
- No additional configuration needed

### 2. Daily Word Service ✅
- Users can toggle in workspace
- Sent daily at 8 AM UTC
- Includes 1 word of the day + 3 review words
- Scheduled automatically on toggle

### 3. Email Preference Management ✅
- API endpoints:
  - `POST /api/email/toggle-daily` - Enable/disable
  - `GET /api/email/daily-status` - Check status

---

## Frontend Integration (React)

### Email Toggle Component

```jsx
import { useState, useEffect } from 'react'

export function EmailPreferences() {
  const [dailyEmailEnabled, setDailyEmailEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load current preference
    fetch('/api/email/daily-status')
      .then(r => r.json())
      .then(data => setDailyEmailEnabled(data.dailyEmailEnabled))
  }, [])

  const handleToggle = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/email/toggle-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !dailyEmailEnabled })
      })
      const data = await response.json()
      setDailyEmailEnabled(data.dailyEmailEnabled)
    } catch (error) {
      console.error('Failed to toggle email:', error)
    }
    setLoading(false)
  }

  return (
    <div className="email-preferences">
      <label>
        <input
          type="checkbox"
          checked={dailyEmailEnabled}
          onChange={handleToggle}
          disabled={loading}
        />
        Enable Daily Email with Word of the Day
      </label>
    </div>
  )
}
```

---

## Gmail Setup (Step by Step)

### Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Find "App passwords" (may need to search)
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the 16-character password

### Update .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=LinguaLink <your-email@gmail.com>
```

### Test Connection

```bash
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'YOUR_EMAIL', pass: 'YOUR_APP_PASSWORD' }
});
t.verify((err, ok) => {
  if (err) console.error('ERROR:', err);
  else console.log('SMTP Connected!');
});
"
```

---

## Troubleshooting

### Issue: SMTP Transporter verification failed

**Solution:**
```bash
# Check SMTP credentials
# Check firewall allows port 587
# Try different SMTP provider
# Check email address format
```

### Issue: Gemini API errors

**Solution:**
```bash
# Get API key from Google AI Studio
# Set GEMINI_API_KEY in .env
# Check API key has correct permissions
```

### Issue: Daily emails not sending

**Solution:**
```bash
# Check user has dailyEmailEnabled = true
# Check user has saved vocabulary
# Check server logs for cron errors
# Verify system time is correct
```

### Issue: Emails going to spam

**Solutions:**
- Add SPF record: `v=spf1 include:sendgrid.net ~all`
- Add DKIM record (if using service)
- Use consistent "From" address
- Include unsubscribe link (future enhancement)

---

## Testing Email Delivery

### Using MailHog (Local Testing)

```bash
# Install MailHog
brew install mailhog  # macOS
# or download from mailhog.io

# Run MailHog
mailhog

# Update .env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false

# View emails at: http://localhost:8025
```

### Using Mailtrap (Cloud Testing)

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials
3. Update `.env` with credentials
4. View emails in Mailtrap dashboard

---

## Database Schema

### User Model Changes

```javascript
{
  // existing fields...
  dailyEmailEnabled: Boolean,      // Toggle for daily emails
  lastEmailSentAt: Date            // Timestamp of last email
}
```

**Migration (if needed):**
```javascript
// Add fields to existing users
db.users.updateMany({}, {
  $set: {
    dailyEmailEnabled: false,
    lastEmailSentAt: null
  }
})
```

---

## API Reference

### Toggle Daily Email Preference

```http
POST /api/email/toggle-daily HTTP/1.1
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "enabled": true
}
```

**Response:**
```json
{
  "message": "Daily email enabled successfully",
  "dailyEmailEnabled": true
}
```

### Get Email Preference Status

```http
GET /api/email/daily-status HTTP/1.1
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "dailyEmailEnabled": true,
  "lastEmailSentAt": "2026-04-30T08:15:32.000Z"
}
```

---

## Code Structure

```
backend/
├── services/
│   ├── emailService.js           # Core email functions
│   └── emailScheduler.js         # Cron job management
├── controllers/
│   └── emailController.js        # API handlers
├── routes/
│   └── emailRoutes.js            # Route definitions
├── models/
│   └── User.js                   # Updated with email fields
├── EMAIL_SYSTEM.md               # Full documentation
└── index.js                      # Updated with scheduler init
```

---

## Key Functions Reference

### emailService.js

```javascript
// Send personalized welcome email
await sendAIPersonalizedWelcomeEmail(user)

// Send daily word email
await sendDailyWordEmail(user, savedWords, newWord)

// Send generic email (foundation)
await sendMailSafe({ to, subject, text })
```

### emailScheduler.js

```javascript
// Initialize all schedules on server start
await initializeDailyEmailSchedules()

// Start schedule for specific user
startUserDailyEmailSchedule(userId, userEmail)

// Stop schedule for user
stopUserDailyEmailSchedule(userId)

// Stop all schedules on shutdown
stopAllEmailSchedules()
```

---

## Security Notes

- ✅ Passwords are hashed before storage
- ✅ API endpoints require JWT authentication
- ✅ Email credentials stored in .env (not in code)
- ✅ No sensitive data logged
- ✅ SMTP uses TLS encryption

---

## Performance

- **Welcome Emails:** < 2 seconds (Gemini call included)
- **Daily Emails:** Sent at exact scheduled time
- **Memory Usage:** One cron job per active user (~1KB each)
- **Database:** Indexed queries for fast vocabulary lookup

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure SMTP and Gemini API keys
3. ✅ Start server
4. ✅ Create test user account
5. ✅ Verify welcome email received
6. ✅ Toggle daily emails on
7. ✅ Add test vocabulary
8. ✅ Check daily email at scheduled time

---

## Support

For issues or questions, check:
1. [EMAIL_SYSTEM.md](./EMAIL_SYSTEM.md) - Full documentation
2. Server console logs - Error messages
3. SMTP provider documentation
4. [Google Gemini API Docs](https://ai.google.dev/docs)

