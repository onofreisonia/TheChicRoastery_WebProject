import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationItem } from '../data/locations';

const defaultCenter: L.LatLngExpression = [44.4268, 26.1025];

const customIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%236b4f43' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3' fill='%23ffffff'/%3E%3C/svg%3E",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface MapComponentProps {
  locations: LocationItem[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
}


const MapEffect = ({ locations, selectedId }: { locations: LocationItem[], selectedId?: string | null }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const loc = locations.find(l => l.id === selectedId);
      if (loc) {
        map.setView([loc.lat, loc.lng], 16, { animate: true });
      }
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(defaultCenter, 12);
    }
  }, [map, locations, selectedId]);

  return null;
};

export const MapComponent = ({ locations, selectedId, onMarkerClick }: MapComponentProps) => {
  const center = useMemo(() => {
    if (selectedId) {
      const loc = locations.find(l => l.id === selectedId);
      if (loc) return [loc.lat, loc.lng] as L.LatLngExpression;
    }
    return defaultCenter;
  }, [selectedId, locations]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapEffect locations={locations} selectedId={selectedId} />

        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(loc.id)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
