import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../utils/theme';

interface PlaceholderImageProps {
  width: number;
  height: number;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ width, height }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🍳</Text>
      </View>
      <Text style={styles.text}>Loading breakfast deal...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 48,
  },
  text: {
    color: colors.textLight,
    fontSize: typography.fontSizes.m,
    textAlign: 'center',
  },
});

export default PlaceholderImage; 