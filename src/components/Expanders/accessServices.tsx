import React from 'react';

interface AccessServicesProps {
  accessInfo: { [key: string]: any };
  services: { [key: string]: any };
  isOpen: boolean;
  toggleOpen: () => void;
  capitalizeWords: (str: string) => string;
}

const AccessServices: React.FC<AccessServicesProps> = ({ accessInfo, services, isOpen, toggleOpen, capitalizeWords }) => {
  return (
    <section className="space-y-4">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full text-xl font-semibold text-gray-800 border-b pb-2 focus:outline-none"
      >
        <span>Service and Access</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="space-y-4 mb-20">
          {[...Object.entries(accessInfo), ...Object.entries(services)].map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm"
                >
                  <h4 className="font-medium text-gray-700">{capitalizeWords(key)}</h4>
                  <p className="text-gray-600">{String(value)}</p>
                </div>
              )
          )}
        </div>
      )}
    </section>
  );
};

export default AccessServices;