import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicPlans } from '../services/publicApi';

const Home = () => {
  const navigate = useNavigate();
  const { user, userType, logout } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getPublicPlans();
      if (response.data && response.data.success) {
        setPlans(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubscribe = (planId) => {
    navigate(`/subscribe?planId=${planId}`);
  };

  const features = [
    {
      icon: '👥',
      title: 'إدارة الأعضاء',
      description: 'إضافة وتعديل وحذف أعضاء الجيم بسهولة مع تتبع كامل لبياناتهم'
    },
    {
      icon: '📋',
      title: 'إدارة الاشتراكات',
      description: 'متابعة اشتراكات الأعضاء وتجديدها وإدارة باقات الاشتراك المختلفة'
    },
    {
      icon: '✅',
      title: 'تسجيل الحضور',
      description: 'تسجيل دخول وخروج الأعضاء تلقائياً مع تتبع مدة الحضور'
    },
    {
      icon: '💳',
      title: 'إدارة المدفوعات',
      description: 'تتبع المدفوعات بطرق متعددة (نقدي، بطاقة، أونلاين) مع سجل كامل'
    },
    {
      icon: '📊',
      title: 'التقارير الشاملة',
      description: 'تقارير مفصلة عن الإيرادات والأعضاء والحضور لاتخاذ قرارات مدروسة'
    },
    {
      icon: '🔒',
      title: 'أمان عالي',
      description: 'نظام آمن مع عزل البيانات بين الجيمات المختلفة'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>نظام إدارة الجيمات</h1>
          <nav style={styles.nav}>
            {user ? (
              <>
                <button 
                  onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/gym/dashboard')} 
                  style={styles.navButton}
                >
                  لوحة التحكم
                </button>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }} 
                  style={{...styles.navButton, ...styles.logoutButton}}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/gym/login')} 
                  style={styles.navButton}
                >
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => navigate('/gym/register')} 
                  style={{...styles.navButton, ...styles.primaryButton}}
                >
                  إنشاء حساب
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            حل شامل لإدارة جيمك بكل سهولة
          </h1>
          <p style={styles.heroDescription}>
            نظام متكامل لإدارة أعضاء الجيم واشتراكاتهم وحضورهم ومدفوعاتهم. 
            وفر وقتك وركز على تطوير جيمك.
          </p>
          <div style={styles.heroButtons}>
            {user ? (
              <button 
                onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/gym/dashboard')} 
                style={styles.ctaButton}
              >
                الذهاب إلى لوحة التحكم
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/gym/register')} 
                  style={styles.ctaButton}
                >
                  ابدأ الآن مجاناً
                </button>
                <button 
                  onClick={() => navigate('/gym/login')} 
                  style={styles.secondaryButton}
                >
                  تسجيل الدخول
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.sectionTitle}>مميزات النظام</h2>
          <p style={styles.sectionDescription}>
            كل ما تحتاجه لإدارة جيمك بكفاءة واحترافية
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={styles.pricing}>
        <div style={styles.pricingContainer}>
          <h2 style={styles.sectionTitle}>باقات الاشتراك</h2>
          <p style={styles.sectionDescription}>
            اختر الباقة المناسبة لجيمك وابدأ إدارة احترافية
          </p>
          {loadingPlans ? (
            <div style={styles.loadingPlans}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل الباقات...</p>
            </div>
          ) : plans.length === 0 ? (
            <div style={styles.noPlans}>
              <p>لا توجد باقات متاحة حالياً</p>
            </div>
          ) : (
            <div style={styles.plansGrid}>
              {plans.map((plan) => (
                <div key={plan._id} style={styles.planCard}>
                  <div style={styles.planHeader}>
                    <h3 style={styles.planName}>{plan.name}</h3>
                    <div style={styles.planPrice}>
                      <span style={styles.priceValue}>{plan.price}</span>
                      <span style={styles.priceCurrency}>جنيه</span>
                    </div>
                  </div>
                  {plan.description && (
                    <p style={styles.planDescription}>{plan.description}</p>
                  )}
                  <div style={styles.planDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⏱️</span>
                      <span>
                        المدة: {plan.duration}{' '}
                        {plan.durationUnit === 'months'
                          ? 'شهر'
                          : plan.durationUnit === 'days'
                          ? 'يوم'
                          : 'سنة'}
                      </span>
                    </div>
                    {plan.maxMembers !== -1 && (
                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>👥</span>
                        <span>حد أقصى: {plan.maxMembers} عضو</span>
                      </div>
                    )}
                    {plan.features && plan.features.length > 0 && (
                      <div style={styles.featuresList}>
                        <strong>الميزات:</strong>
                        <ul style={styles.featuresUl}>
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    style={styles.subscribeButton}
                  >
                    اشترك الآن
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>جاهز للبدء؟</h2>
            <p style={styles.ctaDescription}>
              سجل حسابك الآن وابدأ إدارة جيمك بطريقة احترافية
            </p>
            <button 
              onClick={() => navigate('/gym/register')} 
              style={styles.ctaButtonLarge}
            >
              إنشاء حساب جديد
            </button>
            <p style={styles.ctaSubtext}>
              لديك حساب بالفعل؟{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/gym/login');
                }}
                style={styles.link}
              >
                تسجيل الدخول
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 نظام إدارة الجيمات. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: 0
  },
  nav: {
    display: 'flex',
    gap: '1rem'
  },
  navButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#007bff',
    border: '2px solid #007bff',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: '2px solid #007bff'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: '2px solid #dc3545'
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '6rem 2rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  heroDescription: {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    opacity: 0.95,
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaButton: {
    padding: '1rem 2.5rem',
    backgroundColor: '#ffffff',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  secondaryButton: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  features: {
    padding: '5rem 2rem',
    backgroundColor: '#f8f9fa'
  },
  featuresContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333'
  },
  sectionDescription: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '3rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333'
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6'
  },
  ctaSection: {
    padding: '5rem 2rem',
    backgroundColor: '#007bff',
    color: '#ffffff',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.95
  },
  ctaButtonLarge: {
    padding: '1.25rem 3rem',
    backgroundColor: '#ffffff',
    color: '#007bff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    marginBottom: '1.5rem'
  },
  ctaSubtext: {
    fontSize: '1rem',
    opacity: 0.9
  },
  link: {
    color: '#ffffff',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: '#333',
    color: '#ffffff',
    padding: '2rem',
    textAlign: 'center'
  },
  footerText: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.8
  },
  pricing: {
    padding: '5rem 2rem',
    backgroundColor: '#ffffff'
  },
  pricingContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loadingPlans: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
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
  noPlans: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#666'
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '2px solid #f3f4f6'
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f3f4f6'
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  planPrice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  priceValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  priceCurrency: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  planDescription: {
    color: '#6b7280',
    margin: '0 0 1rem 0',
    lineHeight: 1.6
  },
  planDetails: {
    flex: 1,
    marginBottom: '1.5rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    color: '#374151',
    fontSize: '0.9375rem'
  },
  detailIcon: {
    fontSize: '1.125rem'
  },
  featuresList: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6'
  },
  featuresUl: {
    margin: '0.5rem 0 0 0',
    paddingRight: '1.5rem',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  subscribeButton: {
    padding: '1rem 2rem',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    marginTop: 'auto'
  }
};

export default Home;

