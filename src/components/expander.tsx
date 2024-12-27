import React from 'react';

interface TouristResource {
  [key: string]: any; // Include all columns from CSV
}

interface ExpanderProps {
  visible: boolean;
  onClose: () => void;
  resource?: TouristResource;
  language: 'pt' | 'en' | 'es';
  locale: { [key: string]: string };
}

export default function Expander({ visible, onClose, resource, locale }: ExpanderProps) {
  if (!resource) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white shadow-2xl 
        transform transition-transform duration-300 rounded-t-2xl z-[10000]
        ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ height: '60vh' }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          {resource['Tourist resource name'] || resource.title}
        </h2>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={onClose}
          aria-label={locale['Close'] || 'Close'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 overflow-y-auto" style={{ height: 'calc(60vh - 70px)' }}>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(resource).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">{key}</h4>
              <p className="text-gray-600">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}