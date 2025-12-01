import React, { useState, useEffect } from 'react';
import { getAllSubscriptions } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await getAllSubscriptions();
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'gymManager',
      label: 'مدير الجيم',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span style={{ fontWeight: 500 }}>
            {row.gymManager?.name || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'plan',
      label: 'الباقة',
      render: (_, row) => (
        <span style={{ fontWeight: 500, color: '#667eea' }}>
          {row.plan?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'startDate',
      label: 'تاريخ البدء',
      render: (value) => new Date(value).toLocaleDateString('ar-EG')
    },
    {
      key: 'endDate',
      label: 'تاريخ الانتهاء',
      render: (value) => new Date(value).toLocaleDateString('ar-EG')
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <Badge status={value} />
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
        <PageHeader
          title="اشتراكات مديري الجيمات"
          subtitle="عرض وإدارة جميع الاشتراكات"
        />

        <Table
          columns={columns}
          data={subscriptions}
          emptyMessage="لا توجد اشتراكات"
          emptyIcon="📋"
        />
      </div>
    </AdminLayout>
  );
};

export default Subscriptions;
