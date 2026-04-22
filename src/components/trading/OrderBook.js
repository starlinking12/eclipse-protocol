import React, { useState, useEffect } from 'react';

export const OrderBook = () => {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const generateOrders = () => {
      const basePrice = 3500;
      const newAsks = [];
      const newBids = [];
      
      for (let i = 1; i <= 12; i++) {
        const askPrice = basePrice + (i * 2) + Math.random() * 3;
        const askSize = (Math.random() * 2 + 0.1).toFixed(3);
        newAsks.push({ price: askPrice.toFixed(2), size: askSize, total: (askPrice * askSize).toFixed(0) });
        
        const bidPrice = basePrice - (i * 2) - Math.random() * 3;
        const bidSize = (Math.random() * 2 + 0.1).toFixed(3);
        newBids.push({ price: bidPrice.toFixed(2), size: bidSize, total: (bidPrice * bidSize).toFixed(0) });
      }
      
      setAsks(newAsks);
      setBids(newBids);
    };
    
    generateOrders();
    const interval = setInterval(generateOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex justify-between text-gray-500 text-xs mb-3 px-2">
        <span>Price (USDT)</span>
        <span>Size (ETH)</span>
        <span>Total</span>
      </div>
      
      <div className="space-y-1 mb-3">
        {asks.map((ask, i) => (
          <div key={`ask-${i}`} className="flex justify-between text-red-400 text-sm">
            <span>{ask.price}</span>
            <span>{ask.size}</span>
            <span>{ask.total}</span>
          </div>
        ))}
      </div>
      
      <div className="text-center py-3 border-y border-gray-700 my-2">
        <span className="text-2xl font-bold text-white">$3,482.50</span>
        <span className="text-green-500 text-sm ml-2">+2.4%</span>
      </div>
      
      <div className="space-y-1">
        {bids.map((bid, i) => (
          <div key={`bid-${i}`} className="flex justify-between text-green-400 text-sm">
            <span>{bid.price}</span>
            <span>{bid.size}</span>
            <span>{bid.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};