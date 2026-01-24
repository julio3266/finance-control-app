import { z } from 'zod';

export const goalSchema = z.object({
    name: z.string().min(1, 'Nome da meta é obrigatório'),
    description: z.string().optional(),
    targetAmount: z.string().min(1, 'Valor alvo é obrigatório'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    targetDate: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

