import { number, object } from 'valibot';

export const formSchema = object({
  updatedAt: number(),
});
