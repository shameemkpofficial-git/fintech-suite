import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Custom hook to subscribe to network connectivity status.
 * @returns { isConnected: boolean | null, isInternetReachable: boolean | null }
 */
export const useNetwork = () => {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    // Initial fetch
    NetInfo.fetch().then((state) => {
      setNetworkState(state);
    });

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
    });

    return () => unsubscribe();
  }, []);

  return {
    isConnected: networkState?.isConnected ?? true, // Default to true if unknown
    isInternetReachable: networkState?.isInternetReachable ?? true,
    details: networkState?.details,
    type: networkState?.type,
  };
};
