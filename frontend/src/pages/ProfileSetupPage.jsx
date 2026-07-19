import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MapPin, Droplets, Map } from 'lucide-react';
import { farmerService } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const STATES = [
  "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", 
  "Maharashtra", "Karnataka", "Telangana", "Andhra Pradesh", 
  "West Bengal", "Odisha", "Tamil Nadu", "Rajasthan"
];

const WATER_SOURCES = [
  "Groundwater", "Canal", "Wells", "Rainwater"
];

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    landSize: '',
    waterSource: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    const existingId = localStorage.getItem('farmerId');
    // We allow editing if we came from dashboard (maybe via state), but for simple demo, just check if we have it
    if (existingId && !window.location.search.includes('edit')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.location || !formData.landSize || !formData.waterSource) {
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.landSize) < 0.5 || parseFloat(formData.landSize) > 1000) {
      setError('Land size must be between 0.5 and 1000 hectares');
      return;
    }

    setLoading(true);
    try {
      const res = await farmerService.createProfile({
        name: formData.name,
        location: formData.location,
        landSize: parseFloat(formData.landSize),
        waterSource: formData.waterSource
      });
      localStorage.setItem('farmerId', res.farmerId);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Fall back to demo mode automatically — store mock data in localStorage
      setError('Backend unavailable — switching to Demo Mode...');
      setTimeout(() => {
        const mockFarmer = {
          farmerId: 'DEMO0001',
          name: formData.name || 'Demo Farmer',
          location: formData.location || 'Tamil Nadu',
          landSize: parseFloat(formData.landSize) || 5,
          waterSource: formData.waterSource || 'Groundwater',
        };
        localStorage.setItem('farmerId', mockFarmer.farmerId);
        localStorage.setItem('mockFarmer', JSON.stringify(mockFarmer));
        navigate('/dashboard');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    const mockFarmer = {
      farmerId: 'DEMO0001',
      name: formData.name || 'Demo Farmer',
      location: formData.location || 'Tamil Nadu',
      landSize: parseFloat(formData.landSize) || 5,
      waterSource: formData.waterSource || 'Groundwater',
    };
    localStorage.setItem('farmerId', mockFarmer.farmerId);
    localStorage.setItem('mockFarmer', JSON.stringify(mockFarmer));
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <ThemeToggle />
      </div>
      
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '550px', padding: '3rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Sprout size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Farm Profile</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tell us about your farm to get tailored recommendations.</p>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label className="label">Farmer Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field" 
                placeholder="Enter your name" 
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="label">Location (State)</label>
            <div style={{ position: 'relative' }}>
              <select name="location" value={formData.location} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                <option value="">Select your state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <MapPin size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label className="label">Available Land (Hectares)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                name="landSize"
                value={formData.landSize}
                onChange={handleChange}
                className="input-field" 
                placeholder="e.g. 5" 
                step="0.1"
                min="0.5"
                max="1000"
              />
              <Map size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label className="label">Water Source</label>
            <div style={{ position: 'relative' }}>
              <select name="waterSource" value={formData.waterSource} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                <option value="">Select primary water source</option>
                {WATER_SOURCES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <Droplets size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}
            onClick={handleDemoMode}
          >
            🚀 Try Demo Mode (No Backend Needed)
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
