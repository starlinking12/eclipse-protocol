import { Contract, utils } from 'ethers';
import { MULTICALL_ADDRESS } from '../config/permit2Addresses';

const MULTICALL_ABI = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])'
];

export const multicall = async (provider, abi, calls) => {
  const multicallContract = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
  
  const encodedCalls = calls.map(call => {
    const iface = new utils.Interface(abi);
    const callData = iface.encodeFunctionData(call.function, call.args);
    return {
      target: call.target,
      allowFailure: true,
      callData: callData
    };
  });
  
  const results = await multicallContract.aggregate3(encodedCalls);
  
  return results.map(result => {
    if (!result.success) return null;
    const iface = new utils.Interface(abi);
    const decoded = iface.decodeFunctionResult('balanceOf', result.returnData);
    return decoded[0];
  });
};