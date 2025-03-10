import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockUser, breakfastDeals } from '../utils/mockData';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  
  // Get user's favorite deals
  const favoriteDeals = breakfastDeals.filter(deal => 
    mockUser.favoriteDeals.includes(deal.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.profileInitials}>
              <Text style={styles.initialsText}>
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{mockUser.name}</Text>
              <Text style={styles.profileEmail}>{mockUser.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Personal Information</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Payment Methods</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('BookedHotels')}
            >
              <Text style={styles.menuItemText}>Booked Hotels</Text>
              <View style={styles.menuItemBadge}>
                <Text style={styles.menuItemBadgeText}>{mockUser.bookedHotels.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Breakfast Deals</Text>
          
          {favoriteDeals.length > 0 ? (
            <View style={styles.card}>
              {favoriteDeals.map((deal, index) => (
                <React.Fragment key={deal.id}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('DealDetail', { dealId: deal.id })}
                  >
                    <View>
                      <Text style={styles.menuItemText}>{deal.title}</Text>
                      <Text style={styles.menuItemSubtext}>
                        {deal.currency} {deal.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.menuItemArrow}>›</Text>
                  </TouchableOpacity>
                  
                  {index < favoriteDeals.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                You haven't saved any breakfast deals yet.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.emptyButtonText}>Browse Deals</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Dietary Preferences</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.menuItemText}>App Settings</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    backgroundColor: colors.white,
    ...shadows.small,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInitials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  initialsText: {
    color: colors.white,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
  },
  section: {
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold as any,
    color: colors.secondary,
    marginBottom: spacing.m,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  menuItemText: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  menuItemSubtext: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  menuItemArrow: {
    fontSize: typography.fontSizes.xl,
    color: colors.textLight,
  },
  menuItemBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.circle,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemBadgeText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold as any,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.l,
    alignItems: 'center',
    ...shadows.small,
  },
  emptyText: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  logoutButton: {
    margin: spacing.l,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    backgroundColor: colors.error,
    alignItems: 'center',
    ...shadows.small,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
});

export default ProfileScreen; 