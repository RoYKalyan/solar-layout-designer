import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, Zap, DollarSign } from 'lucide-react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Performance insights and projections</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Zap size={20} color="#059669" />
            </View>
            <Text style={styles.statValue}>0 kWh</Text>
            <Text style={styles.statLabel}>Energy Production</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign size={20} color="#7C3AED" />
            </View>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Savings</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <BarChart3 size={20} color="#2563EB" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <BarChart3 size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Performance Dashboard</Text>
          </View>
          <Text style={styles.cardDescription}>
            Track your solar panel system's performance with real-time monitoring, 
            energy production graphs, and efficiency metrics.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={24} color="#D97706" />
            <Text style={styles.cardTitle}>ROI Tracking</Text>
          </View>
          <Text style={styles.cardDescription}>
            Monitor your return on investment with detailed financial analysis, 
            including payback period calculations and long-term projections.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Zap size={24} color="#059669" />
            <Text style={styles.cardTitle}>Energy Forecasting</Text>
          </View>
          <Text style={styles.cardDescription}>
            Predict future energy production based on weather patterns, seasonal 
            variations, and system performance data.
          </Text>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 0,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-SemiBold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});