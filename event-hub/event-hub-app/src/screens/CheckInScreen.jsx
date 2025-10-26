import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import api from '../services/api';

export default function CheckInScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [manualQR, setManualQR] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleDecode = async (text) => {
    if (!text) return;
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.post('/api/registration/checkin', { qr: text });
      setResult(data.registration || null);
      setMessage('Check-in successful!');
    } catch (e) {
      const msg = e?.response?.data?.error || 'Check-in failed';
      setMessage(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    handleDecode(String(data));
    setTimeout(() => setScanned(false), 1500);
  };

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator color="#64748b" /></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No access to camera. You can use manual entry below.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Check-In</Text>
      {message ? (
        <View style={[styles.alert, message.toLowerCase().includes('success') ? styles.alertSuccess : styles.alertError]}>
          <Text style={styles.alertText}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.scannerWrap}>
        <View style={styles.scannerBox}>
          <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
          <View style={styles.scanOverlay} />
        </View>
        <Text style={styles.help}>Point your camera at the attendee QR code</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Manual Check-In</Text>
        <TextInput
          style={styles.input}
          value={manualQR}
          onChangeText={setManualQR}
          placeholder="e.g. eventId|registrationId"
          placeholderTextColor="#9aa4b2"
          autoCapitalize="none"
        />
        <Pressable style={styles.primaryBtn} disabled={loading || !manualQR.trim()} onPress={() => handleDecode(manualQR.trim())}>
          <Text style={styles.btnText}>{loading ? 'Checking...' : 'Check In'}</Text>
        </Pressable>
      </View>

      {result && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Result</Text>
          <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.value}>{result.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{result.email}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Contact</Text><Text style={styles.value}>{result.contact || 'Not provided'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Event ID</Text><Text style={styles.value}>{String(result.eventId)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={[styles.badge, result.checkedIn ? styles.badgeOk : styles.badgeMuted]}>{result.checkedIn ? 'Checked In' : 'Not Checked In'}</Text></View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0c10' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 16, gap: 12, marginTop: 16 },
  sectionTitle: { color: '#e5e7eb', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 12, color: '#e5e7eb', backgroundColor: '#0f172a' },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#9aa4b2', padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  label: { color: '#9aa4b2' },
  value: { color: '#e5e7eb', marginLeft: 12, flexShrink: 1, textAlign: 'right' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeOk: { backgroundColor: 'rgba(34,197,94,0.2)', borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  badgeMuted: { backgroundColor: 'rgba(100,116,139,0.2)', borderColor: 'rgba(100,116,139,0.3)', color: '#64748b' },
  scannerWrap: { marginTop: 6 },
  scannerBox: { height: 260, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#0f172a' },
  scanOverlay: { position: 'absolute', left: 16, right: 16, top: 16, bottom: 16, borderColor: 'rgba(99,102,241,0.6)', borderWidth: 2, borderRadius: 12 },
});
