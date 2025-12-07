import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicPlans } from '../services/publicApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import layoutStyles from '../styles/Layout.module.css';
import headerStyles from '../styles/Header.module.css';
import footerStyles from '../styles/Footer.module.css';
import sectionStyles from '../styles/Section.module.css';
import heroStyles from '../styles/Hero.module.css';
import ctaStyles from '../styles/CTA.module.css';
import cardStyles from '../styles/Card.module.css';
import gridStyles from '../styles/Grid.module.css';
import buttonStyles from '../styles/Buttons.module.css';

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
    <div className={layoutStyles.container}>
      {/* Header */}
      <header className={headerStyles.header}>
        <div className={headerStyles.headerContent}>
          <div 
            className={headerStyles.logoContainer}
            onClick={() => navigate('/')}
          >
            <div className={headerStyles.logoIcon}>
              💪
            </div>
            <h1 className={headerStyles.logoText}>
              نظام إدارة الجيمات
            </h1>
          </div>
          <nav className={headerStyles.nav}>
            {user ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/gym/dashboard')}
                  size="sm"
                >
                  لوحة التحكم
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  size="sm"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/gym/login')}
                  size="sm"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => navigate('/gym/register')}
                  size="sm"
                >
                  إنشاء حساب
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={heroStyles.hero}>
        {/* Animated Background Elements */}
        <div className={heroStyles.heroBgCircle1} />
        <div className={heroStyles.heroBgCircle2} />
        <div className={heroStyles.heroBgCircle3} />
        
        <div className={heroStyles.heroContent}>
          <h1 className={heroStyles.heroTitle}>
            حل شامل لإدارة جيمك بكل سهولة
          </h1>
          <p className={heroStyles.heroDescription}>
            نظام متكامل لإدارة أعضاء الجيم واشتراكاتهم وحضورهم ومدفوعاتهم. 
            وفر وقتك وركز على تطوير جيمك.
          </p>
          <div className={heroStyles.heroButtons}>
            {user ? (
              <Button
                variant="secondary"
                onClick={() => navigate(userType === 'admin' ? '/admin/dashboard' : '/gym/dashboard')}
                size="lg"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--color-primary)',
                  padding: 'var(--spacing-base) var(--spacing-2xl)',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                }}
              >
                الذهاب إلى لوحة التحكم
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/gym/register')}
                  size="lg"
                  style={{
                    backgroundColor: 'white',
                    color: 'var(--color-primary)',
                    padding: 'var(--spacing-base) var(--spacing-2xl)',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  ابدأ الآن مجاناً
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/gym/login')}
                  size="lg"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: 'var(--spacing-base) var(--spacing-2xl)',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  تسجيل الدخول
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={sectionStyles.sectionDefault}>
        <div className={sectionStyles.sectionContainer}>
          <h2 className={sectionStyles.sectionTitle}>
            مميزات النظام
          </h2>
          <p className={sectionStyles.sectionDescription}>
            كل ما تحتاجه لإدارة جيمك بكفاءة واحترافية
          </p>
          <div className={gridStyles.gridAutoFit}>
            {features.map((feature, index) => (
              <div key={index} className={cardStyles.featureCard}>
                <div className={cardStyles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={cardStyles.featureTitle}>
                  {feature.title}
                </h3>
                <p className={cardStyles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={sectionStyles.sectionPaper}>
        <div className={sectionStyles.sectionContainer}>
          <h2 className={sectionStyles.sectionTitle}>
            باقات الاشتراك
          </h2>
          <p className={sectionStyles.sectionDescription}>
            اختر الباقة المناسبة لجيمك وابدأ إدارة احترافية
          </p>
          {loadingPlans ? (
            <div className={layoutStyles.loadingContent}>
              <LoadingSpinner />
              <p>جاري تحميل الباقات...</p>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl) var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
              <p>لا توجد باقات متاحة حالياً</p>
            </div>
          ) : (
            <div className={gridStyles.gridAutoFillLarge}>
              {plans.map((plan) => (
                <div key={plan._id} className={cardStyles.planCard}>
                  <div className={cardStyles.planHeader}>
                    <h3 className={cardStyles.planName}>
                      {plan.name}
                    </h3>
                    <div className={cardStyles.planPrice}>
                      <span className={cardStyles.priceValue}>
                        {plan.price}
                      </span>
                      <span className={cardStyles.priceCurrency}>
                        جنيه
                      </span>
                    </div>
                  </div>
                  {plan.description && (
                    <p className={cardStyles.planDescription}>
                      {plan.description}
                    </p>
                  )}
                  <div className={cardStyles.planDetails}>
                    <div className={cardStyles.detailItem}>
                      <span className={cardStyles.detailIcon}>⏱️</span>
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
                      <div className={cardStyles.detailItem}>
                        <span className={cardStyles.detailIcon}>👥</span>
                        <span>حد أقصى: {plan.maxMembers} عضو</span>
                      </div>
                    )}
                    {plan.features && plan.features.length > 0 && (
                      <div className={cardStyles.featuresList}>
                        <strong>الميزات:</strong>
                        <ul className={cardStyles.featuresUl}>
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSubscribe(plan._id)}
                    fullWidth
                    style={{ marginTop: 'auto' }}
                  >
                    اشترك الآن
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className={ctaStyles.ctaSection}>
          <div className={ctaStyles.ctaContent}>
            <h2 className={ctaStyles.ctaTitle}>
              جاهز للبدء؟
            </h2>
            <p className={ctaStyles.ctaDescription}>
              سجل حسابك الآن وابدأ إدارة جيمك بطريقة احترافية
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/gym/register')}
              size="lg"
              style={{
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-xl)'
              }}
            >
              إنشاء حساب جديد
            </Button>
            <p className={ctaStyles.ctaSubtext}>
              لديك حساب بالفعل؟{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/gym/login');
                }}
                className={footerStyles.footerLinkWhite}
              >
                تسجيل الدخول
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={footerStyles.footer}>
        <p className={footerStyles.footerText}>
          © 2024 نظام إدارة الجيمات. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
};

export default Home;

