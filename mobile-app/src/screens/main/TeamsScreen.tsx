import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Searchbar, Chip, FAB, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

const TeamsScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('all');

  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  const { data: sportsCategories } = useQuery({
    queryKey: ['sports-categories'],
    queryFn: async () => {
      const response = await api.get('/sports-categories');
      return response.data;
    },
  });

  const filteredTeams = teams?.filter((team: any) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = filterSport === 'all' || team.sportCategoryId === parseInt(filterSport);
    return matchesSearch && matchesSport;
  });

  const sportFilters = [
    { value: 'all', label: 'All Sports' },
    ...(sportsCategories?.map((sport: any) => ({
      value: sport.id.toString(),
      label: sport.name,
    })) || []),
  ];

  const getSportName = (sportId: number) => {
    return sportsCategories?.find((sport: any) => sport.id === sportId)?.name || 'Unknown Sport';
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.secondary;
      case 'inactive':
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
            placeholder="Search teams..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {sportFilters.map((filter) => (
              <Chip
                key={filter.value}
                mode={filterSport === filter.value ? 'flat' : 'outlined'}
                selected={filterSport === filter.value}
                onPress={() => setFilterSport(filter.value)}
                style={styles.filterChip}
              >
                {filter.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Teams List */}
        <ScrollView
          style={styles.teamsList}
          refreshControl={<RefreshControl refreshing={teamsLoading} onRefresh={refetchTeams} />}
        >
          {filteredTeams && filteredTeams.length > 0 ? (
            filteredTeams.map((team: any) => (
              <Card key={team.id} style={styles.teamCard}>
                <Card.Content>
                  <View style={styles.teamHeader}>
                    <View style={styles.teamTitleSection}>
                      <Avatar.Text
                        size={48}
                        label={team.name.charAt(0)}
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <View style={styles.teamInfo}>
                        <Text style={[styles.teamName, { color: theme.colors.onSurface }]}>
                          {team.name}
                        </Text>
                        <Text style={[styles.sportName, { color: theme.colors.onSurfaceVariant }]}>
                          {getSportName(team.sportCategoryId)}
                        </Text>
                      </View>
                    </View>
                    <Chip
                      mode="flat"
                      textStyle={{ color: getTeamStatusColor(team.status) }}
                      style={{
                        backgroundColor: `${getTeamStatusColor(team.status)}20`,
                      }}
                    >
                      {team.status}
                    </Chip>
                  </View>

                  {team.description && (
                    <Text style={[styles.teamDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {team.description.length > 100 
                        ? `${team.description.substring(0, 100)}...`
                        : team.description
                      }
                    </Text>
                  )}

                  <View style={styles.teamDetails}>
                    <View style={styles.teamDetailItem}>
                      <MaterialIcons name="location-on" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.teamDetailText, { color: theme.colors.onSurfaceVariant }]}>
                        {team.homeVenue || 'No home venue'}
                      </Text>
                    </View>
                    
                    <View style={styles.teamDetailItem}>
                      <MaterialIcons name="calendar-today" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.teamDetailText, { color: theme.colors.onSurfaceVariant }]}>
                        Founded {team.foundedYear || 'Unknown'}
                      </Text>
                    </View>

                    <View style={styles.teamDetailItem}>
                      <MaterialIcons name="group" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.teamDetailText, { color: theme.colors.onSurfaceVariant }]}>
                        {team.teamType || 'Club'} Team
                      </Text>
                    </View>
                  </View>
                </Card.Content>
                
                <Card.Actions>
                  <Button mode="outlined" compact>
                    View Details
                  </Button>
                  <Button mode="contained" compact>
                    Join Team
                  </Button>
                </Card.Actions>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="groups" size={64} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No teams found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery ? 'Try adjusting your search' : 'Create a team to get started'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Navigate to create team screen
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
  teamsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teamCard: {
    marginBottom: 16,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teamTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
  },
  sportName: {
    fontSize: 14,
    marginTop: 2,
  },
  teamDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  teamDetails: {
    gap: 6,
  },
  teamDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamDetailText: {
    fontSize: 12,
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

export default TeamsScreen;