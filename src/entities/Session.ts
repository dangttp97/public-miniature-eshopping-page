import { z } from "zod";

import { userSchema } from "./User";

export const sessionSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;
