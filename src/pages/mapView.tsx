// src/pages/mapView.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { LatLngExpression } from 'leaflet';
import { useLanguage } from '../components/languageContext';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { loadCSV, TouristResource } from '../components/loadCsv';

const Map = dynamic(() => import('../components/mapa'), {
  ssr: false,
  loading: () => <div>Cargando mapa...</div>
});

const locales = { pt, en, es };

export default function MapView() {
  const [isClient, setIsClient] = useState(false);
  const { language, setLanguage } = useLanguage() as { language: keyof typeof locales, setLanguage: (lang: keyof typeof locales) => void };
  const [points, setPoints] = useState<TouristResource[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const csvFilePath = `/data/santiago_cabo_verde_recursos_${language}.csv`;
    loadCSV(csvFilePath, language).then(data => {
      console.log(data); // Verificar los datos cargados
      setPoints(data);
    }).catch(console.error);
  }, [language]);
  
  const center: LatLngExpression = [15.102191, -23.62991];

  if (!isClient) return null;

  const locale: { [key: string]: string } = locales[language];

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-[1000]">
        <Image 
          src="/Logo_cabo_verde.png"
          alt="Logo Cabo Verde"
          width={150}
          height={150}
          className="w-[100px] sm:w-[125px] md:w-[150px] lg:w-[175px] h-auto object-contain"
          priority
        />
      </div>
      <div className="absolute top-4 right-4 z-[1000] flex space-x-2">
        <select value={language} onChange={(e) => setLanguage(e.target.value as keyof typeof locales)} className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <Map center={center} points={points} language={language} />
    </div>
  );
}