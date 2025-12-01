import React, { useState, useEffect } from 'react';
import { getAllPayments, createPayment } from '../../services/gymApi';
import GymLayout from '../../components/gym/GymLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Form from '../../components/common/Form';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { spacing } from '../../design-system/theme';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'member_subscription',
    relatedId: '',
    amount: '',
    paymentMethod: 'cash',
    description: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getAllPayments();
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      fetchPayments();
      resetForm();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'member_subscription',
      relatedId: '',
      amount: '',
      paymentMethod: 'cash',
      description: ''
    });
    setShowForm(false);
  };

  const columns = [
    {
      key: 'amount',
      label: 'المبلغ',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#059669', fontSize: '1.0625rem' }}>
          {value} جنيه
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'طريقة الدفع',
      render: (value) => <Badge paymentMethod={value} />
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <Badge status={value} />
    },
    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (value) => new Date(value).toLocaleDateString('ar-EG')
    }
  ];

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
        <PageHeader
          title="المدفوعات"
          subtitle="إدارة مدفوعات الأعضاء"
          action="add"
          actionLabel={showForm ? 'إلغاء' : 'إضافة دفعة'}
          actionIcon={showForm ? '✕' : '➕'}
          onActionClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        />

        {showForm && (
          <Card
            title="إضافة دفعة جديدة"
            style={{ marginBottom: spacing.xl }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group label="المبلغ (جنيه)" required>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
                <Form.Group label="طريقة الدفع">
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    options={[
                      { value: 'cash', label: 'نقدي' },
                      { value: 'card', label: 'بطاقة' },
                      { value: 'online', label: 'أونلاين' }
                    ]}
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Group label="الوصف">
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الدفعة (اختياري)"
                />
              </Form.Group>
              
              <Form.Actions>
                <Button
                  type="submit"
                  variant="primary"
                  icon="➕"
                >
                  إضافة
                </Button>
                <Button
                  type="button"
                  variant="cancel"
                  onClick={resetForm}
                >
                  إلغاء
                </Button>
              </Form.Actions>
            </Form>
          </Card>
        )}

        <Table
          columns={columns}
          data={payments}
          emptyMessage="لا توجد مدفوعات"
          emptyIcon="💳"
        />
      </div>
    </GymLayout>
  );
};

export default Payments;
