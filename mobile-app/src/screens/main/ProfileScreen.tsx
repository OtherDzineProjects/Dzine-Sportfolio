import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Avatar, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    { title: 'Edit Profile', icon: 'person', onPress: () => {} },
    { title: 'My Teams', icon: 'groups', onPress: () => {} },
    { title: 'Achievements', icon: 'emoji-events', onPress: () => {} },
    { title: 'Settings', icon: 'settings', onPress: () => {} },
    { title: 'Help & Support', icon: 'help', onPress: () => {} },
    { title: 'About', icon: 'info', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.firstName?.[0] || 'U'}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
                {user?.email}
              </Text>
              <Text style={[styles.userRole, { color: theme.colors.primary }]}>
                {user?.role}
              </Text>
            </View>
            <Button mode="outlined" compact onPress={() => {}}>
              Edit
            </Button>
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { flex: 1 }]}>
            <Card.Content style={styles.statContent}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                0
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Teams
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statCard, { flex: 1 }]}>
            <Card.Content style={styles.statContent}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                0
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Events
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statCard, { flex: 1 }]}>
            <Card.Content style={styles.statContent}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                0
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Achievements
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          <Card.Content style={styles.menuContent}>
            {menuItems.map((item, index) => (
              <View key={item.title}>
                <List.Item
                  title={item.title}
                  left={(props) => (
                    <MaterialIcons 
                      name={item.icon as any} 
                      size={24} 
                      color={theme.colors.onSurfaceVariant}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                  right={(props) => (
                    <MaterialIcons 
                      name="chevron-right" 
                      size={24} 
                      color={theme.colors.onSurfaceVariant} 
                    />
                  )}
                  onPress={item.onPress}
                  style={styles.menuItem}
                />
                {index < menuItems.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          contentStyle={styles.logoutButtonContent}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  menuCard: {
    elevation: 2,
  },
  menuContent: {
    padding: 0,
  },
  menuItem: {
    paddingVertical: 4,
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;