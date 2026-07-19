import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--primary-light)' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '0.25rem 0' }}>
            {entry.name}: ₹{entry.value.toFixed(0)}
            {entry.name === 'Forecast' && entry.payload.confidence ? ` (${entry.payload.confidence}% confidence)` : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PriceChart = ({ historicalData, forecastedData, cropName }) => {
  // Combine and format data
  const combinedData = [];
  
  if (historicalData) {
    historicalData.forEach(d => {
      combinedData.push({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actualPrice: d.price,
        forecastPrice: null,
        fullDate: d.date
      });
    });
  }
  
  if (forecastedData) {
    forecastedData.forEach(d => {
      combinedData.push({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actualPrice: null,
        forecastPrice: d.predictedPrice,
        confidence: d.confidence,
        fullDate: d.date
      });
    });
  }

  // Sort by date string - simplistic sort assuming data comes mostly sorted, but let's be safe
  combinedData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  // Connect the last actual point to the first forecast point visually
  const lastActualIndex = combinedData.map(d => d.actualPrice).lastIndexOf(combinedData.findLast(d => d.actualPrice !== null)?.actualPrice);
  if (lastActualIndex !== -1 && lastActualIndex < combinedData.length - 1) {
    // Just to make the chart line continuous
    combinedData[lastActualIndex].forecastPrice = combinedData[lastActualIndex].actualPrice;
  }


  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'var(--chart-text)' }} 
            tickMargin={10}
            axisLine={{ stroke: 'var(--chart-grid)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--chart-text)' }} 
            axisLine={{ stroke: 'var(--chart-grid)' }}
            tickFormatter={(value) => `₹${value}`}
            domain={['dataMin - 200', 'dataMax + 200']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <ReferenceLine x={combinedData[lastActualIndex]?.date} stroke="var(--text-muted)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'var(--text-muted)', fontSize: 12 }} />

          <Line 
            type="monotone" 
            dataKey="actualPrice" 
            name="Historical" 
            stroke="var(--primary)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--primary)' }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="forecastPrice" 
            name="Forecast" 
            stroke="var(--accent)" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: 'var(--accent)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
