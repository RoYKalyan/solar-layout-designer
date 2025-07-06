import { useState, useCallback } from 'react';

export interface LayoutContext {
  address?: string;
  roofDimensions?: { width: number; height: number };
  panelCount?: number;
  panelWatts?: number;
  orientation?: 'portrait' | 'landscape';
  systemSize?: number;
  energyGoals?: string;
}

export function useLayoutGeneration() {
  const [layoutContext, setLayoutContext] = useState<LayoutContext>({});
  const [showSatelliteView, setShowSatelliteView] = useState(false);
  const [showLayoutView, setShowLayoutView] = useState(false);

  const extractLayoutInfo = useCallback((message: string): Partial<LayoutContext> => {
    const context: Partial<LayoutContext> = {};
    const lowerMessage = message.toLowerCase();

    // Extract address
    const addressPatterns = [
      /\b\d+\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard)\b/gi,
      /\b[a-zA-Z\s]+,\s*[a-zA-Z]{2}\s*\d{5}\b/gi
    ];
    
    for (const pattern of addressPatterns) {
      const match = message.match(pattern);
      if (match) {
        context.address = match[0];
        break;
      }
    }

    // Extract panel count
    const panelMatch = lowerMessage.match(/(\d+)\s*panels?/);
    if (panelMatch) {
      context.panelCount = parseInt(panelMatch[1]);
    }

    // Extract system size
    const sizeMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*kw/);
    if (sizeMatch) {
      context.systemSize = parseFloat(sizeMatch[1]);
      // Estimate panel count from system size (assuming 400W panels)
      if (!context.panelCount) {
        context.panelCount = Math.round(context.systemSize * 1000 / 400);
      }
    }

    // Extract roof dimensions
    const dimensionMatch = lowerMessage.match(/(\d+)\s*(?:x|by|×)\s*(\d+)\s*(?:feet|ft)/);
    if (dimensionMatch) {
      context.roofDimensions = {
        width: parseInt(dimensionMatch[1]),
        height: parseInt(dimensionMatch[2])
      };
    }

    // Extract panel orientation
    if (lowerMessage.includes('portrait')) {
      context.orientation = 'portrait';
    } else if (lowerMessage.includes('landscape')) {
      context.orientation = 'landscape';
    }

    // Extract energy goals
    const energyMatch = lowerMessage.match(/(\d+)\s*kwh/);
    if (energyMatch) {
      context.energyGoals = energyMatch[0];
    }

    return context;
  }, []);

  const updateLayoutContext = useCallback((newContext: Partial<LayoutContext>) => {
    setLayoutContext(prev => ({ ...prev, ...newContext }));
  }, []);

  const shouldShowSatelliteView = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('address') ||
      lowerMessage.includes('satellite') ||
      lowerMessage.includes('roof') ||
      lowerMessage.includes('imagery') ||
      lowerMessage.includes('analyze') ||
      /\b\d+\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard)\b/gi.test(message)
    );
  }, []);

  const shouldShowLayoutView = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('panel') ||
      lowerMessage.includes('layout') ||
      lowerMessage.includes('design') ||
      lowerMessage.includes('placement') ||
      lowerMessage.includes('configuration') ||
      /(\d+)\s*panels?/.test(lowerMessage) ||
      /(\d+(?:\.\d+)?)\s*kw/.test(lowerMessage)
    );
  }, []);

  const processMessage = useCallback((message: string) => {
    const extractedContext = extractLayoutInfo(message);
    updateLayoutContext(extractedContext);

    const shouldShowSat = shouldShowSatelliteView(message);
    const shouldShowLayout = shouldShowLayoutView(message);

    setShowSatelliteView(shouldShowSat);
    setShowLayoutView(shouldShowLayout);

    return {
      context: extractedContext,
      showSatelliteView: shouldShowSat,
      showLayoutView: shouldShowLayout
    };
  }, [extractLayoutInfo, updateLayoutContext, shouldShowSatelliteView, shouldShowLayoutView]);

  const handleRoofDetected = useCallback((dimensions: { width: number; height: number }) => {
    updateLayoutContext({ roofDimensions: dimensions });
    setShowLayoutView(true);
  }, [updateLayoutContext]);

  return {
    layoutContext,
    showSatelliteView,
    showLayoutView,
    processMessage,
    updateLayoutContext,
    handleRoofDetected,
    setShowSatelliteView,
    setShowLayoutView,
  };
}