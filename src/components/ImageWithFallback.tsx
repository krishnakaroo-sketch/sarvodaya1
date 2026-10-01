import React, { useState, useEffect } from 'react';

type ImageWithFallbackProps = React.ComponentProps<"img"> & {
  src?: string;
  fallbackSrc?: string;
};

export function ImageWithFallback({ src, fallbackSrc, ...props }: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbacks, setFallbacks] = useState<string[]>([]);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setCurrentSrc(src);
    setFallbackIndex(0);
    
    // Check if it's a local image in /images
    const match = src?.match(/^(\/images\/[^\.]+)\.(jpg|jpeg|png)$/);
    if (match) {
      const base = match[1];
      const originalExt = "." + match[2];
      const allExts = ['.jpg', '.jpeg', '.png'];
      
      // Create a list of fallbacks that are NOT the original extension
      const availableFallbacks = allExts
        .filter(ext => ext !== originalExt)
        .map(ext => `${base}${ext}`);
        
      setFallbacks(availableFallbacks);
    } else {
      setFallbacks([]);
    }
  }, [src]);

  const handleError = () => {
    if (fallbackIndex < fallbacks.length) {
      // Try the next available fallback extension
      setCurrentSrc(fallbacks[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try the explicit fallback src if all extensions fail
      setCurrentSrc(fallbackSrc);
    } else if (currentSrc !== "/images/dummy.png") {
      // Final universal fallback to the dummy avatar if no other fallbacks work
      setCurrentSrc("/images/dummy.png");
    }
  };

  return (
    <img
      src={currentSrc}
      onError={handleError}
      {...props}
    />
  );
}
