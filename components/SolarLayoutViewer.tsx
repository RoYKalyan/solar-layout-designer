import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Svg, Rect, Circle, Text as SvgText, G } from 'react-native-svg';
import { Sun, Zap, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react-native';

interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  watts: number;
  efficiency: number;
}

interface SolarLayoutViewerProps {
  roofDimensions?: {
    width: number;
    height: number;
  };
  panelCount?: number;
  panelWatts?: number;
  orientation?: 'portrait' | 'landscape';
  visible: boolean;
}

export function SolarLayoutViewer({ 
  roofDimensions = { width: 40, height: 30 }, 
  panelCount = 20,
  panelWatts = 400,
  orientation = 'landscape',
  visible 
}: SolarLayoutViewerProps) {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [zoom, setZoom] = useState(1);
  const [totalWatts, setTotalWatts] = useState(0);
  const screenWidth = Dimensions.get('window').width - 32;
  const screenHeight = 300;

  // Panel dimensions in feet
  const panelWidth = orientation === 'landscape' ? 6.5 : 3.25;
  const panelHeight = orientation === 'landscape' ? 3.25 : 6.5;

  useEffect(() => {
    if (visible && panelCount > 0) {
      generateOptimalLayout();
    }
  }, [visible, panelCount, orientation, roofDimensions]);

  const generateOptimalLayout = () => {
    const newPanels: Panel[] = [];
    const { width: roofWidth, height: roofHeight } = roofDimensions;
    
    // Calculate how many panels fit in each direction
    const panelsPerRow = Math.floor((roofWidth - 2) / (panelWidth + 0.5)); // 2ft setback, 0.5ft spacing
    const panelsPerCol = Math.floor((roofHeight - 2) / (panelHeight + 0.5));
    const maxPanels = panelsPerRow * panelsPerCol;
    const actualPanelCount = Math.min(panelCount, maxPanels);

    // Calculate starting position for centering
    const totalPanelWidth = panelsPerRow * panelWidth + (panelsPerRow - 1) * 0.5;
    const totalPanelHeight = Math.ceil(actualPanelCount / panelsPerRow) * panelHeight + 
                            (Math.ceil(actualPanelCount / panelsPerRow) - 1) * 0.5;
    
    const startX = (roofWidth - totalPanelWidth) / 2;
    const startY = (roofHeight - totalPanelHeight) / 2;

    // Generate panel positions
    for (let i = 0; i < actualPanelCount; i++) {
      const row = Math.floor(i / panelsPerRow);
      const col = i % panelsPerRow;
      
      const x = startX + col * (panelWidth + 0.5);
      const y = startY + row * (panelHeight + 0.5);
      
      newPanels.push({
        id: `panel-${i}`,
        x,
        y,
        width: panelWidth,
        height: panelHeight,
        watts: panelWatts,
        efficiency: 0.85 + Math.random() * 0.1, // 85-95% efficiency
      });
    }

    setPanels(newPanels);
    setTotalWatts(newPanels.reduce((sum, panel) => sum + panel.watts, 0));
  };

  const scaleX = (screenWidth * zoom) / roofDimensions.width;
  const scaleY = (screenHeight * zoom) / roofDimensions.height;
  const scale = Math.min(scaleX, scaleY);

  const viewBoxWidth = roofDimensions.width;
  const viewBoxHeight = roofDimensions.height;

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sun size={24} color="#D97706" />
          <Text style={styles.title}>Solar Panel Layout</Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setZoom(Math.max(0.5, zoom - 0.2))}
          >
            <ZoomOut size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setZoom(Math.min(2, zoom + 0.2))}
          >
            <ZoomIn size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={generateOptimalLayout}
          >
            <RotateCcw size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.svgContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={3}
        minimumZoomScale={0.5}
      >
        <Svg
          width={screenWidth * zoom}
          height={screenHeight * zoom}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          style={styles.svg}
        >
          {/* Roof outline */}
          <Rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="0.2"
            rx="1"
          />
          
          {/* Setback lines */}
          <Rect
            x="1"
            y="1"
            width={viewBoxWidth - 2}
            height={viewBoxHeight - 2}
            fill="none"
            stroke="#FCA5A5"
            strokeWidth="0.1"
            strokeDasharray="0.5,0.5"
          />

          {/* Solar panels */}
          {panels.map((panel, index) => (
            <G key={panel.id}>
              <Rect
                x={panel.x}
                y={panel.y}
                width={panel.width}
                height={panel.height}
                fill="#1E40AF"
                stroke="#1E3A8A"
                strokeWidth="0.05"
                rx="0.1"
              />
              
              {/* Panel grid lines */}
              <Rect
                x={panel.x + 0.1}
                y={panel.y + 0.1}
                width={panel.width - 0.2}
                height={panel.height - 0.2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="0.02"
              />
              
              {/* Panel number */}
              {zoom > 0.8 && (
                <SvgText
                  x={panel.x + panel.width / 2}
                  y={panel.y + panel.height / 2}
                  fontSize="0.4"
                  fill="white"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {index + 1}
                </SvgText>
              )}
            </G>
          ))}

          {/* Compass */}
          <G transform={`translate(${viewBoxWidth - 3}, 2)`}>
            <Circle cx="0" cy="0" r="1" fill="white" stroke="#D1D5DB" strokeWidth="0.1" />
            <SvgText x="0" y="-0.6" fontSize="0.3" fill="#DC2626" textAnchor="middle">N</SvgText>
            <SvgText x="0.6" y="0.1" fontSize="0.3" fill="#6B7280" textAnchor="middle">E</SvgText>
            <SvgText x="0" y="0.7" fontSize="0.3" fill="#6B7280" textAnchor="middle">S</SvgText>
            <SvgText x="-0.6" y="0.1" fontSize="0.3" fill="#6B7280" textAnchor="middle">W</SvgText>
          </G>
        </Svg>
      </ScrollView>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{panels.length}</Text>
          <Text style={styles.statLabel}>Panels</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(totalWatts / 1000).toFixed(1)}kW</Text>
          <Text style={styles.statLabel}>System Size</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(totalWatts * 4.5 * 365 / 1000).toLocaleString()}</Text>
          <Text style={styles.statLabel}>kWh/year</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{roofDimensions.width}×{roofDimensions.height}ft</Text>
          <Text style={styles.statLabel}>Roof Size</Text>
        </View>
      </View>
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
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    height: 300,
    backgroundColor: '#F9FAFB',
  },
  svg: {
    backgroundColor: '#F9FAFB',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
});