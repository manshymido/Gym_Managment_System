# نظام إدارة الجيمات متعدد المستأجرين

نظام SaaS متعدد المستأجرين لإدارة الجيمات يتكون من:
1. **نظام الإدارة الرئيسي (Admin System)**: يدير اشتراكات مديري الجيمات
2. **نظام إدارة الجيم (Gym Manager System)**: يدير كل مدير جيم أعضاء جيمه واشتراكاتهم

## التقنيات المستخدمة

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

## المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB (محلي أو Atlas)
- npm أو yarn

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd ecommerceManager
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
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

تشغيل Frontend:
```bash
npm run dev
```

## البنية

```
ecommerceManager/
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
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # مكونات React
    │   ├── pages/          # صفحات التطبيق
    │   ├── services/       # خدمات API
    │   ├── context/        # Context API
    │   └── App.jsx
    ├── .env
    └── package.json
```

## الميزات

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

## روابط الموقع

### صفحات نظام الإدارة (Admin)
- **تسجيل دخول المدير**: `http://localhost:3000/admin/login`
- **لوحة تحكم المدير**: `http://localhost:3000/admin/dashboard`
- **إدارة مديري الجيمات**: `http://localhost:3000/admin/gym-managers`
- **إدارة الاشتراكات**: `http://localhost:3000/admin/subscriptions`
- **إدارة الباقات**: `http://localhost:3000/admin/plans`

### صفحات نظام مدير الجيم (Gym Manager)
- **تسجيل دخول مدير الجيم**: `http://localhost:3000/gym/login`
- **لوحة تحكم مدير الجيم**: `http://localhost:3000/gym/dashboard`
- **إدارة الأعضاء**: `http://localhost:3000/gym/members`
- **إدارة اشتراكات الأعضاء**: `http://localhost:3000/gym/subscriptions`
- **إدارة المدفوعات**: `http://localhost:3000/gym/payments`
- **تسجيل الحضور**: `http://localhost:3000/gym/attendance`
- **التقارير**: `http://localhost:3000/gym/reports`

## توثيق APIs

لتفاصيل APIs، راجع الملفات التالية:
- [Admin APIs](./ADMIN_API.md) - تفاصيل APIs نظام الإدارة
- [Gym Manager APIs](./GYM_MANAGER_API.md) - تفاصيل APIs نظام مدير الجيم

## الأمان

- ✅ JWT للمصادقة
- ✅ عزل البيانات بين الجيمات (Multi-tenancy)
- ✅ تشفير كلمات المرور (bcrypt)
- ✅ Content Security Policy (CSP)
- ✅ Security Headers (X-Content-Type-Options, X-Frame-Options)

## أنظمة الدفع

- **Stripe** - دعم كامل
- **PayPal** - دعم كامل
- **الدفع المحلي** - نقدي، بطاقة، أونلاين

## التطوير

### Backend Scripts
```bash
npm run dev          # تشغيل في وضع التطوير
npm start            # تشغيل في وضع الإنتاج
npm run create-admin # إنشاء admin افتراضي
```

### Frontend Scripts
```bash
npm run dev          # تشغيل في وضع التطوير
npm run build        # بناء للإنتاج
npm run preview      # معاينة البناء
```

## المتغيرات البيئية

### Backend (.env)
- `PORT` - منفذ الخادم (افتراضي: 5000)
- `MONGODB_URI` - رابط MongoDB
- `JWT_SECRET` - مفتاح JWT
- `STRIPE_SECRET_KEY` - مفتاح Stripe
- `PAYPAL_CLIENT_ID` - معرف PayPal
- `ADMIN_EMAIL` - بريد Admin الافتراضي
- `ADMIN_PASSWORD` - كلمة مرور Admin الافتراضية

### Frontend (.env)
- `VITE_API_URL` - رابط API
- `VITE_STRIPE_PUBLISHABLE_KEY` - مفتاح Stripe العام

## المساهمة

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت ISC License.

## الدعم

للحصول على المساعدة، يرجى فتح issue في المستودع.

