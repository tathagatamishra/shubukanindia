// cookies.js - Cookie management utility for Next.js

/**
 * Set a cookie with optional configuration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 * @param {number} options.days - Days until expiration (default: 30)
 * @param {string} options.path - Cookie path (default: '/')
 * @param {string} options.domain - Cookie domain
 * @param {boolean} options.secure - Secure flag (default: false)
 * @param {string} options.sameSite - SameSite attribute ('strict', 'lax', 'none')
 * @param {boolean} options.httpOnly - HttpOnly flag (not applicable for client-side)
 */
export const setCookie = (name, value, options = {}) => {
  if (typeof window === 'undefined') {
    console.warn('setCookie: Cannot set cookies on server side');
    return;
  }

  const {
    days = 30,
    path = '/',
    domain,
    secure = false,
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Set expiration date
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }

  // Add path
  if (path) {
    cookieString += `; path=${path}`;
  }

  // Add domain
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  // Add secure flag
  if (secure) {
    cookieString += `; secure`;
  }

  // Add SameSite attribute
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === 'undefined') {
    console.warn('getCookie: Cannot get cookies on server side');
    return null;
  }

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

/**
 * Delete a cookie by setting its expiration date to the past
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path (default: '/')
 * @param {string} domain - Cookie domain
 */
export const deleteCookie = (name, path = '/', domain) => {
  if (typeof window === 'undefined') {
    console.warn('deleteCookie: Cannot delete cookies on server side');
    return;
  }

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
};

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} True if cookie exists, false otherwise
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 * @returns {Object} Object containing all cookies as key-value pairs
 */
export const getAllCookies = () => {
  if (typeof window === 'undefined') {
    console.warn('getAllCookies: Cannot get cookies on server side');
    return {};
  }

  const cookies = {};
  const cookieArray = document.cookie.split(';');

  cookieArray.forEach(cookie => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  return cookies;
};

/**
 * Clear all cookies (client-side only)
 * Note: This only works for cookies that are accessible to JavaScript
 */
export const clearAllCookies = () => {
  if (typeof window === 'undefined') {
    console.warn('clearAllCookies: Cannot clear cookies on server side');
    return;
  }

  const cookies = getAllCookies();
  Object.keys(cookies).forEach(cookieName => {
    deleteCookie(cookieName);
  });
};

/**
 * Set a cookie with JSON value
 * @param {string} name - Cookie name
 * @param {Object} value - Object to be stored as JSON
 * @param {Object} options - Cookie options (same as setCookie)
 */
export const setJSONCookie = (name, value, options = {}) => {
  try {
    const jsonValue = JSON.stringify(value);
    setCookie(name, jsonValue, options);
  } catch (error) {
    console.error('setJSONCookie: Error stringifying value', error);
  }
};

/**
 * Get a cookie value and parse it as JSON
 * @param {string} name - Cookie name
 * @returns {Object|null} Parsed JSON object or null if not found/invalid
 */
export const getJSONCookie = (name) => {
  try {
    const value = getCookie(name);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('getJSONCookie: Error parsing JSON', error);
    return null;
  }
};

// Default export with all methods
const cookies = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie,
  has: hasCookie,
  getAll: getAllCookies,
  clearAll: clearAllCookies,
  setJSON: setJSONCookie,
  getJSON: getJSONCookie
};

export default cookies;