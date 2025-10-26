import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
  const redirectUri = makeRedirectUri({
    // On web, using Expo's proxy avoids COOP/POPUP issues
    useProxy: Platform.OS === 'web',
  });
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    iosClientId: clientId,
    androidClientId: clientId,
    webClientId: clientId,
    scopes: ['profile', 'email'],
    // Explicitly request an ID token for backend verification
    responseType: 'id_token',
    redirectUri,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        try {
          setLoading(true);
          const idToken = response.authentication?.idToken || response.params?.id_token;
          if (!idToken) {
            Alert.alert('Login failed', 'No ID token returned by Google.');
            return;
          }
          const { data } = await authApi.post('/api/auth/google', { credential: idToken });
          if (data?.token && data?.user) {
            await signIn({ token: data.token, user: data.user });
          } else {
            Alert.alert('Login failed', 'Unexpected auth server response');
          }
        } catch (e) {
          Alert.alert('Login failed', e?.response?.data?.error || 'Google authentication failed');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [response]);

  const onGoogleSignIn = async () => {
    if (!clientId) {
      Alert.alert('Missing client ID', 'Google client ID is not set in EXPO_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }
    // Use proxy on web to avoid COOP blocking window.close
    await promptAsync({ useProxy: Platform.OS === 'web', redirectUri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Continue with Google</Text>
      <Pressable style={styles.primaryBtn} onPress={onGoogleSignIn} disabled={loading || !request}>
        <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign in with Google'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#9aa4b2', marginBottom: 12 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
