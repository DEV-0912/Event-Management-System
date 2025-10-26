import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/events');
        if (active) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#64748b" /></View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Available Events</Text>
      {events.length === 0 ? (
        <Text style={styles.empty}>No events available</Text>
      ) : (
        <View style={styles.list}>
          {events.map((ev) => (
            <Pressable key={ev.id} style={styles.card} onPress={() => navigation.navigate('EventRegistration', { eventId: ev.id, event: ev })}>
              <Text style={styles.eventName}>{ev.name}</Text>
              <Text style={styles.meta}>{new Date(ev.date).toLocaleString()} • {ev.venue}</Text>
              {ev.speaker ? <Text style={styles.metaSmall}>Speaker: {ev.speaker}</Text> : null}
            </Pressable>
          ))}
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
  empty: { color: '#9aa4b2' },
  list: { gap: 12 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 12, padding: 14 },
  eventName: { color: '#e5e7eb', fontWeight: '700', marginBottom: 6 },
  meta: { color: '#9aa4b2' },
  metaSmall: { color: '#9aa4b2', marginTop: 2, fontSize: 12 },
});
