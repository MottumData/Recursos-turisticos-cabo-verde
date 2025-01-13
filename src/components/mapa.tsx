'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, point } from 'leaflet';
import ExpanderRutas from './expander_rutas';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { Polyline } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  FaUmbrellaBeach,
  FaUniversity,
  FaLandmark,
  FaPalette,
  FaWrench,
  FaPaintBrush,
  FaPrayingHands,
  FaSeedling,
  FaBinoculars,
  FaUsers,
  FaGuitar,
  FaTractor,
  FaMountain,
  FaGem,
  FaMonument,
  FaLayerGroup
} from 'react-icons/fa';

import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { useState, useEffect, JSX } from 'react';
import Legend from './legend';
import Expander from './expander';
import { TouristResource, Route } from './loadCsv';
import Sidebar from './sidebar';

const Openrouteservice = require("openrouteservice-js");
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

function RoutingControl({ selectedRoute }: { selectedRoute: Route | null }) {
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (selectedRoute) {
      const recursosGeoreferenciados = selectedRoute["recursos georeferenciados"];
      console.log('Map component loaded:', recursosGeoreferenciados);

      if (!recursosGeoreferenciados) {
        console.error('No se encontró "recursos georeferenciados" en selectedRoute.');
        return;
      }

      const lines = recursosGeoreferenciados.split('\n');
      const waypoints = lines.map((line: string) => {
        const match = line.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          return [lng, lat];
        } else {
          console.warn('No se encontraron coordenadas en la línea:', line);
          return null;
        }
      }).filter((coord: [number, number] | null): coord is [number, number] => coord !== null);

      if (waypoints.length < 2) {
        console.error('Se requieren al menos dos waypoints para calcular una ruta.');
        return;
      }

      console.log('Waypoints:', waypoints);

      const fetchRoute = async () => {
        try {
          const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
            method: 'POST',
            headers: {
              'Authorization': '5b3ce3597851110001cf624806d373a127de42c6ac73f64c01f3d2a1',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              coordinates: waypoints
            })
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          const coords = data.features[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
          setRouteCoords(coords);

          // Opcional: Ajustar la vista del mapa para la ruta
          const bounds = L.latLngBounds(coords);
          map.fitBounds(bounds);

        } catch (err) {
          console.error('Error al obtener la ruta:', err);
        }
      };

      fetchRoute();
    }
  }, [map, selectedRoute]);

  return (
    <>
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} pathOptions={{ color: 'blue', weight: 4 }} />
      )}
    </>
  );
}


function createColoredDivIcon(iconElement: JSX.Element, bgColor: string) {
  const size = 30; // Outer circle size
  const iconScale = 0.8; // Scale factor for inner icon
  
  return L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          backgroundColor: bgColor,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ transform: `scale(${iconScale})` }}>
          {iconElement}
        </div>
      </div>
    ),
    className: '',
    iconSize: [size, size],
  });
}
function getIcon(resource: TouristResource, language: Language) {
  const locale = locales[language];
  if (!resource || !resource.cara) {
    return createColoredDivIcon(<FaLandmark size={24} color="#fff" />, '#888');
  }

  const cleanCara = resource.cara.trim();
  switch (cleanCara) {
    case locale['Cara_Beaches_and_Coastal_Locations']:
      return createColoredDivIcon(<FaUmbrellaBeach size={24} color="#fff" />, '#F4D03F'); // Ocean blue
    case locale['Cara_Archaeological Legacy']:
      return createColoredDivIcon(<FaMonument size={24} color="#fff" />, '#d2b48c'); // Sand/stone
    case locale['Cara_Folclore Materials']:
      return createColoredDivIcon(<FaGuitar size={24} color="#fff" />, '#cd5c5c'); // Traditional red
    case locale['Cara_Representative Works of Art']:
      return createColoredDivIcon(<FaPalette size={24} color="#fff" />, '#9370db'); // Artistic purple
    case locale['Cara_Engineering Works']:
      return createColoredDivIcon(<FaWrench size={24} color="#fff" />, '#DC143C'); // Steel blue
    case locale['Cara_Museums and Exhibition Halls']:
      return createColoredDivIcon(<FaPaintBrush size={24} color="#fff" />, '#800020'); // Burgundy
    case locale['Cara_Spiritual Folklore']:
      return createColoredDivIcon(<FaPrayingHands size={24} color="#fff" />, '#4b0082'); // Deep indigo
    case locale['Cara_Vales']:
      return createColoredDivIcon(<FaSeedling size={24} color="#fff" />, '#90ee90'); // Light green
    case locale['Cara_Mountains and Mountains']:
      return createColoredDivIcon(<FaMountain size={24} color="#fff" />, '#708090'); // Slate gray
    case locale['Cara_Flora and Fauna Observation Sites']:
      return createColoredDivIcon(<FaBinoculars size={24} color="#fff" />, '#228b22'); // Forest green
    case locale['Cara_Geological and Paleontological Formations']:
      return createColoredDivIcon(<FaGem size={24} color="#fff" />, '#8b4513'); // Saddle brown
    case locale['Cara_Ethnic Groups']:
      return createColoredDivIcon(<FaUsers size={24} color="#fff" />, '#e27d60'); // Terracotta
    case locale['Cara_Human Settlements and Living Architecture']:
      return createColoredDivIcon(<FaUniversity size={24} color="#fff" />, '#b22222'); // Brick red
    case locale['Cara_Agricultural Exploration']:
      return createColoredDivIcon(<FaTractor size={24} color="#fff" />, '#daa520'); // Golden wheat
    default:
      return createColoredDivIcon(<FaLandmark size={24} color="#fff" />, '#778899'); // Light slate gray
  }
}

export default function Map({ center, points, routes, selectedRoute,setSelectedRoute, language }: MapProps) {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [expanderVisible, setExpanderVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState<TouristResource | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [routeExpanderVisible, setRouteExpanderVisible] = useState(false);
  const [selectedRouteResource, setSelectedRouteResource] = useState<Route | null>(null);

  const handleRouteSelect = (route: Route | null) => {
    console.log('Ruta seleccionada en Map:', route);
    setSelectedRoute(route);
    setSelectedRouteResource(route);
    setRouteExpanderVisible(!!route);
  };

  const handleMarkerClick = (point: TouristResource) => {
    setSelectedResource(point);
    setExpanderVisible(true);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(true);
    setExpanderVisible(false);
    setRouteExpanderVisible(false);
    // Close point expander
    // Don't close route expander here
  };

  const filteredPoints = points.filter(point => 
    filteredCategories.length === 0 || filteredCategories.includes(point.cara)
  );

  const locale: { [key: string]: string } = locales[language];

  return (
    <div className="relative w-full h-full">
      {/* Legend button positioned bottom-right */}
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

      {/* Legend component */}
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
        <Marker key={idx} position={[point.lat, point.lng]} icon={getIcon(point, language)} eventHandlers={{ click: () => handleMarkerClick(point) }}>
          {/*<Popup>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </Popup>*/}
        </Marker>
      ))}
       {selectedRoute && <RoutingControl selectedRoute={selectedRoute} />}
    </MapContainer>
    <Expander
        visible={expanderVisible}
        resource={selectedResource ?? undefined}
        onClose={() => setExpanderVisible(false)}
        language={language}
        locale={locale}
      />

    <ExpanderRutas
        visible={routeExpanderVisible}
        resource={selectedRouteResource ?? undefined}
        onClose={() => setRouteExpanderVisible(false)}
        language={language}
        locale={locale}
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