import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SidebarToggleProps {
  visible: boolean;
  onToggle: () => void;
  className?: string;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ visible, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-10 left-full transform -translate-y-1/2 bg-white border border-gray-300 
    rounded-r-lg shadow-md p-2 focus:outline-none z-[100000] transition-all duration-300 ease-in-out"
    style={{
        left: visible ? 
          'min(400px, max(60vw, min(40vw, 400px)))' : // Coincide con el ancho máximo del sidebar
          '0px'
      }}
    >
      {visible ? (
        <FaChevronLeft className="h-4 w-4 text-gray-700" />
      ) : (
        <FaChevronRight className="h-4 w-4 text-gray-700" />
      )}
    </button>
  );
};

export default SidebarToggle;