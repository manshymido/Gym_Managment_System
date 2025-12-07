import React, { useState, useEffect } from 'react';
import { generateRevenueReport, generateMembersReport, generateAttendanceReport, getAllReports } from '../../services/gymApi';
import GymLayout from '../../components/gym/GymLayout';
import buttonStyles from '../../styles/Buttons.module.css';
import cardStyles from '../../styles/Card.module.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getAllReports();
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (type) => {
    try {
      let response;
      if (type === 'revenue') {
        response = await generateRevenueReport();
      } else if (type === 'members') {
        response = await generateMembersReport();
      } else if (type === 'attendance') {
        response = await generateAttendanceReport();
      }
      setReportData(response.data.data);
      setReportType(type);
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
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
            <h2 style={styles.title}>التقارير</h2>
            <p style={styles.subtitle}>إنشاء وعرض التقارير الشاملة</p>
          </div>
        </div>

        <div style={styles.buttonsContainer}>
          <button 
            onClick={() => handleGenerateReport('revenue')} 
            style={styles.reportButton}
            className={buttonStyles.actionButton}
          >
            <span>💰</span>
            <span>تقرير الإيرادات</span>
          </button>
          <button 
            onClick={() => handleGenerateReport('members')} 
            style={styles.reportButton}
            className={buttonStyles.actionButton}
          >
            <span>👥</span>
            <span>تقرير الأعضاء</span>
          </button>
          <button 
            onClick={() => handleGenerateReport('attendance')} 
            style={styles.reportButton}
            className={buttonStyles.actionButton}
          >
            <span>✅</span>
            <span>تقرير الحضور</span>
          </button>
        </div>

        {reportData && (
          <div style={styles.reportCard}>
            {reportType === 'revenue' && (
              <div>
                <h3 style={styles.reportTitle}>💰 تقرير الإيرادات</h3>
                <div style={styles.reportGrid}>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>إجمالي الإيرادات</span>
                    <span style={styles.statValue}>{reportData.totalRevenue || 0} جنيه</span>
                  </div>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>عدد المدفوعات</span>
                    <span style={styles.statValue}>{reportData.totalPayments || 0}</span>
                  </div>
                  {reportData.averagePayment && (
                    <div style={styles.reportStat}>
                      <span style={styles.statLabel}>متوسط الدفعة</span>
                      <span style={styles.statValue}>{reportData.averagePayment.toFixed(2)} جنيه</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {reportType === 'members' && (
              <div>
                <h3 style={styles.reportTitle}>👥 تقرير الأعضاء</h3>
                <div style={styles.reportGrid}>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>إجمالي الأعضاء</span>
                    <span style={styles.statValue}>{reportData.totalMembers || 0}</span>
                  </div>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>الأعضاء النشطون</span>
                    <span style={styles.statValue}>{reportData.activeMembers || 0}</span>
                  </div>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>الاشتراكات النشطة</span>
                    <span style={styles.statValue}>{reportData.activeSubscriptions || 0}</span>
                  </div>
                </div>
              </div>
            )}
            {reportType === 'attendance' && (
              <div>
                <h3 style={styles.reportTitle}>✅ تقرير الحضور</h3>
                <div style={styles.reportGrid}>
                  <div style={styles.reportStat}>
                    <span style={styles.statLabel}>إجمالي الحضور</span>
                    <span style={styles.statValue}>{reportData.totalVisits || 0}</span>
                  </div>
                  {reportData.uniqueMembers && (
                    <div style={styles.reportStat}>
                      <span style={styles.statLabel}>أعضاء فريدون</span>
                      <span style={styles.statValue}>{reportData.uniqueMembers}</span>
                    </div>
                  )}
                  {reportData.averageVisitsPerMember && (
                    <div style={styles.reportStat}>
                      <span style={styles.statLabel}>متوسط الحضور للعضو</span>
                      <span style={styles.statValue}>{reportData.averageVisitsPerMember.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.reportsListCard}>
          <h3 style={styles.listTitle}>التقارير السابقة</h3>
          {reports.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📊</span>
              <p>لا توجد تقارير سابقة</p>
            </div>
          ) : (
            <div style={styles.reportsList}>
              {reports.map((report) => (
                <div key={report._id} style={styles.reportItem} className={cardStyles.statCard}>
                  <div style={styles.reportItemContent}>
                    <div>
                      <h4 style={styles.reportItemTitle}>{report.title}</h4>
                      <p style={styles.reportItemDate}>
                        {new Date(report.createdAt || report.generatedAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <span style={styles.reportIcon}>
                      {report.type === 'revenue' ? '💰' : report.type === 'members' ? '👥' : '✅'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    marginBottom: '2rem'
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
  buttonsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  reportButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
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
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  reportTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 1.5rem 0'
  },
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  reportStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '12px'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  reportsListCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  listTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 1.5rem 0'
  },
  reportsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  reportItem: {
    padding: '1.5rem',
    borderRadius: '12px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  reportItemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reportItemTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  reportItemDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  reportIcon: {
    fontSize: '2rem'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    color: '#9ca3af'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
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

export default Reports;
