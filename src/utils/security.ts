/**
 * Security utilities for the application
 */

/**
 * Validates if a string is a safe data URL for images
 */
export const isValidImageDataUrl = (url: string): boolean => {
  if (typeof url !== 'string') return false;
  
  const validPrefixes = [
    'data:image/png;base64,',
    'data:image/jpeg;base64,',
    'data:image/jpg;base64,',
    'data:image/webp;base64,'
  ];
  
  return validPrefixes.some(prefix => url.startsWith(prefix));
};

/**
 * Sanitizes text input to prevent XSS
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validates file type and size
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only PNG, JPG, and WebP are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  }
  
  return { valid: true };
};