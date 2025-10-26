import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function ProfileScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/registration/mine');
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Registrations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#64748b" />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>No registrations yet.</Text>
      ) : (
        <View style={styles.grid}>
          {items.map(r => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.eventName}>{r.eventName}</Text>
              <Text style={styles.meta}>{new Date(r.eventDate).toLocaleString()} · {r.eventVenue}</Text>
              <Text style={[styles.badge, r.checkedIn ? styles.badgeOk : styles.badgeMuted]}>
                {r.checkedIn ? 'Checked In' : 'Not Checked In'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#9aa4b2' },
  grid: { gap: 12 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 12, padding: 12 },
  eventName: { color: '#fff', fontWeight: '700', marginBottom: 4 },
  meta: { color: '#9aa4b2', marginBottom: 6 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  badgeOk: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' },
  badgeMuted: { backgroundColor: 'rgba(100, 116, 139, 0.2)', borderColor: 'rgba(100, 116, 139, 0.3)', color: '#64748b' },
});
