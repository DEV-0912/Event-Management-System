import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import EventRegistrationScreen from '../screens/EventRegistrationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import CheckInScreen from '../screens/CheckInScreen';
import EventsScreen from '../screens/EventsScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerContent(props) {
  const { signOut, user } = useAuth();
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <React.Fragment>
        <div style={{ padding: 16, borderBottom: '1px solid #1f2937', background: '#0b0c10' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 9999, background: '#111827', display: 'grid', placeItems: 'center', border: '1px solid #1f2937', color: '#fff', fontWeight: 700 }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{user?.name || 'User'}</span>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{user?.email || ''}</span>
            </div>
          </div>
        </div>
      </React.Fragment>
      <DrawerItemList {...props} />
      <DrawerItem
        label={user ? 'Logout' : 'Login'}
        onPress={() => {
          if (user) signOut();
          props.navigation.closeDrawer();
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function AppNavigator() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (user) {
    return (
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: '#0b0c10' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: () => (
            <Pressable onPress={() => navigation.toggleDrawer()} style={{ paddingHorizontal: 12 }}>
              <Text style={{ fontSize: 22, color: '#fff' }}>☰</Text>
            </Pressable>
          ),
          drawerStyle: { backgroundColor: '#0b0c10', width: 280 },
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: '#cbd5e1',
          drawerActiveBackgroundColor: 'rgba(255,255,255,0.08)',
          drawerLabelStyle: { fontWeight: '600' },
        })}
        drawerContent={(p) => <DrawerContent {...p} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        {!isAdmin ? (
          <Drawer.Screen name="Register" component={EventsScreen} />
        ) : null}
        {isAdmin ? (
          <>
            <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Drawer.Screen name="CreateEvent" component={CreateEventScreen} />
            <Drawer.Screen name="CheckIn" component={CheckInScreen} />
          </>
        ) : null}
        {/* Hidden from drawer but available for navigation */}
        <Drawer.Screen name="EventDetails" component={EventDetailsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="EventRegistration" component={EventRegistrationScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer.Navigator>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
