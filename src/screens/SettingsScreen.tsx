import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../utils/theme';

const SettingsScreen = () => {
  // State for toggle switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dealAlertsEnabled, setDealAlertsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currencySelection, setCurrencySelection] = useState('USD');
  
  // Available currencies
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications from the app
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Deal Alerts</Text>
                <Text style={styles.settingDescription}>
                  Be notified about special breakfast deals
                </Text>
              </View>
              <Switch
                value={dealAlertsEnabled}
                onValueChange={setDealAlertsEnabled}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={dealAlertsEnabled ? colors.primary : colors.card}
                disabled={!notificationsEnabled}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Switch between light and dark themes
                </Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={darkModeEnabled ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>
                  Allow app to access your location
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={locationEnabled ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          
          <View style={styles.card}>
            <View style={styles.currencyContainer}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency}
                  style={[
                    styles.currencyOption,
                    currencySelection === currency && styles.currencyOptionSelected,
                  ]}
                  onPress={() => setCurrencySelection(currency)}
                >
                  <Text
                    style={[
                      styles.currencyText,
                      currencySelection === currency && styles.currencyTextSelected,
                    ]}
                  >
                    {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={styles.aboutItemText}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={styles.aboutItemText}>Terms of Service</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={styles.aboutItemText}>Contact Support</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.aboutItem}>
              <Text style={styles.aboutItemText}>Version</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear App Data</Text>
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
  section: {
    padding: spacing.l,
    paddingBottom: 0,
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
    marginBottom: spacing.l,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: spacing.m,
  },
  settingTitle: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
  },
  currencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.m,
  },
  currencyOption: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
    margin: spacing.xs,
  },
  currencyOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyText: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  currencyTextSelected: {
    color: colors.white,
    fontWeight: typography.fontWeights.semiBold as any,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  aboutItemText: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  versionText: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
  },
  clearButton: {
    margin: spacing.l,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    backgroundColor: colors.white,
    alignItems: 'center',
    ...shadows.small,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold as any,
  },
});

export default SettingsScreen; 