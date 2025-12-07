import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicPlanById, publicSubscribe } from '../services/publicApi';
import { gymManagerLogin } from '../services/gymApi';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import layoutStyles from '../styles/Layout.module.css';
import headerStyles from '../styles/Header.module.css';
import footerStyles from '../styles/Footer.module.css';
import formStyles from '../styles/Form.module.css';
import cardStyles from '../styles/Card.module.css';

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
      <div className={layoutStyles.loading}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className={layoutStyles.containerCentered}>
        <Card className={cardStyles.notFoundCard}>
          <h2 className={cardStyles.notFoundTitle}>
            الباقة غير موجودة
          </h2>
          <Button onClick={() => navigate('/')}>
            العودة للصفحة الرئيسية
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={layoutStyles.containerCentered}>
        <Card className={cardStyles.successCard}>
          <div className={cardStyles.successIcon}>
            ✓
          </div>
          <h2 className={cardStyles.successTitle}>
            تم الاشتراك بنجاح!
          </h2>
          <p className={cardStyles.successMessage}>
            تم تفعيل اشتراكك في باقة {plan.name} بنجاح. يمكنك الآن استخدام جميع الميزات.
          </p>
          <Button onClick={() => navigate('/gym/dashboard')}>
            الانتقال إلى لوحة التحكم
          </Button>
        </Card>
      </div>
    );
  }

  // If user is already logged in as gym_manager, show simplified subscription form
  if (user && userType === 'gym_manager') {
    return (
      <div className={layoutStyles.containerCentered}>
        <Card className={cardStyles.cardLarge}>
          <div className={headerStyles.sectionHeader}>
            <h2 className={headerStyles.titleCentered}>
              الاشتراك في باقة {plan.name}
            </h2>
            <div className={cardStyles.planSummary}>
              <div className={cardStyles.summaryRow}>
                <span>السعر:</span>
                <span className={cardStyles.summaryValue}>
                  {plan.price} جنيه
                </span>
              </div>
              <div className={cardStyles.summaryRow}>
                <span>المدة:</span>
                <span className={cardStyles.summaryValue}>
                  {plan.duration}{' '}
                  {plan.durationUnit === 'months'
                    ? 'شهر'
                    : plan.durationUnit === 'days'
                    ? 'يوم'
                    : 'سنة'}
                </span>
              </div>
            </div>
            <div className={cardStyles.userInfo}>
              <p className={cardStyles.userInfoText}>
                مسجل دخول كـ: <strong>{user.name}</strong> ({user.email})
              </p>
            </div>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubscribeAsLoggedIn} className={formStyles.form}>
            <h3 className={formStyles.formTitle}>
              إتمام الاشتراك
            </h3>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              label="طريقة الدفع"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              options={[
                { value: 'local', label: 'دفع محلي' },
                { value: 'stripe', label: 'Stripe' },
                { value: 'paypal', label: 'PayPal' }
              ]}
            />
            <div className={formStyles.checkboxGroup}>
              <input
                id="autoRenew"
                name="autoRenew"
                type="checkbox"
                checked={formData.autoRenew}
                onChange={handleChange}
                className={formStyles.checkbox}
              />
              <label htmlFor="autoRenew" className={formStyles.checkboxLabel}>
                تجديد تلقائي للاشتراك
              </label>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              fullWidth
              style={{ marginTop: 'var(--spacing-sm)' }}
            >
              {submitting ? 'جاري المعالجة...' : 'إتمام الاشتراك'}
            </Button>
          </form>

          <div className={footerStyles.sectionFooter}>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
            >
              العودة للصفحة الرئيسية
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/gym/dashboard')}
            >
              الذهاب إلى لوحة التحكم
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={layoutStyles.containerCentered}>
      <Card className={cardStyles.cardLarge}>
        <div className={headerStyles.sectionHeader}>
          <h2 className={headerStyles.titleCentered}>
            الاشتراك في باقة {plan.name}
          </h2>
          <div className={cardStyles.planSummary}>
            <div className={cardStyles.summaryRow}>
              <span>السعر:</span>
              <span className={cardStyles.summaryValue}>
                {plan.price} جنيه
              </span>
            </div>
            <div className={cardStyles.summaryRow}>
              <span>المدة:</span>
              <span className={cardStyles.summaryValue}>
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

        <ErrorMessage message={error} />

        {step === 'login' ? (
          <form onSubmit={handleLogin} className={formStyles.form}>
            <h3 className={formStyles.formTitle}>
              تسجيل الدخول
            </h3>
            <Input
              id="loginEmail"
              name="email"
              type="email"
              label="البريد الإلكتروني"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              placeholder="example@gym.com"
            />
            <Input
              id="loginPassword"
              name="password"
              type="password"
              label="كلمة المرور"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              placeholder="كلمة المرور"
            />
            <Button
              type="submit"
              disabled={submitting}
              fullWidth
            >
              {submitting ? 'جاري المعالجة...' : 'تسجيل الدخول والاشتراك'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep('form')}
              fullWidth
            >
              إنشاء حساب جديد
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className={formStyles.form}>
            <h3 className={formStyles.formTitle}>
              إنشاء حساب جديد والاشتراك
            </h3>
            <div className={formStyles.formRow}>
              <Input
                id="name"
                name="name"
                type="text"
                label="الاسم"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="أدخل اسمك الكامل"
              />
              <Input
                id="gymName"
                name="gymName"
                type="text"
                label="اسم الجيم"
                value={formData.gymName}
                onChange={handleChange}
                required
                placeholder="أدخل اسم الجيم"
              />
            </div>
            <div className={formStyles.formRow}>
              <Input
                id="email"
                name="email"
                type="email"
                label="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gym.com"
              />
              <Input
                id="password"
                name="password"
                type="password"
                label="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="6 أحرف على الأقل"
              />
            </div>
            <div className={formStyles.formRow}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                placeholder="رقم الهاتف (اختياري)"
              />
              <Select
                id="paymentMethod"
                name="paymentMethod"
                label="طريقة الدفع"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                options={[
                  { value: 'local', label: 'دفع محلي' },
                  { value: 'stripe', label: 'Stripe' },
                  { value: 'paypal', label: 'PayPal' }
                ]}
              />
            </div>
            <Input
              id="address"
              name="address"
              type="text"
              label="العنوان"
              value={formData.address}
              onChange={handleChange}
              placeholder="عنوان الجيم (اختياري)"
            />
            <div className={formStyles.checkboxGroup}>
              <input
                id="autoRenew"
                name="autoRenew"
                type="checkbox"
                checked={formData.autoRenew}
                onChange={handleChange}
                className={formStyles.checkbox}
              />
              <label htmlFor="autoRenew" className={formStyles.checkboxLabel}>
                تجديد تلقائي للاشتراك
              </label>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              fullWidth
            >
              {submitting ? 'جاري المعالجة...' : 'إتمام الاشتراك'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep('login')}
              fullWidth
            >
              لدي حساب بالفعل - تسجيل الدخول
            </Button>
          </form>
        )}

        <div className={footerStyles.sectionFooterSimple}>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Subscribe;

