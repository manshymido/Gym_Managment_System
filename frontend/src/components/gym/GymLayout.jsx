import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import BaseLayout from '../common/BaseLayout';

const GymLayout = ({ children }) => {
  const { user } = useAuth();

  const menuItems = useMemo(() => [
    { path: '/gym/dashboard', label: 'الرئيسية', icon: '📊' },
    { path: '/gym/members', label: 'الأعضاء', icon: '👥' },
    { path: '/gym/member-plans', label: 'باقات الأعضاء', icon: '💳' },
    { path: '/gym/subscriptions', label: 'الاشتراكات', icon: '📋' },
    { path: '/gym/payments', label: 'المدفوعات', icon: '💰' },
    { path: '/gym/attendance', label: 'الحضور', icon: '✅' },
    { path: '/gym/reports', label: 'التقارير', icon: '📈' }
  ], []);

  return (
    <BaseLayout
      menuItems={menuItems}
      headerTitle="لوحة تحكم مدير الجيم"
      sidebarTitle={user?.gymName || 'الجيم'}
      sidebarSubtitle="لوحة التحكم"
      userRole={user?.gymName || 'مدير الجيم'}
      logoutPath="/gym/login"
    >
      {children}
    </BaseLayout>
  );
};

export default React.memo(GymLayout);
