import { z } from 'zod';
import { insertScanSchema, scans, analyzeRequestSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scans: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze' as const,
      input: analyzeRequestSchema,
      responses: {
        200: z.custom<typeof scans.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/scans' as const,
      responses: {
        200: z.array(z.custom<typeof scans.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/scans/:id' as const,
      responses: {
        200: z.custom<typeof scans.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // Endpoint to generate voice announcement
    tts: {
      method: 'POST' as const,
      path: '/api/tts' as const,
      input: z.object({
        text: z.string(),
      }),
      responses: {
        200: z.object({
          audio: z.string(), // base64 encoded audio
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
