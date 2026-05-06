import { createRequire } from 'module'
import { GoogleGenerativeAI } from '@google/generative-ai'

const require = createRequire(import.meta.url)
const SibApiV3Sdk = require('@getbrevo/brevo')

const brevoConfigured =
  process.env.BREVO_API_KEY && process.env.SENDER_EMAIL

// Verify Brevo is configured on startup
if (brevoConfigured) {
  console.log('[email] Brevo email service configured successfully')
} else {
  console.warn('[email] Brevo not fully configured. Missing BREVO_API_KEY or SENDER_EMAIL')
}

/**
 * Send email using Brevo API
 * @param {string} userEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content for the email
 * @returns {Promise<Object>} - Result object with success status
 */
async function sendEmailViaBrevo(userEmail, subject, htmlContent) {
  if (!brevoConfigured) {
    console.warn('[email] Brevo not configured. Skipping email:', { userEmail, subject })
    return { success: false, error: 'Brevo not configured' }
  }

  try {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    // Authenticate with API Key
    let apiKey = apiInstance.authentications['apiKey']
    apiKey.apiKey = process.env.BREVO_API_KEY

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent
    sendSmtpEmail.sender = {
      name: 'DuoClick',
      email: process.env.SENDER_EMAIL,
    }
    sendSmtpEmail.to = [{ email: userEmail }]

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log(`[email] Email sent successfully to ${userEmail}. Message ID: ${data.messageId}`)
    return { success: true, messageId: data.messageId }
  } catch (error) {
    console.error(`[email] Brevo error sending to ${userEmail}:`, error.message || error)
    return { success: false, error }
  }
}

async function sendMailSafe({ to, subject, text }) {
  if (!to) {
    return
  }

  if (!brevoConfigured) {
    console.warn('[email] Brevo not configured. Skipping email:', { to, subject })
    return
  }

  // Convert plain text to HTML
  const htmlContent = `<html><body><pre style="font-family: Arial, sans-serif; white-space: pre-wrap; word-wrap: break-word;">${text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')}</pre></body></html>`

  await sendEmailViaBrevo(to, subject, htmlContent)
}

/**
 * Generate a personalized welcome message using Gemini AI
 * @param {Object} user - User object with languagesLearning, languagesKnown, interests
 * @returns {Promise<string>} AI-generated welcome message
 */
async function generatePersonalizedWelcomeMessage(user) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Generate a short, encouraging welcome message (approximately 100 words) for a language learning platform user with the following profile:
    
Languages Learning: ${user.languagesLearning.join(', ') || 'Not specified'}
Languages Known: ${user.languagesKnown.join(', ') || 'Not specified'}
Interests: ${user.interests.join(', ') || 'Not specified'}

The message should:
- Be warm and personalized to their learning goals
- Reference their specific interests if provided
- Be motivating and encouraging
- Be professional but friendly

Please write only the message without any additional text or formatting.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text
  } catch (error) {
    console.error('[email] Error generating personalized message from Gemini:', error.message)
    // Fallback message
    return `Welcome to DuoClick! We're excited to have you on your language learning journey. With our platform, you can connect with learners worldwide, practice daily, and achieve your language goals. Let's get started!`
  }
}

/**
 * Send AI-personalized welcome email to user
 * @param {Object} user - User object (should include email, name, languagesLearning, languagesKnown, interests)
 */
async function sendAIPersonalizedWelcomeEmail(user) {
  try {
    const personalizedMessage = await generatePersonalizedWelcomeMessage(user)

    const subject = 'Welcome to DuoClick - Your Personal Learning Journey Starts Here!'
    const text = [
      `Hello ${user.name || 'there'},`,
      '',
      personalizedMessage,
      '',
      'Get started by:',
      '• Connecting with language partners in your learning community',
      '• Adding words to your vocabulary workspace',
      '• Setting up your daily learning preferences',
      '',
      'You can manage your daily email preferences anytime in your workspace settings.',
      '',
      'Happy learning!',
      'The DuoClick Team',
    ].join('\n')

    await sendMailSafe({
      to: user.email,
      subject,
      text,
    })

    console.log(`[email] AI-personalized welcome email sent to ${user.email}`)
  } catch (error) {
    console.error('[email] Error sending AI-personalized welcome email:', error.message)
  }
}

/**
 * Send daily "Word of the Day" email with vocabulary review
 * @param {Object} user - User object (should include email, name)
 * @param {Array} savedWords - Array of vocabulary objects with word, meaning, language fields
 * @param {string} newWord - New word object from the language being learned
 */
async function sendDailyWordEmail(user, savedWords = [], newWord = null) {
  try {
    if (!savedWords || savedWords.length === 0) {
      console.warn(`[email] No saved words available for user ${user.email}, skipping daily email`)
      return
    }

    // Select up to 3 random words from savedWords
    const reviewWords = savedWords
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, savedWords.length))

    const subject = 'DuoClick Daily: Word of the Day & Vocabulary Review'

    const text = [
      `Hello ${user.name || 'there'},`,
      '',
      '=== WORD OF THE DAY ===',
      '',
      newWord
        ? [
            `Word: ${newWord.word}`,
            `Meaning: ${newWord.meaning}`,
            `Language: ${newWord.language}`,
            newWord.examples && newWord.examples.length > 0
              ? `Example: ${newWord.examples[0]}`
              : '',
          ]
            .filter(Boolean)
            .join('\n')
        : 'Keep practicing with your workspace to unlock a new word!',
      '',
      '=== VOCABULARY REVIEW ===',
      'Review these saved words to reinforce your learning:',
      '',
      reviewWords
        .map((w, idx) => {
          return [
            `${idx + 1}. ${w.word}`,
            `   Meaning: ${w.meaning}`,
            w.examples && w.examples.length > 0 ? `   Example: ${w.examples[0]}` : '',
          ]
            .filter(Boolean)
            .join('\n')
        })
        .join('\n\n'),
      '',
      '---',
      'Keep up the great work! Continue building your vocabulary and strengthening your language skills.',
      '',
      'Manage your email preferences in Settings → Email Preferences',
      '',
      'Best regards,',
      'The DuoClick Team',
    ].join('\n')

    await sendMailSafe({
      to: user.email,
      subject,
      text,
    })

    console.log(`[email] Daily word email sent to ${user.email}`)
  } catch (error) {
    console.error('[email] Error sending daily word email:', error.message)
  }
}

export {
  sendMailSafe,
  sendAIPersonalizedWelcomeEmail,
  sendDailyWordEmail,
  sendEmailViaBrevo,
}
