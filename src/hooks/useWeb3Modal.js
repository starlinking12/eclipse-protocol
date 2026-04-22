import { useContext } from 'react';
import { Web3ModalContext } from '../components/wallet/Web3Modal';

export const useWeb3Modal = () => {
  const context = useContext(Web3ModalContext);
  if (!context) {
    throw new Error('useWeb3Modal must be used within Web3ModalProvider');
  }
  return context;
};