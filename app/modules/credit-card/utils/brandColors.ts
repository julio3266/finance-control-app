/**
 * Mapeamento de cores para bandeiras de cartão de crédito
 * Retorna um gradiente de 3 cores para cada bandeira
 */
export const getBrandGradientColors = (brandId: string): [string, string, string] => {
    const brandColors: Record<string, [string, string, string]> = {
        VISA: ['#1434CB', '#1A1F71', '#0D1252'], // Azul Visa
        MASTERCARD: ['#EB001B', '#F79E1B', '#FF6F00'], // Vermelho e Laranja Mastercard
        ELO: ['#00A4E0', '#FFCB05', '#00A859'], // Azul e Verde Elo
        AMEX: ['#006FCF', '#002663', '#001A4A'], // Azul American Express
        HIPERCARD: ['#D52B1E', '#A01F15', '#6B140C'], // Vermelho Hipercard
        AURA: ['#6F2C91', '#4A1C62', '#2D0F3D'], // Roxo Aura
        DINERS: ['#0079BE', '#005A8A', '#003D5C'], // Azul Diners Club
        DISCOVER: ['#FF6000', '#FF8C00', '#CC4A00'], // Laranja Discover
        JCB: ['#0066CC', '#004499', '#002266'], // Azul JCB
    };

    // Retorna as cores da bandeira ou um gradiente padrão escuro
    return brandColors[brandId.toUpperCase()] || ['#1a1a2e', '#16213e', '#0f3460'];
};
