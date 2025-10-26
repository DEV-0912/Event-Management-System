import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export default function CreateEventScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', date: '', venue: '', speaker: '', food: '', description: '' });
  const [poster, setPoster] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: '', type: 'text', options: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.8 });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      if (a.base64) setPoster(`data:${a.type || 'image/jpeg'};base64,${a.base64}`);
      else if (a.uri) setPoster(a.uri);
    }
  };

  const addField = () => {
    if (!newField.label.trim()) return;
    const field = {
      label: newField.label.trim(),
      type: newField.type,
      options: (newField.type === 'select' || newField.type === 'multiselect')
        ? newField.options.split(',').map(s => s.trim()).filter(Boolean)
        : []
    };
    setFields(prev => [...prev, field]);
    setNewField({ label: '', type: 'text', options: '' });
  };

  const removeField = (i) => setFields(prev => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!form.name || !form.date || !form.venue) {
      Alert.alert('Missing info', 'Name, date/time, and venue are required.');
      return;
    }
    setLoading(true);
    try {
      const formSchema = fields.map((f, idx) => ({ id: idx + 1, label: f.label, type: f.type, options: f.options?.length ? f.options : undefined }));
      await api.post('/api/events', { ...form, formSchema, poster });
      Alert.alert('Created', 'Event created successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Event</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} value={form.name} onChangeText={v => set('name', v)} placeholder="Event Name" placeholderTextColor="#9aa4b2" />
        <TextInput style={styles.input} value={form.date} onChangeText={v => set('date', v)} placeholder="Date & Time (YYYY-MM-DDTHH:mm)" placeholderTextColor="#9aa4b2" />
        <TextInput style={styles.input} value={form.venue} onChangeText={v => set('venue', v)} placeholder="Venue" placeholderTextColor="#9aa4b2" />
        <TextInput style={styles.input} value={form.speaker} onChangeText={v => set('speaker', v)} placeholder="Speaker (optional)" placeholderTextColor="#9aa4b2" />
        <TextInput style={styles.input} value={form.food} onChangeText={v => set('food', v)} placeholder="Food (optional)" placeholderTextColor="#9aa4b2" />
        <TextInput style={[styles.input, { height: 100 }]} value={form.description} onChangeText={v => set('description', v)} placeholder="Description" placeholderTextColor="#9aa4b2" multiline />

        <Pressable style={styles.btn} onPress={pickImage}><Text style={styles.btnText}>{poster ? 'Change Poster' : 'Pick Poster'}</Text></Pressable>
        {!!poster && (
          <View style={styles.posterWrap}>
            <Image source={{ uri: poster }} style={styles.poster} />
            <Pressable style={[styles.btn, styles.danger]} onPress={() => setPoster('')}><Text style={styles.btnText}>Remove</Text></Pressable>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Custom Registration Fields</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} value={newField.label} onChangeText={v => setNewField(s => ({ ...s, label: v }))} placeholder="Field Label" placeholderTextColor="#9aa4b2" />
        <TextInput style={styles.input} value={newField.type} onChangeText={v => setNewField(s => ({ ...s, type: v }))} placeholder="Type: text | select | multiselect | checkbox" placeholderTextColor="#9aa4b2" />
        {(newField.type === 'select' || newField.type === 'multiselect') && (
          <TextInput style={styles.input} value={newField.options} onChangeText={v => setNewField(s => ({ ...s, options: v }))} placeholder="Options (comma separated)" placeholderTextColor="#9aa4b2" />
        )}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={styles.btn} onPress={addField}><Text style={styles.btnText}>Add Field</Text></Pressable>
        </View>
        {fields.length > 0 && (
          <View style={{ gap: 8, marginTop: 8 }}>
            {fields.map((f, i) => (
              <View key={i} style={styles.fieldRow}>
                <Text style={styles.fieldText}>{f.label} — {f.type}{(f.type==='select'||f.type==='multiselect') && ` [${f.options.join(', ')}]`}</Text>
                <Pressable style={[styles.btn, styles.danger]} onPress={() => removeField(i)}><Text style={styles.btnText}>Remove</Text></Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable style={styles.primaryBtn} onPress={submit} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? 'Creating…' : 'Create Event'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  content: { padding: 20, gap: 12 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 12, color: '#e5e7eb', backgroundColor: '#0f172a' },
  btn: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: '#e5e7eb', fontWeight: '600' },
  danger: { borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  posterWrap: { gap: 8 },
  poster: { width: '100%', height: 180, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' }
});
