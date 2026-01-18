import { z } from 'zod';

export const accountTypes = [
    'checking',
    'savings',
    'cash',
    'credit',
    'investment',
    'other',
] as const;

export const firstAccountSchema = z.object({
    name: z
        .string()
        .min(2, 'Nome da conta deve ter pelo menos 2 caracteres')
        .max(50, 'Nome da conta deve ter no máximo 50 caracteres'),
    institution: z
        .string()
        .min(2, 'Instituição deve ter pelo menos 2 caracteres')
        .max(100, 'Instituição deve ter no máximo 100 caracteres'),
    type: z.enum(accountTypes, {
        errorMap: () => ({ message: 'Selecione um tipo de conta válido' }),
    }),
    initialBalance: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = parseFloat(val.replace(',', '.').replace(/[^\d.-]/g, ''));
            return !isNaN(num);
        }, 'Saldo inicial deve ser um número válido'),
    color: z.string().min(1, 'Selecione uma cor'),
});

export type FirstAccountFormValues = z.infer<typeof firstAccountSchema>;
