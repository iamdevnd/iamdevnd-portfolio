// src/lib/security.ts
// Input sanitization and validation utilities

import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  // Remove HTML tags and scripts
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Additional cleaning
  return sanitized
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidLength(text: string, min: number, max: number): boolean {
  return text.length >= min && text.length <= max;
}

// Check for suspicious patterns
export function detectSuspiciousContent(text: string): boolean {
  const suspiciousPatterns = [
    /\b(script|javascript|onclick|onload|onerror)\b/i,
    /\b(eval|function|window|document)\b/i,
    /<[^>]*>/g,
    /\b(viagra|casino|loan|crypto|bitcoin)\b/i, // Spam keywords
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(text));
}

// Rate limiting helper (simple in-memory store)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number = 60 * 60 * 1000, maxAttempts: number = 3) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    
    if (!this.attempts.has(identifier)) {
      this.attempts.set(identifier, []);
    }

    const attempts = this.attempts.get(identifier)!;
    
    // Remove old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    this.attempts.set(identifier, recentAttempts);

    if (recentAttempts.length >= this.maxAttempts) {
      return false; // Rate limited
    }

    recentAttempts.push(now);
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const contactFormLimiter = new RateLimiter(60 * 60 * 1000, 3); // 3 per hour