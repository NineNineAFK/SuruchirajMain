// In development, images are served from localhost
// In production, they are served from the root domain
const BASE_DOMAIN = import.meta.env.VITE_domainName.replace('/api', '');
const IMAGE_BASE_URL = `${BASE_DOMAIN}/images/products/`;

// Helper to sort images putting lifestyle shots first
export const sortProductImages = (images: string[]): string[] => {
  return images.sort((a, b) => {
    const isALifestyle = a.toLowerCase().includes('lifestyle shot');
    const isBLifestyle = b.toLowerCase().includes('lifestyle shot');
    if (isALifestyle && !isBLifestyle) return -1;
    if (!isALifestyle && isBLifestyle) return 1;
    return 0;
  });
};

// Get full image URL with proper error handling
export const getProductImageUrl = (imageName: string | undefined): string => {
  // Handle empty, undefined, or default product cases
  if (!imageName || imageName === 'default-product.png' || imageName === 'spices.png') {
    return BASE_DOMAIN + '/images/products/spices.png';
  }
  
  // Handle absolute paths and full URLs
  if (imageName.startsWith('/')) return BASE_DOMAIN + imageName;
  if (imageName.startsWith('http')) return imageName;
  
  // Keep original filename with spaces intact as your server handles spaces correctly
  const url = `${IMAGE_BASE_URL}${imageName}`;
  console.log('Constructing image URL:', { imageName, baseUrl: IMAGE_BASE_URL, fullUrl: url });
  return url;
};

// Function to preload an image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
};

// Get image size class based on viewport
export const getImageSizeClass = (viewportWidth: number): string => {
  if (viewportWidth <= 640) return 'w-full';
  if (viewportWidth <= 1024) return 'w-1/2';
  return 'w-1/3';
};

// Image caching utility using localStorage
const IMAGE_CACHE_PREFIX = 'img_cache_';
const IMAGE_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedImage {
  url: string;
  timestamp: number;
}

export const cacheImage = (imageName: string, url: string): void => {
  try {
    const cacheEntry: CachedImage = {
      url,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${IMAGE_CACHE_PREFIX}${imageName}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Failed to cache image:', error);
  }
};

export const getCachedImage = (imageName: string): string | null => {
  try {
    const cached = localStorage.getItem(`${IMAGE_CACHE_PREFIX}${imageName}`);
    if (!cached) return null;

    const { url, timestamp }: CachedImage = JSON.parse(cached);
    if (Date.now() - timestamp > IMAGE_CACHE_EXPIRY) {
      localStorage.removeItem(`${IMAGE_CACHE_PREFIX}${imageName}`);
      return null;
    }

    return url;
  } catch (error) {
    console.warn('Failed to retrieve cached image:', error);
    return null;
  }
};

// Clean up expired cache entries
export const cleanImageCache = (): void => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(IMAGE_CACHE_PREFIX))
      .forEach(key => {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp }: CachedImage = JSON.parse(cached);
          if (Date.now() - timestamp > IMAGE_CACHE_EXPIRY) {
            localStorage.removeItem(key);
          }
        }
      });
  } catch (error) {
    console.warn('Failed to clean image cache:', error);
  }
};
