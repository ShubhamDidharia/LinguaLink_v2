import toast from 'react-hot-toast'

/**
 * Show a success toast notification
 * @param {string} message - The message to display
 */
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
  })
}

/**
 * Show an error toast notification
 * @param {string} message - The error message to display
 */
export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
  })
}

/**
 * Show a loading toast notification
 * @param {string} message - The loading message to display
 * @returns {string} - The toast id for later dismissal
 */
export const showLoading = (message) => {
  return toast.loading(message)
}

/**
 * Update an existing toast
 * @param {string} toastId - The toast id to update
 * @param {Object} options - Toast options { message, type: 'success'|'error'|'loading' }
 */
export const updateToast = (toastId, { message, type = 'success' }) => {
  if (type === 'success') {
    toast.success(message, { id: toastId })
  } else if (type === 'error') {
    toast.error(message, { id: toastId })
  } else {
    toast.loading(message, { id: toastId })
  }
}

/**
 * Dismiss a specific toast
 * @param {string} toastId - The toast id to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

/**
 * Show an informational toast
 * @param {string} message - The message to display
 */
export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    duration: 3000,
  })
}

export default {
  showSuccess,
  showError,
  showLoading,
  updateToast,
  dismissToast,
  showInfo,
}
