
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom SVG icon for markers to avoid image import issues
const DefaultIcon = L.divIcon({
    html: `<div class="w-6 h-6 bg-[#0047cc] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white">📍</div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GeofenceMapProps {
  center: [number, number];
  zoom?: number;
  zones?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radius: number;
    status: string;
  }[];
  branches?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    image?: string;
  }[];
  onMapClick?: (lat: number, lng: number) => void;
}

const GeofenceMap: React.FC<GeofenceMapProps> = ({ 
  center, 
  zoom = 13, 
  zones = [], 
  branches = [] 
}) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner relative z-0" style={{ height: '100%', minHeight: '200px' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', minHeight: '200px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {zones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Circle
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{ 
                fillColor: zone.status === 'ACTIVE' ? '#10b981' : '#f43f5e',
                color: zone.status === 'ACTIVE' ? '#059669' : '#e11d48',
                fillOpacity: 0.2
              }}
            />
            <Marker position={[zone.lat, zone.lng]}>
              <Popup>
                <div className="p-2">
                  <p className="font-black text-xs uppercase tracking-tight">{zone.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Radius: {zone.radius}m</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {branches.map((branch) => (
          <Marker key={branch.id} position={[branch.lat, branch.lng]}>
            <Popup>
              <div className="p-2 min-w-[150px]">
                {branch.image && (
                  <img 
                    src={branch.image} 
                    alt={branch.name} 
                    className="w-full h-20 object-cover rounded-lg mb-2"
                    referrerPolicy="no-referrer"
                  />
                )}
                <p className="font-black text-xs uppercase tracking-tight">{branch.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Branch Location</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeofenceMap;
