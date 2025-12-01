import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGymManagers, deleteGymManager, getAllPlans, createSubscription } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';

const GymManagers = () => {
  const [gymManagers, setGymManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [plans, setPlans] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    planId: '',
    paymentMethod: 'local',
    paymentId: '',
    autoRenew: false
  });

  useEffect(() => {
    fetchGymManagers();
    fetchPlans();
  }, [search]);

  const fetchGymManagers = async () => {
    try {
      const response = await getAllGymManagers({ search });
      setGymManagers(response.data.gymManagers || []);
    } catch (error) {
      console.error('Error fetching gym managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans({ isActive: true });
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleAddSubscription = (manager) => {
    setSelectedManager(manager);
    setSubscriptionData({
      planId: '',
      paymentMethod: 'local',
      paymentId: '',
      autoRenew: false
    });
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    if (!subscriptionData.planId) {
      alert('يرجى اختيار باقة');
      return;
    }

    try {
      await createSubscription({
        gymManagerId: selectedManager._id,
        planId: subscriptionData.planId,
        paymentMethod: subscriptionData.paymentMethod,
        paymentId: subscriptionData.paymentId || null,
        autoRenew: subscriptionData.autoRenew
      });
      setShowSubscriptionModal(false);
      fetchGymManagers();
      alert('تم إنشاء الاشتراك بنجاح');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert(error.response?.data?.message || 'خطأ في إنشاء الاشتراك');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف مدير الجيم؟')) {
      try {
        await deleteGymManager(id);
        fetchGymManagers();
      } catch (error) {
        console.error('Error deleting gym manager:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: '#ecfdf5', color: '#059669', text: 'نشط' },
      expired: { bg: '#fef3c7', color: '#d97706', text: 'منتهي' },
      suspended: { bg: '#fee2e2', color: '#dc2626', text: 'معلق' },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', text: 'ملغي' }
    };
    const config = statusConfig[status] || statusConfig.expired;
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>مديرو الجيمات</h2>
            <p style={styles.subtitle}>إدارة جميع مديري الجيمات المسجلين</p>
          </div>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="ابحث عن مدير جيم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>الاسم</th>
                <th style={styles.tableHeader}>البريد الإلكتروني</th>
                <th style={styles.tableHeader}>اسم الجيم</th>
                <th style={styles.tableHeader}>الباقة الحالية</th>
                <th style={styles.tableHeader}>حالة الاشتراك</th>
                <th style={styles.tableHeader}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {gymManagers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
                    <div style={styles.emptyState}>
                      <span style={styles.emptyIcon}>👥</span>
                      <p>لا يوجد مديرو جيمات</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gymManagers.map((manager, index) => (
                  <tr key={manager._id} style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                  }}>
                    <td style={styles.tableCell}>
                      <div style={styles.nameCell}>
                        <span style={styles.nameIcon}>👤</span>
                        <span style={styles.nameText}>{manager.name}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>{manager.email}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.gymName}>{manager.gymName}</span>
                    </td>
                    <td style={styles.tableCell}>
                      {manager.currentSubscription?.plan?.name ? (
                        <span style={styles.planName}>
                          {manager.currentSubscription.plan.name}
                        </span>
                      ) : (
                        <span style={styles.noPlan}>لا توجد باقة</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {getStatusBadge(manager.subscriptionStatus)}
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => handleAddSubscription(manager)}
                          style={styles.addButton}
                          className="actionButton"
                        >
                          <span>➕</span>
                          <span>إضافة اشتراك</span>
                        </button>
                        <button
                          onClick={() => handleDelete(manager._id)}
                          style={styles.deleteButton}
                          className="deleteButton"
                        >
                          <span>🗑️</span>
                          <span>حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedManager && (
        <div style={styles.modalOverlay} onClick={() => setShowSubscriptionModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                إضافة اشتراك لـ {selectedManager.name}
              </h3>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubscriptionSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label>الباقة *</label>
                <select
                  value={subscriptionData.planId}
                  onChange={(e) =>
                    setSubscriptionData({
                      ...subscriptionData,
                      planId: e.target.value
                    })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">اختر باقة</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - {plan.price} جنيه
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label>طريقة الدفع *</label>
                <select
                  value={subscriptionData.paymentMethod}
                  onChange={(e) =>
                    setSubscriptionData({
                      ...subscriptionData,
                      paymentMethod: e.target.value
                    })
                  }
                  required
                  style={styles.input}
                >
                  <option value="local">دفع محلي</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label>معرف الدفع (اختياري)</label>
                <input
                  type="text"
                  value={subscriptionData.paymentId}
                  onChange={(e) =>
                    setSubscriptionData({
                      ...subscriptionData,
                      paymentId: e.target.value
                    })
                  }
                  style={styles.input}
                  placeholder="معرف الدفع من بوابة الدفع"
                />
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={subscriptionData.autoRenew}
                  onChange={(e) =>
                    setSubscriptionData({
                      ...subscriptionData,
                      autoRenew: e.target.checked
                    })
                  }
                  style={styles.checkbox}
                />
                <label htmlFor="autoRenew">تجديد تلقائي</label>
              </div>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.submitButton}>
                  إضافة اشتراك
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubscriptionModal(false)}
                  style={styles.cancelButton}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const styles = {
  container: {
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    right: '1rem',
    fontSize: '1.25rem',
    color: '#9ca3af',
    zIndex: 1
  },
  searchInput: {
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    width: '300px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    fontFamily: 'inherit'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb'
  },
  tableHeader: {
    padding: '1.25rem 1.5rem',
    textAlign: 'right',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tableRow: {
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '1.25rem 1.5rem',
    fontSize: '0.9375rem',
    color: '#1f2937',
    borderBottom: '1px solid #f3f4f6'
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  nameIcon: {
    fontSize: '1.25rem'
  },
  nameText: {
    fontWeight: '500'
  },
  gymName: {
    fontWeight: '500',
    color: '#667eea'
  },
  badge: {
    display: 'inline-block',
    padding: '0.375rem 0.875rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: '500',
    textAlign: 'center'
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.2)'
  },
  emptyCell: {
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: '#9ca3af'
  },
  emptyIcon: {
    fontSize: '3rem',
    opacity: 0.5
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(16, 185, 129, 0.2)'
  },
  planName: {
    fontWeight: '500',
    color: '#667eea'
  },
  noPlan: {
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem 0.5rem'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitButton: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default GymManagers;
