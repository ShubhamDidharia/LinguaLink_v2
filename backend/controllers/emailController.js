import User from '../models/User.js'
import {
  startUserDailyEmailSchedule,
  stopUserDailyEmailSchedule,
} from '../services/emailScheduler.js'

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

export default {
  toggleDailyEmail,
  getDailyEmailStatus,
}
