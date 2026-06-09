import { useMemo } from 'react';
import { CircleLayer, ShapeSource, SymbolLayer } from '@rnmapbox/maps';

import type { Echo } from '@/store/useEchoStore';
import { clusterStyle, pinStyle } from './mapStyle';

// Mapbox's onPress payload isn't re-exported from the package root; this matches
// the part we use (the hit features).
interface ShapePressEvent {
  features: GeoJSON.Feature[];
}

interface PinClusterProps {
  echoes: Echo[];
  onPressEcho: (id: string) => void;
  onPressCluster: (coordinates: [number, number]) => void;
}

/**
 * Renders echoes as a clustered GeoJSON source: clusters as ember bubbles with
 * a count, and individual echoes as a soft halo plus a solid dot (the sound-ring
 * motif at map scale). Mapbox handles clustering, so this stays smooth with
 * hundreds of pins.
 */
export function PinCluster({ echoes, onPressEcho, onPressCluster }: PinClusterProps) {
  const shape = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: echoes.map((echo) => ({
        type: 'Feature' as const,
        id: echo.id,
        properties: { id: echo.id, title: echo.title },
        geometry: { type: 'Point' as const, coordinates: [echo.lng, echo.lat] },
      })),
    }),
    [echoes],
  );

  const handlePress = (event: ShapePressEvent) => {
    const feature = event.features[0];
    if (!feature) return;
    const properties = feature.properties ?? {};
    if (properties.cluster) {
      const geometry = feature.geometry;
      if (geometry.type === 'Point') {
        const [lng, lat] = geometry.coordinates;
        if (lng !== undefined && lat !== undefined) {
          onPressCluster([lng, lat]);
        }
      }
    } else if (typeof properties.id === 'string') {
      onPressEcho(properties.id);
    }
  };

  return (
    <ShapeSource
      id="echoes"
      shape={shape}
      cluster
      clusterRadius={50}
      clusterMaxZoomLevel={14}
      onPress={handlePress}
    >
      <CircleLayer
        id="clusters"
        filter={['has', 'point_count']}
        style={{
          circleColor: clusterStyle.color,
          circleOpacity: 0.9,
          circleRadius: ['step', ['get', 'point_count'], 16, 10, 22, 50, 30],
          circleStrokeColor: clusterStyle.strokeColor,
          circleStrokeWidth: 2,
        }}
      />
      <SymbolLayer
        id="cluster-count"
        filter={['has', 'point_count']}
        style={{
          textField: ['get', 'point_count_abbreviated'],
          textSize: 13,
          textColor: clusterStyle.textColor,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />
      <CircleLayer
        id="echo-halo"
        filter={['!', ['has', 'point_count']]}
        style={{
          circleColor: pinStyle.haloColor,
          circleOpacity: pinStyle.haloOpacity,
          circleRadius: pinStyle.haloRadius,
        }}
      />
      <CircleLayer
        id="echo-dot"
        filter={['!', ['has', 'point_count']]}
        style={{
          circleColor: pinStyle.dotColor,
          circleRadius: pinStyle.dotRadius,
          circleStrokeColor: pinStyle.dotStroke,
          circleStrokeWidth: 2,
        }}
      />
    </ShapeSource>
  );
}
