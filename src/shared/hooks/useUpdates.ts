import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

/**
 * Custom hook to manage Expo OTA (Over-The-Air) updates.
 * Provides status information and functions to check/apply updates.
 */
export const useUpdates = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [lastCheckDate, setLastCheckDate] = useState<Date | null>(null);

  /**
   * Checks if an update is available on the server.
   */
  const checkForUpdate = async () => {
    if (__DEV__) {
        console.log('OTA updates are disabled in development mode.');
        return;
    }

    try {
      setLastCheckDate(new Date());
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
    return false;
  };

  /**
   * Downloads the available update.
   */
  const downloadUpdate = async () => {
    if (!isUpdateAvailable) return;

    try {
      setIsDownloading(true);
      await Updates.fetchUpdateAsync();
      setIsUpdateDownloaded(true);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.error('Error downloading update:', error);
      Alert.alert('Update Failed', 'An error occurred while downloading the update.');
    }
  };

  /**
   * Restarts the app to apply the downloaded update.
   */
  const applyUpdate = async () => {
    if (!isUpdateDownloaded) return;

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
    isUpdateAvailable,
    isDownloading,
    isUpdateDownloaded,
    lastCheckDate,
    checkForUpdate,
    downloadUpdate,
    applyUpdate,
    handleUpdateFlow,
  };
};
