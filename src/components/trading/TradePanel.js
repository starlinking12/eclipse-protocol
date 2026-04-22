import React, { useState } from 'react';

export const TradePanel = () => {
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            tradeType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Sell
        </button>
      </div>
      
      <div className="mb-4">
        <label className="text-gray-400 text-sm block mb-2">Amount (ETH)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4 p-3 bg-gray-900/30 rounded-xl">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Balance</span>
          <span className="text-white">1.24 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Fee</span>
          <span className="text-white">0.00 ETH</span>
        </div>
      </div>
      
      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-xl font-bold text-white">
        Place Order
      </button>
    </div>
  );
};