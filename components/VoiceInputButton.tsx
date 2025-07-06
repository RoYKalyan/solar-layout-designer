import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Mic, MicOff, Loader as Loader2 } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

interface VoiceInputButtonProps {
  isRecording: boolean;
  isTranscribing: boolean;
  onPress: () => void;
  disabled?: boolean;
  continuousMode?: boolean;
}

export function VoiceInputButton({ 
  isRecording, 
  isTranscribing, 
  onPress, 
  disabled = false,
  continuousMode = false
}: VoiceInputButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Pulsing animation for recording
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else if (isTranscribing) {
      // Rotation animation for transcribing
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotate.start();
      return () => rotate.stop();
    } else if (continuousMode && !disabled) {
      // Gentle breathing animation for continuous mode
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      breathe.start();
      return () => breathe.stop();
    } else {
      // Reset animations
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
      breatheAnim.setValue(1);
    }
  }, [isRecording, isTranscribing, continuousMode, disabled, pulseAnim, rotateAnim, breatheAnim]);

  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.disabledButton];
    }
    if (isRecording) {
      return [styles.button, styles.recordingButton];
    }
    if (isTranscribing) {
      return [styles.button, styles.transcribingButton];
    }
    if (continuousMode) {
      return [styles.button, styles.continuousButton];
    }
    return [styles.button, styles.defaultButton];
  };

  const getIconColor = () => {
    if (disabled) return '#9CA3AF';
    if (isRecording) return '#FFFFFF';
    if (isTranscribing) return '#FFFFFF';
    if (continuousMode) return '#FFFFFF';
    return '#6B7280';
  };

  const renderIcon = () => {
    if (isTranscribing) {
      return (
        <Animated.View
          style={{
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          }}
        >
          <Loader2 size={20} color={getIconColor()} />
        </Animated.View>
      );
    }

    return <Mic size={20} color={getIconColor()} />;
  };

  const getAnimationTransform = () => {
    if (isRecording) {
      return [{ scale: pulseAnim }];
    }
    if (continuousMode && !disabled) {
      return [{ scale: breatheAnim }];
    }
    return [{ scale: 1 }];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          transform: getAnimationTransform(),
        }}
      >
        {renderIcon()}
      </Animated.View>
      
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <Animated.View
            style={[
              styles.recordingDot,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.6, 1],
                }),
              },
            ]}
          />
        </View>
      )}

      {continuousMode && !isRecording && !isTranscribing && !disabled && (
        <View style={styles.continuousIndicator}>
          <View style={styles.continuousDot} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
  },
  defaultButton: {
    backgroundColor: '#F3F4F6',
  },
  recordingButton: {
    backgroundColor: '#DC2626',
  },
  transcribingButton: {
    backgroundColor: '#2563EB',
  },
  continuousButton: {
    backgroundColor: '#059669',
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
    opacity: 0.5,
  },
  recordingIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  continuousIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continuousDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
});