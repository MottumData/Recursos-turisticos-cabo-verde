import { useState } from 'react';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';

interface LocaleType {
    [key: string]: string;
    Filter_Categories: string;
  }
  
  const locales: { [key in 'pt' | 'en' | 'es']: LocaleType } = { pt, en, es };
  
  type Language = 'pt' | 'en' | 'es';

interface CategoryFilterProps {
  language: Language;
  onFilterChange: (selectedCategories: string[]) => void;
}

export default function CategoryFilter({ language, onFilterChange }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const locale = locales[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryKey: string) => {
    const newCategories = selectedCategories.includes(categoryKey)
      ? selectedCategories.filter(cat => cat !== categoryKey)
      : [...selectedCategories, categoryKey];
    
    setSelectedCategories(newCategories);
    onFilterChange(newCategories); // This will send the category keys to parent
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="space-y-2">
      {Object.keys(locale)
        .filter(key => key.startsWith('Cara_'))
        .map(category => (
          <label 
            key={category} 
            className="flex items-center p-2 rounded-lg hover:bg-white/60 
                     transition-colors duration-200 cursor-pointer group"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(locale[category])}
                onChange={() => toggleCategory(locale[category])}
                className="w-5 h-5 border-2 border-gray-300 rounded-md
                         checked:bg-blue-500 checked:border-blue-500
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-colors duration-200"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium
                           group-hover:text-gray-900 transition-colors duration-200">
                {locale[category]}
              </span>
            </div>
          </label>
        ))}
    </div>
  );
}