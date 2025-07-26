import React, { useState, useEffect } from 'react';
import { getProductImageUrl, preloadImage, getCachedImage, cacheImage } from '../utils/imageUtils';

interface OptimizedImageProps {
  imageName: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  imageName,
  alt,
  className = '',
  lazy = true,
  onLoad,
  onError
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      // Try to get cached image first
      const cachedUrl = getCachedImage(imageName);
      if (cachedUrl) {
        setSrc(cachedUrl);
        return;
      }

      // If not cached, get the full URL
      const imageUrl = getProductImageUrl(imageName);
      
      try {
        // Preload the image
        await preloadImage(imageUrl);
        setSrc(imageUrl);
        setLoaded(true);
        // Cache the successful URL
        cacheImage(imageName, imageUrl);
        onLoad?.();
      } catch (err) {
        console.error('Failed to load image:', imageName);
        setError(true);
        onError?.();
      }
    };

    loadImage();
  }, [imageName, onLoad, onError]);

  return (
    <img
      src={error ? '/public/spices.png' : src}
      alt={alt}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      loading={lazy ? 'lazy' : 'eager'}
      onError={() => {
        setError(true);
        onError?.();
      }}
    />
  );
};
