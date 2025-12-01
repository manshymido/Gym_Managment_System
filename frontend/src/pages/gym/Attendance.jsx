import React, { useState, useEffect } from 'react';
import { getAllAttendance, checkIn, checkOut, getAllMembers } from '../../services/gymApi';
import GymLayout from '../../components/gym/GymLayout';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, membersRes] = await Promise.all([
        getAllAttendance(),
        getAllMembers()
      ]);
      setAttendance(attendanceRes.data.attendance || []);
      setMembers(membersRes.data.members || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await checkIn({ memberId: selectedMember });
      fetchData();
      setShowCheckIn(false);
      setSelectedMember('');
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOut(id);
      fetchData();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  if (loading) {
    return (
      <GymLayout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </GymLayout>
    );
  }

  return (
    <GymLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>الحضور</h2>
            <p style={styles.subtitle}>تسجيل حضور وخروج الأعضاء</p>
          </div>
          <button 
            onClick={() => setShowCheckIn(!showCheckIn)} 
            style={styles.addButton}
            className="actionButton"
          >
            <span>{showCheckIn ? '✕' : '✅'}</span>
            <span>{showCheckIn ? 'إلغاء' : 'تسجيل حضور'}</span>
          </button>
        </div>

        {showCheckIn && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>تسجيل حضور عضو</h3>
            <form onSubmit={handleCheckIn} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>اختر العضو *</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                  style={styles.input}
                >
                  <option value="">اختر العضو</option>
                  {members.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.submitButton} className="actionButton">
                  <span>✅</span>
                  <span>تسجيل الحضور</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCheckIn(false);
                    setSelectedMember('');
                  }} 
                  style={styles.cancelButton}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>العضو</th>
                <th style={styles.tableHeader}>وقت الدخول</th>
                <th style={styles.tableHeader}>وقت الخروج</th>
                <th style={styles.tableHeader}>المدة</th>
                <th style={styles.tableHeader}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>
                    <div style={styles.emptyState}>
                      <span style={styles.emptyIcon}>✅</span>
                      <p>لا توجد سجلات حضور</p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={record._id} style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                  }}>
                    <td style={styles.tableCell}>
                      <div style={styles.nameCell}>
                        <span style={styles.nameIcon}>👤</span>
                        <span style={styles.nameText}>{record.member?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      {new Date(record.checkIn).toLocaleString('ar-EG')}
                    </td>
                    <td style={styles.tableCell}>
                      {record.checkOut ? new Date(record.checkOut).toLocaleString('ar-EG') : '-'}
                    </td>
                    <td style={styles.tableCell}>
                      {record.duration ? (
                        <span style={styles.duration}>{record.duration} دقيقة</span>
                      ) : (
                        <span style={styles.activeBadge}>نشط</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {!record.checkOut && (
                        <button
                          onClick={() => handleCheckOut(record._id)}
                          style={styles.checkOutButton}
                          className="actionButton"
                        >
                          <span>🚪</span>
                          <span>تسجيل الخروج</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GymLayout>
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
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 1.5rem 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '0.875rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  cancelButton: {
    padding: '0.875rem 2rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
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
  duration: {
    fontWeight: '500',
    color: '#667eea'
  },
  activeBadge: {
    display: 'inline-block',
    padding: '0.375rem 0.875rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: '500',
    backgroundColor: '#ecfdf5',
    color: '#059669'
  },
  checkOutButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(245, 158, 11, 0.2)'
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
  }
};

export default Attendance;
