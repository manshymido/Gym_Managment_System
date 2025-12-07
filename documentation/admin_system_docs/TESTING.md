# دليل الاختبار - Testing Guide

## نظرة عامة

تم إنشاء سكريبتات اختبار شاملة للتحقق من عمل جميع التحسينات التي تمت في المراحل الخمس.

## سكريبتات الاختبار المتاحة

### 1. اختبار API الأساسي
```bash
npm run test-api
```
يختبر الوظائف الأساسية للـ API:
- Health check
- Authentication
- Protected routes
- Error handling

### 2. اختبار التحسينات الشامل
```bash
npm run test-improvements
```
يختبر جميع التحسينات من المراحل الخمس:
- **Phase 3**: Compression, Error Handling
- **Phase 4**: Security Headers (Helmet), Rate Limiting
- **Phase 5**: Request Timeout, Startup Message

## متطلبات التشغيل

قبل تشغيل الاختبارات، تأكد من:

1. **تثبيت Dependencies**:
```bash
npm install
```

2. **تشغيل Backend Server**:
```bash
npm run dev
```
يجب أن يعمل السيرفر على `http://localhost:5000`

3. **ملف البيئة (.env)**:
تأكد من وجود ملف `.env` مع:
- `MONGODB_URI`
- `JWT_SECRET`
- `API_URL` (اختياري - افتراضي: http://localhost:5000)

## ما يتم اختباره

### Phase 3: Middleware الأساسي
- ✅ **Compression**: التحقق من وجود `Content-Encoding` header
- ✅ **Error Handling**: اختبار معالجة الأخطاء المختلفة (400, 401, 404)

### Phase 4: الأمان
- ✅ **Security Headers (Helmet)**: التحقق من:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy`
  - `Content-Security-Policy`
- ✅ **Rate Limiting (General)**: اختبار 100 requests limit
- ✅ **Rate Limiting (Auth)**: اختبار 5 requests limit للـ auth routes

### Phase 5: التحسينات النهائية
- ⚠️ **Request Timeout**: يتطلب endpoint خاص (يتم تخطيه)
- ℹ️ **Startup Message**: فحص يدوي (يتم تخطيه)

## تشغيل الاختبارات

### في Terminal منفصل

1. **Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

2. **Terminal 2 - Tests**:
```bash
cd backend
npm run test-improvements
```

## النتائج المتوقعة

### اختبار Compression
```
✓ PASSED (Status: 200)
  Checking headers...
    ✓ content-encoding: gzip
```

### اختبار Security Headers
```
✓ PASSED (Status: 200)
  Checking headers...
    ✓ x-content-type-options: nosniff
    ✓ x-frame-options: DENY
    ✓ x-xss-protection: 1; mode=block
    ✓ referrer-policy: strict-origin-when-cross-origin
    ✓ content-security-policy: [exists]
```

### اختبار Rate Limiting
```
Rate Limiting Results:
  Successful requests: 100
  Rate limited requests: 1
✓ Rate limiting working correctly!
```

### اختبار Auth Rate Limiting
```
Auth Rate Limit Test 6/6
  ✗ FAILED (Expected 429, got 401)
  ...
✓ Auth rate limiting working correctly!
```

## ملاحظات مهمة

1. **Rate Limiting**: قد يستغرق بعض الوقت لأنه يرسل 100+ requests
2. **Auth Rate Limiting**: قد تحتاج إلى الانتظار 15 دقيقة لإعادة تعيين العد
3. **Request Timeout**: يتطلب endpoint خاص يستغرق وقتاً طويلاً
4. **Startup Message**: يجب فحصه يدوياً في console

## استكشاف الأخطاء

### خطأ: "Request timeout"
- تأكد من أن Backend يعمل
- تحقق من `API_URL` في `.env`

### خطأ: "Connection refused"
- تأكد من تشغيل Backend على port 5000
- تحقق من `MONGODB_URI` في `.env`

### Rate Limiting لا يعمل
- تأكد من تثبيت `express-rate-limit`
- تحقق من أن middleware تم إضافته في `server.js`

### Security Headers مفقودة
- تأكد من تثبيت `helmet`
- تحقق من أن Helmet middleware تم إضافته في `server.js`

## الاختبار اليدوي

بعض الاختبارات تتطلب فحص يدوي:

### 1. Morgan Logging
راقب console في Backend عند عمل requests - يجب أن ترى logs بتنسيق `dev`

### 2. Startup Message
عند تشغيل Backend، يجب أن ترى:
```
==================================================
🚀 Server Started Successfully
==================================================
📡 Server running on port: 5000
🌍 Environment: development
⏰ Started at: [timestamp]
==================================================
```

### 3. Graceful Shutdown
اضغط `Ctrl+C` في Backend terminal - يجب أن ترى:
```
SIGINT received. Starting graceful shutdown...
✅ HTTP server closed
✅ MongoDB Connection Closed Gracefully
✅ Graceful shutdown completed
```

## Frontend Testing

للتحقق من Frontend compatibility:

1. **تشغيل Frontend**:
```bash
cd frontend
npm run dev
```

2. **فتح Browser DevTools**:
- Network tab: للتحقق من Compression و Headers
- Console: للتحقق من Error handling

3. **اختبار Rate Limiting**:
- عمل أكثر من 100 request متتالية
- التحقق من رسالة 429 بالعربية

4. **اختبار Timeout**:
- عمل request يستغرق وقتاً طويلاً
- التحقق من رسالة timeout بالعربية

## الخلاصة

جميع الاختبارات التلقائية متاحة عبر:
```bash
npm run test-improvements
```

الاختبارات اليدوية مذكورة أعلاه وتتطلب فحص مباشر.

