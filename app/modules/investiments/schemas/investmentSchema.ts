import { z } from 'zod';

export const investmentSchema = z
    .object({
        investmentType: z.enum(['fixed', 'variable']),
        fixedInvestmentType: z.string().optional(),
        investmentName: z.string().optional(),
        broker: z.string().min(1, 'Corretora/Banco é obrigatório'),
        investedValue: z.string().optional(),
        purchaseDate: z.string().optional(),
        maturityDate: z.string().optional(),
        indexer: z.string().optional(),
        rate: z.string().optional(),
        assetSearch: z.string().optional(),
        ticker: z.string().optional(),
        assetName: z.string().optional(),
        quantity: z.string().optional(),
        averagePrice: z.string().optional(),
        currentPrice: z.string().optional(),
        accountId: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
        // Validações para Renda Fixa
        if (data.investmentType === 'fixed') {
            if (!data.investmentName || data.investmentName.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Nome do investimento é obrigatório',
                    path: ['investmentName'],
                });
            }

            if (!data.investedValue || data.investedValue.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Valor investido é obrigatório',
                    path: ['investedValue'],
                });
            } else {
                const cleaned = data.investedValue.replace(/[^\d,.]/g, '');
                const normalized = cleaned.replace('.', ',');
                const num = parseFloat(normalized.replace(',', '.'));
                if (isNaN(num) || num <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Valor investido deve ser um número maior que zero',
                        path: ['investedValue'],
                    });
                }
            }
        }

        // Validações para Renda Variável
        if (data.investmentType === 'variable') {
            if (!data.ticker || data.ticker.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Ticker é obrigatório',
                    path: ['ticker'],
                });
            }

            if (!data.quantity || data.quantity.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Quantidade é obrigatória',
                    path: ['quantity'],
                });
            } else {
                const num = parseInt(data.quantity, 10);
                if (isNaN(num) || num <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Quantidade deve ser um número maior que zero',
                        path: ['quantity'],
                    });
                }
            }

            if (!data.averagePrice || data.averagePrice.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Preço médio é obrigatório',
                    path: ['averagePrice'],
                });
            } else {
                const cleaned = data.averagePrice.replace(/[^\d,.]/g, '');
                const normalized = cleaned.replace('.', ',');
                const num = parseFloat(normalized.replace(',', '.'));
                if (isNaN(num) || num <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Preço médio deve ser um número maior que zero',
                        path: ['averagePrice'],
                    });
                }
            }

            // Validação opcional do preço atual
            if (data.currentPrice && data.currentPrice.trim() !== '') {
                const cleaned = data.currentPrice.replace(/[^\d,.]/g, '');
                const normalized = cleaned.replace('.', ',');
                const num = parseFloat(normalized.replace(',', '.'));
                if (isNaN(num) || num < 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Preço atual deve ser um número válido',
                        path: ['currentPrice'],
                    });
                }
            }
        }
    });

export type InvestmentFormValues = z.infer<typeof investmentSchema>;
