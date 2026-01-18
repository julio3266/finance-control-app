import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FinanceState {
    income: number;
    expenses: number;
    balance: number;
}

const initialState: FinanceState = {
    income: 5000.0,
    expenses: 3200.0,
    balance: 1800.0,
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
});

export const { setIncome, setExpenses, setFinanceData, addIncome, addExpense } =
    financeSlice.actions;
export default financeSlice.reducer;
