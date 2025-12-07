import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gymManagerLogin } from '../../services/gymApi';
import AuthContainer from '../../components/common/AuthContainer';
import AuthHeader from '../../components/common/AuthHeader';
import AuthForm from '../../components/common/AuthForm';
import AuthFooter from '../../components/common/AuthFooter';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { spacing } from '../../design-system/theme';

const GymLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await gymManagerLogin(email, password);
      login(response.data.gymManager, response.data.token, 'gym_manager');
      navigate('/gym/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer maxWidth="400px">
      <AuthHeader title="تسجيل دخول مدير الجيم" />
      <ErrorMessage message={error} />
      <AuthForm onSubmit={handleSubmit}>
        <Input
          id="gym-email"
          name="email"
          type="email"
          label="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          error={error ? false : undefined}
        />
        <Input
          id="gym-password"
          name="password"
          type="password"
          label="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          error={error ? false : undefined}
        />
        <Button
          type="submit"
          disabled={loading}
          fullWidth
          style={{ marginTop: spacing.base }}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </Button>
      </AuthForm>
      <AuthFooter links={[
        { text: 'ليس لديك حساب؟', to: '/gym/register', label: 'إنشاء حساب جديد' },
        { to: '/', label: 'العودة للصفحة الرئيسية' }
      ]} />
    </AuthContainer>
  );
};

export default GymLogin;

