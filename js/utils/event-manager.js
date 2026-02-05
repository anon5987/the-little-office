/**
 * Event Manager Module
 * Manages event listeners with automatic cleanup to prevent accumulation
 */

// Store for tracking listeners by scope
const listenerRegistry = new Map();

/**
 * Create a scoped event manager for a specific view/component
 * @param {string} scope - Unique identifier for this scope (e.g., 'landing-page', 'hour-page')
 * @returns {Object} Event manager for this scope
 */
export function createEventScope(scope) {
  // Clean up any existing listeners in this scope
  cleanupScope(scope);

  // Initialize registry for this scope
  listenerRegistry.set(scope, []);

  return {
    /**
     * Add an event listener and track it for cleanup
     * @param {EventTarget} target - Element or object to attach listener to
     * @param {string} type - Event type (e.g., 'click', 'change')
     * @param {Function} handler - Event handler function
     * @param {Object} options - Optional addEventListener options
     */
    add(target, type, handler, options) {
      if (!target) return;

      target.addEventListener(type, handler, options);

      const listeners = listenerRegistry.get(scope);
      listeners.push({ target, type, handler, options });
    },

    /**
     * Clean up all listeners in this scope
     */
    cleanup() {
      cleanupScope(scope);
    },
  };
}

/**
 * Clean up all listeners in a scope
 * @param {string} scope - Scope to clean up
 */
export function cleanupScope(scope) {
  const listeners = listenerRegistry.get(scope);
  if (!listeners) return;

  for (const { target, type, handler, options } of listeners) {
    target.removeEventListener(type, handler, options);
  }

  listenerRegistry.delete(scope);
}

// Event scope identifiers
export const SCOPES = {
  LANDING_PAGE: 'landing-page',
  HOUR_PAGE: 'hour-page',
  STICKY_HEADER: 'sticky-header',
  GLOBAL: 'global',
};
