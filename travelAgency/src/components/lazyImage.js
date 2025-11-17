import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const LazyImage = ({ src, alt, width, height ,className }) => (
  <div>
    <LazyLoadImage
      alt={alt}
      height={height}
      src={src}
      width={width}
      className={className} />
  </div>
);

export default LazyImage;