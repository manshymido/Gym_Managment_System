import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gymManagerRegister } from '../../services/gymApi';
import AuthContainer from '../../components/common/AuthContainer';
import AuthHeader from '../../components/common/AuthHeader';
import AuthForm from '../../components/common/AuthForm';
import AuthFooter from '../../components/common/AuthFooter';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { spacing } from '../../design-system/theme';

const GymRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    gymName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await gymManagerRegister(formData);
      if (response.data && response.data.gymManager && response.data.token) {
        login(response.data.gymManager, response.data.token, 'gym_manager');
        navigate('/gym/dashboard');
      } else {
        setError('استجابة غير صحيحة من الخادم');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ أثناء إنشاء الحساب';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer 
      maxWidth="500px"
      containerStyle={{ padding: `${spacing.xl} ${spacing.base}` }}
    >
      <AuthHeader 
        title="إنشاء حساب مدير جيم" 
        subtitle="سجل حسابك الآن وابدأ إدارة جيمك"
      />
      <ErrorMessage message={error} />
      <AuthForm onSubmit={handleSubmit}>
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

          <Input
            id="email"
            name="email"
            type="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@gym.com"
            autoComplete="email"
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
            autoComplete="new-password"
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            placeholder="رقم الهاتف (اختياري)"
          />

          <Input
            id="address"
            name="address"
            type="text"
            label="العنوان"
            value={formData.address}
            onChange={handleChange}
            placeholder="عنوان الجيم (اختياري)"
          />

        <Button
          type="submit"
          disabled={loading}
          fullWidth
          style={{ marginTop: spacing.sm }}
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
        </Button>
      </AuthForm>
      <AuthFooter links={[
        { text: 'لديك حساب بالفعل؟', to: '/gym/login', label: 'تسجيل الدخول' },
        { to: '/', label: 'العودة للصفحة الرئيسية' }
      ]} />
    </AuthContainer>
  );
};

export default GymRegister;

