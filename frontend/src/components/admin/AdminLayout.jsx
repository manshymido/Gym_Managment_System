import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import BaseLayout from '../common/BaseLayout';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();

  const menuItems = useMemo(() => [
    { path: '/admin/dashboard', label: 'الرئيسية', icon: '📊' },
    { path: '/admin/gym-managers', label: 'مديرو الجيمات', icon: '👥' },
    { path: '/admin/subscriptions', label: 'الاشتراكات', icon: '📋' },
    { path: '/admin/plans', label: 'الباقات', icon: '💳' }
  ], []);

  return (
    <BaseLayout
      menuItems={menuItems}
      headerTitle="لوحة تحكم المدير"
      sidebarTitle="نظام الإدارة"
      userRole="مدير النظام"
      logoutPath="/admin/login"
    >
      {children}
    </BaseLayout>
  );
};

export default React.memo(AdminLayout);
