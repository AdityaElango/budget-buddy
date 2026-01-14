/**
 * Network Resilience Utilities
 * Handles network timeouts, retries, and graceful degradation
 */

const DEFAULT_TIMEOUT = 8000; // 8 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second between retries

/**
 * Fetch with timeout and retry logic
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {number} timeout - Request timeout in ms
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(
  url,
  options = {},
  timeout = DEFAULT_TIMEOUT,
  retries = MAX_RETRIES
) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Success response
      if (response.ok) {
        return response;
      }

      // Server error - may retry
      if (response.status >= 500 && attempt < retries) {
        lastError = new Error(`Server error: ${response.status}`);
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }

      // Client error or last attempt
      return response;
    } catch (error) {
      lastError = error;

      // Network timeout or abort - retry
      if (
        error.name === 'AbortError' ||
        error.message.includes('timeout') ||
        error.message.includes('network')
      ) {
        if (attempt < retries) {
          console.log(`Attempt ${attempt + 1} failed, retrying...`, error.message);
          await delay(RETRY_DELAY * (attempt + 1));
          continue;
        }
      }

      // Other errors - don't retry
      throw error;
    }
  }

  // All retries exhausted
  throw lastError || new Error('Network request failed');
}

/**
 * Delay utility for retry logic
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if API is reachable with timeout
 * @returns {Promise<boolean>}
 */
export async function isAPIReachable() {
  try {
    const response = await fetchWithRetry(
      `${process.env.REACT_APP_API_URL || ''}/api/health`,
      { method: 'GET' },
      3000, // Quick check
      0 // No retries for health check
    );
    return response.ok;
  } catch (error) {
    console.log('API not reachable:', error.message);
    return false;
  }
}

/**
 * Batch API requests with timeout
 * @param {array} requests - Array of {url, options} objects
 * @param {number} timeout - Request timeout
 * @returns {Promise<array>}
 */
export async function batchFetch(requests, timeout = DEFAULT_TIMEOUT) {
  return Promise.allSettled(
    requests.map(({ url, options = {} }) =>
      fetchWithRetry(url, options, timeout, 1)
    )
  );
}

/**
 * Create a request that auto-cancels after timeout
 * @param {string} url
 * @param {object} options
 * @param {number} timeout
 * @returns {Promise<Response>}
 */
export function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    });
}

export default {
  fetchWithRetry,
  fetchWithTimeout,
  isAPIReachable,
  batchFetch,
  delay
};
