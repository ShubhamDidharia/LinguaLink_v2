import Workspace from '../models/Workspace.js'

/**
 * Creates default workspace folders for a user's learning languages
 * @param {String} userId - The user's ID
 * @param {Array} languages - Array of language names to create workspaces for
 */
export const createDefaultWorkspaces = async (userId, languages = []) => {
  try {
    if (!languages || languages.length === 0) return

    for (const language of languages) {
      const exists = await Workspace.findOne({ userId, language })
      if (!exists) {
        const newWorkspace = new Workspace({ userId, language })
        await newWorkspace.save()
      }
    }
    
    console.log(`Default workspaces created for user ${userId}`)
  } catch (error) {
    console.error('Error creating default workspaces:', error)
    // Don't throw error - this is a non-critical operation
  }
}

/**
 * Updates workspaces when user updates their learning languages
 * Creates new workspaces for newly added languages
 * Does NOT delete workspaces when languages are removed (per requirements)
 * @param {String} userId - The user's ID
 * @param {Array} newLanguages - Array of language names
 */
export const updateUserWorkspaces = async (userId, newLanguages = []) => {
  try {
    for (const language of newLanguages) {
      const exists = await Workspace.findOne({ userId, language })
      if (!exists) {
        const newWorkspace = new Workspace({ userId, language })
        await newWorkspace.save()
      }
    }

    console.log(`Workspaces updated for user ${userId}`)
  } catch (error) {
    console.error('Error updating workspaces:', error)
    // Don't throw error - this is a non-critical operation
  }
}
