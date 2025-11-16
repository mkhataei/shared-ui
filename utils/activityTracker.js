import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ActivityTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.userId = null;
    this.enabled = true;
    this.queue = [];
    this.batchSize = 10;
    this.flushInterval = 5000; // 5 seconds
    this.startBatchTimer();
  }

  getOrCreateSessionId() {
    // Check if sessionId exists in localStorage
    const STORAGE_KEY = 'fana_session_id';
    const STORAGE_TIMESTAMP_KEY = 'fana_session_timestamp';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    let sessionId = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

    // Check if session expired (30 minutes)
    const now = Date.now();
    if (sessionId && timestamp) {
      const sessionAge = now - parseInt(timestamp, 10);
      if (sessionAge < SESSION_DURATION) {
        // Update timestamp to extend session
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());
        return sessionId;
      }
    }

    // Create new session
    sessionId = this.generateSessionId();
    localStorage.setItem(STORAGE_KEY, sessionId);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());

    console.log('🆕 New session created:', sessionId);
    return sessionId;
  }

  generateSessionId() {
    // Use UUID v4 for better uniqueness
    return uuidv4();
  }

  setUserId(userId) {
    // Ensure userId is a string
    this.userId = userId ? String(userId) : null;
    // console.log('📍 ActivityTracker.setUserId called:', {
    //   input: userId,
    //   stored: this.userId,
    //   type: typeof this.userId
    // });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Clear session (call on logout)
   */
  clearSession() {
    localStorage.removeItem('fana_session_id');
    localStorage.removeItem('fana_session_timestamp');
    // Create new session
    this.sessionId = this.getOrCreateSessionId();
    console.log('🔄 Session cleared and recreated');
  }

  /**
   * Track a single activity
   */
  track(eventType, data = {}) {
    if (!this.enabled) return;

    const activity = {
      userId: this.userId,
      sessionId: this.sessionId,
      eventType,
      timestamp: new Date().toISOString(),
      page: data.page || window.location.pathname,
      action: data.action,
      payload: data.payload,
      userAgent: navigator.userAgent,
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      ...data,
    };

    // Log for debugging
    if (!this.userId) {
      console.warn('⚠️ Activity tracked without userId:', { eventType, page: activity.page });
    }

    this.queue.push(activity);

    // Flush immediately for critical events
    if (eventType === 'error' || this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName) {
    this.track('page_view', {
      action: 'view_page',
      payload: { pageName },
    });
  }

  /**
   * Track button click
   */
  trackClick(elementName, payload = {}) {
    this.track('button_click', {
      action: 'click',
      payload: { element: elementName, ...payload },
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName, payload = {}) {
    this.track('form_submit', {
      action: 'submit_form',
      payload: { form: formName, ...payload },
    });
  }

  /**
   * Track API call
   */
  trackApiCall(endpoint, method, statusCode, duration) {
    this.track('api_call', {
      action: 'api_request',
      method,
      statusCode,
      duration,
      payload: { endpoint },
    });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.track('error', {
      action: 'error_occurred',
      errorMessage: error.message || String(error),
      errorStack: error.stack,
      payload: context,
    });
  }

  /**
   * Track search
   */
  trackSearch(query, results) {
    this.track('search', {
      action: 'search',
      payload: {
        searchQuery: query,
        resultsCount: results,
      },
    });
  }

  /**
   * Flush queue to server
   */
  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await axios.post(`${API_BASE_URL}/activity/batch`, {
        events,
      });
    } catch (error) {
      console.error('Failed to send activity batch:', error);
      // Re-add to queue if failed (optional)
      // this.queue.unshift(...events);
    }
  }

  /**
   * Start automatic batch flushing
   */
  startBatchTimer() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flush on page unload
   */
  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }
}

// Create singleton instance
const activityTracker = new ActivityTracker();

// Setup beforeunload handler
activityTracker.setupBeforeUnload();

// Setup global error tracking
window.addEventListener('error', (event) => {
  activityTracker.trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Setup unhandled promise rejection tracking
window.addEventListener('unhandledrejection', (event) => {
  activityTracker.trackError(new Error(event.reason), {
    type: 'unhandled_promise_rejection',
  });
});

export default activityTracker;
