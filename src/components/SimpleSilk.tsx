import React, { useEffect, useState } from 'react';

const SimpleSilk: React.FC = () => {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 400);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${45 + gradientPosition / 4}deg, #0F1F3A, #061124, #020B1A, #0F1F3A)`,
        backgroundSize: '400% 400%',
        backgroundPosition: `${gradientPosition}% 50%`,
        zIndex: 0,
      }}
    />
  );
};

export default SimpleSilk;