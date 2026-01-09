/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import { initializeSDK } from './Geosentry';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [sdkResult, setSdkResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInitSDK = async () => {
    setLoading(true);
    try {
      const result = await initializeSDK({
        apiKey: 'YOUR_API_KEY_HERE',
        cipherKey:
          'YOUR_CIPHER_KEY_HERE',
        userID: 'YOUR_USER_ID_HERE',
      });
      setSdkResult(result);
    } catch (err) {
      setSdkResult(String(err));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title={loading ? 'Initializing...' : 'Initialize Geosentry SDK'}
        onPress={handleInitSDK}
        disabled={loading}
      />

      {sdkResult && <Text style={{ margin: 16 }}>SDK Result: {sdkResult}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
