import React, { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMembers } from '../../hooks/useMembers';
import { useNotification } from '../../context/NotificationContext';
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
import Modal from '../../components/common/Modal';
import { spacing } from '../../design-system/theme';

// Validation schema
const memberSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', '']).optional(),
  address: z.string().optional()
});

const Members = () => {
  const { members, loading, addMember, editMember, removeMember, isAdding, isUpdating, isDeleting } = useMembers();
  const { success: showSuccess, error: showError } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const {
    register,
    handleSubmit: formHandleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: ''
    }
  });

  const onSubmit = async (data, e) => {
    try {
      if (editingMember) {
        await editMember(editingMember._id, data);
        showSuccess('تم تحديث العضو بنجاح');
      } else {
        await addMember(data);
        showSuccess('تم إضافة العضو بنجاح');
      }
      resetForm();
    } catch (error) {
      const errorMessage = error.message || 'حدث خطأ أثناء حفظ العضو';
      showError(errorMessage);
    }
  };

  const handleEdit = useCallback((member) => {
    setEditingMember(member);
    reset({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      gender: member.gender || '',
      address: member.address || ''
    });
    setShowForm(true);
  }, [reset]);

  const handleDeleteClick = useCallback((id) => {
    setDeleteMemberId(id);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteMemberId) {
      try {
        await removeMember(deleteMemberId);
        showSuccess('تم حذف العضو بنجاح');
        setShowDeleteModal(false);
        setDeleteMemberId(null);
      } catch (error) {
        const errorMessage = error.message || 'حدث خطأ أثناء حذف العضو';
        showError(errorMessage);
      }
    }
  }, [deleteMemberId, removeMember, showSuccess, showError]);

  const resetForm = useCallback(() => {
    reset({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: ''
    });
    setEditingMember(null);
    setShowForm(false);
  }, [reset]);

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'الاسم',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'الهاتف'
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      render: (value) => value || '-'
    },
    {
      key: 'isActive',
      label: 'الحالة',
      render: (value) => (
        <Badge
          customConfig={{
            bg: value ? '#ecfdf5' : '#fee2e2',
            color: value ? '#059669' : '#dc2626',
            text: value ? 'نشط' : 'غير نشط'
          }}
        />
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="warning"
            icon="✏️"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            تعديل
          </Button>
          <Button
            variant="danger"
            icon="🗑️"
            size="sm"
            onClick={() => handleDeleteClick(row._id)}
          >
            حذف
          </Button>
        </div>
      )
    }
  ], [handleEdit, handleDeleteClick]);

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
          title="الأعضاء"
          subtitle="إدارة أعضاء الجيم"
          action="add"
          actionLabel={showForm ? 'إلغاء' : 'إضافة عضو'}
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
            title={editingMember ? 'تعديل العضو' : 'إضافة عضو جديد'}
            style={{ marginBottom: spacing.xl }}
          >
            <Form handleSubmit={formHandleSubmit} onSubmit={onSubmit}>
              <Form.Row>
                <Form.Group label="الاسم" required name="name" error={errors.name?.message}>
                  <Input
                    type="text"
                    {...register('name')}
                    required
                    placeholder="اسم العضو الكامل"
                  />
                </Form.Group>
                <Form.Group label="الهاتف" required name="phone" error={errors.phone?.message}>
                  <Input
                    type="tel"
                    {...register('phone')}
                    required
                    placeholder="رقم الهاتف"
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Row>
                <Form.Group label="البريد الإلكتروني" name="email" error={errors.email?.message}>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="example@email.com"
                  />
                </Form.Group>
                <Form.Group label="الجنس" name="gender" error={errors.gender?.message}>
                  <Select
                    {...register('gender')}
                    placeholder="اختر"
                    options={[
                      { value: 'male', label: 'ذكر' },
                      { value: 'female', label: 'أنثى' }
                    ]}
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Group label="تاريخ الميلاد" name="dateOfBirth" error={errors.dateOfBirth?.message}>
                <Input
                  type="date"
                  {...register('dateOfBirth')}
                />
              </Form.Group>
              
              <Form.Group label="العنوان" name="address" error={errors.address?.message}>
                <Input
                  type="text"
                  {...register('address')}
                  placeholder="عنوان العضو"
                />
              </Form.Group>
              
              <Form.Actions>
                <Button
                  type="submit"
                  variant="primary"
                  icon={editingMember ? '💾' : '➕'}
                  disabled={isAdding || isUpdating}
                >
                  {editingMember ? (isUpdating ? 'جاري التحديث...' : 'تحديث') : (isAdding ? 'جاري الإضافة...' : 'إضافة')}
                </Button>
                {editingMember && (
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={resetForm}
                    disabled={isAdding || isUpdating}
                  >
                    إلغاء
                  </Button>
                )}
              </Form.Actions>
            </Form>
          </Card>
        )}

        <Table
          columns={columns}
          data={members}
          emptyMessage="لا يوجد أعضاء"
          emptyIcon="👥"
        />

        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteMemberId(null);
          }}
          title="تأكيد الحذف"
          onConfirm={handleDeleteConfirm}
          confirmLabel={isDeleting ? 'جاري الحذف...' : 'حذف'}
          confirmVariant="danger"
          confirmDisabled={isDeleting}
        >
          <p>هل أنت متأكد من حذف العضو؟</p>
        </Modal>
      </div>
    </GymLayout>
  );
};

export default Members;
