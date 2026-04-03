import { useEffect, useReducer } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

type UpdateStatus = 'IDLE' | 'CHECKING' | 'AVAILABLE' | 'DOWNLOADING' | 'READY';

interface UpdateState {
  status: UpdateStatus;
  error: string | null;
  lastCheckDate: Date | null;
}

type UpdateAction =
  | { type: 'SET_STATUS'; payload: UpdateStatus }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_CHECK_DATE'; payload: Date };

const updateReducer = (state: UpdateState, action: UpdateAction): UpdateState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, status: 'IDLE', error: action.payload };
    case 'SET_CHECK_DATE':
      return { ...state, lastCheckDate: action.payload };
    default:
      return state;
  }
};

/**
 * Custom hook to manage Expo OTA (Over-The-Air) updates.
 * Provides status information and functions to check/apply updates.
 */
export const useUpdates = () => {
  const [state, dispatch] = useReducer(updateReducer, {
    status: 'IDLE',
    error: null,
    lastCheckDate: null,
  });

  /**
   * Checks if an update is available on the server.
   */
  const checkForUpdate = async () => {
    if (__DEV__) {
      console.log('OTA updates are disabled in development mode.');
      return false;
    }

    try {
      dispatch({ type: 'SET_CHECK_DATE', payload: new Date() });
      dispatch({ type: 'SET_STATUS', payload: 'CHECKING' });
      
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        dispatch({ type: 'SET_STATUS', payload: 'AVAILABLE' });
        return true;
      } else {
        dispatch({ type: 'SET_STATUS', payload: 'IDLE' });
      }
    } catch (error: any) {
      console.error('Error checking for updates:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
    return false;
  };

  /**
   * Downloads the available update.
   */
  const downloadUpdate = async () => {
    if (state.status !== 'AVAILABLE') return;

    try {
      dispatch({ type: 'SET_STATUS', payload: 'DOWNLOADING' });
      await Updates.fetchUpdateAsync();
      dispatch({ type: 'SET_STATUS', payload: 'READY' });
    } catch (error: any) {
      console.error('Error downloading update:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      Alert.alert('Update Failed', 'An error occurred while downloading the update.');
    }
  };

  /**
   * Restarts the app to apply the downloaded update.
   */
  const applyUpdate = async () => {
    if (state.status !== 'READY') return;

    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error applying update:', error);
      Alert.alert('Restart Failed', 'Please close and reopen the app manually.');
    }
  };

  /**
   * Combined function to check, download and prompt for restart.
   */
  const handleUpdateFlow = async () => {
    const available = await checkForUpdate();
    if (available) {
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Would you like to download it now?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              await downloadUpdate();
              Alert.alert(
                'Update Ready',
                'The update has been downloaded. Restart the app to apply changes?',
                [
                  { text: 'Later', style: 'cancel' },
                  { text: 'Restart', onPress: applyUpdate },
                ]
              );
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    // Automatically check for updates on mount if not in dev
    if (!__DEV__) {
      handleUpdateFlow();
    }
  }, []);

  return {
    status: state.status,
    isUpdateAvailable: state.status === 'AVAILABLE' || state.status === 'READY',
    isDownloading: state.status === 'DOWNLOADING',
    isUpdateDownloaded: state.status === 'READY',
    lastCheckDate: state.lastCheckDate,
    checkForUpdate,
    downloadUpdate,
    applyUpdate,
    handleUpdateFlow,
  };
};
