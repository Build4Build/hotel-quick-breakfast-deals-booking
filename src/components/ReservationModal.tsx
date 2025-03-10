import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BreakfastDeal } from '../types';
import { createReservation, isTimeSlotAvailable } from '../services/reservationService';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

interface ReservationModalProps {
  isVisible: boolean;
  onClose: () => void;
  deal: BreakfastDeal;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isVisible,
  onClose,
  deal,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReservation = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    const guests = parseInt(numberOfGuests, 10);
    if (isNaN(guests) || guests < 1) {
      Alert.alert('Error', 'Please enter a valid number of guests');
      return;
    }

    setIsLoading(true);
    try {
      // Check if time slot is available
      const isAvailable = await isTimeSlotAvailable(
        deal.id,
        selectedTimeSlot,
        new Date().toISOString()
      );

      if (!isAvailable) {
        Alert.alert('Error', 'This time slot is no longer available');
        return;
      }

      // Create reservation
      const reservation = await createReservation(
        deal,
        selectedTimeSlot,
        guests,
        specialRequests
      );

      Alert.alert(
        'Success',
        'Your breakfast reservation has been confirmed!',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Reserve Breakfast</Text>
            <Text style={styles.dealTitle}>{deal.title}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Time Slot</Text>
              <View style={styles.timeSlots}>
                {deal.timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlot === slot && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setSelectedTimeSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTimeSlot === slot && styles.selectedTimeSlotText,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Number of Guests</Text>
              <TextInput
                style={styles.input}
                value={numberOfGuests}
                onChangeText={setNumberOfGuests}
                keyboardType="number-pad"
                placeholder="Enter number of guests"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Requests</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Any dietary requirements or special requests?"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Total Price:</Text>
              <Text style={styles.priceValue}>
                {deal.currency} {(deal.price * parseInt(numberOfGuests || '0', 10)).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.reserveButton}
              onPress={handleReservation}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.reserveButtonText}>Confirm Reservation</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.l,
    borderTopRightRadius: borderRadius.l,
    padding: spacing.l,
    maxHeight: '90%',
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    marginBottom: spacing.m,
    color: colors.text,
  },
  dealTitle: {
    fontSize: typography.fontSizes.l,
    color: colors.secondary,
    marginBottom: spacing.l,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
    marginBottom: spacing.s,
    color: colors.text,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  timeSlot: {
    padding: spacing.m,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
    margin: spacing.xs,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    color: colors.text,
    fontSize: typography.fontSizes.m,
  },
  selectedTimeSlotText: {
    color: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    fontSize: typography.fontSizes.m,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  priceLabel: {
    fontSize: typography.fontSizes.l,
    color: colors.text,
  },
  priceValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary,
  },
  reserveButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  reserveButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  cancelButton: {
    padding: spacing.m,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textLight,
    fontSize: typography.fontSizes.m,
  },
}); 