export interface GoalCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

// Usar valores diretos para evitar problemas de inicialização circular
export const GOAL_CATEGORIES: GoalCategory[] = [
    { id: 'retirement', name: 'Aposentadoria', icon: 'umbrella', color: '#7c3aed' },
    { id: 'car', name: 'Carro', icon: 'car', color: '#ef4444' },
    { id: 'house', name: 'Casa', icon: 'home', color: '#8b5cf6' },
    { id: 'education', name: 'Educação', icon: 'book', color: '#22c55e' },
    { id: 'investment', name: 'Investimento', icon: 'trending-up', color: '#eab308' },
    { id: 'other', name: 'Outro', icon: 'target', color: '#6b7280' },
    { id: 'emergency', name: 'Reserva de Emergência', icon: 'shield', color: '#3b82f6' },
    { id: 'travel', name: 'Viagem', icon: 'plane', color: '#a78bfa' },
];

