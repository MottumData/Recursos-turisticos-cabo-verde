import React from 'react';

interface ImageGalleryProps {
  images: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, activeImage, setActiveImage }) => {
  return (
    <div className="lg:w-1/2">
      {images.length > 0 && (
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden mb-4 flex justify-center items-center">
            <div
              className="aspect-ratio-container"
              style={{ aspectRatio: '16/9', minHeight: '100px', maxHeight: '400px' }}
            >
              <img
                src={images[activeImage]}
                alt={`Image ${activeImage + 1}`}
                loading="eager"
                decoding="sync"
                className="w-full h-full object-contain object-center transform transition-transform duration-300 hover:scale-105"
                style={{
                  imageRendering: 'crisp-edges',
                  WebkitFontSmoothing: 'antialiased',
                  backfaceVisibility: 'hidden',
                  filter: 'contrast(1.05) brightness(1.05)',
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden 
                          transition-all duration-300 hover:scale-105
                          ${
                            activeImage === idx
                              ? 'ring-2 ring-gray-700 opacity-100'
                              : 'opacity-70'
                          }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  style={{
                    imageRendering: 'crisp-edges',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;