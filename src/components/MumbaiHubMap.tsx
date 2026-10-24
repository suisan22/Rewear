import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MUMBAI_COLLEGES } from '../data/mumbaiData';
import { MumbaiCollege } from '../types/rentvibe';
import { MapPin, Navigation, Train, Clock } from 'lucide-react';

// Fix default Leaflet marker icon in Vite
const createHubIcon = (isSelected: boolean) =>
  L.divIcon({
    className: 'custom-mumbai-hub-pin',
    html: `<div style="
      width: ${isSelected ? '38px' : '28px'};
      height: ${isSelected ? '38px' : '28px'};
      background: ${isSelected ? 'linear-gradient(135deg, #ED3D63, #8D3FD0)' : '#223CCF'};
      color: #FFFFFF;
      border: 2px solid ${isSelected ? '#0683D7' : '#161B7F'};
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 6px 18px rgba(237,61,99,0.55);
      transition: transform 150ms ease;
    ">₹0</div>`,
    iconSize: [isSelected ? 38 : 28, isSelected ? 38 : 28],
    iconAnchor: [isSelected ? 19 : 14, isSelected ? 19 : 14]
  });

function MapFlyToController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 0.9 });
  }, [center, map]);
  return null;
}

interface MumbaiHubMapProps {
  selectedCollegeId: string;
  onSelectCollege: (collegeId: string) => void;
  isDarkMode: boolean;
}

export const MumbaiHubMap: React.FC<MumbaiHubMapProps> = ({
  selectedCollegeId,
  onSelectCollege,
  isDarkMode
}) => {
  const activeCollege: MumbaiCollege =
    MUMBAI_COLLEGES.find((c) => c.id === selectedCollegeId) || MUMBAI_COLLEGES[0];

  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-colors shadow-lg ${
        isDarkMode
          ? 'bg-[#080917] border-[#223CCF]/50'
          : 'bg-white border-[#223CCF]/25'
      }`}
    >
      {/* Top Info Bar */}
      <div
        className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode
            ? 'border-[#223CCF]/40 bg-[#05050B]'
            : 'border-[#223CCF]/15 bg-[#F4F7FF]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ED3D63] to-[#8D3FD0] text-white flex items-center justify-center shadow-sm shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-sm font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              📍 Mumbai Campus Canteen & Metro Zero-Fee Pickup Hubs
            </h3>
            <p
              className={`text-xs ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Skip ₹120 courier fees · Pick up & drop outfits between lectures at verified college gates 🎒
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold tabular-nums border ${
            isDarkMode
              ? 'bg-[#161B7F]/60 border-[#0683D7]/50 text-[#0683D7]'
              : 'bg-[#0683D7]/10 border-[#0683D7]/30 text-[#223CCF]'
          }`}
        >
          ⚡ {MUMBAI_COLLEGES.length} Active Campus Lockers · ₹0 Shipping
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Canvas */}
        <div className="lg:col-span-8 h-[280px] sm:h-[320px] relative">
          <MapContainer
            center={[activeCollege.lat, activeCollege.lng]}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={
                isDarkMode
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
            />
            <MapFlyToController center={[activeCollege.lat, activeCollege.lng]} />
            {MUMBAI_COLLEGES.map((college) => {
              const isSelected = college.id === selectedCollegeId;
              return (
                <Marker
                  key={college.id}
                  position={[college.lat, college.lng]}
                  icon={createHubIcon(isSelected)}
                  eventHandlers={{
                    click: () => onSelectCollege(college.id)
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 p-1 min-w-[200px]">
                      <div className="font-bold text-sm text-[#161B7F]">🎓 {college.shortName}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{college.hubName}</div>
                      <div className="text-xs font-mono text-[#ED3D63] font-bold mt-1">
                        👗 {college.activeListingsCount} outfits ready · Free Canteen Pickup
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Campus Hub Details Panel */}
        <div
          className={`lg:col-span-4 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l ${
            isDarkMode
              ? 'border-[#223CCF]/40 bg-[#05050B]'
              : 'border-[#223CCF]/20 bg-white'
          }`}
        >
          <div>
            <div
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              ✨ ACTIVE EXCHANGE HUB · {activeCollege.zone}
            </div>
            <h4
              className={`text-lg font-extrabold mt-1 ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              🎓 {activeCollege.shortName}
            </h4>
            <p
              className={`text-xs mt-1 leading-relaxed font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {activeCollege.fullName}
            </p>

            <div
              className={`mt-4 pt-4 border-t space-y-2.5 text-xs ${
                isDarkMode
                  ? 'border-[#223CCF]/40 text-slate-200'
                  : 'border-[#223CCF]/15 text-slate-700'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Navigation className="w-3.5 h-3.5 text-[#ED3D63] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Drop/Pickup Point:</span> {activeCollege.hubName}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Train className="w-3.5 h-3.5 text-[#0683D7] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Rail / Metro Link:</span>{' '}
                  {activeCollege.nearestMetroOrStation}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[#8D3FD0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Exchange Timings:</span>{' '}
                  {activeCollege.freeDropTiming}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Campus Switcher Buttons */}
          <div
            className={`mt-5 pt-3 border-t ${
              isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/15'
            }`}
          >
            <div
              className={`text-[11px] font-bold mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-[#161B7F]'
              }`}
            >
              🔥 Jump to Campus Hub ({activeCollege.activeListingsCount} outfits available):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MUMBAI_COLLEGES.slice(0, 6).map((col) => (
                <button
                  key={col.id}
                  onClick={() => onSelectCollege(col.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    col.id === selectedCollegeId
                      ? 'bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white shadow-md scale-105'
                      : isDarkMode
                      ? 'bg-[#161B7F] text-white hover:bg-[#223CCF] border border-[#223CCF]/50'
                      : 'bg-[#F0F4FF] text-[#161B7F] hover:bg-[#223CCF] hover:text-white border border-[#223CCF]/25'
                  }`}
                >
                  {col.shortName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
