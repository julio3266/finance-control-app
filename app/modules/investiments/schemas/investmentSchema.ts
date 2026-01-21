import { z } from 'zod';

export const investmentSchema = z.object({
    investmentType: z.enum(['fixed', 'variable']),
    fixedInvestmentType: z.string().optional(),
    investmentName: z
        .string()
        .min(1, 'Nome do investimento é obrigatório')
        .max(200, 'Nome deve ter no máximo 200 caracteres'),
    broker: z.string().min(1, 'Corretora/Banco é obrigatório'),
    investedValue: z
        .string()
        .min(1, 'Valor investido é obrigatório')
        .refine((val) => {
            const cleaned = val.replace(/[^\d,.]/g, '');
            const normalized = cleaned.replace('.', ',');
            const num = parseFloat(normalized.replace(',', '.'));
            return !isNaN(num) && num > 0;
        }, 'Valor investido deve ser um número maior que zero'),
    purchaseDate: z.string().optional(),
    maturityDate: z.string().optional(),
    indexer: z.string().optional(),
    rate: z.string().optional(),
    assetSearch: z.string().optional(),
    ticker: z.string().optional(),
    assetName: z.string().optional(),
    quantity: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = parseInt(val, 10);
            return !isNaN(num) && num > 0;
        }, 'Quantidade deve ser um número maior que zero'),
    averagePrice: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const cleaned = val.replace(/[^\d,.]/g, '');
            const normalized = cleaned.replace('.', ',');
            const num = parseFloat(normalized.replace(',', '.'));
            return !isNaN(num) && num >= 0;
        }, 'Preço médio deve ser um número válido'),
    currentPrice: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const cleaned = val.replace(/[^\d,.]/g, '');
            const normalized = cleaned.replace('.', ',');
            const num = parseFloat(normalized.replace(',', '.'));
            return !isNaN(num) && num >= 0;
        }, 'Preço atual deve ser um número válido'),
    accountId: z.string().optional().nullable(),
});

export type InvestmentFormValues = z.infer<typeof investmentSchema>;
