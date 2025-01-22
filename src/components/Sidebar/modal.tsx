import React, { useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: { [key: string]: string };
}

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose, locale }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {locale['How_to_select_route'] || 'How to select your route'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800">1. {locale['Use_filters'] || 'Use the filters'}</h3>
              <img 
                src="Seleccionar_filtros.png" 
                alt="Filters example"
                className="rounded-lg shadow-md w-full max-w-md mx-auto"
              />
              <p className="text-gray-600">
                {locale['Filters_explanation'] || 'Start by using the category, duration, and activity filters to narrow down your options.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800">2. {locale['Select_from_list'] || 'Select from the list'}</h3>
              <img 
                src="Seleccionar_rutas.png" 
                alt="Route selection"
                className="rounded-lg shadow-md w-full max-w-md mx-auto"
              />
              <p className="text-gray-600">
                {locale['selection_explanation'] || 'Choose your preferred route from the filtered list of options.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-800">3. {locale['Visualize_route'] || 'Visualize de route'}</h3>
                <img 
                  src="Ruta_seleccionada.png" 
                  alt="Route selection"
                  className="rounded-lg shadow-md w-full max-w-md mx-auto "
                />
                <p className="text-gray-600">
                  {locale['Route_displayed'] || 'Choose your preferred route from the filtered list of options.'}
                </p>
              </div>
            </div>
          </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale['Understood'] || 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteModal;