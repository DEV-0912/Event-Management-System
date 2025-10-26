import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator, Share } from 'react-native';
import api from '../services/api';

export default function EventDetailsScreen({ route, navigation }) {
  const { eventId } = route.params || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/events/${eventId}`);
        if (!active) return;
        setEvent(data || null);
        setError(null);
      } catch (e) {
        if (!active) return;
        setEvent(null);
        setError('Event not found');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (eventId) load();
    return () => { active = false; };
  }, [eventId]);

  const onShare = async () => {
    try {
      const base = process.env.EXPO_PUBLIC_BASE_URL || '';
      const registrationUrl = `${base.replace(/\/$/, '')}/events/${event?.id}/register`;
      await Share.share({ title: `${event?.name || 'Event'} - Registration`, message: registrationUrl });
    } catch {}
  };

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#64748b" /></View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}> 
        <View style={styles.card}> 
          <Text style={styles.errorTitle}>Event not found</Text>
          <Text style={styles.errorText}>The event may have been removed or the link is incorrect.</Text>
          <Pressable style={styles.btn} onPress={() => navigation.goBack()}><Text style={styles.btnText}>Go Back</Text></Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{event.name}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={styles.btnOutline} onPress={() => navigation.navigate('EventRegistration', { eventId: event.id })}>
              <Text style={styles.btnOutlineText}>Register</Text>
            </Pressable>
            <Pressable style={styles.btnOutline} onPress={onShare}>
              <Text style={styles.btnOutlineText}>Share</Text>
            </Pressable>
          </View>
        </View>
        {!!event.poster && (
          <View style={styles.posterWrap}>
            <Image source={{ uri: String(event.poster) }} style={styles.poster} resizeMode="cover" />
          </View>
        )}
        <View style={{ gap: 6 }}>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Date: </Text>{new Date(event.date).toLocaleString()}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Venue: </Text>{event.venue}</Text>
          {!!event.speaker && (
            <Text style={styles.detail}><Text style={styles.detailLabel}>Speaker: </Text>{event.speaker}</Text>
          )}
          {!!event.food && (
            <Text style={styles.detail}><Text style={styles.detailLabel}>Food: </Text>{event.food}</Text>
          )}
        </View>
        {!!event.description && (
          <Text style={styles.desc}>{String(event.description)}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 20 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', flex: 1, paddingRight: 12 },
  posterWrap: { width: '100%', maxHeight: 420, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  poster: { width: '100%', height: 320 },
  detail: { color: '#e5e7eb' },
  detailLabel: { color: '#9aa4b2', fontWeight: '600' },
  desc: { color: '#9aa4b2', lineHeight: 20 },
  errorTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 6 },
  errorText: { color: '#9aa4b2', marginBottom: 12 },
  btn: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  btnText: { color: '#e5e7eb', fontWeight: '600' },
  btnOutline: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnOutlineText: { color: '#e5e7eb', fontWeight: '600' },
});
