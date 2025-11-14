# 📊 Activity Tracking System

سیستم جامع ردیابی فعالیت کاربران در فانا پورتال

## ✨ ویژگی‌ها

- ✅ ردیابی خودکار بازدید صفحات
- ✅ ردیابی کلیک‌های کاربر
- ✅ ردیابی ارسال فرم‌ها
- ✅ ردیابی خودکار API callها
- ✅ ردیابی خودکار خطاها
- ✅ ارسال دسته‌ای (Batch) برای کاهش تعداد requestها
- ✅ نمایش تاریخ‌ها به شمسی
- ✅ داشبورد تحلیلی کامل

## 🚀 نحوه استفاده

### 1. ردیابی خودکار

ردیابی صفحات و API callها به صورت خودکار فعال است و نیازی به کد اضافی ندارد.

### 2. ردیابی دستی کلیک‌ها

```javascript
import { useClickTracking } from '@shared/hooks/useActivityTracking';

function MyComponent() {
  const trackClick = useClickTracking('button-name');

  const handleClick = () => {
    trackClick({ extra: 'data' });
    // ... rest of your code
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### 3. ردیابی فرم‌ها

```javascript
import { useFormTracking } from '@shared/hooks/useActivityTracking';

function MyForm() {
  const { trackSubmit, trackError } = useFormTracking('my-form');

  const handleSubmit = async (data) => {
    try {
      await api.submitForm(data);
      trackSubmit({ formData: data });
    } catch (error) {
      trackError(error, { formData: data });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 4. ردیابی دستی رویدادها

```javascript
import activityTracker from '@shared/utils/activityTracker';

// ردیابی جستجو
activityTracker.trackSearch('search query', 42); // 42 = تعداد نتایج

// ردیابی خطا
activityTracker.trackError(new Error('Something went wrong'), {
  context: 'additional info'
});
```

## 📋 داشبورد

برای مشاهده داشبورد فعالیت‌ها:

1. به مسیر `/admin/activity` بروید
2. 4 تب مختلف دارید:
   - **داشبورد**: آمار کلی و نمودارها
   - **جدول فعالیت‌ها**: لیست تمام فعالیت‌ها با فیلتر
   - **لاگ خطاها**: لیست خطاها با جزئیات
   - **تایم‌لاین کاربر**: مشاهده فعالیت‌های یک کاربر خاص

## 🔧 تنظیمات

### غیرفعال کردن tracking

```javascript
import activityTracker from '@shared/utils/activityTracker';

activityTracker.setEnabled(false);
```

### تنظیم user ID به صورت دستی

```javascript
activityTracker.setUserId('user-id-123');
```

## 📊 نوع رویدادها

- `page_view`: بازدید صفحه
- `button_click`: کلیک دکمه
- `form_submit`: ارسال فرم
- `api_call`: فراخوانی API
- `error`: خطا
- `search`: جستجو

## 🗄️ Backend Endpoints

- `POST /activity/track` - ثبت یک رویداد
- `POST /activity/batch` - ثبت دسته‌ای رویدادها
- `GET /activity/query` - جستجو در فعالیت‌ها
- `GET /activity/user/:userId` - تایم‌لاین کاربر
- `GET /activity/dashboard/stats` - آمار کلی
- `GET /activity/dashboard/summary` - خلاصه داشبورد
- `GET /activity/dashboard/errors` - لیست خطاها

## 💾 ذخیره‌سازی

- **Hot Storage**: MongoDB (فعالیت‌های اخیر)
- **Cold Storage**: ClickHouse (آرشیو)
- **Queue**: Redis + Bull (پردازش ناهمزمان)

## ⚡ بهینه‌سازی

- ارسال دسته‌ای هر 5 ثانیه یا هر 10 رویداد
- Flush خودکار هنگام بستن صفحه
- ارسال فوری خطاها
- استفاده از Queue برای پردازش ناهمزمان
