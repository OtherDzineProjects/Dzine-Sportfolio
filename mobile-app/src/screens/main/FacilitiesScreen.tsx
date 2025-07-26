import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Searchbar, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

const FacilitiesScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: facilities, isLoading, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const response = await api.get('/facilities');
      return response.data;
    },
  });

  const filteredFacilities = facilities?.filter((facility: any) => {
    return facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           facility.city.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search facilities..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        <ScrollView
          style={styles.facilitiesList}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          {filteredFacilities && filteredFacilities.length > 0 ? (
            filteredFacilities.map((facility: any) => (
              <Card key={facility.id} style={styles.facilityCard}>
                <Card.Content>
                  <View style={styles.facilityHeader}>
                    <Text style={[styles.facilityName, { color: theme.colors.onSurface }]}>
                      {facility.name}
                    </Text>
                    <Chip mode="outlined">
                      {facility.type}
                    </Chip>
                  </View>

                  <View style={styles.facilityDetails}>
                    <View style={styles.facilityInfo}>
                      <MaterialIcons name="location-on" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.facilityText, { color: theme.colors.onSurfaceVariant }]}>
                        {facility.city}, {facility.state}
                      </Text>
                    </View>
                    
                    {facility.capacity && (
                      <View style={styles.facilityInfo}>
                        <MaterialIcons name="people" size={16} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.facilityText, { color: theme.colors.onSurfaceVariant }]}>
                          Capacity: {facility.capacity}
                        </Text>
                      </View>
                    )}

                    {facility.hourlyRate && (
                      <View style={styles.facilityInfo}>
                        <MaterialIcons name="attach-money" size={16} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.facilityText, { color: theme.colors.onSurfaceVariant }]}>
                          ₹{facility.hourlyRate}/hour
                        </Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
                
                <Card.Actions>
                  <Button mode="outlined" compact>
                    View Details
                  </Button>
                  <Button mode="contained" compact>
                    Book Now
                  </Button>
                </Card.Actions>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="location-off" size={64} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No facilities found
              </Text>
            </View>
          )}
        </ScrollView>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  searchSection: { padding: 16 },
  searchbar: { elevation: 2 },
  facilitiesList: { flex: 1, paddingHorizontal: 16 },
  facilityCard: { marginBottom: 16, elevation: 2 },
  facilityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  facilityName: { fontSize: 18, fontWeight: '600', flex: 1 },
  facilityDetails: { gap: 6 },
  facilityInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  facilityText: { fontSize: 12 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 64 },
  emptyText: { fontSize: 18, fontWeight: '500', marginTop: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default FacilitiesScreen;