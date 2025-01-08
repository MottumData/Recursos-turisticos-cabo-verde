'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, point } from 'leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import CategoryFilter from './filter';
import { useState, useEffect } from 'react';
import Legend from './legend';
import Expander from './expander';
import { TouristResource, Route } from './loadCsv';
import Sidebar from './sidebar';

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

  useEffect(() => {
    if (selectedRoute) {
      // Acceder a la propiedad con espacios usando notación de corchetes
      const recursosGeoreferenciados = selectedRoute["recursos georeferenciados"];
      console.log('Map component loaded:', recursosGeoreferenciados);

      if (!recursosGeoreferenciados) {
        console.error('No se encontró "recursos georeferenciados" en selectedRoute.');
        return;
      }

      // Extraer coordenadas del string
      const lines = recursosGeoreferenciados.split('\n');
      const waypoints = lines.map((line: string) => {
        // Utilizar regex para extraer las coordenadas al final de cada línea
        const match = line.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          return L.latLng(lat, lng);
        } else {
          console.warn('No se encontraron coordenadas en la línea:', line);
          return null;
        }
      }).filter((coord: L.LatLng | null): coord is L.LatLng => coord !== null);

      if (waypoints.length < 2) {
        console.error('Se requieren al menos dos waypoints para calcular una ruta.');
        return;
      }

      console.log('Waypoints:', waypoints);

      // Definir el router usando OSRM con HTTPS
      const router = L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      });

      const routingControl = L.Routing.control({
        router: router,
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10,
        },
        show: false, // Ocultar la interfaz de enrutamiento
        createMarker: () => null, // No crear marcadores en los waypoints
      } as any)
        .on('routesfound', (e) => {
          console.log('Ruta encontrada:', e.routes);
        })
        .on('routingerror', (e) => {
          console.error('Error de enrutamiento completo:', e);
        })
        .addTo(map);

        return () => {
          if (routingControl) {
            map.removeControl(routingControl);
          }
        }
    }
  }, [map, selectedRoute]);

  return null;
}

function getIcon(resource: TouristResource, language: Language) {
  const locale = locales[language];
  
  // Verificar si resource y resource.cara están definidos
  if (!resource || !resource.cara) {
    return new Icon({
      iconUrl: '/icons/imagen-por-defecto.png',
      iconSize: [32, 32],
    });
  }

  const cleanCara = resource.cara.trim();
  let iconUrl = '';


  switch (cleanCara) {
    case locale['Cara_Beaches_and_Coastal_Locations']:
      iconUrl = '/icons/playa.png'; // Icono de playa
      break;
    case locale['Cara_Archaeological Legacy']:
      iconUrl = '/icons/arqueologia_1.png'; // Icono de ruinas
      break;
    case locale['Cara_Folclore Materials']:
      iconUrl = '/icons/arqueologia.png'; // Icono de edificio
      break;
    case locale['Cara_Representative Works of Art']:
      iconUrl = '/icons/arte.png'; // Icono de arte
      break;
    case locale['Cara_Engineering Works']:
      iconUrl = '/icons/ingenieria.png'; // Icono de ingeniería
      break;
    case locale['Cara_Museums and Exhibition Halls']:
      iconUrl = '/icons/museo-de-arte.png'; // Icono de museo
      break;
    case locale['Cara_Spiritual Folklore']:
      iconUrl = '/icons/espiritual.png'; // Icono espiritual
      break;
    case locale['Cara_Vales']:
      iconUrl = '/icons/pradera.png'; // Icono de valle
      break;
    case locale['Cara_Mountains and Mountains']:
      iconUrl = '/icons/montana.png'; // Icono de montaña
      break;
    case locale['Cara_Flora and Fauna Observation Sites']:
      iconUrl = '/icons/binoculares.png'; // Icono de naturaleza
      break;
    case locale['Cara_Geological and Paleontological Formations']:
      iconUrl = '/icons/geologia.png'; // Icono de geología
      break;
    case locale['Cara_Ethnic Groups']:
      iconUrl = '/icons/gestion-de-equipos.png'; // Icono de personas
      break;
    case locale['Cara_Human Settlements and Living Architecture']:
      iconUrl = '/icons/clasicos.png'; // Icono de casa
      break;
    case locale['Cara_Agricultural Exploration']:
      iconUrl = '/icons/segador.png'; // Icono de agricultura
      break;
    default:
      iconUrl = '/icons/imagen-por-defecto.png'; // Icono por defecto
  }

  // Verificar si el archivo de icono existe
  const img = new Image();
  img.src = iconUrl;
  img.onerror = () => {
    console.error(`Icon not found: ${iconUrl}`);
  };

  return new Icon({
    iconUrl,
    iconSize: [32, 32]
  });
}

export default function Map({ center, points, routes, selectedRoute,setSelectedRoute, language }: MapProps) {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [expanderVisible, setExpanderVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState<TouristResource | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMarkerClick = (point: TouristResource) => {
    setSelectedResource(point);
    setExpanderVisible(true);
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="absolute top-6 left-6 z-[1000]">
        <button
          onClick={() => setSidebarVisible(true)}
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
    <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        language={language}
        setFilteredCategories={setFilteredCategories}
        content={<div>Your content here</div>}
        locale={locale}
        onRouteSelect={setSelectedRoute}
      />
    </div>
  );
}