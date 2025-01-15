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
import { loadCSV, TouristResource, loadRoutesCSV, Route } from '../components/loadCsv';

const Map = dynamic(() => import('../components/mapa'), {
  ssr: false,
  loading: () => <div>Cargando mapa...</div>
});

const locales = { pt, en, es };

export default function MapView() {
  const [isClient, setIsClient] = useState(false);
  const { language, setLanguage } = useLanguage() as { language: keyof typeof locales, setLanguage: (lang: keyof typeof locales) => void };
  const [points, setPoints] = useState<TouristResource[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  useEffect(() => {
    setIsClient(true);
    const csvFilePath = `/data/santiago_cabo_verde_recursos_${language}.csv`;
    loadCSV(csvFilePath, language).then(data => {
      setPoints(data);
    }).catch(console.error);

    const routesFilePath = `/data/rutas_cabo_verde_${language}.csv`;
    loadRoutesCSV(routesFilePath, language).then(data => {
      setRoutes(data);
    }).catch(console.error);
  }, [language]);
  
  const center: LatLngExpression = [15.102191, -23.62991];

  if (!isClient) return null;
  const locale: { [key: string]: string } = locales[language];
  return (
    <div className="fixed w-full h-[calc(100vh)] overflow-hidden">
      <div className="absolute top-2 right-4 z-[1000]">
        <Image 
          src="/Logo_cabo_verde.png"
          alt="Logo Cabo Verde"
          width={150}
          height={150}
          className="width-auto height-auto"
          priority
        />
      </div>
      <Map center={center} points={points} language={language} routes={routes} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
    </div>
  );
}