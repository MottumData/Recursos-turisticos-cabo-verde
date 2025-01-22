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
import { useEffect, useState } from 'react';
import Legend from './legend';
import Expander from './Expanders/expanderRecursos';
import { TouristResource, Route } from './Utils/loadCsv';
import Sidebar from './Sidebar/sidebar';
import RoutingControl from './Utils/routingControl';
import { getIcon } from './Icon/iconUtils';
import SidebarToggle from './Sidebar/sidebarToggle';
import RouteModal from './Sidebar/modal';

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
  const [filteredPoints, setFilteredPoints] = useState<TouristResource[]>(points);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleRouteSelect = (route: Route | null) => {
    setSelectedRoute(route);
    setSelectedRouteResource(route);
    setRouteExpanderVisible(!!route);
    setSelectedMapResource(null);

    if (route) {
      const resourceIds: string[] = route[locale['georeferenced resources']]
        .split('\n')
        .map((line: string) => line.trim().substring(0, 2)); // Obtener los dos primeros dígitos de cada línea

      const filtered = points.filter(point => resourceIds.includes(point.id.substring(0, 2)));
      setFilteredPoints(filtered);
    } else {
      setFilteredPoints(points);
    }
  };

  const handleCategoryFilterChange = (categories: string[]) => {
    setFilteredCategories(categories);
    
    let filtered = points;
    
    // Apply route filter if a route is selected
    if (selectedRouteResource && selectedRouteResource[locale['georeferenced resources']]) {
      const routePoints: string[] = selectedRouteResource[locale['georeferenced resources']]
        .split('\n')
        .map((line: string) => line.trim());
      filtered = points.filter(point => routePoints.some(rp => point.id.startsWith(rp)));
    }
    
    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter(point => categories.includes(point.cara));
    }
    
    setFilteredPoints(filtered);
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
    setSidebarVisible(!sidebarVisible);
    if (!sidebarVisible) {
      setExpanderVisible(false);
      setRouteExpanderVisible(false);
    }
  };

  const handleRouteExpanderClose = () => {
    setRouteExpanderVisible(false);
    setSelectedRoute(null);
    setSelectedRouteResource(null);
    setFilteredPoints(points);
  };
  

  const locale: { [key: string]: string } = locales[language];

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    // Resetar el estado de las rutas y los puntos al cambiar el idioma
    setSelectedRouteResource(null);
    setSelectedRoute(null); // Añadido para resetear la ruta seleccionada
    setRouteExpanderVisible(false); // Cerrar el expander de la ruta
    setFilteredPoints(points); // Restablecer los puntos filtrados a todos los puntos
  }, [language, points]);

  return (
    <div className="w-screen" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Botón de leyenda posicionado en la esquina inferior derecha */}
      <div className="fixed bottom-8 sm:bottom-6 right-4 z-[1000]">
        <button
          onClick={() => setShowLegend(true)}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          title={locale['Show_Legend'] || 'Show Legend'}
        >
          <FaLayerGroup className="w-6 h-6 text-gray-600" />
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
        {selectedRoute && <RoutingControl selectedRoute={selectedRoute} onRouteClick={handleRouteClick} locale={locale}/>}
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
        onClose={handleRouteExpanderClose}
        language={language}
        locale={locale}
        selectedMapResource={selectedMapResource}
      />

      <RouteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onOpen={() => setSidebarVisible(true)}
        language={language}
        setFilteredCategories={handleCategoryFilterChange}
        content={<div>Your content here</div>}
        locale={locale}
        onRouteSelect={handleRouteSelect}
        openModal={() => setIsModalOpen(true)}
      />
      <SidebarToggle visible={sidebarVisible} onToggle={handleSidebarToggle} />
    </div>
  );
}