import cron from 'node-cron'
import User from '../models/User.js'
import Vocabulary from '../models/Vocabulary.js'
import Workspace from '../models/Workspace.js'
import { sendDailyWordEmail } from './emailService.js'

let scheduledJobs = {} // Store active cron jobs by userId

/**
 * Get a random new word from the user's learning language
 */
async function getRandomNewWord(userId, language) {
  try {
    const word = await Vocabulary.findOne({
      userId,
      language,
    }).exec()

    if (!word) {
      return null
    }

    return word
  } catch (error) {
    console.error('[emailScheduler] Error fetching random word:', error.message)
    return null
  }
}

/**
 * Start daily email scheduler for a specific user
 * Sends email at 8 AM local time every day
 */
export function startUserDailyEmailSchedule(userId, userEmail) {
  try {
    // Check if job already exists for this user
    if (scheduledJobs[userId]) {
      console.log(`[emailScheduler] Job already exists for user ${userId}, skipping`)
      return
    }

    // Schedule for 8 AM every day (0 8 * * *)
    const job = cron.schedule(
      '0 8 * * *',
      async () => {
        try {
          const user = await User.findById(userId)

          if (!user || !user.dailyEmailEnabled) {
            console.log(
              `[emailScheduler] Daily email disabled or user not found for ${userId}, skipping`
            )
            return
          }

          // Get user's primary learning language from workspace
          const workspace = await Workspace.findOne({ userId }).sort({ createdAt: -1 })
          const language = workspace?.language

          if (!language) {
            console.warn(`[emailScheduler] No language workspace found for user ${userId}`)
            return
          }

          // Get saved vocabulary words (up to 10 for random selection)
          const savedWords = await Vocabulary.find({ userId, language })
            .limit(10)
            .exec()

          // Get a random new word
          const newWord = await getRandomNewWord(userId, language)

          // Send the email
          if (savedWords.length > 0 || newWord) {
            await sendDailyWordEmail(user, savedWords, newWord)

            // Update last email sent timestamp
            user.lastEmailSentAt = new Date()
            await user.save()
          } else {
            console.log(
              `[emailScheduler] No vocabulary available for user ${userId}, skipping email`
            )
          }
        } catch (error) {
          console.error(
            `[emailScheduler] Error sending daily email for user ${userId}:`,
            error.message
          )
        }
      },
      {
        timezone: 'UTC', // Adjust as needed or make configurable
      }
    )

    scheduledJobs[userId] = job
    console.log(
      `[emailScheduler] Daily email schedule started for user ${userId} (${userEmail})`
    )
  } catch (error) {
    console.error('[emailScheduler] Error starting daily email schedule:', error.message)
  }
}

/**
 * Stop daily email scheduler for a specific user
 */
export function stopUserDailyEmailSchedule(userId) {
  try {
    if (scheduledJobs[userId]) {
      scheduledJobs[userId].stop()
      delete scheduledJobs[userId]
      console.log(`[emailScheduler] Daily email schedule stopped for user ${userId}`)
    }
  } catch (error) {
    console.error('[emailScheduler] Error stopping daily email schedule:', error.message)
  }
}

/**
 * Initialize daily email schedules for all users with dailyEmailEnabled = true
 * Call this once when the server starts
 */
export async function initializeDailyEmailSchedules() {
  try {
    console.log('[emailScheduler] Initializing daily email schedules...')

    const usersWithEmailEnabled = await User.find({ dailyEmailEnabled: true }).select(
      '_id email name'
    )

    console.log(
      `[emailScheduler] Found ${usersWithEmailEnabled.length} users with daily email enabled`
    )

    for (const user of usersWithEmailEnabled) {
      startUserDailyEmailSchedule(user._id, user.email)
    }

    console.log('[emailScheduler] Daily email schedules initialized successfully')
  } catch (error) {
    console.error('[emailScheduler] Error initializing daily email schedules:', error.message)
  }
}

/**
 * Stop all active email schedules
 * Call this when server shuts down
 */
export function stopAllEmailSchedules() {
  try {
    for (const userId in scheduledJobs) {
      scheduledJobs[userId].stop()
    }
    scheduledJobs = {}
    console.log('[emailScheduler] All email schedules stopped')
  } catch (error) {
    console.error('[emailScheduler] Error stopping all email schedules:', error.message)
  }
}

export default {
  startUserDailyEmailSchedule,
  stopUserDailyEmailSchedule,
  initializeDailyEmailSchedules,
  stopAllEmailSchedules,
}
