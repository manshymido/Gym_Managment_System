import React from 'react';
import { colors, borderRadius, shadows } from '../../design-system/theme';

const Table = ({
  columns = [],
  data = [],
  emptyMessage = 'لا توجد بيانات',
  emptyIcon = '📋',
  renderRow,
  onRowClick,
  ...props
}) => {
  const tableContainerStyle = {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.base
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const headerRowStyle = {
    backgroundColor: colors.gray[50],
    borderBottom: `2px solid ${colors.gray[200]}`
  };

  const headerCellStyle = {
    padding: '1.25rem 1.5rem',
    textAlign: 'right',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const rowStyle = {
    transition: 'background-color 0.2s ease',
    cursor: onRowClick ? 'pointer' : 'default'
  };

  const cellStyle = {
    padding: '1.25rem 1.5rem',
    fontSize: '0.9375rem',
    color: colors.text.primary,
    borderBottom: `1px solid ${colors.gray[100]}`
  };

  const emptyCellStyle = {
    padding: '4rem 2rem',
    textAlign: 'center'
  };

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: colors.gray[400]
  };

  const emptyIconStyle = {
    fontSize: '3rem',
    opacity: 0.5
  };

  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleRowMouseEnter = (e) => {
    if (onRowClick) {
      e.currentTarget.style.backgroundColor = colors.gray[50];
    }
  };

  const handleRowMouseLeave = (e) => {
    if (onRowClick) {
      e.currentTarget.style.backgroundColor = '';
    }
  };

  return (
    <div style={tableContainerStyle} {...props}>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            {columns.map((column, index) => (
              <th key={column.key || index} style={headerCellStyle}>
                {column.label || column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={emptyCellStyle}>
                <div style={emptyStateStyle}>
                  <span style={emptyIconStyle}>{emptyIcon}</span>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              if (renderRow) {
                return renderRow(row, rowIndex);
              }

              return (
                <tr
                  key={row.id || row._id || rowIndex}
                  style={{
                    ...rowStyle,
                    backgroundColor: rowIndex % 2 === 0 ? colors.background.paper : colors.gray[50]
                  }}
                  onClick={() => handleRowClick(row, rowIndex)}
                  onMouseEnter={handleRowMouseEnter}
                  onMouseLeave={handleRowMouseLeave}
                >
                  {columns.map((column, colIndex) => (
                    <td key={column.key || colIndex} style={cellStyle}>
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

