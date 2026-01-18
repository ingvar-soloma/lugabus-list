// Reddit-style username generator
const adjectives = [
  'Brave',
  'Swift',
  'Clever',
  'Mighty',
  'Silent',
  'Golden',
  'Ancient',
  'Mystic',
  'Noble',
  'Wise',
  'Bold',
  'Fierce',
  'Gentle',
  'Proud',
  'Quick',
  'Calm',
  'Wild',
  'Free',
  'Dark',
  'Bright',
];

const nouns = [
  'Eagle',
  'Tiger',
  'Dragon',
  'Phoenix',
  'Wolf',
  'Bear',
  'Lion',
  'Falcon',
  'Raven',
  'Hawk',
  'Fox',
  'Panther',
  'Owl',
  'Shark',
  'Dolphin',
  'Whale',
  'Cobra',
  'Viper',
  'Lynx',
  'Jaguar',
];

export function generateUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999);
  return `${adjective}${noun}${number}`;
}

// Google Sheets-style avatar colors
export const avatarColors = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

export function getAvatarColor(userId: string): string {
  // Use hash of userId to consistently pick same color for same user
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

export function generateAvatarSvg(username: string, color: string): string {
  const initials = username
    .split(/(?=[A-Z])/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return `
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" 
        fill="white" text-anchor="middle" dominant-baseline="central">
    ${initials}
  </text>
</svg>`.trim();
}
