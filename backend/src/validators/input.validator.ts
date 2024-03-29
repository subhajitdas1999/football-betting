import { z } from "zod";

export const addNewLeagueInput = z.object({
  name: z.string(),
  logo: z.string(),
  season: z.string().transform((val) => parseInt(val)),
  start: z.string(),
  end: z.string(),
  leagueId: z.string().transform((val) => parseInt(val)),
});

export const searchNoteQuery = z.object({
  league: z
    .string()
    .optional()
    .transform((val) =>
      val !== undefined && !isNaN(parseInt(val)) ? parseInt(val) : undefined
    ),
  season: z
    .string()
    .optional()
    .transform((val) =>
      val !== undefined && !isNaN(parseInt(val)) ? parseInt(val) : undefined
    ),
});
