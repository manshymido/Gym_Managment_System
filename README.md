# 🏋️ نظام إدارة الجيمات متعدد المستأجرين

نظام SaaS متعدد المستأجرين لإدارة الجيمات يتكون من:
1. **نظام الإدارة الرئيسي (Admin System)**: يدير اشتراكات مديري الجيمات
2. **نظام إدارة الجيم (Gym Manager System)**: يدير كل مدير جيم أعضاء جيمه واشتراكاتهم

## 📋 جدول المحتويات

- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [المتطلبات](#المتطلبات)
- [التثبيت والتشغيل](#التثبيت-والتشغيل)
- [البنية](#البنية)
- [الميزات](#الميزات)
- [روابط الموقع](#روابط-الموقع)
- [توثيق APIs](#توثيق-apis)
- [الأمان](#الأمان)
- [أنظمة الدفع](#أنظمة-الدفع)
- [التطوير](#التطوير)

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express** - إطار عمل الويب
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - للمصادقة
- **bcryptjs** - لتشفير كلمات المرور
- **Stripe & PayPal** - أنظمة الدفع

### Frontend
- **React** - مكتبة واجهة المستخدم
- **Vite** - أداة البناء
- **React Router** - التوجيه
- **Axios** - طلبات HTTP

## 📦 المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB (محلي أو Atlas)
- npm أو yarn

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/manshymido/Gym-system.git
cd Gym-system
```

### 2. إعداد Backend

```bash
cd backend
npm install
cp .env.example .env
```

قم بتعديل ملف `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gym-management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

تشغيل Backend:
```bash
npm run dev
```

إنشاء Admin افتراضي:
```bash
npm run create-admin
```

البيانات الافتراضية:
- Email: `admin@example.com`
- Password: `admin123`

### 3. إعداد Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

قم بتعديل ملف `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

تشغيل Frontend:
```bash
npm run dev
```

## 📁 البنية

```
Gym-system/
├── backend/
│   ├── src/
│   │   ├── config/          # إعدادات قاعدة البيانات والدفع
│   │   ├── models/          # نماذج MongoDB
│   │   ├── routes/          # مسارات API
│   │   ├── controllers/     # منطق العمل
│   │   ├── middleware/      # Middleware للمصادقة والعزل
│   │   ├── services/        # خدمات الدفع
│   │   ├── utils/           # أدوات مساعدة
│   │   └── server.js        # نقطة الدخول
│   ├── admin_system_docs/   # توثيق APIs نظام الإدارة
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # مكونات React
│   │   ├── pages/          # صفحات التطبيق
│   │   ├── services/       # خدمات API
│   │   ├── context/        # Context API
│   │   ├── design-system/  # نظام التصميم
│   │   └── App.jsx
│   ├── gym_manager_system_docs/  # توثيق APIs نظام مدير الجيم
│   ├── .env.example
│   └── package.json
│
└── documentation/
    └── README.md           # توثيق إضافي
```

## ✨ الميزات

### نظام الإدارة (Admin)
- ✅ تسجيل دخول/خروج المدير
- ✅ إدارة مديري الجيمات (CRUD)
- ✅ إنشاء وإدارة باقات الاشتراك
- ✅ إدارة اشتراكات مديري الجيمات
- ✅ معالجة المدفوعات
- ✅ تقارير عن الإيرادات والاشتراكات

### نظام مدير الجيم (Gym Manager)
- ✅ تسجيل دخول/خروج مدير الجيم
- ✅ إدارة أعضاء الجيم (CRUD)
- ✅ إدارة اشتراكات الأعضاء
- ✅ تسجيل الحضور والخروج
- ✅ معالجة مدفوعات الأعضاء
- ✅ تقارير شاملة (إيرادات، أعضاء، حضور)

### الميزات العامة
- ✅ واجهة مستخدم حديثة وسهلة الاستخدام
- ✅ تصميم متجاوب (Responsive Design)
- ✅ دعم أنظمة دفع متعددة
- ✅ نظام تقارير شامل
- ✅ عزل البيانات بين الجيمات (Multi-tenancy)

## 🔗 روابط الموقع

### صفحات نظام الإدارة (Admin)
- **تسجيل دخول المدير**: `http://localhost:3000/admin/login`
- **لوحة تحكم المدير**: `http://localhost:3000/admin/dashboard`
- **إدارة مديري الجيمات**: `http://localhost:3000/admin/gym-managers`
- **إدارة الاشتراكات**: `http://localhost:3000/admin/subscriptions`
- **إدارة الباقات**: `http://localhost:3000/admin/plans`

### صفحات نظام مدير الجيم (Gym Manager)
- **تسجيل دخول مدير الجيم**: `http://localhost:3000/gym/login`
- **تسجيل مدير جيم جديد**: `http://localhost:3000/gym/register`
- **لوحة تحكم مدير الجيم**: `http://localhost:3000/gym/dashboard`
- **إدارة الأعضاء**: `http://localhost:3000/gym/members`
- **إدارة اشتراكات الأعضاء**: `http://localhost:3000/gym/subscriptions`
- **إدارة المدفوعات**: `http://localhost:3000/gym/payments`
- **تسجيل الحضور**: `http://localhost:3000/gym/attendance`
- **التقارير**: `http://localhost:3000/gym/reports`

### الصفحات العامة
- **الصفحة الرئيسية**: `http://localhost:3000/`
- **صفحة الاشتراك**: `http://localhost:3000/subscribe`

## 📚 توثيق APIs

لتفاصيل APIs، راجع الملفات التالية:
- [Admin APIs](./backend/admin_system_docs/ADMIN_API.md) - تفاصيل APIs نظام الإدارة
- [Gym Manager APIs](./frontend/gym_manager_system_docs/GYM_MANAGER_API.md) - تفاصيل APIs نظام مدير الجيم

## 🔒 الأمان

- ✅ JWT للمصادقة
- ✅ عزل البيانات بين الجيمات (Multi-tenancy)
- ✅ تشفير كلمات المرور (bcrypt)
- ✅ Content Security Policy (CSP)
- ✅ Security Headers (X-Content-Type-Options, X-Frame-Options)
- ✅ التحقق من صحة البيانات (Validation)
- ✅ Request Size Limits - حماية من الطلبات الكبيرة
- ✅ Graceful Shutdown - إغلاق آمن للخادم

## 💳 أنظمة الدفع

- **Stripe** - دعم كامل للدفع الإلكتروني
- **PayPal** - دعم كامل للدفع الإلكتروني
- **الدفع المحلي** - نقدي، بطاقة، أونلاين

## 👨‍💻 التطوير

### Backend Scripts
```bash
npm run dev          # تشغيل في وضع التطوير
npm start            # تشغيل في وضع الإنتاج
npm run create-admin # إنشاء admin افتراضي
npm run test-api     # اختبار APIs
```

## ⚙️ إعدادات متقدمة

### تحسينات قاعدة البيانات

تم تحسين اتصال MongoDB مع الميزات التالية:

- **Connection Pooling**: إدارة فعالة لاتصالات قاعدة البيانات
- **Retry Logic**: إعادة محاولة الاتصال تلقائياً مع exponential backoff
- **Event Handlers**: مراقبة حالة الاتصال (connected, error, disconnected, reconnected)
- **Graceful Shutdown**: إغلاق آمن للاتصال عند إيقاف الخادم
- **Timeout Configuration**: إعدادات قابلة للتخصيص للـ timeouts

### حدود حجم الطلبات

تم إضافة حماية من الطلبات الكبيرة:

- **JSON Body Limit**: حد أقصى لحجم JSON (افتراضي: 10MB)
- **URL-encoded Limit**: حد أقصى لحجم URL-encoded data (افتراضي: 10MB)
- **Error Handling**: معالجة مخصصة لأخطاء 413 Payload Too Large
- **Security Logging**: تسجيل محاولات الطلبات الكبيرة

يمكن تخصيص الحدود عبر متغيرات البيئة `REQUEST_SIZE_LIMIT_JSON` و `REQUEST_SIZE_LIMIT_URLENCODED`.

### Frontend Scripts
```bash
npm run dev          # تشغيل في وضع التطوير
npm run build        # بناء للإنتاج
npm run preview      # معاينة البناء
```

## 🔧 المتغيرات البيئية

### Backend (.env)
```env
PORT=5000                                    # منفذ الخادم
NODE_ENV=development                         # بيئة التشغيل
MONGODB_URI=mongodb://localhost:27017/gym-management  # رابط MongoDB
JWT_SECRET=your_jwt_secret_key_here          # مفتاح JWT
JWT_EXPIRES_IN=7d                            # مدة صلاحية JWT
STRIPE_SECRET_KEY=your_stripe_secret_key     # مفتاح Stripe السري
PAYPAL_CLIENT_ID=your_paypal_client_id       # معرف PayPal
PAYPAL_CLIENT_SECRET=your_paypal_secret      # سر PayPal
ADMIN_EMAIL=admin@example.com                # بريد Admin الافتراضي
ADMIN_PASSWORD=admin123                       # كلمة مرور Admin الافتراضية

# MongoDB Connection Options (اختياري)
MONGODB_MAX_POOL_SIZE=10                     # الحد الأقصى لاتصالات MongoDB
MONGODB_MIN_POOL_SIZE=2                      # الحد الأدنى لاتصالات MongoDB
MONGODB_CONNECT_TIMEOUT_MS=30000             # مهلة الاتصال (ملي ثانية)
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000     # مهلة اختيار الخادم (ملي ثانية)
MONGODB_SOCKET_TIMEOUT_MS=45000              # مهلة Socket (ملي ثانية)

# Request Size Limits (اختياري)
REQUEST_SIZE_LIMIT_JSON=10mb                 # الحد الأقصى لحجم JSON
REQUEST_SIZE_LIMIT_URLENCODED=10mb           # الحد الأقصى لحجم URL-encoded
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api       # رابط API
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key  # مفتاح Stripe العام
```

## 🤝 المساهمة

نرحب بمساهماتكم! للمساهمة:

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت ISC License.

## 📞 الدعم

للحصول على المساعدة، يرجى فتح [issue](https://github.com/manshymido/Gym-system/issues) في المستودع.

## 👤 المؤلف

- GitHub: [@manshymido](https://github.com/manshymido)

---

⭐ إذا أعجبك المشروع، لا تنسى إعطائه نجمة!

