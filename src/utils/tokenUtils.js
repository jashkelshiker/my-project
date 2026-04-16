/**
 * JWT Token Utilities
 * Validates and manages JWT tokens
 */

/**
 * Check if a string is a valid JWT
 * Validates basic JWT structure (3 dot-separated parts)
 * @param {string} token - Token to validate
 * @returns {boolean} - True if appears to be a JWT
 */
export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  // JWT should have 3 parts: header.payload.signature
  return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Decode JWT payload (without verification)
 * Safe decoding with fallback
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if fails
 */
export const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    let payload = parts[1];
    
    // Add padding for base64
    while (payload.length % 4) {
      payload += '=';
    }
    
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.debug('Could not decode token payload:', error.message);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
};

/**
 * Clear all auth tokens from localStorage
 */
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Validate and repair token storage
 * Clears invalid tokens and returns validity
 * Only clears tokens if they fail basic structure checks
 * @returns {boolean} - True if tokens look valid
 */
export const validateStoredTokens = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // If no tokens, that's fine (not logged in yet)
  if (!accessToken && !refreshToken) {
    return false;
  }

  // Check if tokens exist but are obviously invalid (not strings, empty, etc)
  if ((accessToken && typeof accessToken !== 'string') || 
      (refreshToken && typeof refreshToken !== 'string')) {
    console.warn('Invalid token types in storage');
    clearAuthTokens();
    return false;
  }

  // If we have both tokens, consider them valid
  // The server will reject them on API calls if they're actually invalid
  return !!accessToken && !!refreshToken;
};
