import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const screen = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const isAuthed = !!user;
  const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
  const [ovLoading, setOvLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const { data } = await api.get('/api/events');
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadUserData = async () => {
      if (!isAuthed) return;
      if (isAdmin) {
        setOvLoading(true);
        try {
          const { data } = await api.get('/api/events/overview');
          if (!cancelled) setOverview(data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
        } catch {
          if (!cancelled) setOverview({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
        } finally {
          if (!cancelled) setOvLoading(false);
        }
      } else {
        setLoading(true);
        try {
          const { data } = await api.get('/api/registration/mine');
          if (!cancelled) setItems(Array.isArray(data) ? data : []);
        } catch {
          if (!cancelled) setItems([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    };
    loadUserData();
    return () => { cancelled = true; };
  }, [isAuthed, isAdmin]);

  const topItems = useMemo(() => items.slice(0, 3), [items]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Welcome to Event Hub</Text>
            <Text style={styles.heroSubtitle}>
              Plan, register, and manage campus events with ease. Discover amazing events and connect with your community.
            </Text>
            <View style={styles.heroActions}>
              <Pressable
                style={[styles.heroBtn, styles.heroBtnPrimary]}
                onPress={() => {
                  if (isAuthed) {
                    navigation?.navigate?.('Register');
                  }
                }}
              >
                <Text style={styles.heroBtnPrimaryText}>{isAuthed ? 'Browse & Register' : 'Browse Events'}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.heroImages}>
            <View style={styles.imageGrid}>
              <View style={styles.colLeft}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop' }}
                  style={styles.leftTall}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.colRight}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop' }}
                  style={styles.rightSmall}
                  resizeMode="cover"
                />
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?q=80&w=1200&auto=format&fit=crop' }}
                  style={styles.rightSmall}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {eventsLoading ? <Text style={styles.loadingText}>Loading...</Text> : null}
        </View>
        {(!eventsLoading && events.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No events available</Text>
            <Text style={styles.emptySubtitle}>Check back later for upcoming events</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.eventsScroll}>
            {events.map((ev, idx) => (
              <Pressable
                key={ev.id}
                style={styles.eventCardWide}
                onPress={() => navigation?.navigate?.('EventRegistration', { eventId: ev.id })}
              >
                <View style={styles.eventPoster}>
                  <View style={styles.badgeIndex}><Text style={styles.badgeIndexText}>#{idx + 1}</Text></View>
                  {!!ev.poster && (
                    <Image source={{ uri: String(ev.poster) }} style={styles.posterImg} resizeMode="cover" />
                  )}
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{ev.name}</Text>
                  <View style={styles.eventMetaRow}>
                    <Text style={styles.eventMeta}>{new Date(ev.date).toLocaleString()}</Text>
                    <Text style={styles.eventMetaDot}>•</Text>
                    <Text style={styles.eventMeta}>{ev.venue}</Text>
                  </View>
                  {!!ev.description && (
                    <Text style={styles.eventDesc} numberOfLines={2}>
                      {String(ev.description)}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* User Registered Events */}
      {isAuthed && !isAdmin && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Registered Events</Text>
            {loading ? <ActivityIndicator size="small" color="#64748b" /> : null}
          </View>
          {(topItems.length === 0 && !loading) ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No registrations yet</Text>
              <Text style={styles.emptySubtitle}>Start by browsing and registering for events</Text>
            </View>
          ) : (
            <View style={styles.eventsGrid}>
              {topItems.map(r => (
                <View key={r.id} style={styles.eventCard}>
                  <View style={styles.eventHeaderRow}>
                    <Text style={styles.eventName}>{r.eventName}</Text>
                    <View style={[styles.badge, r.checkedIn ? styles.badgeSuccess : styles.badgeMuted]}>
                      <Text style={[styles.badgeText, r.checkedIn ? styles.badgeSuccessText : styles.badgeMutedText]}>
                        {r.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.eventDetailsCol}>
                    <Text style={styles.detailItem}>{new Date(r.eventDate).toLocaleString()}</Text>
                    <Text style={styles.detailItem}>{r.eventVenue}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {topItems.length > 0 && (
            <View style={styles.sectionActions}> 
              <Pressable style={styles.viewAllBtn} onPress={() => navigation?.navigate?.('Profile')}> 
                <Text style={styles.viewAllBtnText}>View All Events</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Admin Overview */}
      {isAuthed && isAdmin && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Admin Overview</Text>
            {ovLoading ? <ActivityIndicator size="small" color="#64748b" /> : null}
          </View>
          <View style={styles.eventsGrid}>
            <View style={styles.eventCard}><Text style={styles.eventName}>My Events</Text><Text style={styles.detailItem}>Total: {overview.totalEvents}</Text></View>
            <View style={styles.eventCard}><Text style={styles.eventName}>Registrations</Text><Text style={styles.detailItem}>Total: {overview.totalRegistrations}</Text></View>
            <View style={styles.eventCard}><Text style={styles.eventName}>Checked-In</Text><Text style={styles.detailItem}>Total: {overview.totalCheckedIn}</Text></View>
          </View>
          <View style={[styles.sectionActions, { marginTop: 12 }]}>
            <Pressable style={styles.viewAllBtn} onPress={() => navigation?.navigate?.('AdminDashboard')}><Text style={styles.viewAllBtnText}>Go to Dashboard</Text></Pressable>
          </View>
          <View style={[styles.sectionActions, { marginTop: 12 }]}> 
            <ScrollView horizontal contentContainerStyle={{ gap: 12 }} showsHorizontalScrollIndicator={false}>
              <Pressable style={styles.viewAllBtn} onPress={() => navigation?.navigate?.('CreateEvent')}><Text style={styles.viewAllBtnText}>Create Event</Text></Pressable>
              <Pressable style={styles.viewAllBtn} onPress={() => navigation?.navigate?.('AdminDashboard')}><Text style={styles.viewAllBtnText}>Check-In</Text></Pressable>
              <Pressable style={styles.viewAllBtn} onPress={() => navigation?.navigate?.('AdminDashboard')}><Text style={styles.viewAllBtnText}>Manage Ads</Text></Pressable>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Features Section */}
      <View style={styles.section}>
        <View style={[styles.sectionHeaderRow, { justifyContent: 'center', flexDirection: 'column' }]}> 
          <Text style={styles.featuresTitle}>Why Choose Event Hub?</Text>
          <Text style={styles.featuresSubtitle}>Everything you need for seamless event management</Text>
        </View>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureCardTitle}>For Students</Text>
            <Text style={styles.featureCardText}>Discover upcoming events and register in seconds. Access your QR codes in My Events for quick check-in.</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureCardTitle}>For Admins</Text>
            <Text style={styles.featureCardText}>Create events, manage registrations, check-in attendees, and manage promotional banners with ease.</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureCardTitle}>Fast Check-In</Text>
            <Text style={styles.featureCardText}>QR-based entry system for a quick and seamless experience at the venue.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10' },
  containerContent: { padding: 20 },

  // Hero
  heroSection: { marginVertical: 24 },
  heroContent: { flexDirection: screen.width < 768 ? 'column' : 'row', gap: 24, alignItems: 'center' },
  heroText: { flex: 1, gap: 16 },
  heroTitle: { fontSize: 36, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: 16, color: '#9aa4b2' },
  heroActions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  heroBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  heroBtnPrimary: { backgroundColor: '#4f46e5' },
  heroBtnSecondary: { backgroundColor: '#1f2937', borderWidth: 1, borderColor: '#334155' },
  heroBtnPrimaryText: { color: '#fff', fontWeight: '700' },
  heroBtnSecondaryText: { color: '#e5e7eb', fontWeight: '700' },

  heroImages: { flex: 1, width: '100%' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colLeft: { flex: 1 },
  colRight: { width: screen.width < 768 ? 150 : 220, gap: 12, marginLeft: 12 },
  leftTall: { width: '100%', height: screen.width < 480 ? 280 : 360, borderRadius: 16, borderWidth: 1, borderColor: '#222', backgroundColor: '#111' },
  rightSmall: { width: '100%', height: screen.width < 480 ? 120 : 160, borderRadius: 16, borderWidth: 1, borderColor: '#222', backgroundColor: '#111' },

  // Sections
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  loadingText: { color: '#9aa4b2' },

  // Events horizontal
  eventsScroll: { paddingVertical: 8, gap: 12 },
  eventCardWide: { width: 320, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 14, overflow: 'hidden', marginRight: 12 },
  eventPoster: { width: '100%', height: 160, backgroundColor: '#0f172a' },
  posterImg: { width: '100%', height: '100%' },
  badgeIndex: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 2 },
  badgeIndexText: { color: '#fff', fontSize: 12 },
  eventInfo: { padding: 12, gap: 6 },
  eventTitle: { color: '#fff', fontWeight: '700' },
  eventMetaRow: { flexDirection: 'row', gap: 8 },
  eventMeta: { color: '#9aa4b2' },
  eventMetaDot: { color: '#9aa4b2' },
  eventDesc: { color: '#9aa4b2' },

  // User events grid
  sectionCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: '#1f2937', borderRadius: 20, padding: 16, marginBottom: 24 },
  eventsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  eventCard: { flexBasis: '48%', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: '#1f2937', borderRadius: 12, padding: 12 },
  eventHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventName: { color: '#fff', fontWeight: '600', fontSize: 16 },
  eventDetailsCol: { gap: 4 },
  detailItem: { color: '#9aa4b2' },

  sectionActions: { alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  viewAllBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 10 },
  viewAllBtnText: { color: '#e5e7eb', fontWeight: '600' },

  // Badges
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.3)' },
  badgeSuccessText: { color: '#22c55e' },
  badgeMuted: { backgroundColor: 'rgba(100, 116, 139, 0.2)', borderColor: 'rgba(100, 116, 139, 0.3)' },
  badgeMutedText: { color: '#64748b' },

  // Features
  featuresTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  featuresSubtitle: { color: '#9aa4b2', marginTop: 4 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  featureCard: { flexBasis: '48%', backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 16 },
  featureCardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  featureCardText: { color: '#9aa4b2' },
});
