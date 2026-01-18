import React, { useMemo } from 'react';

// Simplified SVG paths for political icons (24x24 source paths)
const ICONS = [
  'M13,3L11,3L11,5L9,5L9,7L7,7L7,9L5,9L5,11L3,11L3,13L5,13L5,15L7,15L7,17L9,17L9,19L11,19L11,21L13,21L13,19L15,19L15,17L17,17L17,15L19,15L19,13L21,13L21,11L19,11L19,9L17,9L17,7L15,7L15,5L13,5L13,3Z',
  'M20,10V14H18V10H20M15,10V14H13V10H15M7,14H5V10H7V14M22,8H2V20H22V8M20,18H4V12H20V18Z M17,15H19V17H17V15M14,15H16V17H14V15M11,15H13V17H11V15M8,15H10V17H8V15M5,15H7V17H5V15',
  'M17,6H16V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v2H7c-1.1,0-2,0.9-2,2v11c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V8 C19,6.9,18.1,6,17,6z M10,4h4v2h-4V4z M17,19H7V8h10V19z',
  'M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,17c-1.2,1.2-2.8,2-4.5,2.4v-2.1 c0.9-0.3,1.7-0.8,2.4-1.5L17,17z M12,17.4V19c-1.7-0.4-3.3-1.2-4.5-2.4l2.1-2.1C10.3,15.2,11.1,15.7,12,17.4z',
  'M7,2v10h2V2h2v10h2V2h2v10c0,2.21-1.79,4-4,4v5h-2v-5c-2.21,0-4-1.79-4-4V2H7z',
  'M16,2H8C6.9,2,6,2.9,6,4v16c0,1.11,0.89,2,2,2h8c1.11,0,2-0.89,2-2V4C18,2.89,17.11,2,16,2z M16,20H8V4h8V20z M10,6h4v2h-4V6z M10,10h4v2h-4V10z M10,14h4v2h-4V14z',
  'M6,2L18,2L15,10L18,18L12,22L6,18L9,10L6,2Z',
  'M12,2c-1.66,0-3,1.34-3,3v7c0,1.66,1.34,3,3,3s3-1.34,3-3V5C15,3.34,13.66,2,12,2z M17,12c0,2.76-2.24,5-5,5 s-5-2.24-5-5H5c0,3.53,2.61,6.43,6,6.92V22h2v-3.08c3.39-0.49,6-3.39,6-6.92H17z',
  'M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 s8,3.59,8,8S16.41,20,12,20z M7,10c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S6.45,10,7,10z M17,10c0.55,0,1,0.45,1,1s-0.45,1-1,1 s-1-0.45-1-1S16.45,10,17,10z M12,17c-2.33,0-4.31-1.46-5.11-3.5h10.22C16.31,15.54,14.33,17,12,17z',
  'M20,4H4C2.89,4,2.01,4.89,2.01,6L2,18c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2V6C22,4.89,21.11,4,20,4z M20,18H4V6h16V18z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z',
];

const PATTERNS = (id: string, color: string) => [
  { id: 'plain', element: null },
  {
    id: `dots-${id}`,
    element: (
      <>
        <pattern id={`dots-${id}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill={color} opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
      </>
    ),
  },
  {
    id: `stripes-${id}`,
    element: (
      <>
        <pattern
          id={`stripes-${id}`}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="10" stroke={color} strokeWidth="2" opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#stripes-${id})`} />
      </>
    ),
  },
  {
    id: `vyshyvanka-${id}`,
    element: (
      <>
        <pattern
          id={`vyshyvanka-${id}`}
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="5" height="5" fill={color} opacity="0.2" />
          <rect x="10" y="10" width="5" height="5" fill={color} opacity="0.2" />
          <rect x="5" y="5" width="5" height="5" fill={color} opacity="0.1" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#vyshyvanka-${id})`} />
      </>
    ),
  },
  {
    id: `mesh-${id}`,
    element: (
      <>
        <pattern id={`mesh-${id}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M15 0H0v15" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#mesh-${id})`} />
      </>
    ),
  },
];

interface MemeAvatarProps {
  userId: number | string;
  size?: number;
  className?: string;
}

export const MemeAvatar: React.FC<MemeAvatarProps> = ({ userId, size = 64, className }) => {
  const { bgColor, iconPath, pattern, iconColor } = useMemo(() => {
    let numericId: number;
    if (typeof userId === 'string') {
      numericId = Number.parseInt(userId.substring(0, 8), 16);
      if (Number.isNaN(numericId)) {
        numericId = 0;
        for (let i = 0; i < userId.length; i++) {
          numericId = (numericId << 5) - numericId + (userId.codePointAt(i) || 0);
          numericId = Math.trunc(numericId);
        }
        numericId = Math.abs(numericId);
      }
    } else {
      numericId = userId;
    }

    // Background Color (Golden Ratio HSL)
    const hue = (numericId * 137.5) % 360;
    const saturation = 70;
    const lightness = 50;
    const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Icon selection
    const iconIdx = Math.abs(numericId >> 3) % ICONS.length;
    const iconPath = ICONS[iconIdx];

    // Contrast color
    const iconColor = lightness > 60 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)';

    // Pattern selection
    const patterns = PATTERNS(numericId.toString(), iconColor);
    const patternIdx = Math.abs(numericId >> 1) % patterns.length;
    const pattern = patterns[patternIdx];

    return { bgColor, iconPath, pattern, iconColor };
  }, [userId]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ borderRadius: '8px', overflow: 'hidden' }}
    >
      <rect width="128" height="128" fill={bgColor} />
      <g>
        {pattern.element}
        <g fill={iconColor} transform="translate(16,16) scale(4)">
          <path d={iconPath} />
        </g>
      </g>
    </svg>
  );
};

export default MemeAvatar;
