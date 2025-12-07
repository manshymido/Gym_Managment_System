import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/adminApi';
import AuthContainer from '../../components/common/AuthContainer';
import AuthHeader from '../../components/common/AuthHeader';
import AuthForm from '../../components/common/AuthForm';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AdminLogin = () => {
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
      console.log('Attempting login with:', email);
      const response = await adminLogin(email, password);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.admin && response.data.token) {
        login(response.data.admin, response.data.token, 'admin');
        navigate('/admin/dashboard');
      } else {
        setError('استجابة غير صحيحة من الخادم');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer maxWidth="400px">
      <AuthHeader title="تسجيل دخول المدير" />
      <ErrorMessage message={error} />
      <AuthForm onSubmit={handleSubmit}>
        <Input
          id="admin-email"
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
          id="admin-password"
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
          style={{ marginTop: 'var(--spacing-base)' }}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </Button>
      </AuthForm>
    </AuthContainer>
  );
};

export default AdminLogin;

