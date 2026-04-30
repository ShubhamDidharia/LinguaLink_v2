import User from '../models/User.js'
import {
  startUserDailyEmailSchedule,
  stopUserDailyEmailSchedule,
} from '../services/emailScheduler.js'
import { sendMailSafe } from '../services/emailService.js'

/**
 * Toggle daily email preference for a user
 * POST /api/email/toggle-daily
 */
export const toggleDailyEmail = async (req, res) => {
  try {
    const userId = req.user.userId
    const { enabled } = req.body

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { dailyEmailEnabled: enabled },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Start or stop the email schedule based on preference
    if (enabled) {
      startUserDailyEmailSchedule(user._id, user.email)
    } else {
      stopUserDailyEmailSchedule(user._id)
    }

    const status = enabled ? 'enabled' : 'disabled'
    console.log(`[email] Daily email ${status} for user ${user.email}`)

    res.json({
      message: `Daily email ${status} successfully`,
      dailyEmailEnabled: user.dailyEmailEnabled,
    })
  } catch (error) {
    console.error('[email] Error toggling daily email preference:', error.message)
    res.status(500).json({ error: 'Failed to update email preference' })
  }
}

/**
 * Get daily email preference status
 * GET /api/email/daily-status
 */
export const getDailyEmailStatus = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findById(userId).select('dailyEmailEnabled lastEmailSentAt')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      dailyEmailEnabled: user.dailyEmailEnabled,
      lastEmailSentAt: user.lastEmailSentAt,
    })
  } catch (error) {
    console.error('[email] Error fetching daily email status:', error.message)
    res.status(500).json({ error: 'Failed to fetch email preferences' })
  }
}

/**
 * Send a test email to verify SMTP
 * POST /api/email/test
 */
export const sendTestEmail = async (req, res) => {
  try {
    const userId = req.user.userId
    const { to } = req.body || {}

    const user = await User.findById(userId).select('email name')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const targetEmail = to || user.email
    if (!targetEmail) {
      return res.status(400).json({ error: 'Target email missing' })
    }

    const subject = 'DuoClick SMTP Test'
    const text = `Hello ${user.name || 'there'},\n\nThis is a test email to verify SMTP delivery for DuoClick.\n\nIf you received this, SMTP is working.\n\n- DuoClick`

    await sendMailSafe({
      to: targetEmail,
      subject,
      text,
    })

    res.json({ message: 'Test email sent (or queued).', to: targetEmail })
  } catch (error) {
    console.error('[email] Error sending test email:', error.message)
    res.status(500).json({ error: 'Failed to send test email' })
  }
}

export default {
  toggleDailyEmail,
  getDailyEmailStatus,
  sendTestEmail,
}
