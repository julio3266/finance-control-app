import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface UnifiedTransactionAccount {
    id: string;
    name: string;
    type?: string;
}

export interface UnifiedTransactionCategory {
    id: string;
    name: string;
    icon: string;
    color?: string;
}

export interface UnifiedTransactionCreditCard {
    id: string;
    name: string;
    brand?: string;
}

export interface UnifiedTransaction {
    id: string;
    source: 'manual' | 'open_finance';
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    isPaid?: boolean;
    imported?: boolean;
    category?: UnifiedTransactionCategory;
    account?: UnifiedTransactionAccount;
    bankAccount?: UnifiedTransactionAccount;
    creditCard?: UnifiedTransactionCreditCard;
}

export interface UnifiedTransactionsResponse {
    transactions: UnifiedTransaction[];
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface FetchUnifiedTransactionsParams {
    accountId?: string;
    bankAccountId?: string;
    type?: 'INCOME' | 'EXPENSE';
    source?: 'manual' | 'open_finance' | 'all';
    accountType?: 'CREDIT' | 'BANK' | 'all';
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
    isPaid?: boolean;
    imported?: boolean;
    page?: number;
    pageSize?: number;
}

export const fetchUnifiedTransactions = createAsyncThunk<
    UnifiedTransactionsResponse,
    FetchUnifiedTransactionsParams,
    { state: RootState; rejectValue: string }
>('extract/fetchUnifiedTransactions', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = new URLSearchParams();

        if (params.accountId) queryParams.append('accountId', params.accountId);
        if (params.bankAccountId) queryParams.append('bankAccountId', params.bankAccountId);
        if (params.type) queryParams.append('type', params.type);
        if (params.source && params.source !== 'all') queryParams.append('source', params.source);
        if (params.accountType && params.accountType !== 'all')
            queryParams.append('accountType', params.accountType);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.month) queryParams.append('month', params.month.toString());
        if (params.year) queryParams.append('year', params.year.toString());
        if (params.isPaid !== undefined) queryParams.append('isPaid', params.isPaid.toString());
        if (params.imported !== undefined)
            queryParams.append('imported', params.imported.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize !== undefined)
            queryParams.append('pageSize', params.pageSize.toString());

        const response = await apiClient.get<UnifiedTransactionsResponse>(
            `/api/finance/transactions/unified?${queryParams.toString()}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('Erro ao buscar transações');
    }
});
