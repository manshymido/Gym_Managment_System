import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllGymManagers, getAllSubscriptions, getRevenueStats } from '../../services/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { colors, spacing } from '../../design-system/theme';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalGymManagers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [managersRes, subscriptionsRes, revenueRes] = await Promise.all([
        getAllGymManagers(),
        getAllSubscriptions({ status: 'active' }),
        getRevenueStats()
      ]);
      setStats({
        totalGymManagers: managersRes.data.gymManagers?.length || 0,
        activeSubscriptions: subscriptionsRes.data.subscriptions?.length || 0,
        totalRevenue: revenueRes.data.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي مديري الجيمات',
      value: stats.totalGymManagers,
      icon: '👥',
      gradient: colors.primary.gradient,
      bgColor: colors.gray[50]
    },
    {
      title: 'الاشتراكات النشطة',
      value: stats.activeSubscriptions,
      icon: '✅',
      gradient: colors.success.gradient,
      bgColor: colors.success.light
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue} جنيه`,
      icon: '💰',
      gradient: colors.warning.gradient,
      bgColor: colors.warning.light
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: spacing.xl }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.text.primary,
            margin: '0 0 0.5rem 0'
          }}>
            نظرة عامة
          </h2>
          <p style={{
            fontSize: '1rem',
            color: colors.text.secondary,
            margin: 0
          }}>
            إحصائيات سريعة عن النظام
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {statCards.map((card, index) => (
            <Card key={index} hover>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: card.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.base,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '2rem' }}>{card.icon}</span>
              </div>
              <h3 style={{
                fontSize: '0.875rem',
                color: colors.text.secondary,
                margin: `0 0 ${spacing.md} 0`,
                fontWeight: 500
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: colors.text.primary,
                margin: 0,
                lineHeight: 1
              }}>
                {card.value}
              </p>
            </Card>
          ))}
        </div>

        <Card
          style={{
            background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}15 100%)`
          }}
        >
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: colors.text.primary,
            margin: `0 0 ${spacing.md} 0`
          }}>
            مرحباً بك في لوحة التحكم
          </h3>
          <p style={{
            fontSize: '1rem',
            color: colors.text.secondary,
            margin: `0 0 ${spacing.lg} 0`,
            lineHeight: 1.6
          }}>
            من هنا يمكنك إدارة مديري الجيمات والاشتراكات والباقات بسهولة
          </p>
          <div style={{
            display: 'flex',
            gap: spacing.base,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="secondary"
              icon="👥"
              onClick={() => window.location.href = '/admin/gym-managers'}
            >
              إدارة مديري الجيمات
            </Button>
            <Button
              variant="secondary"
              icon="📋"
              onClick={() => window.location.href = '/admin/subscriptions'}
            >
              إدارة الاشتراكات
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
