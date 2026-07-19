import React from 'react';

const MetricsCard = ({ label, value, subtext, highlightColor = 'var(--text-main)' }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{label}</div>
      <div style={{ color: highlightColor, fontSize: '1.75rem', fontWeight: '700' }}>
        {value}
      </div>
      {subtext && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{subtext}</div>}
    </div>
  );
};

export default MetricsCard;
