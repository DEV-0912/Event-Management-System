import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    // Placeholder: your backend uses Google OAuth; email sign-up can be added if supported server-side
    Alert.alert('Info', 'Email sign-up is not enabled on the backend. Use Google login on Login screen.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to discover and register for events</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor="#9aa4b2" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#9aa4b2" autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#9aa4b2" secureTextEntry />
      <Pressable style={styles.primaryBtn} onPress={onRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9aa4b2', marginTop: 4, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 12, color: '#e5e7eb', marginBottom: 12, backgroundColor: '#111827' },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
