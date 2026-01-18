/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada no padrão R$ X.XXX,XX
 */
export const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
