import Papa from 'papaparse';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';

export interface TouristResource {
  lat: number;
  lng: number;
  [key: string]: any; // Allows any other CSV fields
}

const locales = { pt, en, es };

type Language = 'pt' | 'en' | 'es';
const language: Language = 'pt';

export const loadCSV = (csvFilePath: string, language: Language): Promise<TouristResource[]> => {
  const locale = locales[language];
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        const data: TouristResource[] = results.data.map((row: any) => {
          const [lat, lng] = row['Lat-Long'].split(',').map((coord: string) => parseFloat(coord.trim()));
          const resource: TouristResource = {
            lat,
            lng,
          };
          // Copiar todas las demás columnas
          for (const [key, value] of Object.entries(row)) {
            if (key !== 'Lat-Long') {
              if (key === 'Cara') {
                resource['cara'] = value; // Mapeo explícito de 'Cara' a 'cara'
              } else {
                resource[key.toLowerCase()] = value; // Normalizar otras claves si es necesario
              }
            }
          }
          console.log("Parsed resource:", resource);
          console.log("resource con cara:", resource.cara) // Para depuración
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