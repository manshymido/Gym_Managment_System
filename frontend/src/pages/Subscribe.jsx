import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicPlanById, publicSubscribe } from '../services/publicApi';
import { gymManagerLogin } from '../services/gymApi';

const Subscribe = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const { user, userType, login } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'login', 'success'

  const [formData, setFormData] = useState({
    name: '',
    gymName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    paymentMethod: 'local',
    autoRenew: false
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (planId) {
      fetchPlan();
    } else {
      navigate('/');
    }
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const response = await getPublicPlanById(planId);
      if (response.data && response.data.success) {
        setPlan(response.data.data);
      } else {
        setError('الباقة غير موجودة');
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      setError('خطأ في جلب بيانات الباقة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await gymManagerLogin(loginData.email, loginData.password);
      if (response.data && response.data.token) {
        login(response.data.gymManager, response.data.token, 'gym_manager');
        // After login, proceed with subscription
        handleSubscribeWithExistingAccount();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubscribeWithExistingAccount = async () => {
    setSubmitting(true);
    setError('');

    try {
      const emailToUse = user?.email || loginData.email;
      const response = await publicSubscribe({
        email: emailToUse,
        planId: planId,
        paymentMethod: formData.paymentMethod,
        autoRenew: formData.autoRenew
      });

      if (response.data && response.data.success) {
        setStep('success');
        // Update auth context if token is returned
        if (response.data.token) {
          login(response.data.gymManager, response.data.token, 'gym_manager');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في إتمام الاشتراك');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubscribeAsLoggedIn = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await publicSubscribe({
        email: user.email,
        planId: planId,
        paymentMethod: formData.paymentMethod,
        autoRenew: formData.autoRenew
      });

      if (response.data && response.data.success) {
        setStep('success');
        // Update auth context if token is returned
        if (response.data.token) {
          login(response.data.gymManager, response.data.token, 'gym_manager');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في إتمام الاشتراك');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await publicSubscribe({
        ...formData,
        planId: planId
      });

      if (response.data && response.data.success) {
        setStep('success');
        // Login user after successful subscription
        if (response.data.token && response.data.gymManager) {
          login(response.data.gymManager, response.data.token, 'gym_manager');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في إتمام الاشتراك');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>الباقة غير موجودة</h2>
          <button onClick={() => navigate('/')} style={styles.button}>
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>تم الاشتراك بنجاح!</h2>
          <p style={styles.successMessage}>
            تم تفعيل اشتراكك في باقة {plan.name} بنجاح. يمكنك الآن استخدام جميع الميزات.
          </p>
          <button
            onClick={() => navigate('/gym/dashboard')}
            style={styles.button}
          >
            الانتقال إلى لوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  // If user is already logged in as gym_manager, show simplified subscription form
  if (user && userType === 'gym_manager') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>الاشتراك في باقة {plan.name}</h2>
            <div style={styles.planSummary}>
              <div style={styles.summaryRow}>
                <span>السعر:</span>
                <span style={styles.summaryValue}>{plan.price} جنيه</span>
              </div>
              <div style={styles.summaryRow}>
                <span>المدة:</span>
                <span style={styles.summaryValue}>
                  {plan.duration}{' '}
                  {plan.durationUnit === 'months'
                    ? 'شهر'
                    : plan.durationUnit === 'days'
                    ? 'يوم'
                    : 'سنة'}
                </span>
              </div>
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userInfoText}>
                مسجل دخول كـ: <strong>{user.name}</strong> ({user.email})
              </p>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubscribeAsLoggedIn} style={styles.form}>
            <h3 style={styles.formTitle}>إتمام الاشتراك</h3>
            <div style={styles.formGroup}>
              <label htmlFor="paymentMethod">طريقة الدفع *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="local">دفع محلي</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div style={styles.checkboxGroup}>
              <input
                id="autoRenew"
                name="autoRenew"
                type="checkbox"
                checked={formData.autoRenew}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="autoRenew">تجديد تلقائي للاشتراك</label>
            </div>
            <button type="submit" disabled={submitting} style={styles.button}>
              {submitting ? 'جاري المعالجة...' : 'إتمام الاشتراك'}
            </button>
          </form>

          <div style={styles.footer}>
            <button onClick={() => navigate('/')} style={styles.linkButton}>
              العودة للصفحة الرئيسية
            </button>
            <button 
              onClick={() => navigate('/gym/dashboard')} 
              style={styles.linkButton}
            >
              الذهاب إلى لوحة التحكم
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>الاشتراك في باقة {plan.name}</h2>
          <div style={styles.planSummary}>
            <div style={styles.summaryRow}>
              <span>السعر:</span>
              <span style={styles.summaryValue}>{plan.price} جنيه</span>
            </div>
            <div style={styles.summaryRow}>
              <span>المدة:</span>
              <span style={styles.summaryValue}>
                {plan.duration}{' '}
                {plan.durationUnit === 'months'
                  ? 'شهر'
                  : plan.durationUnit === 'days'
                  ? 'يوم'
                  : 'سنة'}
              </span>
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {step === 'login' ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <h3 style={styles.formTitle}>تسجيل الدخول</h3>
            <div style={styles.formGroup}>
              <label htmlFor="loginEmail">البريد الإلكتروني *</label>
              <input
                id="loginEmail"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                style={styles.input}
                placeholder="example@gym.com"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="loginPassword">كلمة المرور *</label>
              <input
                id="loginPassword"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                style={styles.input}
                placeholder="كلمة المرور"
              />
            </div>
            <button type="submit" disabled={submitting} style={styles.button}>
              {submitting ? 'جاري المعالجة...' : 'تسجيل الدخول والاشتراك'}
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              style={styles.secondaryButton}
            >
              إنشاء حساب جديد
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>إنشاء حساب جديد والاشتراك</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="name">الاسم *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="gymName">اسم الجيم *</label>
                <input
                  id="gymName"
                  name="gymName"
                  type="text"
                  value={formData.gymName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="أدخل اسم الجيم"
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="example@gym.com"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="password">كلمة المرور *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={styles.input}
                  placeholder="6 أحرف على الأقل"
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="رقم الهاتف (اختياري)"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="paymentMethod">طريقة الدفع *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="local">دفع محلي</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address">العنوان</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="عنوان الجيم (اختياري)"
              />
            </div>
            <div style={styles.checkboxGroup}>
              <input
                id="autoRenew"
                name="autoRenew"
                type="checkbox"
                checked={formData.autoRenew}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="autoRenew">تجديد تلقائي للاشتراك</label>
            </div>
            <button type="submit" disabled={submitting} style={styles.button}>
              {submitting ? 'جاري المعالجة...' : 'إتمام الاشتراك'}
            </button>
            <button
              type="button"
              onClick={() => setStep('login')}
              style={styles.secondaryButton}
            >
              لدي حساب بالفعل - تسجيل الدخول
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <button onClick={() => navigate('/')} style={styles.linkButton}>
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem 1rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '700px'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center'
  },
  planSummary: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '1rem'
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#667eea'
  },
  userInfo: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#e7f3ff',
    borderRadius: '6px',
    border: '1px solid #b3d9ff'
  },
  userInfoText: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#0066cc'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  input: {
    padding: '0.875rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    fontFamily: 'inherit'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  button: {
    padding: '0.875rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.3s ease'
  },
  secondaryButton: {
    padding: '0.875rem',
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.875rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  successCard: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem'
  },
  successMessage: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.6
  }
};

export default Subscribe;

