# Admin System API Documentation

توثيق شامل لـ APIs نظام الإدارة الرئيسي

## Base URL
```
http://localhost:5000/api/admin
```

## Authentication

جميع الـ APIs (ما عدا `/auth/login` و `/auth/register`) تتطلب مصادقة باستخدام JWT Token في Header:
```
Authorization: Bearer <token>
```

---

## Authentication APIs

### تسجيل دخول المدير
**POST** `/auth/login`

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

#### Error Responses
- **401 Unauthorized**: بيانات الدخول غير صحيحة
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### تسجيل مدير جديد
**POST** `/auth/register`

#### Request Body
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

---

### جلب بيانات المدير
**GET** `/auth/profile`

#### Headers
```
Authorization: Bearer <token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses
- **401 Unauthorized**: Token غير صالح أو مفقود
- **403 Forbidden**: غير مصرح بالوصول

---

## Gym Managers APIs

جميع الـ APIs التالية تتطلب مصادقة Admin.

### جلب جميع مديري الجيمات
**GET** `/gym-managers`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `search` - البحث بالاسم أو البريد الإلكتروني

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Gym Manager Name",
      "email": "manager@gym.com",
      "gymName": "Fitness Gym",
      "phone": "1234567890",
      "address": "123 Street",
      "subscription": {
        "status": "active",
        "plan": "Premium",
        "expiresAt": "2024-12-31T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### جلب مدير جيم محدد
**GET** `/gym-managers/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Gym Manager Name",
    "email": "manager@gym.com",
    "gymName": "Fitness Gym",
    "phone": "1234567890",
    "address": "123 Street",
    "subscription": {
      "status": "active",
      "plan": "Premium",
      "expiresAt": "2024-12-31T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses
- **404 Not Found**: مدير الجيم غير موجود

---

### تحديث مدير جيم
**PUT** `/gym-managers/:id`

#### Request Body
```json
{
  "name": "Updated Name",
  "gymName": "Updated Gym Name",
  "phone": "9876543210",
  "address": "456 New Street"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Name",
    "gymName": "Updated Gym Name",
    "phone": "9876543210",
    "address": "456 New Street",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### حذف مدير جيم
**DELETE** `/gym-managers/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Gym manager deleted successfully"
}
```

#### Error Responses
- **404 Not Found**: مدير الجيم غير موجود

---

## Plans APIs

جميع الـ APIs التالية تتطلب مصادقة Admin.

### جلب جميع الباقات
**GET** `/plans`

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Basic",
      "description": "Basic subscription plan",
      "price": 99.99,
      "duration": 30,
      "features": ["Feature 1", "Feature 2"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### جلب باقة محددة
**GET** `/plans/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Basic",
    "description": "Basic subscription plan",
    "price": 99.99,
    "duration": 30,
    "features": ["Feature 1", "Feature 2"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### إنشاء باقة جديدة
**POST** `/plans`

#### Request Body
```json
{
  "name": "Premium",
  "description": "Premium subscription plan",
  "price": 199.99,
  "duration": 30,
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Premium",
    "description": "Premium subscription plan",
    "price": 199.99,
    "duration": 30,
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث باقة
**PUT** `/plans/:id`

#### Request Body
```json
{
  "name": "Updated Premium",
  "price": 249.99,
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Updated Premium",
    "price": 249.99,
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### حذف باقة
**DELETE** `/plans/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Plan deleted successfully"
}
```

---

## Subscriptions APIs

جميع الـ APIs التالية تتطلب مصادقة Admin.

### جلب جميع الاشتراكات
**GET** `/subscriptions`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `status` - فلترة حسب الحالة (active, expired, cancelled)
- `gymManagerId` - فلترة حسب مدير الجيم

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "gymManager": {
        "id": "507f1f77bcf86cd799439010",
        "name": "Gym Manager Name",
        "gymName": "Fitness Gym"
      },
      "plan": {
        "id": "507f1f77bcf86cd799439009",
        "name": "Premium",
        "price": 199.99
      },
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T00:00:00.000Z",
      "paymentMethod": "stripe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### جلب اشتراك محدد
**GET** `/subscriptions/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "gymManager": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Gym Manager Name",
      "gymName": "Fitness Gym"
    },
    "plan": {
      "id": "507f1f77bcf86cd799439009",
      "name": "Premium",
      "price": 199.99
    },
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z",
    "paymentMethod": "stripe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### إنشاء اشتراك جديد
**POST** `/subscriptions`

#### Request Body
```json
{
  "gymManagerId": "507f1f77bcf86cd799439010",
  "planId": "507f1f77bcf86cd799439009",
  "paymentMethod": "stripe",
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "gymManager": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Gym Manager Name"
    },
    "plan": {
      "id": "507f1f77bcf86cd799439009",
      "name": "Premium"
    },
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث اشتراك
**PUT** `/subscriptions/:id`

#### Request Body
```json
{
  "status": "active",
  "endDate": "2024-02-29T00:00:00.000Z"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "status": "active",
    "endDate": "2024-02-29T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### إلغاء اشتراك
**DELETE** `/subscriptions/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "status": "cancelled",
    "cancelledAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## Error Responses

جميع الـ APIs قد ترجع الأخطاء التالية:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden. Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Notes

- جميع التواريخ في تنسيق ISO 8601 (UTC)
- جميع الأسعار بالعملة المحلية (يمكن تحديدها في الإعدادات)
- JWT Token صالح لمدة 7 أيام (افتراضي)
- جميع الـ APIs تدعم Content-Type: `application/json`

