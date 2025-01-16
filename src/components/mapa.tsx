'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import ExpanderRutas from './Expanders/expanderRutas';
import 'leaflet/dist/leaflet.css';
import {
  FaLayerGroup
} from 'react-icons/fa';

import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { useState } from 'react';
import Legend from './legend';
import Expander from './Expanders/expanderRecursos';
import { TouristResource, Route } from './Utils/loadCsv';
import Sidebar from './Sidebar/sidebar';
import RoutingControl from './Utils/routingControl';
import { getIcon } from './Icon/iconUtils';

const locales = { pt, en, es };

type Language = 'pt' | 'en' | 'es';

interface MapProps {
  center: LatLngExpression;
  points: TouristResource[];
  routes: Route[];
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;
  language: Language;
}

export default function Map({ center, points, selectedRoute, setSelectedRoute, language }: MapProps) {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [expanderVisible, setExpanderVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState<TouristResource | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [routeExpanderVisible, setRouteExpanderVisible] = useState(false);
  const [selectedRouteResource, setSelectedRouteResource] = useState<Route | null>(null);
  const [selectedMapResource, setSelectedMapResource] = useState<TouristResource | null>(null);

  const handleRouteSelect = (route: Route | null) => {
    console.log('Ruta seleccionada en Map:', route);
    setSelectedRoute(route);
    setSelectedRouteResource(route);
    setRouteExpanderVisible(!!route);
    setSelectedMapResource(null);
  };

  const handleRouteClick = () => {
    if (selectedRoute) {
      setSelectedRouteResource(selectedRoute);
      setRouteExpanderVisible(true);
    }
  };

  const handleMarkerClick = (point: TouristResource) => {
    setSelectedResource(point);
    setSelectedMapResource(point);
    setExpanderVisible(true);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(true);
    setExpanderVisible(false);
    setRouteExpanderVisible(false);
    // Cerrar expander de punto
    // No cerrar expander de ruta aquí
  };

  const filteredPoints = points.filter(point => 
    filteredCategories.length === 0 || filteredCategories.includes(point.cara)
  );

  const locale: { [key: string]: string } = locales[language];

  return (
    <div className="w-screen h-screen relative ">
      {/* Botón de leyenda posicionado en la esquina inferior derecha */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <button
          onClick={() => setShowLegend(true)}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          title={locale['Show_Legend'] || 'Show Legend'}
        >
          <FaLayerGroup className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="absolute top-6 left-6 z-[1000]">
        <button
          onClick={handleSidebarToggle}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          title="Open Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Componente de leyenda */}
      {showLegend && (
        <Legend
          locale={locale}
          onClose={() => setShowLegend(false)}
        />
      )}

      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredPoints.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]} icon={getIcon(point, language, locales)} eventHandlers={{ click: () => handleMarkerClick(point) }}>
          </Marker>
        ))}
        {selectedRoute && <RoutingControl selectedRoute={selectedRoute} onRouteClick={handleRouteClick}/>}
      </MapContainer>
      <Expander
        visible={expanderVisible}
        resource={selectedResource ?? undefined}
        onClose={() => {setExpanderVisible(false); setSelectedMapResource(null);}}
        language={language}
        locale={locale}
      />

      <ExpanderRutas
        visible={routeExpanderVisible}
        resource={selectedRouteResource ?? undefined}
        onClose={() => setRouteExpanderVisible(false)}
        language={language}
        locale={locale}
        selectedMapResource={selectedMapResource}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        language={language}
        setFilteredCategories={setFilteredCategories}
        content={<div>Your content here</div>}
        locale={locale}
        onRouteSelect={handleRouteSelect}
      />
    </div>
  );
}