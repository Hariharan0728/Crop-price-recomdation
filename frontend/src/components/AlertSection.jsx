import React, { useState } from 'react';
import { Bell, BellRing, X } from 'lucide-react';

const AlertSection = ({ crop, activeAlerts, onCreateAlert, onDismissAlert }) => {
  const [targetPrice, setTargetPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetPrice) return;
    
    onCreateAlert(parseFloat(targetPrice));
    setTargetPrice('');
  };

  const cropAlerts = activeAlerts.filter(a => a.cropId === crop.cropId);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
        <BellRing size={24} />
        <h3 style={{ margin: 0 }}>Price Alerts for {crop.cropName}</h3>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Set Alert Form */}
        <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Set Target Selling Price</h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="label" style={{ fontSize: '0.875rem' }}>Price per quintal (₹)</label>
              <input 
                type="number" 
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="input-field" 
                placeholder={`e.g. ${crop.forecastPrice}`}
                min={crop.currentPrice}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!targetPrice}>
              Create
            </button>
          </form>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            You'll be notified when the market price reaches your target.
          </p>
        </div>

        {/* Active Alerts List */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Active Alerts</h4>
          
          {cropAlerts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
              <Bell size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p>No active alerts for {crop.cropName}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cropAlerts.map(alert => (
                <div key={alert.id || alert.alertId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface)', borderLeft: '4px solid var(--accent)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Target: ₹{alert.targetPrice}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created: {new Date(alert.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button 
                    onClick={() => onDismissAlert(alert.id || alert.alertId)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                    title="Dismiss alert"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertSection;
