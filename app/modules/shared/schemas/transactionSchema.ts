import { z } from 'zod';

export const transactionSchema = z.object({
    amount: z
        .string()
        .min(1, 'Valor é obrigatório')
        .refine((val) => {
            const cleaned = val.replace(/[^\d,.]/g, '');
            const normalized = cleaned.replace('.', ',');
            const num = parseFloat(normalized.replace(',', '.'));
            return !isNaN(num) && num > 0;
        }, 'Valor deve ser um número maior que zero'),
    description: z
        .string()
        .min(1, 'Descrição é obrigatória')
        .max(200, 'Descrição deve ter no máximo 200 caracteres'),
    isReceived: z.boolean(),
    selectedDate: z.enum(['today', 'yesterday', 'other']),
    isFixed: z.boolean().optional(),
    isRepeat: z.boolean().optional(),
    repeatCount: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = parseInt(val, 10);
            return !isNaN(num) && num > 0 && num <= 365;
        }, 'Quantidade de repetições deve ser entre 1 e 365'),
    repeatPeriod: z.enum(['dias', 'semanas', 'meses', 'anos']).optional(),
    ignoreTransaction: z.boolean().optional(),
    categoryId: z.string().optional().nullable(),
    accountId: z.string().optional().nullable(),
    creditCardId: z.string().optional().nullable(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
