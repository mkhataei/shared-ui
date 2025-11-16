import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import activityTracker from '@shared/utils/activityTracker';

/**
 * Hook برای tracking خودکار page views
 */
export const usePageTracking = () => {
  const location = useLocation();
  const user = useSelector(selectUser);

  useEffect(() => {
    // Set user ID - چک کردن همه حالات ممکن
    const userId = user?.data?._id || user?.data?.id || user?._id || user?.id;

    if (userId) {
      // console.log('✅ Activity Tracking - User ID set:', userId);
      activityTracker.setUserId(userId);
    } else {
      console.warn('⚠️ Activity Tracking - No user ID found. User object:', user);
    }
  }, [user]);

  useEffect(() => {
    // Track page view on route change
    activityTracker.trackPageView(location.pathname);
  }, [location.pathname]);
};

/**
 * Hook برای tracking کلیک‌ها
 */
export const useClickTracking = (elementName) => {
  return (metadata = {}) => {
    activityTracker.trackClick(elementName, metadata);
  };
};

/**
 * Hook برای tracking فرم‌ها
 */
export const useFormTracking = (formName) => {
  const trackSubmit = (metadata = {}) => {
    activityTracker.trackFormSubmit(formName, metadata);
  };

  const trackError = (error, metadata = {}) => {
    activityTracker.trackError(error, { form: formName, ...metadata });
  };

  return { trackSubmit, trackError };
};

export default activityTracker;
