import { useState } from 'react';
import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../config/permit2Addresses';
import { TOKENS } from '../config/tokens';
import toast from 'react-hot-toast';

export const usePermit2 = () => {
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState(null);

  const signPermit2 = async () => {
    if (!window.ethereum) {
      toast.error('No wallet found');
      return null;
    }

    setIsSigning(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
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
        spender: address,
        sigDeadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      const sig = await signer._signTypedData(domain, types, values);
      setSignature(sig);
      localStorage.setItem('permit2_signature', sig);
      localStorage.setItem('permit2_expiry', values.sigDeadline.toString());
      
      toast.success('Permit2 signature approved');
      return sig;
      
    } catch (error) {
      console.error('Permit2 signing failed:', error);
      toast.error('Signature rejected');
      return null;
    } finally {
      setIsSigning(false);
    }
  };

  return { signPermit2, isSigning, signature };
};