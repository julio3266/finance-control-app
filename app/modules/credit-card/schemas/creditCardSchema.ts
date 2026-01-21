import { z } from 'zod';

export const creditCardSchema = z
    .object({
        accountId: z.string().min(1, 'Selecione uma conta'),
        brandId: z.string().min(1, 'Selecione a bandeira do cartão'),
        cardName: z
            .string()
            .min(1, 'Nome do cartão é obrigatório')
            .max(100, 'Nome deve ter no máximo 100 caracteres'),
        usedLimit: z
            .string()
            .min(1, 'Limite utilizado é obrigatório')
            .refine((val) => {
                const cleaned = val.replace(/[^\d,.]/g, '');
                const normalized = cleaned.replace('.', ',');
                const num = parseFloat(normalized.replace(',', '.'));
                return !isNaN(num) && num >= 0;
            }, 'Limite utilizado deve ser um número válido'),
        totalLimit: z
            .string()
            .min(1, 'Limite total é obrigatório')
            .refine((val) => {
                const cleaned = val.replace(/[^\d,.]/g, '');
                const normalized = cleaned.replace('.', ',');
                const num = parseFloat(normalized.replace(',', '.'));
                return !isNaN(num) && num > 0;
            }, 'Limite total deve ser um número maior que zero'),
        closingDay: z
            .string()
            .min(1, 'Dia de fechamento é obrigatório')
            .refine((val) => {
                const day = parseInt(val, 10);
                return !isNaN(day) && day >= 1 && day <= 31;
            }, 'Dia de fechamento deve ser entre 1 e 31'),
        dueDay: z
            .string()
            .min(1, 'Dia de vencimento é obrigatório')
            .refine((val) => {
                const day = parseInt(val, 10);
                return !isNaN(day) && day >= 1 && day <= 31;
            }, 'Dia de vencimento deve ser entre 1 e 31'),
    })
    .superRefine((data, ctx) => {
        const usedLimitCleaned = data.usedLimit.replace(/[^\d,.]/g, '').replace('.', ',');
        const totalLimitCleaned = data.totalLimit.replace(/[^\d,.]/g, '').replace('.', ',');
        const usedLimit = parseFloat(usedLimitCleaned.replace(',', '.'));
        const totalLimit = parseFloat(totalLimitCleaned.replace(',', '.'));

        if (!isNaN(usedLimit) && !isNaN(totalLimit) && usedLimit > totalLimit) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Limite utilizado não pode ser maior que o limite total',
                path: ['usedLimit'],
            });
        }
    });

export type CreditCardFormValues = z.infer<typeof creditCardSchema>;
