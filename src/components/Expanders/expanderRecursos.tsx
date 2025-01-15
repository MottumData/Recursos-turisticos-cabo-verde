import React, { useState, useEffect, useRef } from 'react';
import Header from './expanderHeader';
import BasicInfo from './basicInfo';
import Description from './description';
import AccessServices from './accessServices';
import ImageGallery from './imageGallery';

interface TouristResource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ExpanderProps {
  visible: boolean;
  onClose: () => void;
  resource?: TouristResource;
  language: 'pt' | 'en' | 'es';
  locale: { [key: string]: string };
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.toString().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function Expander({ visible, onClose, resource, locale }: ExpanderProps) {
  const [activeImage, setActiveImage] = useState(0);
  const expanderRef = useRef<HTMLDivElement>(null);

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAccessServicesOpen, setIsAccessServicesOpen] = useState(false);

  const [expanderHeight, setExpanderHeight] = useState('40vh');
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
      // Impose a max limit so the header doesn't keep moving past top
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
  
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (expanderRef.current && !expanderRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

  if (!resource) return null;

  // Image collection
  const images = [
    resource[locale['feature images']],
    resource[locale['feature 1 images']],
    resource[locale['feature 2 images']],
    resource[locale['feature 3 images']],
    resource[locale['feature 4 images']],
  ].filter(Boolean);

  // Organize data into sections
  const basicInfo = {
    [locale['nome do recurso turístico']]: resource[locale['nome do recurso turístico']],
    [locale['island']]: resource[locale['island']],
    [locale['council']]: resource[locale['council']],
    [locale['parish']]: resource[locale['parish']],
    [locale['vila']]: resource[locale['vila']],
    [locale['neighborhood']]: resource[locale['neighborhood']]
  };

  const description = {
      [locale['descrição do produto']]: resource[locale['descrição do produto']],
      [locale['associated material elements']]: resource[locale['associated material elements']],
      [locale['associated natural elements']]: resource[locale['associated natural elements']],
      [locale['uniqueness that sets it apart from others in the region']]: resource[locale['uniqueness that sets it apart from others in the region']]
  };

  const accessInfo = {
      [locale['resource access [public or private domain]']]: resource[locale['resource access [public or private domain]']],
      [locale['means of travel']]: resource[locale['means of travel']],
      [locale['conservation status']]: resource[locale['conservation status']],
      [locale['type of income']]: resource[locale['type of income']]
  };

  const services = {
      [locale['basic services (within the tourist resort)']]: resource[locale['basic services (within the tourist resort)']],
      [locale['emergency services (within the tourist resort)']]: resource[locale['emergency services (within the tourist resort)']],
      [locale['other tourist services (within the tourist resource)']]: resource[locale['other tourist services (within the tourist resource)']]
  };
  return (
    <div
      ref={expanderRef}
      onMouseDown={handleMouseDown}
      className={`fixed bottom-0 left-0 w-full bg-gradient-to-t from-white to-gray-50
        transform transition-transform duration-300 rounded-t-3xl z-[10000]
        shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm
        ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: expanderHeight, cursor: 'row-resize', overscrollBehavior: 'contain' }}
    >

      <div className="flex justify-center items-center p-2">
        <div className="w-12 h-1 bg-gray-400 rounded-full" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-sm border-b border-gray-200 rounded-t-3xl" onTouchStart={handleTouchStart}>
        <Header
          resourceName={capitalizeWords(resource[locale['nome do recurso turístico']])}
          onClose={onClose}
          googleMapsUrl={resource[locale['url google maps']]}
        />
      </div>
  
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(80vh - 90px)', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Information Column */}
          <div className="lg:w-1/2 space-y-8">
            {/* Basic Information */}
            <BasicInfo basicInfo={basicInfo} capitalizeWords={capitalizeWords} />

            {/* Description */}
            <Description
              description={description}
              isOpen={isDescriptionOpen}
              toggleOpen={() => setIsDescriptionOpen(!isDescriptionOpen)}
              capitalizeWords={capitalizeWords}
            />

            {/* Access and Services */}
            <AccessServices
              accessInfo={accessInfo}
              services={services}
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