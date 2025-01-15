import React from 'react';

interface BasicInfoProps {
  basicInfo: { [key: string]: any };
  capitalizeWords: (str: string) => string;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ basicInfo, capitalizeWords }) => {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(basicInfo).map(
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
    </section>
  );
};

export default BasicInfo;