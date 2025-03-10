import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { getDealById, getHotelById } from '../utils/mockData';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';

type DealDetailRouteProp = RouteProp<RootStackParamList, 'DealDetail'>;
type DealDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DealDetail'>;

const DealDetailScreen = () => {
  const route = useRoute<DealDetailRouteProp>();
  const navigation = useNavigation<DealDetailNavigationProp>();
  const { dealId } = route.params;
  
  // Get deal and hotel data
  const deal = getDealById(dealId);
  const hotel = deal ? getHotelById(deal.hotelId) : undefined;
  
  if (!deal || !hotel) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Deal not found</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.bookButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  // Calculate discount
  const discountPercentage = Math.round(
    ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: deal.image }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{deal.title}</Text>
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {hotel.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{deal.description}</Text>
          </View>
          
          {deal.ingredients && deal.ingredients.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              <View style={styles.tagContainer}>
                {deal.ingredients.map((item, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {deal.dietaryOptions && deal.dietaryOptions.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Dietary Options</Text>
              <View style={styles.tagContainer}>
                {deal.dietaryOptions.map((item, index) => (
                  <View key={index} style={[styles.tag, styles.dietaryTag]}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {deal.timeSlots && deal.timeSlots.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              <View style={styles.timeSlotContainer}>
                {deal.timeSlots.map((slot, index) => (
                  <TouchableOpacity key={index} style={styles.timeSlot}>
                    <Text style={styles.timeSlotText}>{slot}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.location}>{hotel.address}</Text>
          </View>
          
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Special Deal Price</Text>
              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>
                  {deal.currency} {deal.originalPrice.toFixed(2)}
                </Text>
                <Text style={styles.discountTag}>{discountPercentage}% OFF</Text>
              </View>
              <Text style={styles.price}>
                {deal.currency} {deal.price.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Reserve Now</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              • Deal available until {new Date(deal.availableUntil).toLocaleDateString()}
            </Text>
            <Text style={styles.noteText}>
              • Reservation can be cancelled up to 2 hours before the selected time slot
            </Text>
            <Text style={styles.noteText}>
              • Payment will be processed at the hotel
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  errorText: {
    fontSize: typography.fontSizes.l,
    color: colors.error,
    marginBottom: spacing.l,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  header: {
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hotelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotelName: {
    fontSize: typography.fontSizes.l,
    color: colors.secondary,
    fontWeight: typography.fontWeights.medium as any,
  },
  ratingContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.s,
  },
  rating: {
    color: colors.white,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.bold as any,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginVertical: spacing.s,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold as any,
    color: colors.secondary,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
    lineHeight: typography.lineHeights.m,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  dietaryTag: {
    backgroundColor: colors.primaryLight,
  },
  tagText: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  timeSlotText: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium as any,
  },
  location: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  priceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginVertical: spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.small,
  },
  priceLabel: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: spacing.s,
  },
  discountTag: {
    fontSize: typography.fontSizes.xs,
    color: colors.white,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.s,
  },
  price: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    ...shadows.small,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  noteCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginVertical: spacing.s,
  },
  noteText: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
});

export default DealDetailScreen; 