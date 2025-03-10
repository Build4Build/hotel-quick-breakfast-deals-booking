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
  ViewStyle,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList, BreakfastDeal, BookedHotel } from '../types';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';
import { getRandomBreakfastImage } from '../services/imageService';
import { getTodaysDeals, fetchDealById } from '../services/dealService';
import { fetchHotelById } from '../services/hotelService';
import ReservationModal from '../components/ReservationModal';
import PlaceholderImage from '../components/PlaceholderImage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.l * 2;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [deals, setDeals] = useState<BreakfastDeal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<BreakfastDeal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Record<string, BookedHotel>>({});
  const [dealImages, setDealImages] = useState<Record<string, string>>({});
  
  // Fetch deals and their images
  useEffect(() => {
    const fetchDealsAndImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const todaysDeals = await getTodaysDeals();
        setDeals(todaysDeals);

        // Fetch images for each deal
        const imagePromises = todaysDeals.map(async (deal) => {
          try {
            const image = await getRandomBreakfastImage();
            return [deal.id, image];
          } catch (error) {
            console.error(`Error fetching image for deal ${deal.id}:`, error);
            return [deal.id, deal.image]; // Use the deal's default image
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = Object.fromEntries(imageResults);
        setDealImages(imageMap);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setError('Unable to load breakfast deals. Please try again later.');
        // Fallback to mock data
        setDeals(require('../utils/mockData').getTodaysDeals());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDealsAndImages();
  }, []);
  
  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      const hotelPromises = deals.map(async (deal) => {
        const hotel = await fetchHotelById(deal.hotelId);
        if (hotel) {
          return [deal.hotelId, hotel];
        }
        return null;
      });

      const hotelResults = await Promise.all(hotelPromises);
      const hotelMap = Object.fromEntries(
        hotelResults.filter((result): result is [string, BookedHotel] => result !== null)
      );
      setHotels(hotelMap);
    };

    if (deals.length > 0) {
      fetchHotels();
    }
  }, [deals]);
  
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

  const handleReservePress = async (deal: BreakfastDeal) => {
    try {
      // Fetch the latest deal data before showing the modal
      const updatedDeal = await fetchDealById(deal.id);
      if (updatedDeal) {
        setSelectedDeal(updatedDeal);
        setIsReservationModalVisible(true);
      } else {
        Alert.alert('Error', 'This deal is no longer available.');
      }
    } catch (error) {
      console.error('Error fetching deal details:', error);
      Alert.alert('Error', 'Unable to load deal details. Please try again.');
    }
  };

  interface PlaceholderProps {
    style: ViewStyle;
  }

  const renderDealCard = ({ item, index }: { item: BreakfastDeal; index: number }) => {
    // Only render current card
    if (index !== currentIndex) return null;
    
    const hotel = hotels[item.hotelId];
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
          source={{ uri: dealImages[item.id] || item.image }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
          placeholder={({ style }: PlaceholderProps) => (
            <PlaceholderImage
              width={style.width as number}
              height={style.height as number}
            />
          )}
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
            style={styles.reserveButton}
            onPress={() => handleReservePress(item)}
          >
            <Text style={styles.reserveButtonText}>Reserve Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding the best breakfast deals for you...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setIsLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Swipe to discover exclusive breakfast deals at your booked hotels
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
              No breakfast deals available at your booked hotels right now.
              Please check back later for new offers.
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

      {selectedDeal && (
        <ReservationModal
          isVisible={isReservationModalVisible}
          onClose={() => {
            setIsReservationModalVisible(false);
            setSelectedDeal(null);
          }}
          deal={selectedDeal}
        />
      )}
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
  reserveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginTop: spacing.s,
  },
  reserveButtonText: {
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
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  errorText: {
    fontSize: typography.fontSizes.m,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
});

export default HomeScreen; 