import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventRegistrationScreen({ route, navigation }) {
  const { eventId, event: initialEvent } = route.params || {};
  const [event, setEvent] = useState(initialEvent || null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [form, setForm] = useState({ name: '', email: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [schema, setSchema] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [myRegs, setMyRegs] = useState([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        // If we already have the full event from navigation, use it immediately and try refresh in background
        if (initialEvent && !eventId) {
          setEvent(initialEvent);
          return setLoading(false);
        }
        const { data } = await api.get(`/api/events/${eventId}`);
        if (!active) return;
        setEvent(data || null);
      } catch {
        // Fallback to event passed via navigation
        if (active) setEvent(prev => prev || initialEvent || null);
      } finally {
        if (active) setLoading(false);
      }
    };
    if (eventId || initialEvent) load();
    return () => { active = false; };
  }, [eventId]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const onSubmit = async () => {
    if (isAdmin) {
      Alert.alert('Admins cannot register', 'Use the admin dashboard to manage events and share registration links.');
      return;
    }
    if (alreadyRegistered) {
      Alert.alert('Already registered', 'You have already registered for this event.');
      return;
    }
    if (!form.name || !form.email) {
      Alert.alert('Missing info', 'Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { name: form.name, email: form.email, contact: form.contact, eventId, answers };
      const { data } = await api.post('/api/registration', payload);
      if (data?.registration) {
        Alert.alert('Registered', 'Registration successful! A QR has been emailed to you.');
        navigation.replace('Home');
      } else {
        Alert.alert('Notice', 'Submitted.');
      }
    } catch (e) {
      const msg = e?.response?.data?.error || 'Registration failed';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#64748b" /></View>
    );
  }

  if (!event && !loading) {
    return (
      <View style={styles.container}><Text style={styles.empty}>Event not found.</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Register: {event.name}</Text>
      <Text style={styles.subtitle}>{new Date(event.date).toLocaleString()} · {event.venue}</Text>

      {/* Event details toggle */}
      <View style={styles.card}>
        <Pressable style={styles.toggleRow} onPress={() => setShowDetails(v => !v)}>
          <Text style={styles.sectionTitle}>{showDetails ? 'Hide Details' : 'Show Details'}</Text>
        </Pressable>
        {showDetails && (
          <View style={{ gap: 6 }}>
            {event?.speaker ? <Text style={styles.meta}>Speaker: {event.speaker}</Text> : null}
            {event?.food ? <Text style={styles.meta}>Food: {event.food}</Text> : null}
            {event?.description ? <Text style={styles.meta}>{String(event.description)}</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <TextInput style={styles.input} value={form.name} onChangeText={v => set('name', v)} placeholder="Full Name" placeholderTextColor="#9aa4b2" editable={!user} />
        <TextInput style={styles.input} value={form.email} onChangeText={v => set('email', v)} placeholder="Email" placeholderTextColor="#9aa4b2" autoCapitalize="none" keyboardType="email-address" editable={!user} />
        <TextInput style={styles.input} value={form.contact} onChangeText={v => set('contact', v)} placeholder="Contact (optional)" placeholderTextColor="#9aa4b2" keyboardType="phone-pad" />

        {/* Dynamic additional fields from event.formSchema */}
        {schema.length > 0 && (
          <View style={{ gap: 10 }}>
            {schema.map((f) => (
              <View key={String(f.id || f.label)}>
                {f.type === 'text' && (
                  <View>
                    <Text style={styles.label}>{f.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={String(answers[f.label] || '')}
                      onChangeText={(v) => setAnswer(f.label, v)}
                      placeholder={f.placeholder || f.label}
                      placeholderTextColor="#9aa4b2"
                    />
                  </View>
                )}
                {f.type === 'select' && Array.isArray(f.options) && (
                  <View>
                    <Text style={styles.label}>{f.label}</Text>
                    <View style={styles.chipsRow}>
                      {f.options.map(opt => {
                        const sel = String(answers[f.label] || '') === String(opt);
                        return (
                          <Pressable key={String(opt)} style={[styles.chip, sel ? styles.chipActive : null]} onPress={() => setAnswer(f.label, opt)}>
                            <Text style={[styles.chipText, sel ? styles.chipTextActive : null]}>{String(opt)}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </View>
                )}
                {f.type === 'multiselect' && Array.isArray(f.options) && (
                  <View>
                    <Text style={styles.label}>{f.label}</Text>
                    <View style={styles.chipsRow}>
                      {f.options.map(opt => {
                        const vals = Array.isArray(answers[f.label]) ? answers[f.label] : [];
                        const sel = vals.includes(opt);
                        return (
                          <Pressable
                            key={String(opt)}
                            style={[styles.chip, sel ? styles.chipActive : null]}
                            onPress={() => {
                              const set = new Set(vals);
                              if (sel) set.delete(opt); else set.add(opt);
                              setAnswer(f.label, Array.from(set));
                            }}
                          >
                            <Text style={[styles.chipText, sel ? styles.chipTextActive : null]}>{String(opt)}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </View>
                )}
                {f.type === 'checkbox' && (
                  <Pressable
                    style={[styles.checkboxRow]}
                    onPress={() => setAnswer(f.label, !answers[f.label])}
                  >
                    <View style={[styles.checkboxBox, answers[f.label] ? styles.checkboxChecked : null]} />
                    <Text style={styles.checkboxLabel}>{f.label}</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        {alreadyRegistered && (
          <View style={[styles.alert, styles.alertInfo]}>
            <Text style={styles.alertText}>You have already registered for this event.</Text>
          </View>
        )}

        <Pressable style={styles.primaryBtn} onPress={onSubmit} disabled={submitting || alreadyRegistered}><Text style={styles.btnText}>{submitting ? 'Registering...' : (alreadyRegistered ? 'Already Registered' : 'Register')}</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#9aa4b2', marginTop: 4, marginBottom: 12 },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 16, gap: 12 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#9aa4b2' },
  input: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 12, color: '#e5e7eb', backgroundColor: '#0f172a' },
  label: { color: '#9aa4b2', marginBottom: 6, marginTop: 8 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#9aa4b2', padding: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  checkboxBox: { width: 18, height: 18, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#0f172a' },
  checkboxChecked: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  checkboxLabel: { color: '#e5e7eb' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0f172a' },
  chipActive: { backgroundColor: 'rgba(79,70,229,0.15)', borderColor: '#4f46e5' },
  chipText: { color: '#9aa4b2' },
  chipTextActive: { color: '#c7d2fe', fontWeight: '700' },
  alert: { borderRadius: 10, padding: 10, borderWidth: 1 },
  alertInfo: { backgroundColor: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.28)' },
});
