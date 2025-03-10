import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { bookedHotels } from '../utils/mockData';
import { RootStackParamList, BookedHotel } from '../types';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';

type BookedHotelsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookedHotels'>;

const BookedHotelsScreen = () => {
  const navigation = useNavigation<BookedHotelsNavigationProp>();

  const renderHotelItem = ({ item }: { item: BookedHotel }) => {
    const checkInDate = new Date(item.checkInDate);
    const checkOutDate = new Date(item.checkOutDate);
    
    // Format dates in a user-friendly way
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    
    return (
      <View style={styles.hotelCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.hotelImage}
          contentFit="cover"
          transition={300}
        />
        
        <View style={styles.hotelContent}>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <Text style={styles.hotelAddress} numberOfLines={1}>
            {item.address}
          </Text>
          
          <View style={styles.stayDetails}>
            <View style={styles.stayDetail}>
              <Text style={styles.stayDetailLabel}>Check In</Text>
              <Text style={styles.stayDetailValue}>{formatDate(checkInDate)}</Text>
            </View>
            
            <View style={styles.stayDetail}>
              <Text style={styles.stayDetailLabel}>Check Out</Text>
              <Text style={styles.stayDetailValue}>{formatDate(checkOutDate)}</Text>
            </View>
          </View>
          
          <View style={styles.stayDetails}>
            <View style={styles.stayDetail}>
              <Text style={styles.stayDetailLabel}>Room Type</Text>
              <Text style={styles.stayDetailValue}>{item.roomType}</Text>
            </View>
            
            <View style={styles.stayDetail}>
              <Text style={styles.stayDetailLabel}>Guests</Text>
              <Text style={styles.stayDetailValue}>{item.guests}</Text>
            </View>
          </View>
          
          <View style={styles.bookingReference}>
            <Text style={styles.bookingReferenceLabel}>Booking Reference</Text>
            <Text style={styles.bookingReferenceValue}>{item.bookingReference}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Your booked hotels with available breakfast deals
        </Text>
      </View>

      {bookedHotels.length > 0 ? (
        <FlatList
          data={bookedHotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any booked hotels yet.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.footerButtonText}>View Breakfast Deals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  listContent: {
    padding: spacing.l,
  },
  hotelCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    marginBottom: spacing.l,
    ...shadows.medium,
  },
  hotelImage: {
    width: '100%',
    height: 180,
  },
  hotelContent: {
    padding: spacing.m,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hotelName: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.s,
  },
  ratingText: {
    color: colors.white,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.bold as any,
  },
  hotelAddress: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    marginBottom: spacing.m,
  },
  stayDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  stayDetail: {
    flex: 1,
  },
  stayDetailLabel: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  stayDetailValue: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
    fontWeight: typography.fontWeights.medium as any,
  },
  bookingReference: {
    marginTop: spacing.s,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookingReferenceLabel: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  bookingReferenceValue: {
    fontSize: typography.fontSizes.m,
    color: colors.secondary,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  emptyText: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.m,
  },
  footerButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    ...shadows.small,
  },
  footerButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
});

export default BookedHotelsScreen; 