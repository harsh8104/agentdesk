import { z } from "zod";

export const presentationsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const presentationsUpdateSchema = presentationsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
