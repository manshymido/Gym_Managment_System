import React, { useState, useEffect } from 'react';
import { getAllSubscriptions, createSubscription, getAllMembers, getAllMemberPlans } from '../../services/gymApi';
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
import { spacing, colors } from '../../design-system/theme';

const MemberSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [usePlan, setUsePlan] = useState(true);
  const [formData, setFormData] = useState({
    memberId: '',
    planId: '',
    planName: '',
    price: '',
    duration: '1',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscriptionsRes, membersRes, plansRes] = await Promise.all([
        getAllSubscriptions(),
        getAllMembers(),
        getAllMemberPlans({ isActive: 'true' })
      ]);
      setSubscriptions(subscriptionsRes.data.subscriptions || []);
      setMembers(membersRes.data.members || []);
      setPlans(plansRes.data.plans || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subscriptionData = {
        memberId: formData.memberId,
        paymentMethod: formData.paymentMethod
      };

      if (usePlan && formData.planId) {
        subscriptionData.planId = formData.planId;
      } else {
        subscriptionData.planName = formData.planName;
        subscriptionData.price = parseFloat(formData.price);
        subscriptionData.duration = parseInt(formData.duration);
      }

      await createSubscription(subscriptionData);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p._id === planId);
    if (selectedPlan) {
      setFormData({
        ...formData,
        planId: planId,
        planName: selectedPlan.name,
        price: selectedPlan.price.toString(),
        duration: selectedPlan.duration.toString()
      });
    }
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      planId: '',
      planName: '',
      price: '',
      duration: '1',
      paymentMethod: 'cash'
    });
    setUsePlan(true);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'member',
      label: 'العضو',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span style={{ fontWeight: 500 }}>
            {row.member?.name || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'planName',
      label: 'الباقة',
      render: (value, row) => (
        <span style={{ fontWeight: 500, color: '#667eea' }}>
          {row.plan?.name || value || 'N/A'}
        </span>
      )
    },
    {
      key: 'price',
      label: 'السعر',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#059669' }}>
          {value} جنيه
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
      <GymLayout>
        <LoadingSpinner />
      </GymLayout>
    );
  }

  return (
    <GymLayout>
      <div style={{ width: '100%' }}>
        <PageHeader
          title="اشتراكات الأعضاء"
          subtitle="إدارة اشتراكات أعضاء الجيم"
          action="add"
          actionLabel={showForm ? 'إلغاء' : 'إضافة اشتراك'}
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
            title="إضافة اشتراك جديد"
            style={{ marginBottom: spacing.xl }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Group label="العضو" required>
                <Select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  required
                  placeholder="اختر العضو"
                  options={members.map(member => ({
                    value: member._id,
                    label: member.name
                  }))}
                />
              </Form.Group>

              <Form.Group label="طريقة الإدخال">
                <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.base }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={usePlan}
                      onChange={() => setUsePlan(true)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>اختيار من الباقات</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={!usePlan}
                      onChange={() => setUsePlan(false)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>إدخال يدوي</span>
                  </label>
                </div>
              </Form.Group>

              {usePlan ? (
                <Form.Group label="الباقة" required>
                  <Select
                    value={formData.planId}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    required
                    placeholder="اختر الباقة"
                    options={plans.map(plan => ({
                      value: plan._id,
                      label: `${plan.name} - ${plan.price} جنيه (${plan.duration} ${plan.durationUnit === 'months' ? 'شهر' : plan.durationUnit === 'days' ? 'يوم' : 'سنة'})`
                    }))}
                  />
                  {formData.planId && (() => {
                    const selectedPlan = plans.find(p => p._id === formData.planId);
                    const durationUnitText = selectedPlan?.durationUnit === 'months' ? 'شهر' : 
                                             selectedPlan?.durationUnit === 'days' ? 'يوم' : 'سنة';
                    return (
                      <div style={{ marginTop: spacing.sm, padding: spacing.sm, backgroundColor: colors.gray[50], borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                          السعر: <strong>{formData.price} جنيه</strong> | المدة: <strong>{formData.duration} {durationUnitText}</strong>
                        </div>
                      </div>
                    );
                  })()}
                </Form.Group>
              ) : (
                <>
                  <Form.Row>
                    <Form.Group label="اسم الباقة" required>
                      <Input
                        type="text"
                        value={formData.planName}
                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                        required
                        placeholder="مثال: باقة شهرية"
                      />
                    </Form.Group>
                    <Form.Group label="السعر (جنيه)" required>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        placeholder="0.00"
                      />
                    </Form.Group>
                  </Form.Row>
                  
                  <Form.Group label="المدة (بالأشهر)" required>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      placeholder="1"
                    />
                  </Form.Group>
                </>
              )}
              
              <Form.Group label="طريقة الدفع">
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  options={[
                    { value: 'cash', label: 'نقدي' },
                    { value: 'card', label: 'بطاقة' },
                    { value: 'online', label: 'أونلاين' },
                    { value: 'other', label: 'أخرى' }
                  ]}
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
          data={subscriptions}
          emptyMessage="لا توجد اشتراكات"
          emptyIcon="📋"
        />
      </div>
    </GymLayout>
  );
};

export default MemberSubscriptions;
