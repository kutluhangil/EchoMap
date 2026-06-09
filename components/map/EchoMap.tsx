import { useCallback, useRef, useState } from 'react';
import Mapbox, { Camera, MapView, MarkerView, UserLocation } from '@rnmapbox/maps';
import { Crosshair } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/ui';
import { getCurrentCoordinates } from '@/lib/location/geo';
import { useEchoStore } from '@/store/useEchoStore';
import { palette } from '@/theme/colors';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE_URL, MAPBOX_TOKEN } from './mapStyle';
import { PinCluster } from './PinCluster';
import { SoundRingPin } from './SoundRingPin';

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface EchoMapProps {
  onSelectEcho?: (id: string) => void;
}

/**
 * The custom slate Mapbox map: clustered ember pins, the selected echo marked
 * with the animated Skia sound-ring, the user's location, and a recenter
 * control. Tapping a pin selects it and notifies the parent (the Memory Weaver
 * opens the detail screen).
 */
export function EchoMap({ onSelectEcho }: EchoMapProps) {
  const echoes = useEchoStore((s) => s.echoes);
  const cameraRef = useRef<Camera>(null);
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? (echoes.find((e) => e.id === selectedId) ?? null) : null;

  const recenter = useCallback(async () => {
    const coords = await getCurrentCoordinates();
    if (coords) {
      cameraRef.current?.setCamera({
        centerCoordinate: [coords.lng, coords.lat],
        zoomLevel: 14,
        animationDuration: 800,
      });
    }
  }, []);

  const handleEchoPress = useCallback(
    (id: string) => {
      setSelectedId(id);
      onSelectEcho?.(id);
    },
    [onSelectEcho],
  );

  const handleClusterPress = useCallback((coordinates: [number, number]) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      zoomLevel: DEFAULT_ZOOM + 2.5,
      animationDuration: 600,
    });
  }, []);

  return (
    <View style={styles.fill}>
      <MapView
        style={styles.fill}
        styleURL={MAP_STYLE_URL}
        scaleBarEnabled={false}
        compassEnabled={false}
        attributionPosition={{ bottom: 8, left: 8 }}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{ centerCoordinate: DEFAULT_CENTER, zoomLevel: DEFAULT_ZOOM }}
        />
        <UserLocation visible androidRenderMode="normal" />
        <PinCluster
          echoes={echoes}
          onPressEcho={handleEchoPress}
          onPressCluster={handleClusterPress}
        />
        {selected ? (
          <MarkerView
            coordinate={[selected.lng, selected.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
            allowOverlap
          >
            <SoundRingPin />
          </MarkerView>
        ) : null}
      </MapView>

      <Pressable
        onPress={recenter}
        accessibilityRole="button"
        accessibilityLabel="Recenter on my location"
        hitSlop={8}
        style={[styles.recenter, { bottom: insets.bottom + 24 }]}
      >
        <Crosshair color={palette.mist} size={22} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  recenter: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.slateDeep,
    borderWidth: 1,
    borderColor: palette.slate,
  },
});
