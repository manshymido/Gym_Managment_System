import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMembers, getAllSubscriptions, getAllPayments } from '../../services/gymApi';
import GymLayout from '../../components/gym/GymLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { colors, spacing } from '../../design-system/theme';

const GymDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    todayAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [membersRes, subscriptionsRes, paymentsRes] = await Promise.all([
        getAllMembers(),
        getAllSubscriptions({ status: 'active' }),
        getAllPayments({ status: 'completed' })
      ]);

      const totalRevenue = paymentsRes.data.totalAmount || 0;

      setStats({
        totalMembers: membersRes.data.members?.length || 0,
        activeSubscriptions: subscriptionsRes.data.subscriptions?.length || 0,
        totalRevenue,
        todayAttendance: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => [
    {
      title: 'إجمالي الأعضاء',
      value: stats.totalMembers,
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
    },
    {
      title: 'حضور اليوم',
      value: stats.todayAttendance,
      icon: '📊',
      gradient: colors.info.gradient,
      bgColor: colors.info.light
    }
  ], [stats.totalMembers, stats.activeSubscriptions, stats.totalRevenue, stats.todayAttendance]);

  if (loading) {
    return (
      <GymLayout>
        <LoadingSpinner />
      </GymLayout>
    );
  }

  return (
    <GymLayout>
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
            إحصائيات سريعة عن الجيم
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
            من هنا يمكنك إدارة أعضاء الجيم والاشتراكات والحضور والمدفوعات بسهولة
          </p>
          <div style={{
            display: 'flex',
            gap: spacing.base,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="secondary"
              icon="👥"
              onClick={() => navigate('/gym/members')}
            >
              إدارة الأعضاء
            </Button>
            <Button
              variant="secondary"
              icon="📋"
              onClick={() => navigate('/gym/subscriptions')}
            >
              إدارة الاشتراكات
            </Button>
            <Button
              variant="secondary"
              icon="✅"
              onClick={() => navigate('/gym/attendance')}
            >
              تسجيل الحضور
            </Button>
          </div>
        </Card>
      </div>
    </GymLayout>
  );
};

export default GymDashboard;
