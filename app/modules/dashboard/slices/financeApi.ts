import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';
import type { CreditCardResponse } from '@app/modules/credit-card/slices/creditCardApi';

export interface OverviewConnection {
    id: string;
    institution: string;
    logo: string;
    status: string;
    lastSyncAt: string | null;
}

export interface FinanceOverviewResponse {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    creditCards?: {
        cards: CreditCardResponse[];
        total: number;
        totalLimit: number;
        totalUsed: number;
        totalAvailable: number;
        totalManual: number;
        totalOpenFinance: number;
    };
    connections?: OverviewConnection[];
}

export interface TransactionAccount {
    id: string;
    name: string;
}

export interface TransactionCategory {
    id: string;
    name: string;
    icon: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: 'INCOME' | 'EXPENSE';
    isPredefined: boolean;
    createdAt: string;
}

export interface TransactionResponse {
    id: string;
    description: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    date: string;
    isPaid: boolean;
    account: TransactionAccount;
    category: TransactionCategory;
    isPartOfRecurringSeries: boolean;
}

export const fetchFinanceOverview = createAsyncThunk<
    FinanceOverviewResponse,
    void,
    { state: RootState; rejectValue: string }
>('finance/fetchOverview', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<FinanceOverviewResponse>('/api/finance/overview', {
            Authorization: `Bearer ${token}`,
        });
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar informações financeiras';
        return rejectWithValue(errorMessage);
    }
});

export const fetchRecentTransactions = createAsyncThunk<
    TransactionResponse[],
    { limit?: number },
    { state: RootState; rejectValue: string }
>('finance/fetchRecentTransactions', async ({ limit = 5 }, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const limitParam = Math.min(Math.max(limit, 1), 50);
        const response = await apiClient.get<TransactionResponse[]>(
            `/api/finance/transactions/recent?limit=${limitParam}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar transações recentes';
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Recent Transactions Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});

export interface CreateTransactionRequest {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string;
    date: string;
    isPaid: boolean;
    categoryId?: string | null;
    accountId?: string | null;
    creditCardId?: string | null;
    notes?: string | null;
    isRecurring?: boolean;
    repetitionFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    repetitionInterval?: number;
    repetitionEndDate?: string | null;
}

export const createTransaction = createAsyncThunk<
    TransactionResponse,
    CreateTransactionRequest,
    { state: RootState; rejectValue: string }
>('finance/createTransaction', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<TransactionResponse>(
            '/api/finance/transactions',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao criar transação';
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Create Transaction Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});

export const fetchCategories = createAsyncThunk<
    CategoryResponse[],
    void,
    { state: RootState; rejectValue: string }
>('finance/fetchCategories', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<CategoryResponse[]>('/api/finance/categories', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar categorias';
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Fetch Categories Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});
