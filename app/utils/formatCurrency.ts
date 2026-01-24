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

/**
 * Formata um valor monetário ocultando-o se hideValues for true
 * @param value - Valor numérico a ser formatado
 * @param hideValues - Se true, retorna valor ofuscado (R$ •••)
 * @returns String formatada ou ofuscada
 */
export const formatCurrencyWithHide = (value: number, hideValues: boolean): string => {
    if (hideValues) {
        return 'R$ •••';
    }
    return formatCurrency(value);
};
