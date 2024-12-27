'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import CategoryFilter from './filter';
import { useState } from 'react';
import Legend from './legend';

const locales = { pt, en, es };

type Language = 'pt' | 'en' | 'es';

interface MapProps {
  center: LatLngExpression;
  points: Array<{ lat: number; lng: number; title: string; description: string, cara: string }>;
  language: Language;
}

function getIcon(cara: string, language: Language) {
  const locale = locales[language];
  let iconUrl = '';

  console.log("Locale keys:", Object.values(locale));
  console.log("Trimmed cara:", cara.trim());

  switch (cara.trim()) {
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

export default function Map({ center, points, language }: MapProps) {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState<boolean>(false); 

  const filteredPoints = points.filter(point => 
    filteredCategories.length === 0 || filteredCategories.includes(point.cara)
  );

  const locale: { [key: string]: string } = locales[language];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-20 right-4 z-[1000]">
        <CategoryFilter 
          language={language}
          onFilterChange={setFilteredCategories}
        />
      </div>
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
        <Marker key={idx} position={[point.lat, point.lng]} icon={getIcon(point.cara, language)}>
          <Popup>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}