import { createSlice } from '@reduxjs/toolkit';
import { fetchFinanceOverview, FinanceOverviewResponse } from './financeApi';

interface FinanceState {
    financeOverviewResponse: FinanceOverviewResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: FinanceState = {
    financeOverviewResponse: null,
    loading: false,
    error: null,
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinanceOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFinanceOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.financeOverviewResponse = action.payload;
            })
            .addCase(fetchFinanceOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default financeSlice.reducer;