'use client';

import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSX } from 'react';
import { FaLandmark, FaUmbrellaBeach, FaMonument, FaGuitar, FaPalette, FaWrench, FaPaintBrush, FaPrayingHands, FaSeedling, FaMountain, FaBinoculars, FaGem, FaUsers, FaUniversity, FaTractor } from 'react-icons/fa';

export function createColoredDivIcon(iconElement: JSX.Element, bgColor: string) {
  const size = 30; {/* Tamaño del círculo exterior */}
  const iconScale = 0.8; {/* Factor de escala para el icono interior */}
  
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

export function getIcon(resource: any, language: any, locales: any) {
  const locale = locales[language];
  if (!resource || !resource.cara) {
    return createColoredDivIcon(<FaLandmark size={24} color="#fff" />, '#888');
  }

  const cleanCara = resource.cara.trim();
  switch (cleanCara) {
    case locale['Cara_Beaches_and_Coastal_Locations']:
      return createColoredDivIcon(<FaUmbrellaBeach size={24} color="#fff" />, '#F4D03F'); // Azul océano
    case locale['Cara_Archaeological Legacy']:
      return createColoredDivIcon(<FaMonument size={24} color="#fff" />, '#d2b48c'); // Arena/piedra
    case locale['Cara_Folclore Materials']:
      return createColoredDivIcon(<FaGuitar size={24} color="#fff" />, '#cd5c5c'); // Rojo tradicional
    case locale['Cara_Representative Works of Art']:
      return createColoredDivIcon(<FaPalette size={24} color="#fff" />, '#9370db'); // Púrpura artístico
    case locale['Cara_Engineering Works']:
      return createColoredDivIcon(<FaWrench size={24} color="#fff" />, '#DC143C'); // Azul acero
    case locale['Cara_Museums and Exhibition Halls']:
      return createColoredDivIcon(<FaPaintBrush size={24} color="#fff" />, '#800020'); // Borgoña
    case locale['Cara_Spiritual Folklore']:
      return createColoredDivIcon(<FaPrayingHands size={24} color="#fff" />, '#4b0082'); // Índigo profundo
    case locale['Cara_Vales']:
      return createColoredDivIcon(<FaSeedling size={24} color="#fff" />, '#90ee90'); // Verde claro
    case locale['Cara_Mountains and Mountains']:
      return createColoredDivIcon(<FaMountain size={24} color="#fff" />, '#708090'); // Gris pizarra
    case locale['Cara_Flora and Fauna Observation Sites']:
      return createColoredDivIcon(<FaBinoculars size={24} color="#fff" />, '#228b22'); // Verde bosque
    case locale['Cara_Geological and Paleontological Formations']:
      return createColoredDivIcon(<FaGem size={24} color="#fff" />, '#8b4513'); // Marrón soga
    case locale['Cara_Ethnic Groups']:
      return createColoredDivIcon(<FaUsers size={24} color="#fff" />, '#e27d60'); // Terracota
    case locale['Cara_Human Settlements and Living Architecture']:
      return createColoredDivIcon(<FaUniversity size={24} color="#fff" />, '#b22222'); // Rojo ladrillo
    case locale['Cara_Agricultural Exploration']:
      return createColoredDivIcon(<FaTractor size={24} color="#fff" />, '#daa520'); // Trigo dorado
    default:
      return createColoredDivIcon(<FaLandmark size={24} color="#fff" />, '#778899'); // Gris pizarra claro
  }
}