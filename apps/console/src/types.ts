import { z } from 'zod';
import { AuthStateModelSchema, UserInfoSchema } from './schemas';

export type AuthStateModel = z.infer<typeof AuthStateModelSchema>;
export type Principal = z.infer<typeof UserInfoSchema>;
