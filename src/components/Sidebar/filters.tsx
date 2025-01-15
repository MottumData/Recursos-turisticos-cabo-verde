import React from 'react';
import CategoryFilter from '../filter';

type Language = 'pt' | 'en' | 'es';

interface FiltersProps {
  language: Language;
  setFilteredDurations: (durations: string[]) => void;
  setFilteredActivities: (activities: string[]) => void;
  durationOptions: { key: string; label: string }[];
  activityOptions: { key: string; label: string }[];
  locale: { [key: string]: string };
  filteredRoutesCount: number;
}

const Filters: React.FC<FiltersProps> = ({
  language,
  setFilteredDurations,
  setFilteredActivities,
  durationOptions,
  activityOptions,
  locale,
  filteredRoutesCount
}) => {
  return (
    <>
      <div className="px-4 py-0 sm:px-6 sm:py-0">
        <CategoryFilter
          language={language}
          onFilterChange={setFilteredDurations}
          options={durationOptions}
          localeKey="Filter_Duration"
        />
      </div>

      <div className="px-4 py-2 sm:px-6 sm:py-4">
        <CategoryFilter
          language={language}
          onFilterChange={setFilteredActivities}
          options={activityOptions}
          localeKey="Filter_Activity"
        />
      </div>
      <div className="mb-2 mt-4 text-center text-xs sm:text-base">
        {`${locale['Showing']} ${filteredRoutesCount} ${locale['of 23 available routes']}`}
      </div>
    </>
  );
}

export default Filters;