import { createSlice } from '@reduxjs/toolkit';
import { fetchAccounts, fetchUnifiedAccounts, AccountResponse, UnifiedAccountResponse } from './accountsApi';

interface AccountsState {
    accounts: AccountResponse[];
    unifiedAccounts: UnifiedAccountResponse[];
    loading: boolean;
    loadingUnified: boolean;
    error: string | null;
}

const initialState: AccountsState = {
    accounts: [],
    unifiedAccounts: [],
    loading: false,
    loadingUnified: false,
    error: null,
};

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        clearAccounts: (state) => {
            state.accounts = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar contas';
            })
            .addCase(fetchUnifiedAccounts.pending, (state) => {
                state.loadingUnified = true;
                state.error = null;
            })
            .addCase(fetchUnifiedAccounts.fulfilled, (state, action) => {
                state.loadingUnified = false;
                state.unifiedAccounts = action.payload;
            })
            .addCase(fetchUnifiedAccounts.rejected, (state, action) => {
                state.loadingUnified = false;
                state.error = action.payload || 'Erro ao buscar contas unificadas';
            });
    },
});

export const { clearAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
