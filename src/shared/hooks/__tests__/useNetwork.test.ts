import { renderHook, act, waitFor } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetwork } from '../useNetwork';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

describe('useNetwork', () => {
  const mockedNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches initial network state on mount', async () => {
    const initialState = {
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    };
    mockedNetInfo.fetch.mockResolvedValue(initialState as any);
    mockedNetInfo.addEventListener.mockReturnValue(() => {});

    const { result } = renderHook(() => useNetwork());

    await waitFor(() => {
      expect(result.current.type).toBe('wifi');
    });

    expect(mockedNetInfo.fetch).toHaveBeenCalled();
  });

  it('subscribes to network changes on mount and unsubscribes on unmount', () => {
    const unsubscribe = jest.fn();
    mockedNetInfo.fetch.mockResolvedValue({} as any);
    mockedNetInfo.addEventListener.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useNetwork());

    expect(mockedNetInfo.addEventListener).toHaveBeenCalled();
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('updates state when a network change occurs', async () => {
    let changeHandler: (state: any) => void = () => {};
    mockedNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
    mockedNetInfo.addEventListener.mockImplementation((handler) => {
      changeHandler = handler;
      return () => {};
    });

    const { result } = renderHook(() => useNetwork());

    // Wait for initial fetch to settle
    await waitFor(() => expect(mockedNetInfo.fetch).toHaveBeenCalled());

    await act(async () => {
      changeHandler({ 
        isConnected: false, 
        isInternetReachable: false,
        type: 'none'
      });
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });
    
    expect(result.current.isInternetReachable).toBe(false);
    expect(result.current.type).toBe('none');
  });

  it('provides default values when network state is unknown', async () => {
    mockedNetInfo.fetch.mockResolvedValue(null as any);
    mockedNetInfo.addEventListener.mockReturnValue(() => {});

    const { result } = renderHook(() => useNetwork());

    expect(result.current.isConnected).toBe(true); // Default value in hook
    expect(result.current.isInternetReachable).toBe(true);
  });
});
