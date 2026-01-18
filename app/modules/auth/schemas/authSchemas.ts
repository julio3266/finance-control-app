import { z } from 'zod';

export const emailSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
});

export const otpSchema = z.object({
    otp: z
        .string()
        .min(1, 'Código é obrigatório')
        .length(6, 'Código deve ter 6 dígitos')
        .regex(/^\d+$/, 'Código deve conter apenas números'),
});

export const loginSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    otp: z
        .string()
        .min(1, 'Código é obrigatório')
        .length(6, 'Código deve ter 6 dígitos')
        .regex(/^\d+$/, 'Código deve conter apenas números'),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
