import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image, TextInput, Alert, Platform, Linking, Share } from 'react-native';
import api from '../services/api';

export default function AdminDashboardScreen() {
  const [events, setEvents] = useState([]);
  const [unowned, setUnowned] = useState([]);
  const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
  const [regsByEvent, setRegsByEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const [openEventIds, setOpenEventIds] = useState(new Set());
  const [deletingId, setDeletingId] = useState(null);
  const [sendTo, setSendTo] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [mine, ov, u] = await Promise.all([
        api.get('/api/events/mine').catch(() => ({ data: [] })),
        api.get('/api/events/overview').catch(() => ({ data: { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 } })),
        api.get('/api/events/unowned').catch(() => ({ data: [] })),
      ]);
      setEvents(mine.data || []);
      setOverview(ov.data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
      setUnowned(u.data || []);
    } finally {
      setLoading(false);
    }
  };

  const buildRegistrationLink = (eventId) => {
    // For mobile web and native, use EXPO_PUBLIC_WEB_URL if available, else window.origin on web
    const webBase = process.env.EXPO_PUBLIC_WEB_URL || (Platform.OS === 'web' ? window.location.origin : 'https://events.vjstartup.com');
    return `${webBase}/events/${eventId}/register`;
  };

  const copyRegistrationLink = async (eventId) => {
    const url = buildRegistrationLink(eventId);
    try {
      if (Platform.OS === 'web' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        Alert.alert('Copied', 'Registration link copied to clipboard');
        return;
      }
      // Fallback to Share sheet on native
      await Share.share({ message: url, url });
    } catch {
      Alert.alert('Link', url);
    }
  };

  const downloadRegistrationQR = async (eventId) => {
    try {
      const url = buildRegistrationLink(eventId);
      const { data } = await api.post('/api/registration/qr', { url });
      const dataUrl = data?.dataUrl;
      if (!dataUrl) { Alert.alert('Error', 'Failed to generate QR'); return; }
      if (Platform.OS === 'web') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `event-${eventId}-registration-qr.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // On native, try to open the image in the browser
        await Linking.openURL(dataUrl);
      }
    } catch {
      Alert.alert('Error', 'Failed to download QR');
    }
  };

  useEffect(() => { load(); }, []);

  const toggleRegs = async (eventId) => {
    const next = new Set(openEventIds);
    if (next.has(eventId)) {
      next.delete(eventId);
      setOpenEventIds(next);
      return;
    }
    next.add(eventId);
    setOpenEventIds(next);
    await reloadRegs(eventId);
  };

  const reloadRegs = async (eventId) => {
    try {
      setLoadingEventId(eventId);
      const { data } = await api.get(`/api/registration/event/${eventId}`);
      setRegsByEvent(prev => ({ ...prev, [eventId]: Array.isArray(data) ? data : [] }));
    } finally {
      setLoadingEventId(null);
    }
  };

  const claim = async (id) => {
    try {
      await api.post(`/api/events/${id}/claim`);
      Alert.alert('Success', 'Event claimed.');
      load();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to claim event');
    }
  };

  const remove = async (id) => {
    const performDelete = async () => {
      try {
        setDeletingId(id);
        await api.delete(`/api/events/${id}`);
        Alert.alert('Deleted', 'Event removed.');
        load();
      } catch (e) {
        const msg = e?.response?.data?.error || 'Delete failed';
        Alert.alert('Error', msg);
      } finally {
        setDeletingId(null);
      }
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to delete this event?');
      if (ok) await performDelete();
      return;
    }

    Alert.alert('Confirm', 'Delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: performDelete }
    ]);
  };

  const sendAttendance = async (eventId) => {
    const raw = (sendTo[eventId] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (raw.length === 0) { Alert.alert('Recipients', 'Enter at least one email.'); return; }
    try {
      const { data } = await api.post(`/api/registration/event/${eventId}/send-attendance`, { recipients: raw });
      Alert.alert('Sent', `Attendance sent. Checked-in rows: ${data?.count ?? 0}`);
      setSendTo(prev => ({ ...prev, [eventId]: '' }));
    } catch {
      Alert.alert('Error', 'Failed to send attendance');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Admin Dashboard</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statLabel}>My Events</Text><Text style={styles.statValue}>{overview.totalEvents}</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Registrations</Text><Text style={styles.statValue}>{overview.totalRegistrations}</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Checked-In</Text><Text style={styles.statValue}>{overview.totalCheckedIn}</Text></View>
      </View>

      {unowned.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Legacy Events</Text>
          <View style={{ gap: 12 }}>
            {unowned.map(ev => (
              <View key={ev.id} style={styles.card}>
                <Text style={styles.eventName}>{ev.name}</Text>
                <Text style={styles.meta}>{new Date(ev.date).toLocaleString()} · {ev.venue}</Text>
                <Pressable style={styles.claimBtn} onPress={() => claim(ev.id)}><Text style={styles.claimText}>Claim Event</Text></Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>My Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#64748b" />
      ) : events.length === 0 ? (
        <Text style={styles.empty}>No events yet.</Text>
      ) : (
        <View style={{ gap: 12 }}>
          {events.map(ev => (
            <View key={ev.id} style={styles.card}>
              {!!ev.poster && (
                <View style={styles.posterWrap}><Image source={{ uri: String(ev.poster) }} style={styles.poster} resizeMode="cover" /></View>
              )}
              <View style={{ gap: 6 }}>
                <Text style={styles.eventName}>{ev.name}</Text>
                <Text style={styles.meta}>{new Date(ev.date).toLocaleString()} · {ev.venue}</Text>
              </View>
              <View style={styles.rowGap}>
                <Pressable style={styles.btn} onPress={() => toggleRegs(ev.id)}>
                  <Text style={styles.btnText}>{openEventIds.has(ev.id) ? 'Hide Registrations' : 'View Registrations'}</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => copyRegistrationLink(ev.id)}>
                  <Text style={styles.btnText}>Copy Reg Link</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => downloadRegistrationQR(ev.id)}>
                  <Text style={styles.btnText}>Download QR</Text>
                </Pressable>
                <Pressable style={[styles.btn, styles.danger]} onPress={() => remove(ev.id)} disabled={deletingId===ev.id}>
                  <Text style={styles.btnText}>{deletingId===ev.id ? 'Deleting...' : 'Delete'}</Text>
                </Pressable>
              </View>

              {openEventIds.has(ev.id) && (
                <View style={styles.regsBox}>
                  {loadingEventId === ev.id ? (
                    <ActivityIndicator size="small" color="#64748b" />
                  ) : (
                    <>
                      {(!regsByEvent[ev.id] || regsByEvent[ev.id].length === 0) ? (
                        <Text style={styles.empty}>No registrations yet.</Text>
                      ) : (
                        <View style={{ gap: 8 }}>
                          {regsByEvent[ev.id].map(r => (
                            <View key={r.id} style={styles.regRow}>
                              <Text style={styles.regName}>{r.name}</Text>
                              <Text style={styles.regMeta}>{r.email}</Text>
                              <Text style={[styles.badge, r.checkedIn ? styles.badgeOk : styles.badgeMuted]}>
                                {r.checkedIn ? 'Checked In' : 'Not Checked In'}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <View style={{ marginTop: 12 }}>
                        <Text style={styles.label}>Send attendance CSV to (comma separated emails)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="dean@college.edu, hod@dept.edu"
                          placeholderTextColor="#9aa4b2"
                          value={sendTo[ev.id] || ''}
                          onChangeText={(t) => setSendTo(prev => ({ ...prev, [ev.id]: t }))}
                        />
                        <Pressable style={styles.primaryBtn} onPress={() => sendAttendance(ev.id)}>
                          <Text style={styles.primaryBtnText}>Send Attendance</Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              )}
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
  pageTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 14, padding: 14 },
  statLabel: { color: '#9aa4b2', marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 8 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 14, padding: 14, gap: 10 },
  eventName: { color: '#fff', fontWeight: '700' },
  meta: { color: '#9aa4b2' },
  posterWrap: { width: '100%', height: 160, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  poster: { width: '100%', height: '100%' },
  rowGap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btn: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 10 },
  btnText: { color: '#e5e7eb', fontWeight: '600' },
  danger: { borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  regsBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1f2937' },
  regRow: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 10, gap: 4 },
  regName: { color: '#fff', fontWeight: '700' },
  regMeta: { color: '#9aa4b2' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  badgeOk: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' },
  badgeMuted: { backgroundColor: 'rgba(100, 116, 139, 0.2)', borderColor: 'rgba(100, 116, 139, 0.3)', color: '#64748b' },
  label: { color: '#9aa4b2', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 10, color: '#e5e7eb', backgroundColor: '#0f172a', marginBottom: 8 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
