/**
 * Retry logic with exponential backoff for API calls
 * @param {Function} asyncFn - The async function to retry
 * @param {Number} maxRetries - Maximum number of retries (default: 3)
 * @param {Number} initialDelay - Initial delay in ms (default: 1000)
 * @param {Array} retryableStatuses - HTTP statuses to retry on (default: [503, 429])
 * @returns {Promise} Result from the async function
 */
export async function retryWithBackoff(
  asyncFn,
  maxRetries = 3,
  initialDelay = 1000,
  retryableStatuses = [503, 429]
) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.response?.status;

      // Only retry on specific statuses
      if (!retryableStatuses.includes(status)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff: 1s, 2s, 4s, etc.
      const delayMs = initialDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms`, error.message);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

/**
 * Format retry info for client response
 * @param {Number} attempt - Current attempt number
 * @param {Number} maxRetries - Total max retries
 * @returns {Object} Retry info object
 */
export function getRetryInfo(attempt, maxRetries) {
  const delayMs = 1000 * Math.pow(2, attempt);
  return {
    attempt: attempt + 1,
    maxRetries: maxRetries + 1,
    nextRetryIn: delayMs,
  };
}
