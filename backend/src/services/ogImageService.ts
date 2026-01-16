import sharp from 'sharp';
import { Person } from '@prisma/client';
import logger from '../config/logger';

export class OgImageService {
  private readonly width = 1200;
  private readonly height = 630;

  async generatePersonCard(person: Person): Promise<Buffer> {
    try {
      // 1. Create a base canvas (dark gradient-ish)
      const canvas = sharp({
        create: {
          width: this.width,
          height: this.height,
          channels: 4,
          background: { r: 10, g: 10, b: 10, alpha: 1 },
        },
      });

      // 2. SVG overlay for text and design
      // We use SVG because sharp's text support depends on pango/cairo which might not be in all environments
      // but SVG is always supported.
      const svg = `
        <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#022c22;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Background accent -->
          <rect x="0" y="0" width="1200" height="10" fill="url(#grad)" />
          
          <!-- Title -->
          <text x="60" y="100" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#059669" letter-spacing="2">LUGABUS.UA</text>
          
          <!-- Person Name -->
          <text x="60" y="240" font-family="Arial, sans-serif" font-size="80" font-weight="black" fill="white">${this.escapeXml(person.fullName)}</text>
          
          <!-- Role -->
          <text x="60" y="310" font-family="Arial, sans-serif" font-size="32" fill="#9ca3af">${this.escapeXml(person.currentRole || 'Громадський діяч')}</text>
          
          <!-- Stats badge -->
          <rect x="60" y="380" width="280" height="60" rx="30" fill="#1f2937" />
          <text x="100" y="420" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">Репутація: ${person.reputation.toFixed(1)}</text>
          
          <!-- Border -->
          <rect x="2" y="2" width="1196" height="626" rx="20" fill="none" stroke="#374151" stroke-width="4" />
        </svg>
      `;

      // 3. Composite
      // If person has a photo, we could download it and composite it too
      // For now, let's keep it text-based for stability
      return await canvas
        .composite([
          {
            input: Buffer.from(svg),
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();
    } catch (error) {
      logger.error('Failed to generate OG image', error);
      throw new Error('OG image generation failed');
    }
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case "'":
          return '&apos;';
      }
      return c;
    });
  }
}
