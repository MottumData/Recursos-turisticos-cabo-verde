import { useEffect } from 'react';
import { Route, loadRoutesCSV } from '../Utils/loadCsv';

type Language = 'pt' | 'en' | 'es';

interface SidebarUtilsProps {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  language: Language;
  locale: { [key: string]: string };
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  setDurationOptions: React.Dispatch<React.SetStateAction<{ key: string; label: string }[]>>;
  setActivityOptions: React.Dispatch<React.SetStateAction<{ key: string; label: string }[]>>;
  routes: Route[];
  filteredDurations: string[];
  filteredActivities: string[];
  setFilteredRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
}

const useSidebarHooks = ({
  sidebarRef,
  onClose,
  language,
  locale,
  setRoutes,
  setDurationOptions,
  setActivityOptions,
  routes,
  filteredDurations,
  filteredActivities,
  setFilteredRoutes
}: SidebarUtilsProps) => {

  {/* Cerrar el sidebar cuando clicamos fuera de el mismo */}
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef, onClose]);

  {/* Cargar las rutas desde el CSV */}
  useEffect(() => {
    const csvFilePath = `/data/rutas_cabo_verde_${language}.csv`;
    loadRoutesCSV(csvFilePath, language).then(data => {
      setRoutes(data);

      const uniqueDurations = Array.from(new Set(data.map(route => route[locale['duration_final']]))).sort();
      
      const cleanActivity = (activity: string) => {
        return activity
          .replace(/[\[\]']/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      };

      const uniqueActivities: string[] = Array.from(
        new Set(
          data.flatMap((route: Route) => 
            route[locale['activity_list']]
              .split(',')
              .map(cleanActivity)
          )
        )
      )
      .map(activity => activity.charAt(0).toUpperCase() + activity.slice(1))
      .sort();
      
      const formattedDurations = uniqueDurations.map(value => ({ key: value, label: value }));
      const formattedActivities = uniqueActivities.map(value => ({ key: value, label: value }));
      
      setDurationOptions(formattedDurations);
      setActivityOptions(formattedActivities);
    }).catch(error => {
      console.error('Error loading routes:', error);
    });
  }, [language, locale, setRoutes, setDurationOptions, setActivityOptions]);

  {/* Filtrar las rutas según las duraciones y actividades seleccionadas */}
  useEffect(() => {
    let filtered = routes;
  
    if (filteredDurations.length > 0) {
      filtered = filtered.filter(route => filteredDurations.includes(route[locale['duration_final']]));
    }
  
    if (filteredActivities.length > 0) {
      filtered = filtered.filter(route => {
        const routeActivities: string[] = route[locale['activity_list']]
          .replace(/[\[\]']/g, '')
          .split(',')
          .map((activity: string) => activity.trim().toLowerCase());
        
        return filteredActivities.some(
          filterActivity => routeActivities.includes(filterActivity.toLowerCase())
        );
      });
    }
  
    setFilteredRoutes(filtered);
  }, [routes, filteredDurations, filteredActivities, locale, setFilteredRoutes]);
};

export default useSidebarHooks;