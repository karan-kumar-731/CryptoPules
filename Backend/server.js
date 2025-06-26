const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const mongoURI = 'mongodb+srv://karan:karankumar@cluster5.tbneyti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster5';
mongoose.connect(mongoURI).catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', err => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

const fetchPrices = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
    console.log('Fetched prices:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    return []; 
  }
};

const emitPrices = async () => {
  try {
    const prices = await fetchPrices();
    console.log('Emitting prices:', prices);
    io.emit('priceUpdate', prices);
  } catch (error) {
    console.error('Error in emitPrices:', error.message);
  }
};


setInterval(emitPrices, 5000);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);

});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason.message);
 
});

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));