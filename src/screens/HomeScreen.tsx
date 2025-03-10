import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { getTodaysDeals, getHotelById } from '../utils/mockData';
import { RootStackParamList, BreakfastDeal } from '../types';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';
import { getRandomBreakfastImage } from '../services/imageService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.l * 2;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [deals, setDeals] = useState<BreakfastDeal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch deals and add random images for some
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        // Get deals from our mock data
        const todaysDeals = getTodaysDeals();
        
        // For demo purposes, add a random deal with a dynamically fetched image
        if (todaysDeals.length > 0) {
          // Create a copy of the deals
          const updatedDeals = [...todaysDeals];
          
          // Add a new random deal with a dynamically fetched image
          const randomDeal: BreakfastDeal = {
            ...todaysDeals[0], // Clone an existing deal as a base
            id: 'dynamic-deal-1',
            title: 'Today\'s Special Breakfast',
            description: 'A special breakfast option featuring the chef\'s selection, fresh ingredients, and a seasonal twist.',
            price: 22.99,
            originalPrice: 36.99,
            image: getRandomBreakfastImage(), // Use dynamic image!
          };
          
          updatedDeals.push(randomDeal);
          setDeals(updatedDeals);
        } else {
          setDeals(todaysDeals);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Fallback to original deals if there's an error
        setDeals(getTodaysDeals());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeals();
  }, []);
  
  // Setting up swipe animation
  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        // Swipe threshold is 1/4 of card width
        const swipeThreshold = CARD_WIDTH / 4;
        
        if (gestureState.dx < -swipeThreshold) {
          // Swipe left - show next deal
          swipeLeft();
        } else if (gestureState.dx > swipeThreshold) {
          // Swipe right - show previous deal
          swipeRight();
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  const swipeLeft = () => {
    if (currentIndex < deals.length - 1) {
      Animated.timing(position, {
        toValue: { x: -CARD_WIDTH, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
        position.setValue({ x: 0, y: 0 });
      });
    } else {
      // Return to center if last deal
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        friction: 5,
      }).start();
    }
  };

  const swipeRight = () => {
    if (currentIndex > 0) {
      Animated.timing(position, {
        toValue: { x: CARD_WIDTH, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setCurrentIndex(currentIndex - 1);
        position.setValue({ x: 0, y: 0 });
      });
    } else {
      // Return to center if first deal
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        friction: 5,
      }).start();
    }
  };

  const renderDealCard = ({ item, index }: { item: BreakfastDeal; index: number }) => {
    // Only render current card
    if (index !== currentIndex) return null;
    
    const hotel = getHotelById(item.hotelId);
    const discountPercentage = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    // Rotate animation for swipe effect
    const rotate = position.x.interpolate({
      inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { rotate }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
        </View>
        
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
          placeholderContentFit="cover"
          placeholder={require('../../assets/placeholder-image.png')}
        />

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel?.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {hotel?.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              {item.currency} {item.originalPrice.toFixed(2)}
            </Text>
            <Text style={styles.price}>
              {item.currency} {item.price.toFixed(2)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('DealDetail', { dealId: item.id })}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading today's breakfast deals...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Swipe to discover today's breakfast deals at your hotels
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {deals.length > 0 ? (
          <FlatList
            data={deals}
            renderItem={renderDealCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noDealsContainer}>
            <Text style={styles.noDealsText}>
              No breakfast deals available for your booked hotels.
            </Text>
          </View>
        )}
      </View>

      {deals.length > 0 && (
        <View style={styles.pagination}>
          {deals.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('BookedHotels')}
        >
          <Text style={styles.footerButtonText}>Your Hotels</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.footerButtonText}>Profile</Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: borderRadius.l,
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hotelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  hotelName: {
    fontSize: typography.fontSizes.m,
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
  description: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    marginBottom: spacing.m,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  originalPrice: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: spacing.m,
  },
  price: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary,
  },
  detailButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
  },
  detailButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.m,
  },
  footerButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  footerButtonText: {
    color: colors.secondary,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.medium as any,
  },
  noDealsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
  },
  noDealsText: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textAlign: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    backgroundColor: colors.error,
    borderRadius: borderRadius.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    zIndex: 1,
  },
  discountText: {
    color: colors.white,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.bold as any,
  },
});

export default HomeScreen; 