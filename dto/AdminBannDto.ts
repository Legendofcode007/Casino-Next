import { z } from "zod";



export const ToggleBannBodyZ = z.object({
  user_id: z.number()
});

export type ToggleBannBody = z.infer<typeof ToggleBannBodyZ>;