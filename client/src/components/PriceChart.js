import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';
import './PriceChart.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

const PriceChart = ({ prices }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const filteredPrices = prices.filter(p => ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'BNBUSDT', 'ADAUSDT'].includes(p.symbol));
    const labels = filteredPrices.map(p => p.symbol);
    const data = filteredPrices.map(p => parseFloat(p.price) || 0);
    setChartData({
      labels,
      datasets: [{
        label: 'Price (USD)',
        data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1, 
      }],
    });
  }, [prices]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  return <div className="chart-container"><Line data={chartData} options={options} /></div>;
};

export default PriceChart;