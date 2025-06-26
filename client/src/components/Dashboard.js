import React, { useState, useEffect } from 'react';
import PriceChart from './PriceChart';
import './Dashboard.css';
import { saveAs } from 'file-saver'; 

const Dashboard = ({ prices }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const cryptocurrencies = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'BNBUSDT', 'ADAUSDT'].slice(0, 5);

  const getHistoricalData = (symbol) => {
    const now = new Date();
    const historical = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now - i * 60 * 60 * 1000).toLocaleTimeString();
      const basePrice = prices.find(p => p.symbol === symbol)?.price || 0;
     
      const variation = (Math.random() - 0.5) * 0.1 * basePrice;
      return { time, price: parseFloat((parseFloat(basePrice) + variation).toFixed(2)) };
    }).reverse(); 
    return historical;
  };

  const downloadReport = () => {
    const csv = [
      'Symbol,Price (USD)',
      ...cryptocurrencies.map(symbol => {
        const priceObj = prices.find(p => p.symbol === symbol);
        const price = priceObj ? parseFloat(priceObj.price).toFixed(2) : 'N/A';
        return `${symbol},${price}`;
      })
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'crypto_report.csv');
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark' : 'light'}`}>
      <h2>Dashboard</h2>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <button onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? 'Hide History' : 'View 24h History'}
      </button>
      <button onClick={downloadReport}>Download Report</button>
      <ul>
        {cryptocurrencies.map(crypto => {
          const priceObj = prices.find(p => p.symbol === crypto);
          const price = priceObj ? parseFloat(priceObj.price).toFixed(2) : 'N/A';
          return (
            <li key={crypto}>
              {crypto}: ${price}
            </li>
          );
        })}
      </ul>
      <PriceChart prices={prices} />
      {showHistory && (
        <div>
          <h3>24h Price History</h3>
          {cryptocurrencies.map(crypto => (
            <div key={crypto}>
              <h4>{crypto}</h4>
              <ul>
                {getHistoricalData(crypto).map((data, index) => (
                  <li key={index}>{data.time}: ${data.price}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;