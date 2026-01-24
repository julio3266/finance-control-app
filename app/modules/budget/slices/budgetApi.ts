import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, type ApiError } from '@app/utils/api';

export interface SubCategory {
    id: string;
    name: string;
    icon: string;
    limit: number;
    spent: number;
}

export interface BudgetCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    limit: number;
    spent: number;
    subCategories: SubCategory[];
}

export interface Budget {
    id: string;
    name: string;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    totalLimit: number;
    totalSpent: number;
    categories: BudgetCategory[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBudgetRequest {
    name: string;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    categories: {
        categoryId: string;
        limit: number;
        subCategories?: {
            subCategoryId: string;
            limit: number;
        }[];
    }[];
}

export interface UpdateBudgetRequest {
    id: string;
    name?: string;
    categories?: {
        categoryId: string;
        limit: number;
        subCategories?: {
            subCategoryId: string;
            limit: number;
        }[];
    }[];
}

export interface BudgetSummary {
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
    dailySpent: number;
    weeklySpent: number;
    monthlySpent: number;
    dailyRemaining: number;
    weeklyRemaining: number;
    monthlyRemaining: number;
    daysRemaining: number;
}

// Mock data para categorias padrão
export const DEFAULT_CATEGORIES: Omit<BudgetCategory, 'limit' | 'spent'>[] = [
    {
        id: '1',
        name: 'Alimentação',
        icon: '🍔',
        color: '#EF4444',
        subCategories: [
            { id: '1-1', name: 'Restaurantes', icon: '🍽️', limit: 0, spent: 0 },
            { id: '1-2', name: 'Supermercado', icon: '🛒', limit: 0, spent: 0 },
            { id: '1-3', name: 'Delivery', icon: '🛵', limit: 0, spent: 0 },
            { id: '1-4', name: 'Lanches', icon: '🥪', limit: 0, spent: 0 },
        ],
    },
    {
        id: '2',
        name: 'Transporte',
        icon: '🚗',
        color: '#3B82F6',
        subCategories: [
            { id: '2-1', name: 'Combustível', icon: '⛽', limit: 0, spent: 0 },
            { id: '2-2', name: 'Uber/99', icon: '🚕', limit: 0, spent: 0 },
            { id: '2-3', name: 'Transporte Público', icon: '🚌', limit: 0, spent: 0 },
            { id: '2-4', name: 'Estacionamento', icon: '🅿️', limit: 0, spent: 0 },
        ],
    },
    {
        id: '3',
        name: 'Moradia',
        icon: '🏠',
        color: '#10B981',
        subCategories: [
            { id: '3-1', name: 'Aluguel', icon: '🔑', limit: 0, spent: 0 },
            { id: '3-2', name: 'Condomínio', icon: '🏢', limit: 0, spent: 0 },
            { id: '3-3', name: 'Energia', icon: '💡', limit: 0, spent: 0 },
            { id: '3-4', name: 'Água', icon: '💧', limit: 0, spent: 0 },
            { id: '3-5', name: 'Internet', icon: '📶', limit: 0, spent: 0 },
            { id: '3-6', name: 'Manutenção', icon: '🔧', limit: 0, spent: 0 },
        ],
    },
    {
        id: '4',
        name: 'Lazer',
        icon: '🎮',
        color: '#8B5CF6',
        subCategories: [
            { id: '4-1', name: 'Streaming', icon: '📺', limit: 0, spent: 0 },
            { id: '4-2', name: 'Cinema', icon: '🎬', limit: 0, spent: 0 },
            { id: '4-3', name: 'Jogos', icon: '🎮', limit: 0, spent: 0 },
            { id: '4-4', name: 'Viagens', icon: '✈️', limit: 0, spent: 0 },
            { id: '4-5', name: 'Bares/Baladas', icon: '🍻', limit: 0, spent: 0 },
        ],
    },
    {
        id: '5',
        name: 'Saúde',
        icon: '💊',
        color: '#EC4899',
        subCategories: [
            { id: '5-1', name: 'Plano de Saúde', icon: '🏥', limit: 0, spent: 0 },
            { id: '5-2', name: 'Medicamentos', icon: '💊', limit: 0, spent: 0 },
            { id: '5-3', name: 'Academia', icon: '🏋️', limit: 0, spent: 0 },
            { id: '5-4', name: 'Consultas', icon: '👨‍⚕️', limit: 0, spent: 0 },
        ],
    },
    {
        id: '6',
        name: 'Educação',
        icon: '📚',
        color: '#F59E0B',
        subCategories: [
            { id: '6-1', name: 'Cursos', icon: '🎓', limit: 0, spent: 0 },
            { id: '6-2', name: 'Livros', icon: '📖', limit: 0, spent: 0 },
            { id: '6-3', name: 'Material Escolar', icon: '✏️', limit: 0, spent: 0 },
        ],
    },
    {
        id: '7',
        name: 'Compras',
        icon: '🛍️',
        color: '#14B8A6',
        subCategories: [
            { id: '7-1', name: 'Roupas', icon: '👕', limit: 0, spent: 0 },
            { id: '7-2', name: 'Eletrônicos', icon: '📱', limit: 0, spent: 0 },
            { id: '7-3', name: 'Casa', icon: '🏠', limit: 0, spent: 0 },
            { id: '7-4', name: 'Presentes', icon: '🎁', limit: 0, spent: 0 },
        ],
    },
    {
        id: '8',
        name: 'Pessoal',
        icon: '💇',
        color: '#6366F1',
        subCategories: [
            { id: '8-1', name: 'Cabeleireiro', icon: '💇', limit: 0, spent: 0 },
            { id: '8-2', name: 'Cosméticos', icon: '💄', limit: 0, spent: 0 },
            { id: '8-3', name: 'Higiene', icon: '🧴', limit: 0, spent: 0 },
        ],
    },
];

// State
interface BudgetState {
    budgets: Budget[];
    activeBudget: Budget | null;
    summary: BudgetSummary | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BudgetState = {
    budgets: [],
    activeBudget: null,
    summary: null,
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchBudgets = createAsyncThunk<Budget[], void, { rejectValue: ApiError }>(
    'budget/fetchBudgets',
    async (_, { rejectWithValue }) => {
        try {
            return await apiClient.get<Budget[]>('/budgets');
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const fetchActiveBudget = createAsyncThunk<Budget | null, void, { rejectValue: ApiError }>(
    'budget/fetchActiveBudget',
    async (_, { rejectWithValue }) => {
        try {
            return await apiClient.get<Budget | null>('/budgets/active');
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const fetchBudgetSummary = createAsyncThunk<BudgetSummary, string, { rejectValue: ApiError }>(
    'budget/fetchBudgetSummary',
    async (budgetId, { rejectWithValue }) => {
        try {
            return await apiClient.get<BudgetSummary>(`/budgets/${budgetId}/summary`);
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const createBudget = createAsyncThunk<Budget, CreateBudgetRequest, { rejectValue: ApiError }>(
    'budget/createBudget',
    async (data, { rejectWithValue }) => {
        try {
            return await apiClient.post<Budget>('/budgets', data);
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const updateBudget = createAsyncThunk<Budget, UpdateBudgetRequest, { rejectValue: ApiError }>(
    'budget/updateBudget',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            return await apiClient.patch<Budget>(`/budgets/${id}`, data);
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const deleteBudget = createAsyncThunk<void, string, { rejectValue: ApiError }>(
    'budget/deleteBudget',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/budgets/${id}`);
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

// Slice
const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setActiveBudget: (state, action: PayloadAction<Budget | null>) => {
            state.activeBudget = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Budgets
            .addCase(fetchBudgets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.budgets = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Erro ao carregar orçamentos';
            })
            // Fetch Active Budget
            .addCase(fetchActiveBudget.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActiveBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeBudget = action.payload;
            })
            .addCase(fetchActiveBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Erro ao carregar orçamento ativo';
            })
            // Fetch Summary
            .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            // Create Budget
            .addCase(createBudget.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.budgets.push(action.payload);
                state.activeBudget = action.payload;
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Erro ao criar orçamento';
            })
            // Update Budget
            .addCase(updateBudget.fulfilled, (state, action) => {
                const index = state.budgets.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.budgets[index] = action.payload;
                }
                if (state.activeBudget?.id === action.payload.id) {
                    state.activeBudget = action.payload;
                }
            })
            // Delete Budget
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.budgets = state.budgets.filter((b) => b.id !== action.meta.arg);
                if (state.activeBudget?.id === action.meta.arg) {
                    state.activeBudget = null;
                }
            });
    },
});

export const { clearError, setActiveBudget } = budgetSlice.actions;
export const budgetReducer = budgetSlice.reducer;
export default budgetSlice.reducer;
