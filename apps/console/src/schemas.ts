import { z } from 'zod';

export const UserInfoSchema = z.object({
  email: z.email(),
  names: z.string(),
  avatar: z.string().optional()
});

export const AuthStateModelSchema = z.object({
  principal: UserInfoSchema.optional(),
  sessionId: z.string().optional(),
  isSignedIn: z.boolean().default(false),
  sessionExpiresAt: z.number().optional()
});
