import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type WelcomeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>
              SF
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            Sportfolio
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Comprehensive Sports Management Platform
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
            ⚽ Manage teams and athletes
          </Text>
          <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
            🏆 Track live matches and scores
          </Text>
          <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
            📊 Analyze performance statistics
          </Text>
          <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
            🏟️ Find and book facilities
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Signup')}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            Create Account
          </Button>
        </View>
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
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresContainer: {
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    borderRadius: 8,
  },
  secondaryButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default WelcomeScreen;