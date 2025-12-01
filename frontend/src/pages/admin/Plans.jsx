import React, { useState, useEffect } from 'react';
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Form from '../../components/common/Form';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { colors, spacing } from '../../design-system/theme';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    durationUnit: 'months',
    features: '',
    maxMembers: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : -1
      };

      if (editingPlan) {
        await updatePlan(editingPlan._id, data);
      } else {
        await createPlan(data);
      }
      fetchPlans();
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      durationUnit: plan.durationUnit,
      features: plan.features?.join(', ') || '',
      maxMembers: plan.maxMembers === -1 ? '' : plan.maxMembers.toString()
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeletePlanId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletePlanId) {
      try {
        await deletePlan(deletePlanId);
        fetchPlans();
        setShowDeleteModal(false);
        setDeletePlanId(null);
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      durationUnit: 'months',
      features: '',
      maxMembers: ''
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  const getDurationText = (duration, unit) => {
    const units = {
      days: 'يوم',
      months: 'شهر',
      years: 'سنة'
    };
    return `${duration} ${units[unit] || unit}`;
  };

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
          title="باقات الاشتراك"
          subtitle="إدارة باقات الاشتراك المتاحة"
          action="add"
          actionLabel={showForm ? 'إلغاء' : 'إضافة باقة'}
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
            title={editingPlan ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
            style={{ marginBottom: spacing.xl }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group label="اسم الباقة" required>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="مثال: باقة أساسية"
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
              
              <Form.Group label="الوصف">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الباقة..."
                  rows={3}
                />
              </Form.Group>
              
              <Form.Row>
                <Form.Group label="المدة" required>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="مثال: 1"
                  />
                </Form.Group>
                <Form.Group label="وحدة المدة" required>
                  <Select
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    options={[
                      { value: 'days', label: 'أيام' },
                      { value: 'months', label: 'أشهر' },
                      { value: 'years', label: 'سنوات' }
                    ]}
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Group label="الميزات (مفصولة بفواصل)">
                <Input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="ميزة 1, ميزة 2, ميزة 3"
                />
              </Form.Group>
              
              <Form.Group label="الحد الأقصى للأعضاء (-1 للغير محدود)">
                <Input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  placeholder="-1"
                />
              </Form.Group>
              
              <Form.Actions>
                <Button
                  type="submit"
                  variant="primary"
                  icon={editingPlan ? '💾' : '➕'}
                >
                  {editingPlan ? 'تحديث' : 'إضافة'}
                </Button>
                {editingPlan && (
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={resetForm}
                  >
                    إلغاء
                  </Button>
                )}
              </Form.Actions>
            </Form>
          </Card>
        )}

        {plans.length === 0 ? (
          <EmptyState
            icon="💳"
            message="لا توجد باقات متاحة"
            action={!showForm}
            actionLabel="إضافة باقة"
            onActionClick={() => setShowForm(true)}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: spacing.lg
          }}>
            {plans.map((plan) => (
              <Card key={plan._id} hover style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: spacing.base,
                  paddingBottom: spacing.base,
                  borderBottom: `2px solid ${colors.gray[100]}`
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: colors.text.primary,
                    margin: 0
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                  }}>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      background: colors.primary.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {plan.price}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      color: colors.text.secondary
                    }}>
                      جنيه
                    </span>
                  </div>
                </div>
                
                {plan.description && (
                  <p style={{
                    color: colors.text.secondary,
                    margin: `0 0 ${spacing.base} 0`,
                    lineHeight: 1.6
                  }}>
                    {plan.description}
                  </p>
                )}
                
                <div style={{ flex: 1, marginBottom: spacing.lg }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                    color: colors.text.primary,
                    fontSize: '0.9375rem'
                  }}>
                    <span>⏱️</span>
                    <span>المدة: {getDurationText(plan.duration, plan.durationUnit)}</span>
                  </div>
                  
                  {plan.maxMembers !== -1 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      marginBottom: spacing.md,
                      color: colors.text.primary,
                      fontSize: '0.9375rem'
                    }}>
                      <span>👥</span>
                      <span>حد أقصى: {plan.maxMembers} عضو</span>
                    </div>
                  )}
                  
                  {plan.features && plan.features.length > 0 && (
                    <div style={{
                      marginTop: spacing.base,
                      paddingTop: spacing.base,
                      borderTop: `1px solid ${colors.gray[100]}`
                    }}>
                      <strong style={{ display: 'block', marginBottom: spacing.sm }}>
                        الميزات:
                      </strong>
                      <ul style={{
                        margin: 0,
                        paddingRight: spacing.lg,
                        color: colors.text.secondary,
                        fontSize: '0.875rem'
                      }}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: spacing.md,
                  marginTop: 'auto',
                  paddingTop: spacing.base,
                  borderTop: `2px solid ${colors.gray[100]}`
                }}>
                  <Button
                    variant="warning"
                    icon="✏️"
                    onClick={() => handleEdit(plan)}
                    fullWidth
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="danger"
                    icon="🗑️"
                    onClick={() => handleDeleteClick(plan._id)}
                    fullWidth
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletePlanId(null);
          }}
          title="تأكيد الحذف"
          onConfirm={handleDeleteConfirm}
          confirmLabel="حذف"
          confirmVariant="danger"
        >
          <p>هل أنت متأكد من حذف هذه الباقة؟</p>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Plans;
