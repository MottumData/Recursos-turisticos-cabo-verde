'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Route } from './loadCsv';

interface RoutingControlProps {
  selectedRoute: Route | null;
  onRouteClick?: () => void;
  locale: { [key: string]: string };
}

export default function RoutingControl({ selectedRoute, onRouteClick, locale }: RoutingControlProps) {
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  {/* useEffect para cargar la ruta seleccionada en el mapa */}
  useEffect(() => {
    if (selectedRoute) {
      const recursosGeoreferenciados = selectedRoute[locale["georeferenced resources"]];

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
      
      {/* Función asíncrona para obtener la ruta */}
      const fetchRoute = async () => {
        try {
          const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
            method: 'POST',
            headers: {
              'Authorization': '5b3ce3597851110001cf624806d373a127de42c6ac73f64c01f3d2a1',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              coordinates: waypoints,
              radiuses: waypoints.map(() => 10000),
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
      <>
        {/* Línea visible */}
        <Polyline 
          positions={routeCoords} 
          pathOptions={{ 
            color: 'blue', 
            weight: 8, 
            opacity: 0.7,
            className: 'no-focus-outline',
            interactive: true
          }} 
          eventHandlers={{
            click: onRouteClick,
            mouseover: (e) => {
              e.target.getElement()?.style.removeProperty('outline');
            }
          }}
        >
          <Tooltip sticky className='no-focus-outline'>
            Click para más información
          </Tooltip>
        </Polyline>

        {/* Capa interactiva transparente */}
        <Polyline 
          positions={routeCoords} 
          pathOptions={{ 
            color: 'transparent', 
            weight: 20, 
            opacity: 0,
            className: 'no-focus-outline',
            interactive: true
          }} 
          eventHandlers={{
            click: onRouteClick,
          }}
        />
      </>
    )}
  </>
  );
}