import Papa from 'papaparse';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';

export interface TouristResource {
  lat: number;
  lng: number;
  title: string;
  description: string;
  cara: string;
}

const locales = { pt, en, es };

type Language = 'pt' | 'en' | 'es';
const language: Language = 'pt'; // Set default language or get it from a context or prop

export const loadCSV = (csvFilePath: string, language: Language): Promise<TouristResource[]> => {
  const locale = locales[language];
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.map((row: any) => {
          const [lat, lng] = row['Lat-Long'].split(',').map((coord: string) => parseFloat(coord.trim()));
          return {
            lat,
            lng,
            title: row[locale['Nome do recurso turístico']],
            description: row[locale['Descrição do produto']],
            cara: row['Cara']
          };
        });
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};