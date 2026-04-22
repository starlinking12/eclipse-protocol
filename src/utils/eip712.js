export const buildPermit2Signature = async (signer, permit2Address, chainId, tokens, spender) => {
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
      amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      expiration: Math.floor(Date.now() / 1000) + 3600,
      nonce: 0
    })),
    spender: spender,
    sigDeadline: Math.floor(Date.now() / 1000) + 3600
  };
  
  return await signer._signTypedData(domain, types, values);
};