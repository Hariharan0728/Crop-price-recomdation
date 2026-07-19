import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Bell, Target } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Sprout size={32} />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>AgriPrice</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }} className="animate-fade-in">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            Get Market-Ready <br/> 
            <span style={{ color: 'var(--primary)' }}>Know Your Crop Price Before Planting</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Empowering Indian farmers with data-driven forward pricing. Make informed decisions, maximize profits, and never sell at a loss again.
          </p>

          <button 
            className="btn btn-primary" 
            style={{ fontSize: '1.25rem', padding: '1rem 2.5rem', borderRadius: '50px' }}
            onClick={() => navigate('/setup')}
          >
            Get Started
          </button>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '5rem', width: '100%', maxWidth: '1000px' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(45, 106, 79, 0.1)', padding: '1rem', borderRadius: '50%', width: 'fit-content', color: 'var(--primary)' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>3-6 Month Forecasts</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Accurate predictions using AI and Agmarknet data.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(233, 196, 106, 0.2)', padding: '1rem', borderRadius: '50%', width: 'fit-content', color: 'var(--secondary)' }}>
              <Sprout size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Smart Recommendations</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tailored to your location and water availability.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(244, 162, 97, 0.2)', padding: '1rem', borderRadius: '50%', width: 'fit-content', color: 'var(--accent)' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Profit Estimates</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Know your potential margin before sowing the seed.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '1rem', borderRadius: '50%', width: 'fit-content', color: 'var(--danger)' }}>
              <Bell size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Price Alerts</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Get notified the moment market hits your target.</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
