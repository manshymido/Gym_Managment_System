# Gym Manager System API Documentation

توثيق شامل لـ APIs نظام إدارة الجيم

## Base URL
```
http://localhost:5000/api/gym
```

## Authentication

جميع الـ APIs (ما عدا `/auth/login` و `/auth/register`) تتطلب:
1. مصادقة باستخدام JWT Token في Header
2. اشتراك نشط (active subscription)

```
Authorization: Bearer <token>
```

**ملاحظة**: مديري الجيم الجدد لديهم اشتراك منتهي (expired) افتراضياً، ويحتاجون لاشتراك نشط للوصول إلى الـ APIs.

---

## Authentication APIs

### تسجيل دخول مدير الجيم
**POST** `/auth/login`

#### Request Body
```json
{
  "email": "manager@gym.com",
  "password": "password123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "gymManager": {
    "id": "507f1f77bcf86cd799439011",
    "email": "manager@gym.com",
    "name": "Gym Manager Name",
    "gymName": "Fitness Gym",
    "subscription": {
      "status": "active",
      "expiresAt": "2024-12-31T00:00:00.000Z"
    }
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

- **403 Forbidden**: الاشتراك منتهي
```json
{
  "success": false,
  "message": "Subscription expired. Please renew your subscription"
}
```

---

### تسجيل مدير جيم جديد
**POST** `/auth/register`

#### Request Body
```json
{
  "name": "Manager Name",
  "gymName": "Fitness Gym",
  "email": "manager@gym.com",
  "password": "securePassword123",
  "phone": "1234567890",
  "address": "123 Street, City"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "gymManager": {
    "id": "507f1f77bcf86cd799439011",
    "email": "manager@gym.com",
    "name": "Manager Name",
    "gymName": "Fitness Gym",
    "phone": "1234567890",
    "address": "123 Street, City",
    "subscription": {
      "status": "expired"
    }
  }
}
```

**ملاحظة**: المدير الجديد سيحصل على اشتراك منتهي افتراضياً ويحتاج لتفعيل اشتراك من نظام الإدارة.

---

### جلب بيانات مدير الجيم
**GET** `/auth/profile`

#### Headers
```
Authorization: Bearer <token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "gymManager": {
    "id": "507f1f77bcf86cd799439011",
    "email": "manager@gym.com",
    "name": "Manager Name",
    "gymName": "Fitness Gym",
    "phone": "1234567890",
    "address": "123 Street, City",
    "subscription": {
      "status": "active",
      "plan": {
        "name": "Premium",
        "price": 199.99
      },
      "expiresAt": "2024-12-31T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses
- **401 Unauthorized**: Token غير صالح أو مفقود
- **403 Forbidden**: الاشتراك منتهي

---

## Members APIs

جميع الـ APIs التالية تتطلب مصادقة واشتراك نشط. البيانات معزولة تلقائياً حسب مدير الجيم (Multi-tenancy).

### جلب جميع الأعضاء
**GET** `/members`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `search` - البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف
- `status` - فلترة حسب الحالة (active, inactive)

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Member Name",
      "email": "member@example.com",
      "phone": "1234567890",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "address": "123 Street",
      "status": "active",
      "subscription": {
        "status": "active",
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

### جلب عضو محدد
**GET** `/members/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Member Name",
    "email": "member@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "address": "123 Street",
    "status": "active",
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "status": "active",
      "plan": "Monthly",
      "expiresAt": "2024-12-31T00:00:00.000Z"
    },
    "attendance": {
      "totalVisits": 45,
      "lastVisit": "2024-01-15T10:30:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses
- **404 Not Found**: العضو غير موجود أو لا ينتمي لهذا الجيم

---

### إضافة عضو جديد
**POST** `/members`

#### Request Body
```json
{
  "name": "New Member",
  "email": "newmember@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "gender": "female",
  "address": "456 Street"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "New Member",
    "email": "newmember@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "gender": "female",
    "address": "456 Street",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث عضو
**PUT** `/members/:id`

#### Request Body
```json
{
  "name": "Updated Member Name",
  "phone": "9876543210",
  "address": "789 New Street"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Member Name",
    "phone": "9876543210",
    "address": "789 New Street",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### حذف عضو
**DELETE** `/members/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

---

## Member Subscriptions APIs

جميع الـ APIs التالية تتطلب مصادقة واشتراك نشط.

### جلب جميع اشتراكات الأعضاء
**GET** `/subscriptions`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `status` - فلترة حسب الحالة (active, expired, cancelled)
- `memberId` - فلترة حسب العضو

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "member": {
        "id": "507f1f77bcf86cd799439010",
        "name": "Member Name",
        "email": "member@example.com"
      },
      "plan": {
        "name": "Monthly",
        "price": 99.99,
        "duration": 30
      },
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T00:00:00.000Z",
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
    "member": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Member Name"
    },
    "plan": {
      "name": "Monthly",
      "price": 99.99,
      "duration": 30
    },
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z",
    "payments": [
      {
        "id": "507f1f77bcf86cd799439014",
        "amount": 99.99,
        "method": "cash",
        "date": "2024-01-01T00:00:00.000Z"
      }
    ],
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
  "memberId": "507f1f77bcf86cd799439010",
  "planName": "Monthly",
  "price": 99.99,
  "duration": 30,
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "member": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Member Name"
    },
    "plan": {
      "name": "Monthly",
      "price": 99.99,
      "duration": 30
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

## Payments APIs

جميع الـ APIs التالية تتطلب مصادقة واشتراك نشط.

### جلب جميع المدفوعات
**GET** `/payments`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `memberId` - فلترة حسب العضو
- `method` - فلترة حسب طريقة الدفع (cash, card, stripe, paypal)
- `startDate` - تاريخ البداية
- `endDate` - تاريخ النهاية

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "member": {
        "id": "507f1f77bcf86cd799439010",
        "name": "Member Name"
      },
      "subscription": {
        "id": "507f1f77bcf86cd799439009",
        "plan": "Monthly"
      },
      "amount": 99.99,
      "method": "cash",
      "status": "completed",
      "date": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 200,
    "pages": 20
  },
  "summary": {
    "totalAmount": 19998.00,
    "totalCount": 200
  }
}
```

---

### جلب دفعة محددة
**GET** `/payments/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "member": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Member Name",
      "email": "member@example.com"
    },
    "subscription": {
      "id": "507f1f77bcf86cd799439009",
      "plan": "Monthly"
    },
    "amount": 99.99,
    "method": "cash",
    "status": "completed",
    "date": "2024-01-01T00:00:00.000Z",
    "notes": "Payment notes",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تسجيل دفعة جديدة
**POST** `/payments`

#### Request Body
```json
{
  "memberId": "507f1f77bcf86cd799439010",
  "subscriptionId": "507f1f77bcf86cd799439009",
  "amount": 99.99,
  "method": "cash",
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Payment notes"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "member": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Member Name"
    },
    "subscription": {
      "id": "507f1f77bcf86cd799439009",
      "plan": "Monthly"
    },
    "amount": 99.99,
    "method": "cash",
    "status": "completed",
    "date": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### تحديث دفعة
**PUT** `/payments/:id`

#### Request Body
```json
{
  "amount": 149.99,
  "status": "completed",
  "notes": "Updated payment notes"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 149.99,
    "status": "completed",
    "notes": "Updated payment notes",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## Attendance APIs

جميع الـ APIs التالية تتطلب مصادقة واشتراك نشط.

### جلب جميع سجلات الحضور
**GET** `/attendance`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `memberId` - فلترة حسب العضو
- `startDate` - تاريخ البداية
- `endDate` - تاريخ النهاية
- `status` - فلترة حسب الحالة (checked-in, checked-out)

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "member": {
        "id": "507f1f77bcf86cd799439010",
        "name": "Member Name"
      },
      "checkIn": "2024-01-15T10:30:00.000Z",
      "checkOut": "2024-01-15T12:00:00.000Z",
      "duration": 90,
      "status": "checked-out",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 500,
    "pages": 50
  }
}
```

---

### جلب سجلات حضور عضو محدد
**GET** `/attendance/member/:memberId`

#### Query Parameters (Optional)
- `startDate` - تاريخ البداية
- `endDate` - تاريخ النهاية

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "checkIn": "2024-01-15T10:30:00.000Z",
      "checkOut": "2024-01-15T12:00:00.000Z",
      "duration": 90,
      "status": "checked-out"
    }
  ],
  "summary": {
    "totalVisits": 45,
    "totalHours": 67.5,
    "averageDuration": 90
  }
}
```

---

### تسجيل حضور
**POST** `/attendance/checkin`

#### Request Body
```json
{
  "memberId": "507f1f77bcf86cd799439010"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "member": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Member Name"
    },
    "checkIn": "2024-01-15T10:30:00.000Z",
    "status": "checked-in",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request**: العضو لديه حضور نشط بالفعل
```json
{
  "success": false,
  "message": "Member already checked in"
}
```

---

### تسجيل خروج
**PUT** `/attendance/:id/checkout`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "checkIn": "2024-01-15T10:30:00.000Z",
    "checkOut": "2024-01-15T12:00:00.000Z",
    "duration": 90,
    "status": "checked-out",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request**: العضو لم يسجل دخول بعد
```json
{
  "success": false,
  "message": "Member not checked in"
}
```

---

## Reports APIs

جميع الـ APIs التالية تتطلب مصادقة واشتراك نشط.

### جلب جميع التقارير
**GET** `/reports`

#### Query Parameters (Optional)
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد النتائج في الصفحة (افتراضي: 10)
- `type` - نوع التقرير (revenue, members, attendance)

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "revenue",
      "title": "Revenue Report - January 2024",
      "period": {
        "start": "2024-01-01T00:00:00.000Z",
        "end": "2024-01-31T00:00:00.000Z"
      },
      "createdAt": "2024-01-31T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "pages": 3
  }
}
```

---

### جلب تقرير محدد
**GET** `/reports/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "revenue",
    "title": "Revenue Report - January 2024",
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-01-31T00:00:00.000Z"
    },
    "data": {
      "totalRevenue": 9999.00,
      "totalPayments": 100,
      "byMethod": {
        "cash": 5000.00,
        "card": 3000.00,
        "stripe": 1999.00
      }
    },
    "createdAt": "2024-01-31T00:00:00.000Z"
  }
}
```

---

### تقرير الإيرادات
**POST** `/reports/revenue`

#### Request Body
```json
{
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T00:00:00.000Z",
  "groupBy": "day"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "revenue",
    "title": "Revenue Report - January 2024",
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-01-31T00:00:00.000Z"
    },
    "data": {
      "totalRevenue": 9999.00,
      "totalPayments": 100,
      "averagePayment": 99.99,
      "byMethod": {
        "cash": 5000.00,
        "card": 3000.00,
        "stripe": 1999.00
      },
      "byDay": [
        {
          "date": "2024-01-01",
          "revenue": 500.00,
          "count": 5
        }
      ]
    },
    "createdAt": "2024-01-31T00:00:00.000Z"
  }
}
```

---

### تقرير الأعضاء
**POST** `/reports/members`

#### Request Body
```json
{
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T00:00:00.000Z"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "type": "members",
    "title": "Members Report - January 2024",
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-01-31T00:00:00.000Z"
    },
    "data": {
      "totalMembers": 150,
      "newMembers": 20,
      "activeMembers": 120,
      "inactiveMembers": 30,
      "byStatus": {
        "active": 120,
        "inactive": 30
      },
      "byGender": {
        "male": 80,
        "female": 70
      }
    },
    "createdAt": "2024-01-31T00:00:00.000Z"
  }
}
```

---

### تقرير الحضور
**POST** `/reports/attendance`

#### Request Body
```json
{
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T00:00:00.000Z",
  "groupBy": "day"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "type": "attendance",
    "title": "Attendance Report - January 2024",
    "period": {
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-01-31T00:00:00.000Z"
    },
    "data": {
      "totalVisits": 1500,
      "uniqueMembers": 120,
      "averageVisitsPerMember": 12.5,
      "peakHours": [
        {
          "hour": 18,
          "visits": 200
        }
      ],
      "byDay": [
        {
          "date": "2024-01-01",
          "visits": 50,
          "uniqueMembers": 40
        }
      ]
    },
    "createdAt": "2024-01-31T00:00:00.000Z"
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
  "message": "Subscription expired. Please renew your subscription"
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
- البيانات معزولة تلقائياً حسب مدير الجيم (Multi-tenancy)
- مدير الجيم لا يمكنه الوصول إلا لبيانات جيمه فقط
- الاشتراك النشط مطلوب لجميع الـ APIs (ما عدا login و register)

