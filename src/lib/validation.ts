
import { BundlePlan, Session, Photographer, Location } from './storage';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validators = {
  // Session validation
  validateSession: (session: Partial<Session>): void => {
    if (!session.name || session.name.trim().length < 3) {
      throw new ValidationError('Session name must be at least 3 characters long', 'name');
    }

    if (!session.location || session.location.trim().length === 0) {
      throw new ValidationError('Location is required', 'location');
    }

    if (!session.photographerId) {
      throw new ValidationError('Photographer ID is required', 'photographerId');
    }
  },

  // Photographer validation
  validatePhotographer: (photographer: Partial<Photographer>): void => {
    if (!photographer.name || photographer.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long', 'name');
    }

    if (!photographer.email || !validators.isValidEmail(photographer.email)) {
      throw new ValidationError('Valid email address is required', 'email');
    }

    if (!photographer.password || photographer.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long', 'password');
    }
  },

  // Bundle plan validation
  validateBundlePlan: (plan: Partial<BundlePlan>): void => {
    if (!plan.name || plan.name.trim().length < 2) {
      throw new ValidationError('Plan name must be at least 2 characters long', 'name');
    }

    if (!plan.photoLimit || plan.photoLimit < 1 || plan.photoLimit > 50) {
      throw new ValidationError('Photo limit must be between 1 and 50', 'photoLimit');
    }

    if (!plan.price || plan.price < 0 || plan.price > 10000) {
      throw new ValidationError('Price must be between 0 and 10000', 'price');
    }
  },

  // Location validation
  validateLocation: (location: Partial<Location>): void => {
    if (!location.name || location.name.trim().length < 2) {
      throw new ValidationError('Location name must be at least 2 characters long', 'name');
    }
  },

  // PIN validation
  validatePin: (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  },

  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // File validation
  validateImageFile: (file: File): void => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError('Only JPEG, PNG, and WEBP images are allowed');
    }

    if (file.size > maxSize) {
      throw new ValidationError('File size must be less than 10MB');
    }
  },

  // Session ID validation
  validateSessionId: (sessionId: string): boolean => {
    return /^[A-Z0-9]{6,12}$/.test(sessionId);
  },

  // Order validation
  validateOrder: (order: any, bundlePlan: BundlePlan): void => {
    if (!order.selectedPhotos || order.selectedPhotos.length === 0) {
      throw new ValidationError('At least one photo must be selected');
    }

    if (order.selectedPhotos.length > bundlePlan.photoLimit) {
      throw new ValidationError(`Cannot select more than ${bundlePlan.photoLimit} photos for this plan`);
    }
  },

  // Data sanitization
  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },

  // Check for duplicate emails
  validateUniqueEmail: (email: string, existingEmails: string[]): void => {
    if (existingEmails.includes(email.toLowerCase())) {
      throw new ValidationError('Email address already exists', 'email');
    }
  }
};
