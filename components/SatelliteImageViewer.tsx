import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapPin, Satellite, Loader as Loader2, RefreshCw } from 'lucide-react-native';

interface SatelliteImageViewerProps {
  address?: string;
  onRoofDetected?: (dimensions: { width: number; height: number }) => void;
  visible: boolean;
}

export function SatelliteImageViewer({ address, onRoofDetected, visible }: SatelliteImageViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [roofAnalysis, setRoofAnalysis] = useState<{
    detected: boolean;
    dimensions?: { width: number; height: number };
    area?: number;
    roofType?: string;
  }>({ detected: false });

  const screenWidth = Dimensions.get('window').width - 32;

  useEffect(() => {
    if (visible && address) {
      loadSatelliteImage();
    }
  }, [visible, address]);

  const loadSatelliteImage = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // Simulate API call to Google Maps/Satellite imagery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate Google Maps embed URL
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&maptype=satellite&zoom=20`;
      
      setMapUrl(googleMapsUrl);
      
      // Simulate roof detection
      simulateRoofDetection();
    } catch (error) {
      Alert.alert('Error', 'Failed to load satellite imagery');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRoofDetection = () => {
    // Simulate AI roof detection results
    const mockDimensions = {
      width: 35 + Math.random() * 20, // 35-55 feet
      height: 25 + Math.random() * 15, // 25-40 feet
    };
    
    const mockArea = mockDimensions.width * mockDimensions.height;
    const roofTypes = ['Gable', 'Hip', 'Flat', 'Complex'];
    const mockRoofType = roofTypes[Math.floor(Math.random() * roofTypes.length)];

    setRoofAnalysis({
      detected: true,
      dimensions: mockDimensions,
      area: mockArea,
      roofType: mockRoofType,
    });

    // Notify parent component
    onRoofDetected?.(mockDimensions);
  };

  const refreshAnalysis = () => {
    if (address) {
      loadSatelliteImage();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Satellite size={24} color="#2563EB" />
          <Text style={styles.title}>Satellite Analysis</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={refreshAnalysis}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} color="#6B7280" />
          ) : (
            <RefreshCw size={16} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      {address && (
        <View style={styles.addressContainer}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.addressText}>{address}</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Loader2 size={32} color="#2563EB" />
            <Text style={styles.loadingText}>Analyzing satellite imagery...</Text>
            <Text style={styles.loadingSubtext}>Detecting roof boundaries and calculating dimensions</Text>
          </View>
        ) : mapUrl ? (
          <WebView
            source={{ uri: mapUrl }}
            style={styles.webview}
            onError={() => {
              // Fallback to static satellite view
              setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address || '')}&zoom=20&size=${Math.floor(screenWidth)}x300&maptype=satellite&key=YOUR_API_KEY`);
            }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Satellite size={48} color="#D1D5DB" />
            <Text style={styles.placeholderText}>Enter an address to view satellite imagery</Text>
          </View>
        )}
      </View>

      {roofAnalysis.detected && (
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>🏠 Roof Analysis Results</Text>
          
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisValue}>
                {roofAnalysis.dimensions?.width.toFixed(1)}×{roofAnalysis.dimensions?.height.toFixed(1)}ft
              </Text>
              <Text style={styles.analysisLabel}>Roof Dimensions</Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Text style={styles.analysisValue}>
                {roofAnalysis.area?.toFixed(0)} sq ft
              </Text>
              <Text style={styles.analysisLabel}>Total Area</Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Text style={styles.analysisValue}>{roofAnalysis.roofType}</Text>
              <Text style={styles.analysisLabel}>Roof Type</Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Text style={styles.analysisValue}>South</Text>
              <Text style={styles.analysisLabel}>Optimal Face</Text>
            </View>
          </View>

          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: '87%' }]} />
            </View>
            <Text style={styles.confidenceText}>87% Detection Confidence</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  analysisContainer: {
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analysisItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    fontFamily: 'Inter-Bold',
  },
  analysisLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#059669',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});