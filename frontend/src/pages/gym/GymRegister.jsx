import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gymManagerRegister } from '../../services/gymApi';

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>إنشاء حساب مدير جيم</h2>
          <p style={styles.subtitle}>سجل حسابك الآن وابدأ إدارة جيمك</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
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
              autoComplete="email"
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
              autoComplete="new-password"
            />
          </div>

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

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            لديك حساب بالفعل؟{' '}
            <Link to="/gym/login" style={styles.link}>
              تسجيل الدخول
            </Link>
          </p>
          <p style={styles.footerText}>
            <Link to="/" style={styles.link}>
              العودة للصفحة الرئيسية
            </Link>
          </p>
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
    maxWidth: '500px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
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
  button: {
    padding: '0.875rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.3s ease'
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
  footerText: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0.5rem 0'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default GymRegister;

