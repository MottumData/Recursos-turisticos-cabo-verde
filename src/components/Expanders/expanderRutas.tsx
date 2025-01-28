import React, { useState, useRef, useEffect } from 'react';
import Header from './expanderHeader';
import BasicInfo from './basicInfo';
import Description from './description';
import AccessServices from './accessServices';
import ImageGallery from './imageGallery';
import { FaMap } from 'react-icons/fa';

interface TouristResource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ExpanderRutasProps {
  visible: boolean;
  onClose: () => void;
  resource?: TouristResource;
  language: 'pt' | 'en' | 'es';
  locale: { [key: string]: string };
  selectedMapResource?: TouristResource | null;
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str
    .toString()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function ExpanderRutas({ visible, onClose, resource, locale, selectedMapResource}: ExpanderRutasProps) {
  const [activeImage, setActiveImage] = useState(0);
  const expanderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const MIN_HEIGHT_VH = 25; // Altura mínima en vh
  const getMinHeightPx = () => (MIN_HEIGHT_VH / 100) * window.innerHeight;
  
  const [expanderHeight, setExpanderHeight] = useState(`${MIN_HEIGHT_VH}vh`);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const startYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number | null>(null);

  {/* Cerrar el Expander cuando se selecciona un recurso en el mapa */}
  useEffect(() => {
    if (selectedMapResource) {
      onClose();
    }
  }, [selectedMapResource, onClose]);

  {/* Actualizar la altura mínima del Expander cuando cambia el tamaño de la ventana */}
  useEffect(() => {
    const handleResize = () => {
      // Actualizar minHeight cuando cambia el tamaño de la ventana
      if (expanderRef.current) {
        const currentHeight = parseInt(expanderHeight);
        const minHeight = getMinHeightPx();
        if (currentHeight < minHeight) {
          setExpanderHeight(`${minHeight}px`);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [expanderHeight]);

  {/* Actualizar la altura del Expander cuando cambia la visibilidad */}
  useEffect(() => {
    if (visible) {
      setExpanderHeight(`${MIN_HEIGHT_VH}vh`);
      setIsDropdownOpen(false); // Cerrar los desplegables
      expanderRef.current?.scrollTo(0, 0); // Desplazar el expander hacia arriba
      contentRef.current?.scrollTo(0, 0); // Desplazar el contenido hacia arriba
    }
  }, [visible]);

  {/* Actualizar la altura del Expander cuando cambia la altura del header */}
  useEffect(() => {
    const headerHeight = (expanderRef.current?.querySelector('div.sticky') as HTMLElement)?.offsetHeight || 0;
    contentRef.current?.style.setProperty('height', `calc(${expanderHeight} - ${headerHeight}px)`);
  }, [expanderHeight, visible]);

  {/* Función para mover el Expander */}
  const handleMouseDown = (evt: React.MouseEvent) => {
    evt.preventDefault();
    startYRef.current = evt.clientY;
    startHeightRef.current = expanderRef.current?.offsetHeight || 0;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  {/* Función para mover el Expander */}
  const handleMouseMove = (evt: MouseEvent) => {
    if (startYRef.current !== null && startHeightRef.current !== null) {
      const delta = startYRef.current - evt.clientY;
      let newHeight = startHeightRef.current + delta;
      const maxExpanderHeight = window.innerHeight;
      const minExpanderHeight = getMinHeightPx();
      if (newHeight > maxExpanderHeight) newHeight = maxExpanderHeight;
      if (newHeight < minExpanderHeight) newHeight = minExpanderHeight;
      setExpanderHeight(`${newHeight}px`);
    }
  };

  {/* Función para soltar el Expander */}
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    startYRef.current = null;
    startHeightRef.current = null;
  };

  {/* Función para tocar el Expander en dispositivos táctiles */}
  const handleTouchStart = (evt: React.TouchEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    startYRef.current = evt.touches[0].clientY;
    startHeightRef.current = expanderRef.current?.offsetHeight || 0;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  {/* Función para mover el Expander en dispositivos táctiles */}
  const handleTouchMove = (evt: TouchEvent) => {
    evt.preventDefault();
    if (startYRef.current !== null && startHeightRef.current !== null) {
      const delta = startYRef.current - evt.touches[0].clientY;
      let newHeight = startHeightRef.current + delta;
      const maxExpanderHeight = window.innerHeight;
      const minExpanderHeight = getMinHeightPx();
      if (newHeight > maxExpanderHeight) newHeight = maxExpanderHeight;
      if (newHeight < minExpanderHeight) newHeight = minExpanderHeight;
      setExpanderHeight(`${newHeight}px`);
    }
  };
  
  {/* Función para soltar el Expander en dispositivos táctiles */}
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    startYRef.current = null;
    startHeightRef.current = null;
  };

  if (!resource) return null;

  const images = [
    resource[locale['url_img1']],
    resource[locale['url_img2']],
    resource[locale['url_img3']],
    resource[locale['url_img4']],
  ].filter(Boolean);

  const mainInfo = {
    [locale['distance']]: resource[locale['distance']],
    [locale['duration']]: resource[locale['duration']],
    [locale['route description']]: resource[locale['route description']],
  };
  
  const details = {
    [locale['difficulty']]: resource[locale['difficulty']],
    [locale['activity']]: resource[locale['activity']],
    [locale['access mode']]: resource[locale['access mode']],
  };
  
  const locationInfo = {
    [locale['starting point']]: resource[locale['starting point']],
    [locale['exit point']]: resource[locale['exit point']],
    [locale['municipalities through which it passes']]: resource[locale['municipalities through which it passes']],
  };
  
  const additionalInfo = {
    [locale['resources included']]: resource[locale['resources included']],
    [locale['optional activities:']]: resource[locale['optional activities:']],
    [locale['recommendations']]: resource[locale['recommendations']],
  };
  
  const description = {
    [locale['route description']]: resource[locale['route description']],
  };

  const requiredKeys = [
    'name', 'distance', 'duration',
    'difficulty', 'activity', 'access mode',
    'starting point', 'exit point', 'municipalities through which it passes',
    'resources included', 'optional activities:', 'recommendations',
    'route description'
  ];
  
  requiredKeys.forEach(key => {
    if (!locale[key]) {
      console.warn(`Missing locale key: ${key}`);
    }
  });

  return (
    <div
      ref={expanderRef}
      onMouseDown={handleMouseDown}
      className={`fixed bottom-0 left-0 w-full bg-gradient-to-t from-white to-gray-50
        transform transition-transform duration-300 rounded-t-3xl z-[10000]
        shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm
        ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ height: expanderHeight, cursor: 'row-resize' }}
    >

      <div className="flex justify-center items-center p-2">
        <div className="w-12 h-1 bg-gray-400 rounded-full" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-sm border-b border-gray-200 rounded-t-3xl" onTouchStart={handleTouchStart}>
        <Header
          resourceName={capitalizeWords(resource[locale['name']])}
          onClose={onClose}
          googleMapsUrl={resource[locale['url google maps']]}
          locale={locale}
        />
      </div>

      {/* Body content below header */}
      <div ref={contentRef} className="p-6 overflow-y-auto" style={{ height: `calc(${expanderHeight} - 90px)`, WebkitOverflowScrolling: 'touch'}}>
        <div className="flex flex-col lg:flex-row gap-8">
        <ImageGallery
            images={images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
          {/* Information Column */}
          <div className="lg:w-1/2 space-y-8">
          <BasicInfo 
            mainInfo={mainInfo}
            routeDetails={details}
            locationInfo={locationInfo}
            additionalInfo={additionalInfo}
            capitalizeWords={capitalizeWords}
            locale={locale}
            type="route" // 'route' for ExpanderRutas, 'resource' for ExpanderRecursos
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          </div>
        </div>
      </div>
    </div>
  );
}