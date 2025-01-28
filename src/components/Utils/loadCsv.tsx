import Papa from 'papaparse';
import pt from '../../../public/locale/pt';
import en from '../../../public/locale/en';
import es from '../../../public/locale/es';

export interface TouristResource {
  id: string;
  lat: number;
  lng: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Route {
  name: string;
  coordinates: [number, number][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const locales = { pt, en, es };

type Language = 'pt' | 'en' | 'es';

{/* Función para cargar los recursos turísticos desde un archivo CSV */}
export const loadCSV = (csvFilePath: string, language: Language): Promise<TouristResource[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: TouristResource[] = results.data.map((row: any) => {
          console.log('Lat-Long value:', row['Lat-Long']);
          const [lat, lng] = row['Lat-Long'].split(',').map((coord: string) => parseFloat(coord.trim()));
          
          const resource: TouristResource = {
            id: row['id'],
            lat,
            lng,
          };
          for (const [key, value] of Object.entries(row)) {
            if (key !== 'Lat-Long') {
              if (key === 'Cara') {
                resource['cara'] = value; 
              } else {
                resource[key.toLowerCase()] = value;
              }
            }
          }
          return resource;
        });
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

{/* Función para cargar las rutas desde un archivo CSV */}
export const loadRoutesCSV = (csvFilePath: string, language: Language): Promise<Route[]> => {
  const locale = locales[language];
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Route[] = results.data.map((row: any) => {
          const coordinates = row['Ruta LatLong Transformada']
          ? row['Ruta LatLong Transformada'].split(';').map((coord: string) => {
              const [lat, lng] = coord.split(',').map((c: string) => parseFloat(c.trim()));
              return [lat, lng] as [number, number];
            })
          : [];
          const route: Route = {
            name: row[locale['Nome da rota']],
            coordinates,
          };
          for (const [key, value] of Object.entries(row)) {
            if (key !== 'Rota LatLong Transformada' && key !== 'Nome da rota') {
              route[key.toLowerCase()] = value;
            }
          }
          return route;
        });
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};