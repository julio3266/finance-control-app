import { z } from 'zod';

export const personalDataSchema = z.object({
    firstName: z
        .string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
    lastName: z
        .string()
        .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
        .max(50, 'Sobrenome deve ter no máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Sobrenome deve conter apenas letras'),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.replace(/\D/g, '').length >= 10,
            'Telefone deve ter pelo menos 10 dígitos',
        ),
    cep: z
        .string()
        .optional()
        .refine((val) => !val || val.replace(/\D/g, '').length === 8, 'CEP deve ter 8 dígitos'),
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    complement: z.string().optional(),
});

export type PersonalDataFormValues = z.infer<typeof personalDataSchema>;
