import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Searchbar, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

const EventsScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events');
      return response.data;
    },
  });

  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.primary;
      case 'ongoing':
        return theme.colors.secondary;
      case 'completed':
        return theme.colors.outline;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search events..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {statusFilters.map((filter) => (
              <Chip
                key={filter.value}
                mode={filterStatus === filter.value ? 'flat' : 'outlined'}
                selected={filterStatus === filter.value}
                onPress={() => setFilterStatus(filter.value)}
                style={styles.filterChip}
              >
                {filter.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.eventsList}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          {filteredEvents && filteredEvents.length > 0 ? (
            filteredEvents.map((event: any) => (
              <Card key={event.id} style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventName, { color: theme.colors.onSurface }]}>
                      {event.name}
                    </Text>
                    <Chip
                      mode="flat"
                      textStyle={{ color: getEventStatusColor(event.status) }}
                      style={{
                        backgroundColor: `${getEventStatusColor(event.status)}20`,
                      }}
                    >
                      {event.status}
                    </Chip>
                  </View>

                  <Text style={[styles.eventDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {event.description.length > 150 
                      ? `${event.description.substring(0, 150)}...`
                      : event.description
                    }
                  </Text>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventInfo}>
                      <MaterialIcons name="event" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.eventDate, { color: theme.colors.onSurfaceVariant }]}>
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <View style={styles.eventInfo}>
                      <MaterialIcons name="people" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.eventParticipants, { color: theme.colors.onSurfaceVariant }]}>
                        Max {event.maxParticipants} participants
                      </Text>
                    </View>

                    {event.entryFee && parseFloat(event.entryFee) > 0 && (
                      <View style={styles.eventInfo}>
                        <MaterialIcons name="attach-money" size={16} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.eventFee, { color: theme.colors.onSurfaceVariant }]}>
                          ₹{parseFloat(event.entryFee).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
                
                <Card.Actions>
                  <Button mode="outlined" compact>
                    View Details
                  </Button>
                  {event.status === 'upcoming' && (
                    <Button mode="contained" compact>
                      Register
                    </Button>
                  )}
                </Card.Actions>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={64} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No events found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery ? 'Try adjusting your search' : 'Check back later for new events'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Navigate to create event screen
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    gap: 12,
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventCard: {
    marginBottom: 16,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 6,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDate: {
    fontSize: 12,
  },
  eventParticipants: {
    fontSize: 12,
  },
  eventFee: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default EventsScreen;