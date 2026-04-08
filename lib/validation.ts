import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required').max(128),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  role: z.enum(['business', 'referrer']),
});

export const referralSchema = z.object({
  slug: z.string().min(1, 'Business slug is required').max(255),
  customerName: z.string().min(2, 'Customer name is required').max(100).trim(),
  customerEmail: z.string().email('Invalid customer email').max(255),
  customerPhone: z.string().max(20).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

/** Extract first error message from a Zod error */
export function getFirstZodError(error: z.ZodError): string {
  return error.issues?.[0]?.message || 'Invalid input';
}

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReferralInput = z.infer<typeof referralSchema>;
