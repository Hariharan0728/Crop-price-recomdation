import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Sprout, MapPin, Droplets, Grid, MoreVertical, Cloud, Newspaper, ChevronDown, ChevronUp, User, HelpCircle } from 'lucide-react';
import { farmerService, cropService, alertService } from '../services/api';
import CropCard from '../components/CropCard';
import PriceChart from '../components/PriceChart';
import MetricsCard from '../components/MetricsCard';
import AlertSection from '../components/AlertSection';
import ThemeToggle from '../components/ThemeToggle';
import MapWidget from '../components/MapWidget';

const Dashboard = () => {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [cropDetail, setCropDetail] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = localStorage.getItem('farmerId');
        if (!id) {
          navigate('/setup');
          return;
        }

        // Try backend first
        try {
          const farmerData = await farmerService.getProfile(id);
          setFarmer(farmerData);
          setSelectedLocation(farmerData.location);
          const alertsData = await alertService.getActiveAlerts(farmerData.farmerId);
          setAlerts(alertsData.alerts || []);
        } catch (backendErr) {
          // Fall back to mock data stored in localStorage
          const mockRaw = localStorage.getItem('mockFarmer');
          const mockFarmer = mockRaw ? JSON.parse(mockRaw) : {
            farmerId: id,
            name: 'Demo Farmer',
            location: 'Tamil Nadu',
            landSize: 5,
            waterSource: 'Groundwater',
          };
          setFarmer(mockFarmer);
          setSelectedLocation(mockFarmer.location);
          // Use mock recommendations
          const mockRecs = [
            { cropId: 'rice', cropName: 'Rice', icon: '🍚', currentPrice: 2480, forecastPrice: 2650, marketDemand: 'High', averageYield: 35, waterNeeds: 'High', plantingSeason: 'Kharif', daysToMaturity: 120, historicalPrices: [], forecastedPrices: [] },
            { cropId: 'groundnut', cropName: 'Groundnut', icon: '🥜', currentPrice: 5300, forecastPrice: 5600, marketDemand: 'Medium', averageYield: 18, waterNeeds: 'Medium', plantingSeason: 'Kharif', daysToMaturity: 110, historicalPrices: [], forecastedPrices: [] },
            { cropId: 'sugarcane', cropName: 'Sugarcane', icon: '🍬', currentPrice: 335, forecastPrice: 365, marketDemand: 'High', averageYield: 700, waterNeeds: 'Very High', plantingSeason: 'Year-round', daysToMaturity: 330, historicalPrices: [], forecastedPrices: [] },
          ];
          setRecommendations(mockRecs);
          setSelectedCropId('rice');
          setCropDetail(mockRecs[0]);
          setAlerts([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  useEffect(() => {
    const fetchRecs = async () => {
      if (farmer && selectedLocation) {
        try {
          const recData = await cropService.getRecommendations(farmer.farmerId, selectedLocation, farmer.waterSource);
          setRecommendations(recData.recommendations || []);
          
          if (recData.recommendations && recData.recommendations.length > 0) {
            setSelectedCropId(recData.recommendations[0].cropId);
          } else {
            setSelectedCropId(null);
            setCropDetail(null);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchRecs();
  }, [selectedLocation, farmer]);

  useEffect(() => {
    const fetchCropDetail = async () => {
      if (selectedCropId && farmer) {
        try {
          const detail = await cropService.getForecast(selectedCropId, selectedLocation || farmer.location);
          setCropDetail(detail);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchCropDetail();
  }, [selectedCropId, farmer, selectedLocation]);

  const handleCreateAlert = async (targetPrice) => {
    if (!farmer || !cropDetail) return;
    try {
      await alertService.createAlert({
        farmerId: farmer.farmerId,
        cropId: cropDetail.cropId,
        targetPrice: targetPrice
      });
      // reload alerts
      const alertsData = await alertService.getActiveAlerts(farmer.farmerId);
      setAlerts(alertsData.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      await alertService.dismissAlert(alertId);
      // reload alerts
      const alertsData = await alertService.getActiveAlerts(farmer.farmerId);
      setAlerts(alertsData.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('farmerId');
    navigate('/');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Dashboard...</div>;
  }

  if (!farmer) return null;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Top Header Bar */}
      <header className="glass-panel" style={{ borderRadius: 0, padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Sprout size={28} />
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>AgriPrice Dashboard</h1>
        </div>
        <div style={{ fontWeight: '500' }}>Welcome, {farmer.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            ID: {farmer.farmerId}
          </div>
          
          <ThemeToggle />
          
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="btn btn-outline" 
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="glass-panel" style={{ 
              position: 'absolute', top: '120%', right: 0, width: '200px', 
              padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}>
              <button onClick={() => { setShowMenu(false); navigate('/setup?edit=true'); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', width: '100%' }}>
                <User size={16} /> Edit Profile
              </button>
              <button onClick={() => setShowMenu(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', width: '100%' }}>
                <Settings size={16} /> Settings
              </button>
              <button onClick={() => setShowMenu(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', width: '100%' }}>
                <HelpCircle size={16} /> Help & Support
              </button>
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.25rem 0' }} />
              <button onClick={handleLogout} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', width: '100%', color: 'var(--danger)' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
        
        {/* Dashboard Overview Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Profile Card (condensed) */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--card-bg-gradient)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--primary)" /> Farm Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--text-muted)" /> <span style={{ color: 'var(--text-muted)' }}>Location:</span> <strong>{farmer.location}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Grid size={16} color="var(--text-muted)" /> <span style={{ color: 'var(--text-muted)' }}>Land:</span> <strong>{farmer.landSize} hectares</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} color="var(--text-muted)" /> <span style={{ color: 'var(--text-muted)' }}>Water Source:</span> <strong>{farmer.waterSource}</strong>
              </div>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cloud size={18} color="#0077b6" /> Local Weather (Mock)
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0077b6' }}>28°C</div>
              <div>
                <div style={{ fontWeight: '500' }}>Partly Cloudy</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Humidity: 65%</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Wind: 12 km/h</div>
              </div>
            </div>
          </div>

          {/* News Widget */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Newspaper size={18} color="#e76f51" /> Market News (Mock)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <strong>Govt announces new MSP</strong> - <span style={{ color: 'var(--text-muted)' }}>2 hours ago</span>
              </div>
              <div>
                <strong>Export ban lifted on Rice</strong> - <span style={{ color: 'var(--text-muted)' }}>5 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <MapWidget selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} crops={recommendations} />
        </div>

        {/* Recommendations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Top Recommended Crops for {selectedLocation || (farmer && farmer.location)}</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
          {(showAllCrops ? recommendations : recommendations.slice(0, 2)).map(crop => (
            <CropCard 
              key={crop.cropId} 
              crop={crop} 
              isSelected={selectedCropId === crop.cropId}
              onClick={() => setSelectedCropId(crop.cropId)}
            />
          ))}
        </div>
        
        {recommendations.length > 2 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => setShowAllCrops(!showAllCrops)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem' }}
            >
              {showAllCrops ? <><ChevronUp size={18}/> Show Less</> : <><ChevronDown size={18}/> Show More Crops ({recommendations.length - 2})</>}
            </button>
          </div>
        )}

        {/* Detailed Analysis */}
        {cropDetail && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>{cropDetail.icon}</span> 
              Detailed Analysis: {cropDetail.cropName}
            </h2>
            
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <MetricsCard 
                label="Current Price" 
                value={`₹${cropDetail.currentPrice}`} 
                subtext="Per quintal (Updated today)" 
              />
              <MetricsCard 
                label="Forecast Price (6 mo)" 
                value={`₹${cropDetail.forecastPrice}`} 
                subtext={`Target potential`}
                highlightColor="var(--primary)" 
              />
              {(() => {
                const profitPerQuintal = cropDetail.forecastPrice - cropDetail.currentPrice;
                const totalYield = farmer.landSize * cropDetail.averageYield;
                const totalProfit = profitPerQuintal * totalYield;
                const margin = (profitPerQuintal / cropDetail.currentPrice) * 100;
                
                return (
                  <MetricsCard 
                    label="Expected Extra Profit" 
                    value={`₹${totalProfit.toLocaleString('en-IN')}`} 
                    subtext={`On ${farmer.landSize} hectares (Margin: +${margin.toFixed(1)}%)`}
                    highlightColor={margin > 5 ? '#2a9d8f' : '#e9c46a'} 
                  />
                )
              })()}
              <MetricsCard 
                label="Market Status" 
                value={cropDetail.marketDemand} 
                subtext="Current demand outlook" 
              />
            </div>

            {/* Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Price Trend Forecast</h3>
              <PriceChart 
                historicalData={cropDetail.historicalPrices} 
                forecastedData={cropDetail.forecastedPrices} 
                cropName={cropDetail.cropName}
              />
            </div>

            {/* Additional Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Growing Conditions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Water Req:</strong><br/>{cropDetail.waterNeeds}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Planting Season:</strong><br/>{cropDetail.plantingSeason}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Maturity:</strong><br/>{cropDetail.daysToMaturity} days</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Avg Yield:</strong><br/>{cropDetail.averageYield} quintal/ha</div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <AlertSection 
              crop={cropDetail} 
              activeAlerts={alerts} 
              onCreateAlert={handleCreateAlert}
              onDismissAlert={handleDismissAlert}
            />

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
