import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  locale: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ locale }) => {
  return (
    <div className="p-3 sm:p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <Image 
            src="/Logo_cabo_verde.png"
            alt="Logo Cabo Verde"
            width={90}
            height={90}
            className="object-contain sm:w-[130px] sm:h-[130px]"
            priority
          />
          <h2 className="text-xs sm:text-lg font-bold text-gray-800 text-center">
            {locale['Santiago Resources map']}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Header;