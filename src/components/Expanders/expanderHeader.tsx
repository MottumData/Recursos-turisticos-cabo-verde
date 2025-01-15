import React from 'react';
import { FaMap } from 'react-icons/fa';

interface ExpanderHeaderProps {
  resourceName: string;
  onClose: () => void;
  googleMapsUrl: string;
}

const ExpanderHeader: React.FC<ExpanderHeaderProps> = ({ resourceName, onClose, googleMapsUrl }) => {
  return (
    <div className="flex flex-col items-center p-6 relative">
      <div className="flex justify-between w-full items-center">
        <h2 className="text-xl sm:text-4xl font-bold text-center flex-1 px-6 py-4
                    bg-gradient-to-r from-gray-800 to-gray-600 
                    bg-clip-text text-transparent">
          {resourceName}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100/80 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <button
        onClick={() => window.open(googleMapsUrl, '_blank')}
        className="flex items-center gap-2 px-4 py-2 mt-2 text-sm text-gray-600 hover:bg-gray-100/80 rounded-full transition-colors"
        title="Ver en Google Maps"
      >
        <FaMap className="h-5 w-5" />
        <span>Ver en Google Maps</span>
      </button>
    </div>
  );
};

export default ExpanderHeader;