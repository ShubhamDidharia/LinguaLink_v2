# Email System Documentation - LinguaLink

## Overview

The email system integrates three key features:
1. **AI-Personalized Welcome Emails** - Sent on signup using Gemini API
2. **Daily Word of the Day Service** - Scheduled daily emails with vocabulary review
3. **Email Preference Management** - Users can toggle daily emails on/off

---

## 1. AI-Personalized Welcome Email

### Description
When a user signs up, they receive a personalized welcome email generated using Google's Gemini API. The message is tailored to their:
- Languages they're learning
- Languages they already know
- Personal interests

### Implementation Flow

**File:** `controllers/authController.js`
```
User signs up → AI-personalized email generated → Email sent via SMTP
```

**Key Function:** `sendAIPersonalizedWelcomeEmail(user)`

Located in: `services/emailService.js`

**Parameters:**
- `user` - User object with fields:
  - `email` - User's email address
  - `name` - User's name
  - `languagesLearning` - Array of languages they're learning
  - `languagesKnown` - Array of languages they know
  - `interests` - Array of personal interests

**Example Output:**
```
Subject: Welcome to LinguaLink - Your Personal Learning Journey Starts Here!

Body:
Hello [User Name],

[AI-Generated Personalized Message (~100 words)]

Get started by:
• Connecting with language partners in your learning community
• Adding words to your vocabulary workspace
• Setting up your daily learning preferences

...
```

---

## 2. Daily Word of the Day Service

### Description
Users can enable a daily email service that sends:
1. One "New Word" from their learning language
2. Up to 3 randomly selected saved words for review

### Email Schedule
- **Time:** 8:00 AM UTC daily
- **Frequency:** Every 24 hours
- **Content:** Dynamic based on user's vocabulary

### Key Files

**Service:** `services/emailScheduler.js`
- Manages cron job scheduling
- Handles user-specific schedules
- Retrieves vocabulary and sends emails

**Controller:** `controllers/emailController.js`
- Handles toggle requests
- Manages email preferences

**Routes:** `routes/emailRoutes.js`

### Endpoints

#### Toggle Daily Email
```
POST /api/email/toggle-daily
Authorization: Bearer [JWT Token]
Body: { "enabled": true/false }

Response:
{
  "message": "Daily email enabled/disabled successfully",
  "dailyEmailEnabled": true/false
}
```

#### Get Email Status
```
GET /api/email/daily-status
Authorization: Bearer [JWT Token]

Response:
{
  "dailyEmailEnabled": true/false,
  "lastEmailSentAt": "2026-04-30T08:00:00.000Z"
}
```

### Implementation Details

**File Structure:**
```
controllers/emailController.js     - API endpoints for preferences
services/emailScheduler.js         - Cron job management
services/emailService.js           - Email sending logic
routes/emailRoutes.js              - Route definitions
```

**Vocabulary Selection Logic:**
1. Fetches user's primary learning language from their workspace
2. Retrieves up to 10 vocabulary words
3. Randomly selects 1 "New Word" (word of the day)
4. Randomly selects up to 3 words for review
5. Formats and sends email

### Example Email

```
Subject: LinguaLink Daily: Word of the Day & Vocabulary Review

Body:
Hello [User Name],

=== WORD OF THE DAY ===

Word: Maison
Meaning: House (in French)
Language: French
Example: "La maison est belle."

=== VOCABULARY REVIEW ===
Review these saved words to reinforce your learning:

1. Chat
   Meaning: Cat
   Example: "Le chat est noir."

2. Livre
   Meaning: Book
   Example: "Je lis un livre intéressant."

3. Café
   Meaning: Coffee
   Example: "Je bois un café le matin."

---
Keep up the great work! Continue building your vocabulary and strengthening your language skills.

Manage your email preferences in Settings → Email Preferences
```

---

## 3. Server Initialization

### Scheduler Startup

When the server starts (`index.js`):

1. **Initialize Database Connection**
2. **Find all users with `dailyEmailEnabled = true`**
3. **Create cron jobs for each user**
4. **Log initialization status**

```javascript
// Server startup sequence
await connectDB(MONGO_URI)
await initializeDailyEmailSchedules()
```

### Graceful Shutdown

On server shutdown (SIGTERM/SIGINT):
1. Stop all cron jobs
2. Close database connections
3. Exit cleanly

```javascript
// Cleanup on shutdown
stopAllEmailSchedules()
```

---

## 4. Database Schema Changes

### User Model (`models/User.js`)

Added fields:
```javascript
{
  dailyEmailEnabled: { type: Boolean, default: false },
  lastEmailSentAt: { type: Date, default: null }
}
```

---

## 5. Environment Variables

Required in `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=LinguaLink <noreply@lingualink.com>

# Gemini API
GEMINI_API_KEY=your_gemini_key_here
```

### SMTP Configuration Guide

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587`
- Secure: `false`
- User: Your Gmail address
- Pass: App Password (not regular password)

**Office 365:**
- Host: `smtp.office365.com`
- Port: `587`
- Secure: `false`
- User: Your email
- Pass: Your password

**SendGrid:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- Secure: `false`
- User: `apikey`
- Pass: Your SendGrid API key

---

## 6. Error Handling

### Graceful Degradation

- **SMTP Not Configured:** Emails are skipped with warnings
- **Gemini API Failure:** Falls back to generic welcome message
- **Cron Job Failure:** Error logged, job continues running
- **No Vocabulary:** Email skipped, user not penalized

### Logging

All email operations are logged with `[email]` prefix:
```
[email] SMTP transporter verified successfully
[email] AI-personalized welcome email sent to user@example.com
[emailScheduler] Daily email schedule started for user [ID]
[emailScheduler] Error sending daily email for user [ID]: [error]
```

---

## 7. Workflow Summary

### User Signup → Welcome Email
```
1. User provides: name, email, password, interests, languages
2. User saved to database
3. Workspaces created for learning languages
4. Gemini API generates personalized message
5. Welcome email sent via SMTP
6. Response sent to frontend
```

### Daily Email Service
```
1. User toggles dailyEmailEnabled = true
2. Email scheduler starts cron job for that user
3. Every day at 8 AM UTC:
   a. Fetch user's vocabulary
   b. Select random words
   c. Generate email content
   d. Send via SMTP
   e. Update lastEmailSentAt timestamp
4. User can toggle off anytime to stop emails
```

---

## 8. Frontend Integration

### Toggle Email Preference

```javascript
// Enable daily emails
await fetch('/api/email/toggle-daily', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ enabled: true })
})

// Check email status
await fetch('/api/email/daily-status', {
  method: 'GET'
})
```

### Toggle UI Component (React)

```jsx
<label htmlFor="dailyEmailToggle">Enable Daily Email Reminders</label>
<input 
  type="checkbox" 
  id="dailyEmailToggle"
  checked={dailyEmailEnabled}
  onChange={(e) => toggleDailyEmail(e.target.checked)}
/>
```

---

## 9. Troubleshooting

### Emails Not Sending

**Check:**
1. SMTP configuration in `.env`
2. Email provider allows SMTP access
3. `transporter.verify()` logs successfully
4. GEMINI_API_KEY is set for AI emails

### Daily Emails Not Scheduled

**Check:**
1. User has `dailyEmailEnabled = true` in database
2. User has at least one vocabulary word saved
3. User has a workspace with a language
4. Server console logs scheduler initialization
5. Check system time matches UTC

### Personalized Welcome Not Working

**Check:**
1. GEMINI_API_KEY is set and valid
2. All user fields present: languagesLearning, interests
3. Check logs for Gemini API errors
4. Fallback message sent if API fails

---

## 10. Performance Considerations

- **Cron Jobs:** Lightweight, scheduled at exact time
- **Vocabulary Query:** Indexed by userId and language
- **Gemini Calls:** Only on signup, not in loop
- **Email Sending:** Async, doesn't block request
- **Memory:** Cron jobs stored in memory, survives restarts

---

## Dependencies Added

```json
{
  "nodemailer": "^6.9.7",
  "node-cron": "^3.0.2"
}
```

**Install:**
```bash
npm install
```

Both are already in package.json after updates.

---

## Testing

### Manual Testing

1. **Welcome Email:**
   - Create new user with interests and languages
   - Check email inbox for personalized message

2. **Daily Email Toggle:**
   - Login as user
   - POST to `/api/email/toggle-daily` with `{ enabled: true }`
   - Check if next day at 8 AM sends email

3. **Vocabulary Email:**
   - Add 3-5 words to user's workspace
   - Wait for scheduled time or manually trigger
   - Verify email content

### Test Endpoint
```bash
# Toggle daily email on
curl -X POST http://localhost:4000/api/email/toggle-daily \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{"enabled": true}'

# Check status
curl http://localhost:4000/api/email/daily-status \
  -H "Cookie: jwt=YOUR_JWT_TOKEN"
```

---

## Future Enhancements

- [ ] Timezone support (currently UTC)
- [ ] Custom email schedule times per user
- [ ] Email template customization
- [ ] A/B testing email content
- [ ] Unsubscribe links
- [ ] Email preference dashboard
- [ ] Scheduled email queue
- [ ] Email delivery tracking
