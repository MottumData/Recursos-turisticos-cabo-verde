import React, { useState, useRef } from 'react';
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
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str
    .toString()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function ExpanderRutas({ visible, onClose, resource, locale }: ExpanderRutasProps) {
  const [activeImage, setActiveImage] = useState(0);
  const expanderRef = useRef<HTMLDivElement>(null);

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAccessServicesOpen, setIsAccessServicesOpen] = useState(false);

  const [expanderHeight, setExpanderHeight] = useState('30vh');
  const startYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number | null>(null);

  const handleMouseDown = (evt: React.MouseEvent) => {
    evt.preventDefault();
    startYRef.current = evt.clientY;
    startHeightRef.current = expanderRef.current?.offsetHeight || 0;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (evt: MouseEvent) => {
    if (startYRef.current !== null && startHeightRef.current !== null) {
      const delta = startYRef.current - evt.clientY;
      let newHeight = startHeightRef.current + delta;
      const maxExpanderHeight = window.innerHeight;
      if (newHeight > maxExpanderHeight) newHeight = maxExpanderHeight;
      setExpanderHeight(`${newHeight}px`);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    startYRef.current = null;
    startHeightRef.current = null;
  };

  const handleTouchStart = (evt: React.TouchEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    startYRef.current = evt.touches[0].clientY;
    startHeightRef.current = expanderRef.current?.offsetHeight || 0;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleTouchMove = (evt: TouchEvent) => {
    evt.preventDefault();
    if (startYRef.current !== null && startHeightRef.current !== null) {
      const delta = startYRef.current - evt.touches[0].clientY;
      let newHeight = startHeightRef.current + delta;
      const maxExpanderHeight = window.innerHeight;
      if (newHeight > maxExpanderHeight) newHeight = maxExpanderHeight;
      setExpanderHeight(`${newHeight}px`);
    }
  };
  
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    startYRef.current = null;
    startHeightRef.current = null;
  };

  if (!resource) return null;

  // Image collection
  const images = [
    resource[locale['url_img1']],
    resource[locale['url_img2']],
    resource[locale['url_img3']],
    resource[locale['url_img4']],
  ].filter(Boolean);

  // Organize data into sections
  const basicInfo = {
    [locale['name']]: resource[locale['name']],
    [locale['municipalities through which it passes']]: resource[locale['municipalities through which it passes']],
    [locale['duration']]: resource[locale['duration']],
    [locale['distance']]: resource[locale['distance']],
    [locale['access mode']]: resource[locale['access mode']],
    [locale['difficulty']]: resource[locale['difficulty']],
    [locale['activity']]: resource[locale['activity']],
    [locale['resources included']]: resource[locale['resources included']],
    [locale['starting point']]: resource[locale['starting point']],
    [locale['exit point']]: resource[locale['exit point']],
    [locale['georeferenced resources']]: resource[locale['georeferenced resources']],
    [locale['url google maps']]: resource[locale['url google maps']],
    [locale['latlong route']]: resource[locale['latlong route']],
    [locale['ruta latlong transformada']]: resource[locale['ruta latlong transformada']],
    [locale['optional activities:']]: resource[locale['optional activities:']],
    [locale['recommendations']]: resource[locale['recommendations']],
    [locale['id']]: resource[locale['id']],
  };

  const description = {
    [locale['route description max. 300 words']]: resource[locale['route description max. 300 words']],
  };

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
        />
      </div>

      {/* Body content below header */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(80vh - 90px)', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Information Column */}
          <div className="lg:w-1/2 space-y-8">
            <BasicInfo basicInfo={basicInfo} capitalizeWords={capitalizeWords} />

            <Description
              description={description}
              isOpen={isDescriptionOpen}
              toggleOpen={() => setIsDescriptionOpen(!isDescriptionOpen)}
              capitalizeWords={capitalizeWords}
            />

            <AccessServices
              accessInfo={{}}
              services={{}} // Añadir información si es necesario
              isOpen={isAccessServicesOpen}
              toggleOpen={() => setIsAccessServicesOpen(!isAccessServicesOpen)}
              capitalizeWords={capitalizeWords}
            />
          </div>

          {/* Image and Gallery Column */}
          <ImageGallery
            images={images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
        </div>
      </div>
    </div>
  );
}