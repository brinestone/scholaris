import { z } from 'zod';

export const UserInfoSchema = z.object({
  email: z.email(),
  names: z.string(),
  avatar: z.string().optional()
});

export const AuthStateModelSchema = z.object({
  principal: UserInfoSchema.optional(),
  accessToken: z.jwt().optional(),
  isSignedIn: z.boolean().default(false),
  sessionExpiresAt: z.string().optional()
});
