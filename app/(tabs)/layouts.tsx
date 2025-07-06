import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LayoutGrid as Layout, Sun, Zap, DollarSign } from 'lucide-react-native';

export default function LayoutsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solar Layouts</Text>
        <Text style={styles.headerSubtitle}>Visual design tool coming soon</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Layout size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Layout Generator</Text>
          </View>
          <Text style={styles.cardDescription}>
            Create visual solar panel layouts based on your conversations with SolarBot. 
            This feature will render optimized panel arrangements for your roof.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Sun size={24} color="#D97706" />
            <Text style={styles.cardTitle}>Sun Path Analysis</Text>
          </View>
          <Text style={styles.cardDescription}>
            Analyze sun exposure patterns throughout the day and seasons to optimize 
            panel placement and maximize energy production.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Zap size={24} color="#059669" />
            <Text style={styles.cardTitle}>Energy Modeling</Text>
          </View>
          <Text style={styles.cardDescription}>
            Calculate expected energy production based on your specific layout, 
            location, and system specifications.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <DollarSign size={24} color="#7C3AED" />
            <Text style={styles.cardTitle}>Cost Analysis</Text>
          </View>
          <Text style={styles.cardDescription}>
            Get detailed cost breakdowns and ROI calculations for your solar 
            installation project.
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