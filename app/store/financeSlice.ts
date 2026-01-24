import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchFinanceOverview,
    fetchRecentTransactions,
    fetchCategories,
    type TransactionResponse,
    type CategoryResponse,
    type FinanceOverviewResponse,
    type OverviewConnection,
} from '@app/modules/dashboard/slices/financeApi';

interface FinanceState {
    financeOverviewResponse: FinanceOverviewResponse | null;
    income: number;
    expenses: number;
    balance: number;
    loading: boolean;
    error: string | null;
    transactions: TransactionResponse[];
    transactionsLoading: boolean;
    transactionsError: string | null;
    categories: CategoryResponse[];
    categoriesLoading: boolean;
    categoriesError: string | null;
    creditCards?: FinanceOverviewResponse['creditCards'];
    connections?: OverviewConnection[];
}

const initialState: FinanceState = {
    financeOverviewResponse: null,
    income: 0,
    expenses: 0,
    balance: 0,
    loading: false,
    error: null,
    transactions: [],
    transactionsLoading: false,
    transactionsError: null,
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        setIncome: (state, action: PayloadAction<number>) => {
            state.income = action.payload;
            state.balance = state.income - state.expenses;
        },
        setExpenses: (state, action: PayloadAction<number>) => {
            state.expenses = action.payload;
            state.balance = state.income - state.expenses;
        },
        setFinanceData: (state, action: PayloadAction<{ income: number; expenses: number }>) => {
            state.income = action.payload.income;
            state.expenses = action.payload.expenses;
            state.balance = action.payload.income - action.payload.expenses;
        },
        addIncome: (state, action: PayloadAction<number>) => {
            state.income += action.payload;
            state.balance = state.income - state.expenses;
        },
        addExpense: (state, action: PayloadAction<number>) => {
            state.expenses += action.payload;
            state.balance = state.income - state.expenses;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinanceOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFinanceOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.financeOverviewResponse = action.payload;
                state.balance = action.payload.totalBalance;
                state.income = action.payload.totalIncome;
                state.expenses = action.payload.totalExpenses;
                if (action.payload.creditCards) {
                    state.creditCards = action.payload.creditCards;
                }
                if (action.payload.connections) {
                    state.connections = action.payload.connections;
                }
            })
            .addCase(fetchFinanceOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar informações financeiras';
            })
            .addCase(fetchRecentTransactions.pending, (state) => {
                state.transactionsLoading = true;
                state.transactionsError = null;
            })
            .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
                state.transactionsLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchRecentTransactions.rejected, (state, action) => {
                state.transactionsLoading = false;
                state.transactionsError = action.payload || 'Erro ao buscar transações recentes';
            })
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload || 'Erro ao buscar categorias';
            });
    },
});

export const { setIncome, setExpenses, setFinanceData, addIncome, addExpense } =
    financeSlice.actions;
export default financeSlice.reducer;
