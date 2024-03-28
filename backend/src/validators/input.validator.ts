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
export const searchPrediction = z.object({
  fixtureId: z.string().transform((val) => parseInt(val)),
  gameStartTimeStamp: z.string().transform((val) => parseInt(val)),
});

const Team = z.enum(["home", "away"]);
export const addPredictionInput = z.object({
  team: Team,
  amount: z.string(),
  fixtureId: z.string().transform((val) => parseInt(val)),
  chain: z.string(),
  walletAddress: z.string(),
  leagueId: z.string().transform((val) => parseInt(val)),
});
