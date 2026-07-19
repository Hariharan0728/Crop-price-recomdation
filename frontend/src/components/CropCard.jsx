import React from 'react';

const CropCard = ({ crop, isSelected, onClick }) => {
  const margin = ((crop.forecastPrice - crop.currentPrice) / crop.currentPrice) * 100;
  
  let profitColor = 'text-green';
  let bgColor = 'rgba(42, 157, 143, 0.1)';
  if (margin < 5) {
    profitColor = 'text-yellow';
    bgColor = 'rgba(233, 196, 106, 0.1)';
  }
  if (margin < 0) {
    profitColor = 'text-red';
    bgColor = 'rgba(230, 57, 70, 0.1)';
  }

  return (
    <div 
      className="glass-panel"
      style={{ 
        padding: '1.5rem', 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
        transform: isSelected ? 'translateY(-4px)' : 'none',
        boxShadow: isSelected ? '0 10px 25px -5px rgba(45, 106, 79, 0.3)' : 'var(--shadow-sm)'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>{crop.icon}</div>
        <div style={{ background: bgColor, color: `var(--${profitColor.split('-')[1]})`, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
          {margin > 0 ? '+' : ''}{margin.toFixed(1)}%
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{crop.cropName}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
        <div style={{ color: 'var(--text-muted)' }}>
          <div>Current</div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{crop.currentPrice}</div>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
          <div>Forecast</div>
          <div style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{crop.forecastPrice}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', width: '100%', height: '4px', background: '#e9ecef', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${crop.suitabilityScore}%`, background: 'var(--primary)' }}></div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
        Suitability: {crop.suitabilityScore}%
      </div>
      
      <button 
        className="btn btn-outline" 
        style={{ 
          width: '100%', 
          padding: '0.5rem', 
          fontSize: '0.875rem', 
          background: isSelected ? 'var(--primary)' : 'transparent', 
          color: isSelected ? 'white' : 'var(--primary)',
          borderColor: isSelected ? 'var(--primary)' : 'var(--glass-border)'
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onClick(); 
        }}
      >
        {isSelected ? 'Viewing Analysis' : 'More Info'}
      </button>
    </div>
  );
};

export default CropCard;
