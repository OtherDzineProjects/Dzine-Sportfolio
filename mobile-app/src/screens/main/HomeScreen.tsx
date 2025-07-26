import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Avatar, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events');
      return response.data;
    },
  });

  const { data: liveMatches, isLoading: matchesLoading, refetch: refetchMatches } = useQuery({
    queryKey: ['matches', 'live'],
    queryFn: async () => {
      const response = await api.get('/matches/live');
      return response.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data.slice(0, 3); // Show top 3 teams
    },
  });

  const onRefresh = () => {
    refetchEvents();
    refetchMatches();
    refetchTeams();
  };

  const isLoading = eventsLoading || matchesLoading || teamsLoading;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={48}
              label={user?.firstName?.[0] || 'U'}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.userText}>
              <Text style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
                Welcome back,
              </Text>
              <Text style={[styles.userName, { color: theme.colors.onBackground }]}>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
          </View>
          <Chip mode="outlined" compact>
            {user?.role}
          </Chip>
        </View>

        {/* Live Matches */}
        <Card style={styles.card}>
          <Card.Title
            title="Live Matches"
            left={(props) => <MaterialIcons name="sports-score" size={24} color={theme.colors.primary} />}
          />
          <Card.Content>
            {liveMatches && liveMatches.length > 0 ? (
              liveMatches.map((match: any) => (
                <View key={match.id} style={styles.matchItem}>
                  <View style={styles.matchTeams}>
                    <Text style={[styles.teamName, { color: theme.colors.onSurface }]}>
                      Team {match.homeTeamId}
                    </Text>
                    <View style={styles.score}>
                      <Text style={[styles.scoreText, { color: theme.colors.primary }]}>
                        {match.homeScore} - {match.awayScore}
                      </Text>
                    </View>
                    <Text style={[styles.teamName, { color: theme.colors.onSurface }]}>
                      Team {match.awayTeamId}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    style={{ backgroundColor: theme.colors.secondaryContainer }}
                  >
                    {match.status.toUpperCase()}
                  </Chip>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No live matches at the moment
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Upcoming Events */}
        <Card style={styles.card}>
          <Card.Title
            title="Upcoming Events"
            left={(props) => <MaterialIcons name="event" size={24} color={theme.colors.primary} />}
            right={(props) => <Button mode="text" compact>View All</Button>}
          />
          <Card.Content>
            {events && events.length > 0 ? (
              events.slice(0, 2).map((event: any) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: theme.colors.onSurface }]}>
                      {event.name}
                    </Text>
                    <Text style={[styles.eventDate, { color: theme.colors.onSurfaceVariant }]}>
                      {new Date(event.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    style={{ backgroundColor: theme.colors.tertiaryContainer }}
                  >
                    {event.status}
                  </Chip>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No upcoming events
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="account-group"
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
              >
                My Teams
              </Button>
              <Button
                mode="contained"
                icon="calendar-plus"
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
              >
                Create Event
              </Button>
              <Button
                mode="contained"
                icon="map-marker"
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
              >
                Find Facilities
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Teams */}
        {teams && teams.length > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="Your Teams"
              right={(props) => <Button mode="text" compact>View All</Button>}
            />
            <Card.Content>
              {teams.map((team: any) => (
                <View key={team.id} style={styles.teamItem}>
                  <View style={styles.teamInfo}>
                    <Text style={[styles.teamName, { color: theme.colors.onSurface }]}>
                      {team.name}
                    </Text>
                    <Text style={[styles.teamDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {team.description}
                    </Text>
                  </View>
                  <Chip mode="outlined">
                    {team.status}
                  </Chip>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    elevation: 2,
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  score: {
    paddingHorizontal: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDate: {
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  actionButtonContent: {
    paddingVertical: 4,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  teamInfo: {
    flex: 1,
  },
  teamDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 16,
  },
});

export default HomeScreen;