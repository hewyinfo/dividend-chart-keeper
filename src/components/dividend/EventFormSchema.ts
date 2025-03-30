
import { z } from "zod";

export const eventFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(10),
  exDate: z.date({
    required_error: "Ex-dividend date is required",
  }),
  payDate: z.date().optional(),
  yield: z.number().min(0).max(100).optional(),
  received: z.boolean().default(false),
  amount: z.number().min(0).optional(),
  status: z.enum(["Confirmed", "Projected"]).default("Projected"),
  notes: z.string().optional(),
  yieldOnCost: z.number().min(0).max(100).optional(),
  price: z.number().min(0).optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
