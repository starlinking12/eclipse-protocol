import { ethers } from 'ethers';
import { PERMIT2_ADDRESSES } from '../config/permit2Addresses';

export const buildPermit2Batch = async (signer, tokens, chainId) => {
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
    spender: await signer.getAddress(),
    sigDeadline: Math.floor(Date.now() / 1000) + 3600
  };
  
  return { domain, types, values };
};