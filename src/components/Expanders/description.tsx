import React from 'react';

interface DescriptionProps {
  description: { [key: string]: any };
  isOpen: boolean;
  toggleOpen: () => void;
  capitalizeWords: (str: string) => string;
}

const Description: React.FC<DescriptionProps> = ({ description, isOpen, toggleOpen, capitalizeWords }) => {
  return (
    <section className="space-y-4">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full text-xl font-semibold text-gray-800 border-b pb-2 focus:outline-none"
      >
        <span>Description</span>
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
        <div className="space-y-4">
          {Object.entries(description).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm"
                >
                  <h4 className="font-medium text-gray-700 mb-2">{capitalizeWords(key)}</h4>
                  <p className="text-gray-600 whitespace-pre-line">{String(value)}</p>
                </div>
              )
          )}
        </div>
      )}
    </section>
  );
};

export default Description;