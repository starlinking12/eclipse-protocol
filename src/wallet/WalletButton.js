import React from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useWeb3Modal as useLocalWeb3Modal } from './Web3Modal';

export const WalletButton = () => {
  const { open } = useWeb3Modal();
  const { isConnected, account } = useLocalWeb3Modal();

  if (isConnected && account) {
    return (
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-white font-mono text-sm">
          {account.slice(0,6)}...{account.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  );
};