import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => console.log('Connected to WebSocket'));
    socket.on('disconnect', () => console.log('Disconnected from WebSocket'));
    socket.on('priceUpdate', (data) => {
      console.log('Received prices:', data);
      setPrices(data);
    });
    socket.on('connect_error', (error) => console.error('Connection error:', error));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <h1>CryptoPulse</h1>
      {prices.length > 0 ? (
        <Dashboard prices={prices} />
      ) : (
        <p>Loading prices...</p>
      )}
    </div>
  );
};

export default App;