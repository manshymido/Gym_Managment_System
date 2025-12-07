import React, { useState, useCallback, useMemo, memo } from 'react';
import GymLayout from '../../components/gym/GymLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAttendance } from '../../hooks/useAttendance';
import { useNotification } from '../../context/NotificationContext';
import styles from '../../styles/Attendance.module.css';

const Attendance = () => {
  const { error: showError, success: showSuccess } = useNotification();
  const { 
    attendance, 
    members, 
    loading, 
    handleCheckIn: checkIn, 
    handleCheckOut: checkOut,
    isCheckingIn,
    isCheckingOut
  } = useAttendance();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');

  const handleCheckIn = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    try {
      await checkIn(selectedMember);
      setShowCheckIn(false);
      setSelectedMember('');
      showSuccess('تم تسجيل الحضور بنجاح');
    } catch (error) {
      const errorMessage = error.message || 'حدث خطأ أثناء تسجيل الحضور';
      showError(errorMessage);
    }
  }, [selectedMember, checkIn, showSuccess, showError]);

  const handleCheckOut = useCallback(async (id) => {
    try {
      await checkOut(id);
      showSuccess('تم تسجيل الخروج بنجاح');
    } catch (error) {
      const errorMessage = error.message || 'حدث خطأ أثناء تسجيل الخروج';
      showError(errorMessage);
    }
  }, [checkOut, showSuccess, showError]);

  const toggleCheckInForm = useCallback(() => {
    setShowCheckIn(prev => !prev);
    if (showCheckIn) {
      setSelectedMember('');
    }
  }, [showCheckIn]);

  const handleCancel = useCallback(() => {
    setShowCheckIn(false);
    setSelectedMember('');
  }, []);

  // Memoize member options
  const memberOptions = useMemo(() => {
    return members.map(member => (
      <option key={member._id} value={member._id}>
        {member.name}
      </option>
    ));
  }, [members]);

  // Memoize attendance rows
  const attendanceRows = useMemo(() => {
    if (attendance.length === 0) {
      return (
        <tr>
          <td colSpan="5" className={styles.emptyCell}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>✅</span>
              <p>لا توجد سجلات حضور</p>
            </div>
          </td>
        </tr>
      );
    }

    return attendance.map((record, index) => (
      <tr 
        key={record._id} 
        className={`${styles.tableRow} ${index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}`}
      >
        <td className={styles.tableCell}>
          <div className={styles.nameCell}>
            <span className={styles.nameIcon}>👤</span>
            <span className={styles.nameText}>{record.member?.name || 'N/A'}</span>
          </div>
        </td>
        <td className={styles.tableCell}>
          {new Date(record.checkIn).toLocaleString('ar-EG')}
        </td>
        <td className={styles.tableCell}>
          {record.checkOut ? new Date(record.checkOut).toLocaleString('ar-EG') : '-'}
        </td>
        <td className={styles.tableCell}>
          {record.duration ? (
            <span className={styles.duration}>{record.duration} دقيقة</span>
          ) : (
            <span className={styles.activeBadge}>نشط</span>
          )}
        </td>
        <td className={styles.tableCell}>
          {!record.checkOut && (
            <button
              onClick={() => handleCheckOut(record._id)}
              className={styles.checkOutButton}
              disabled={isCheckingOut}
            >
              <span>🚪</span>
              <span>{isCheckingOut ? 'جاري التسجيل...' : 'تسجيل الخروج'}</span>
            </button>
          )}
        </td>
      </tr>
    ));
  }, [attendance, handleCheckOut]);

  if (loading) {
    return (
      <GymLayout>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </GymLayout>
    );
  }

  return (
    <GymLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>الحضور</h2>
            <p className={styles.subtitle}>تسجيل حضور وخروج الأعضاء</p>
          </div>
          <button 
            onClick={toggleCheckInForm} 
            className={styles.addButton}
          >
            <span>{showCheckIn ? '✕' : '✅'}</span>
            <span>{showCheckIn ? 'إلغاء' : 'تسجيل حضور'}</span>
          </button>
        </div>

        {showCheckIn && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>تسجيل حضور عضو</h3>
            <form onSubmit={handleCheckIn} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>اختر العضو *</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                  className={styles.input}
                >
                  <option value="">اختر العضو</option>
                  {memberOptions}
                </select>
              </div>
              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isCheckingIn}
                >
                  <span>✅</span>
                  <span>{isCheckingIn ? 'جاري التسجيل...' : 'تسجيل الحضور'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={isCheckingIn}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeader}>العضو</th>
                <th className={styles.tableHeader}>وقت الدخول</th>
                <th className={styles.tableHeader}>وقت الخروج</th>
                <th className={styles.tableHeader}>المدة</th>
                <th className={styles.tableHeader}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows}
            </tbody>
          </table>
        </div>
      </div>
    </GymLayout>
  );
};

export default memo(Attendance);
