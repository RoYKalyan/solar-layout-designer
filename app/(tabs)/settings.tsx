import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { Settings, Volume2, Mic, Bell, Shield, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your SolarBot experience</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice & Audio</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Volume2 size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Speech Responses</Text>
                <Text style={styles.settingDescription}>
                  Enable text-to-speech for AI responses
                </Text>
              </View>
            </View>
            <Switch
              value={speechEnabled}
              onValueChange={setSpeechEnabled}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={speechEnabled ? '#2563EB' : '#6B7280'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Mic size={20} color="#059669" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Voice Input</Text>
                <Text style={styles.settingDescription}>
                  Use voice commands and speech-to-text
                </Text>
              </View>
            </View>
            <Switch
              value={voiceInputEnabled}
              onValueChange={setVoiceInputEnabled}
              trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
              thumbColor={voiceInputEnabled ? '#059669' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Bell size={20} color="#D97706" />
              </View>
              <View>
                <Text style={styles.settingTitle}>System Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive updates about your solar projects
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#FCD34D' }}
              thumbColor={notificationsEnabled ? '#D97706' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Shield size={20} color="#7C3AED" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>
                  Manage your data and privacy preferences
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Info size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.settingTitle}>App Information</Text>
                <Text style={styles.settingDescription}>
                  Version 1.0.0 - AI-Powered Solar Design Assistant
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.featureSectionTitle}>🚀 New Features</Text>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Voice-Enabled Conversations</Text>
            <Text style={styles.featureDescription}>
              Now you can speak directly to SolarBot! Use voice input to describe your property, 
              ask questions about solar installations, and get spoken responses back.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Automated Roof Analysis</Text>
            <Text style={styles.featureDescription}>
              Coming soon: AI-powered roof analysis from satellite imagery, automatic dimension 
              extraction, and optimized panel placement recommendations.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontFamily: 'Inter-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  featureSection: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  featureSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});