import { createSlice } from '@reduxjs/toolkit';
import { fetchAccounts, AccountResponse } from './accountsApi';

interface AccountsState {
    accounts: AccountResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: AccountsState = {
    accounts: [],
    loading: false,
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
            });
    },
});

export const { clearAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
