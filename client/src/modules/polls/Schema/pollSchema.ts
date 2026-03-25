import { z } from 'zod';

export const pollSchema = z.object({
    id:z.string().optional(),
    question: z.string().min(1, "Questions is required"),
     options: z.array(
    z.object({
      option: z.string().min(1, "Option cannot be empty"),
      votes: z.number().optional() // backend can handle default
    })
  ).min(2, "At least two options required"),
    createdAt:z.string().optional(),
});

export type pollschemaInput = z.infer<typeof pollSchema>;