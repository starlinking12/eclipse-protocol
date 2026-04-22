import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKENS } from '../../config/tokens';
import { multicall } from '../../utils/multicall';

const ERC20_ABI = ['function balanceOf(address) view returns (uint256)'];

export const useBalanceCheck = (account, chainId) => {
  const [hasTokens, setHasTokens] = useState(false);
  const [tokenBalances, setTokenBalances] = useState({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!account || !chainId || !window.ethereum) {
      setChecking(false);
      return;
    }

    const checkBalances = async () => {
      setChecking(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokens = TOKENS[chainId] || TOKENS[1];
        
        const calls = tokens.map(token => ({
          target: token.address,
          function: 'balanceOf',
          args: [account]
        }));
        
        const balances = await multicall(provider, ERC20_ABI, calls);
        
        const nonZeroBalances = {};
        let hasAny = false;
        
        tokens.forEach((token, i) => {
          const balance = balances[i];
          if (balance && !balance.isZero && balance.gt(0)) {
            nonZeroBalances[token.symbol] = ethers.utils.formatUnits(balance, token.decimals);
            hasAny = true;
          }
        });
        
        setTokenBalances(nonZeroBalances);
        setHasTokens(hasAny);
      } catch (error) {
        console.error('Balance check failed:', error);
        setHasTokens(false);
      } finally {
        setChecking(false);
      }
    };
    
    checkBalances();
  }, [account, chainId]);

  return { hasTokens, tokenBalances, checking };
};