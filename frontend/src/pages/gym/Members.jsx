import React, { useState, useEffect } from 'react';
import { getAllMembers, createMember, updateMember, deleteMember } from '../../services/gymApi';
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

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateMember(editingMember._id, formData);
      } else {
        await createMember(formData);
      }
      fetchMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      gender: member.gender || '',
      address: member.address || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteMemberId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteMemberId) {
      try {
        await deleteMember(deleteMemberId);
        fetchMembers();
        setShowDeleteModal(false);
        setDeleteMemberId(null);
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: ''
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const columns = [
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
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group label="الاسم" required>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="اسم العضو الكامل"
                  />
                </Form.Group>
                <Form.Group label="الهاتف" required>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="رقم الهاتف"
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Row>
                <Form.Group label="البريد الإلكتروني">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </Form.Group>
                <Form.Group label="الجنس">
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    placeholder="اختر"
                    options={[
                      { value: 'male', label: 'ذكر' },
                      { value: 'female', label: 'أنثى' }
                    ]}
                  />
                </Form.Group>
              </Form.Row>
              
              <Form.Group label="تاريخ الميلاد">
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </Form.Group>
              
              <Form.Group label="العنوان">
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="عنوان العضو"
                />
              </Form.Group>
              
              <Form.Actions>
                <Button
                  type="submit"
                  variant="primary"
                  icon={editingMember ? '💾' : '➕'}
                >
                  {editingMember ? 'تحديث' : 'إضافة'}
                </Button>
                {editingMember && (
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
          confirmLabel="حذف"
          confirmVariant="danger"
        >
          <p>هل أنت متأكد من حذف العضو؟</p>
        </Modal>
      </div>
    </GymLayout>
  );
};

export default Members;
