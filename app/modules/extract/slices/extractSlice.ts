import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    type UnifiedTransaction,
    type UnifiedTransactionsResponse,
    type FetchUnifiedTransactionsParams,
    fetchUnifiedTransactions,
} from './extractApi';

export interface ExtractState {
    transactions: UnifiedTransaction[];
    loading: boolean;
    error: string | null;
    filters: FetchUnifiedTransactionsParams;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null;
}

const initialState: ExtractState = {
    transactions: [],
    loading: false,
    error: null,
    filters: {
        source: 'all',
        accountType: 'all',
        page: 1,
        pageSize: 20,
    },
    pagination: null,
};

const extractSlice = createSlice({
    name: 'extract',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<FetchUnifiedTransactionsParams>>) => {
            const newFilters = { ...state.filters, ...action.payload };
            // Se os filtros mudaram (exceto page), resetar para página 1
            const filtersChanged =
                newFilters.type !== state.filters.type ||
                newFilters.source !== state.filters.source ||
                newFilters.accountType !== state.filters.accountType ||
                newFilters.accountId !== state.filters.accountId ||
                newFilters.bankAccountId !== state.filters.bankAccountId ||
                newFilters.month !== state.filters.month ||
                newFilters.year !== state.filters.year;

            if (filtersChanged && !action.payload.page) {
                newFilters.page = 1;
                state.transactions = []; // Limpar transações quando filtros mudam
            }

            state.filters = newFilters;
        },
        clearFilters: (state) => {
            state.filters = {
                source: 'all',
                accountType: 'all',
                page: 1,
                pageSize: 20,
            };
        },
        resetExtract: (state) => {
            state.transactions = [];
            state.loading = false;
            state.error = null;
            state.pagination = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnifiedTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnifiedTransactions.fulfilled, (state, action) => {
                state.loading = false;
                if (state.filters.page === 1 || !state.pagination) {
                    state.transactions = action.payload.transactions;
                } else {
                    state.transactions = [...state.transactions, ...action.payload.transactions];
                }
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchUnifiedTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar transações';
            });
    },
});

export const { setFilters, clearFilters, resetExtract } = extractSlice.actions;
export default extractSlice.reducer;
