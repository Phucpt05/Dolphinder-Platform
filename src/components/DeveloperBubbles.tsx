import React, { useEffect, useState } from "react";
import { loadDevelopers, type Dev } from "../data/loadDevs";

interface BubbleProps {
  dev: Dev;
  index: number;
}

interface DeveloperBubbleProps extends BubbleProps {
  position: { x: number; y: number; delay: number; duration: number };
  screenSize: { width: number; height: number };
  totalBubbles: number;
}

const DeveloperBubble: React.FC<DeveloperBubbleProps> = ({
  dev,
  position,
  screenSize,
  totalBubbles,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState<number | null>(null);

  // Calculate responsive size based on screen size and number of bubbles
  const getResponsiveSize = () => {
    // Base sizes for different screen sizes
    let baseSize = 16; // default desktop size (w-16 h-16)

    if (screenSize.width < 640)
      baseSize = 10; // small mobile
    else if (screenSize.width < 768)
      baseSize = 12; // mobile
    else if (screenSize.width < 1024) baseSize = 14; // tablet

    // Adjust size based on number of bubbles for better distribution
    let sizeMultiplier = 1;

    if (totalBubbles <= 5) {
      sizeMultiplier = 1.3; // Make bubbles larger when there are few
    } else if (totalBubbles <= 10) {
      sizeMultiplier = 1.15;
    } else if (totalBubbles <= 15) {
      sizeMultiplier = 1.0;
    } else if (totalBubbles <= 25) {
      sizeMultiplier = 0.9;
    } else {
      sizeMultiplier = 0.8; // Make bubbles smaller when there are many
    }

    // Calculate final size
    const finalSize = Math.round(baseSize * sizeMultiplier);

    // Ensure minimum and maximum sizes for consistency
    const clampedSize = Math.max(8, Math.min(24, finalSize));

    return `w-${clampedSize} h-${clampedSize}`;
  };

  const bubbleSize = getResponsiveSize();

  // Handle touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default behaviors like image zoom, context menu, text selection
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (touchTimeout) {
      clearTimeout(touchTimeout);
    }

    // Set hover state after a short delay (like press and hold)
    const timeoutId = window.setTimeout(() => {
      setIsHovered(true);
    }, 150); // 150ms delay for press and hold feel

    setTouchTimeout(timeoutId);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Prevent default behaviors
    e.preventDefault();
    e.stopPropagation();

    // Clear timeout if touch ends before hover activates
    if (touchTimeout) {
      window.clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }

    // If hover was activated (touch was long enough), show tooltip for a while
    if (isHovered) {
      // Remove hover state after a delay to allow users to see the tooltip
      window.setTimeout(() => {
        setIsHovered(false);
      }, 2000); // Show tooltip for 2 seconds after release
    } else {
      // If it was a quick tap (not long enough to activate hover), navigate immediately
      window.open(`/${dev.username}`, "_blank");
    }
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    // Prevent default behaviors
    e.preventDefault();
    e.stopPropagation();

    // Handle touch cancel (when touch is interrupted)
    if (touchTimeout) {
      window.clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
    setIsHovered(false);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (touchTimeout) {
        window.clearTimeout(touchTimeout);
      }
    };
  }, [touchTimeout]);

  return (
    <div
      className={`developer-bubble absolute touch-manipulation transition-all duration-300 select-none ${
        isHovered ? "z-30 scale-110" : "z-10 scale-100"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${position.delay}s`,
        animationDuration: `${position.duration}s`,
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onContextMenu={e => e.preventDefault()} // Prevent context menu on long press
    >
      <div
        className={`group relative cursor-pointer ${
          isHovered ? "animate-none" : "animate-float"
        }`}
        onClick={e => {
          // Prevent double navigation on touch devices
          if (e.detail === 0) {
            // This is a programmatic click (from touch), don't handle it here
            return;
          }
          // This is a real mouse click on desktop
          window.open(`/${dev.username}`, "_blank");
        }}
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={dev.avatar || `https://github.com/${dev.username}.png`}
            alt={dev.name}
            className={`${bubbleSize} pointer-events-none rounded-full border-3 border-white/30 shadow-lg transition-all duration-300 select-none group-hover:border-blue-400/60 group-hover:shadow-blue-500/30`}
            style={{
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = `https://github.com/${dev.username}.png`;
            }}
          />

          {/* Glow effect */}
          {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"></div> */}
        </div>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform rounded-lg bg-black/90 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="font-semibold">{dev.name}</div>
          <div className="text-xs text-gray-300">@{dev.username}</div>
          {dev.bio && (
            <div className="mt-1 max-w-48 truncate text-xs text-gray-400">
              {dev.bio}
            </div>
          )}

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-black/90"></div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if two circles overlap
const checkOverlap = (
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
  totalBubbles: number,
  screenWidth: number = 1024
) => {
  // Fixed minimum distance for consistent spacing
  let baseDistance = 12;

  // Adjust based on bubble count
  if (totalBubbles <= 5) {
    baseDistance = 18; // More space for fewer bubbles
  } else if (totalBubbles <= 10) {
    baseDistance = 15;
  } else if (totalBubbles <= 20) {
    baseDistance = 12;
  } else {
    baseDistance = 10; // Less space for many bubbles
  }

  // Adjust for screen size
  if (screenWidth < 640) baseDistance *= 0.8;
  else if (screenWidth < 768) baseDistance *= 0.9;

  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < baseDistance;
};

// Generate non-overlapping positions with better distribution
const generatePositions = (count: number, screenWidth: number = 1024) => {
  const positions: Array<{
    x: number;
    y: number;
    delay: number;
    duration: number;
  }> = [];
  const maxAttempts = 50; // Reduced attempts for faster positioning

  // Use grid-based positioning for better distribution
  const cols = Math.ceil(Math.sqrt(count * 1.5)); // Wider grid for better spacing
  const rows = Math.ceil(count / cols);
  
  // Calculate spacing based on screen size and bubble count
  const cellWidth = 80 / cols; // Use 80% of screen width
  const cellHeight = 80 / rows; // Use 80% of screen height
  
  // Add some randomness to avoid perfect grid appearance
  const randomOffset = 0.3; // 30% random offset within each cell

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Base position in grid
    const baseX = 10 + (col + 0.5) * cellWidth; // Start at 10% from left
    const baseY = 10 + (row + 0.5) * cellHeight; // Start at 10% from top
    
    // Add random offset within cell
    const randomX = (Math.random() - 0.5) * cellWidth * randomOffset;
    const randomY = (Math.random() - 0.5) * cellHeight * randomOffset;
    
    let position = {
      x: Math.max(5, Math.min(95, baseX + randomX)), // Clamp between 5% and 95%
      y: Math.max(5, Math.min(95, baseY + randomY)), // Clamp between 5% and 95%
      delay: Math.random() * 3, // Reduced delay range for smoother animation
      duration: 6 + Math.random() * 3, // Reduced duration range
    };

    // Check for overlaps and adjust if necessary
    let attempts = 0;
    while (
      attempts < maxAttempts &&
      positions.some(existingPos =>
        checkOverlap(position, existingPos, count, screenWidth)
      )
    ) {
      // Slightly adjust position
      position = {
        ...position,
        x: Math.max(5, Math.min(95, position.x + (Math.random() - 0.5) * 5)),
        y: Math.max(5, Math.min(95, position.y + (Math.random() - 0.5) * 5)),
      };
      
      attempts++;
    }

    positions.push(position);
  }

  return positions;
};

const DeveloperBubbles: React.FC = () => {
  const [developers, setDevelopers] = useState<Dev[]>([]);
  const [positions, setPositions] = useState<
    Array<{ x: number; y: number; delay: number; duration: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devs = await loadDevelopers();
        setDevelopers(devs);
        // Generate positions after we know how many developers we have
        // Use current screen width or default to 1024 for initial generation
        const currentWidth = window.innerWidth || 1024;
        setPositions(generatePositions(devs.length, currentWidth));
      } catch (error) {
        console.error("Error loading developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Handle screen resize for responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setScreenSize({
        width: newWidth,
        height: newHeight,
      });

      // Regenerate positions if screen size changed significantly and we have developers
      if (developers.length > 0) {
        const widthDifference = Math.abs(newWidth - screenSize.width);
        // Regenerate positions if width changed by more than 150px (significant breakpoint change)
        if (widthDifference > 150) {
          setPositions(generatePositions(developers.length, newWidth));
        }
      }
    };

    // Debounce resize events to improve performance
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 250);
    };

    handleResize(); // Initial size
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [developers.length, screenSize.width]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="h-4 w-4 animate-bounce rounded-full bg-purple-400"></div>
          <div
            className="h-4 w-4 animate-bounce rounded-full bg-blue-400"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="h-4 w-4 animate-bounce rounded-full bg-indigo-400"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {developers.map((dev, index) => (
        <div key={dev.username} className="pointer-events-auto">
          <DeveloperBubble
            dev={dev}
            index={index}
            position={
              positions[index] || { x: 50, y: 50, delay: 0, duration: 10 }
            }
            screenSize={screenSize}
            totalBubbles={developers.length}
          />
        </div>
      ))}
    </div>
  );
};

export default DeveloperBubbles;
