import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, type ApiError } from '@app/utils/api';

export interface ChartDataPoint {
    month: string;
    income: number;
    expenses: number;
}

export interface MonthlyOverviewSummary {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: number;
    totalBalance: number;
}

export interface MonthlyOverviewResponse {
    period: {
        month: number;
        year: number;
    };
    summary: MonthlyOverviewSummary;
    financialTip: string;
    chart: ChartDataPoint[];
}

export interface ExpenseDistributionItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    total?: number;
    value?: number;
    percentage: number;
}

export interface ExpensesChartDataPoint {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

export interface ExpensesEvolutionPoint {
    month: string;
    label: string;
    year: number;
    value: number;
}

export interface ExpensesResponse {
    period?: {
        month: number;
        year: number;
    };
    view?: string;
    totalExpenses: number;
    distribution: ExpenseDistributionItem[];
    chart: ExpensesChartDataPoint[];
    evolution?: ExpensesEvolutionPoint[];
}

export type ExpensesViewMode = 'category' | 'card' | 'account';

export interface InvestmentSubcategory {
    name: string;
    value: number;
    percentage: number;
}

export interface InvestmentAllocationItem {
    id: string;
    name: string;
    color: string;
    value: number;
    percentage: number;
    subcategories?: InvestmentSubcategory[];
}

export interface InvestmentEvolutionPoint {
    month: string;
    value: number;
}

export interface InvestmentProfitabilityItem {
    id: string;
    name: string;
    currentValue: number;
    investedValue: number;
    return: number;
    returnPercent: number;
}

export interface InvestmentsAllocationResponse {
    totalInvested: number;
    totalCurrent: number;
    monthlyReturn?: {
        value: number;
        percentage: number;
    };
    allocation: InvestmentAllocationItem[];
}

export interface InvestmentsEvolutionResponse {
    totalInvested: number;
    totalCurrent: number;
    evolution: InvestmentEvolutionPoint[];
}

export interface InvestmentsProfitabilityResponse {
    totalInvested: number;
    totalCurrent: number;
    profitability: InvestmentProfitabilityItem[];
}

export type InvestmentsResponse = 
    | InvestmentsAllocationResponse 
    | InvestmentsEvolutionResponse 
    | InvestmentsProfitabilityResponse;

export type InvestmentsViewMode = 'allocation' | 'evolution' | 'profitability';

export interface IncomeDistributionItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    amount?: number;
    total?: number;
    value?: number;
    percentage: number;
}

export interface IncomeEvolutionPoint {
    month: string;
    value: number;
}

export interface IncomeCategoryResponse {
    totalIncome: number;
    monthlyAverage: number;
    distribution: IncomeDistributionItem[];
}

export interface IncomeSourceResponse {
    totalIncome: number;
    monthlyAverage: number;
    distribution: IncomeDistributionItem[];
}

export interface IncomeEvolutionResponse {
    totalIncome: number;
    monthlyAverage: number;
    evolution: IncomeEvolutionPoint[];
}

export type IncomeResponse = 
    | IncomeCategoryResponse 
    | IncomeSourceResponse 
    | IncomeEvolutionResponse;

export type IncomeViewMode = 'category' | 'source' | 'evolution';

export interface ReportPeriodParams {
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
}

export interface ExpensesParams extends ReportPeriodParams {
    view: ExpensesViewMode;
}

export interface InvestmentsParams extends ReportPeriodParams {
    view: InvestmentsViewMode;
}

export interface IncomeParams extends ReportPeriodParams {
    view: IncomeViewMode;
}


interface ReportsState {

    overview: MonthlyOverviewResponse | null;
    overviewLoading: boolean;
    overviewError: string | null;
    

    expenses: ExpensesResponse | null;
    expensesLoading: boolean;
    expensesError: string | null;
    

    investments: InvestmentsResponse | null;
    investmentsLoading: boolean;
    investmentsError: string | null;
    

    income: IncomeResponse | null;
    incomeLoading: boolean;
    incomeError: string | null;
}

const initialState: ReportsState = {
    overview: null,
    overviewLoading: false,
    overviewError: null,
    
    expenses: null,
    expensesLoading: false,
    expensesError: null,
    
    investments: null,
    investmentsLoading: false,
    investmentsError: null,
    
    income: null,
    incomeLoading: false,
    incomeError: null,
};


const buildQueryString = (params: ReportPeriodParams | ExpensesParams | InvestmentsParams | IncomeParams): string => {
    const entries = Object.entries(params as Record<string, unknown>)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    
    return entries.length > 0 ? `?${entries.join('&')}` : '';
};

const ensureToken = (getState: () => unknown): void => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth?.token;
    if (token && !apiClient.getToken()) {
        apiClient.setToken(token);
    }
};

export const fetchMonthlyOverview = createAsyncThunk<
    MonthlyOverviewResponse,
    ReportPeriodParams | undefined,
    { rejectValue: string }
>(
    'reports/fetchMonthlyOverview',
    async (params, { getState, rejectWithValue }) => {
        try {
            ensureToken(getState);
            const queryString = params ? buildQueryString(params) : '';
            const url = `/api/reports/monthly-overview${queryString}`;
            
            const response = await apiClient.get<MonthlyOverviewResponse>(url);   
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            if (__DEV__) {
                console.error('📊 [Monthly Overview API] Error:', apiError);
            }
            return rejectWithValue(apiError.message || 'Erro ao carregar visão geral');
        }
    }
);

export const fetchExpenses = createAsyncThunk<
    ExpensesResponse,
    ExpensesParams,
    { rejectValue: string }
>(
    'reports/fetchExpenses',
    async (params, { getState, rejectWithValue }) => {
        try {
            ensureToken(getState);
            const queryString = buildQueryString(params);
            const response = await apiClient.get<ExpensesResponse>(
                `/api/reports/expenses${queryString}`
            );
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            return rejectWithValue(apiError.message || 'Erro ao carregar gastos');
        }
    }
);


export const fetchInvestments = createAsyncThunk<
    InvestmentsResponse,
    InvestmentsParams,
    { rejectValue: string }
>(
    'reports/fetchInvestments',
    async (params, { getState, rejectWithValue }) => {
        try {
            ensureToken(getState);
            const queryString = buildQueryString(params);
            const response = await apiClient.get<InvestmentsResponse>(
                `/api/reports/investments-detail${queryString}`
            );
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            return rejectWithValue(apiError.message || 'Erro ao carregar investimentos');
        }
    }
);

export const fetchIncome = createAsyncThunk<
    IncomeResponse,
    IncomeParams,
    { rejectValue: string }
>(
    'reports/fetchIncome',
    async (params, { getState, rejectWithValue }) => {
        try {
            ensureToken(getState);
            const queryString = buildQueryString(params);
            const response = await apiClient.get<IncomeResponse>(
                `/api/reports/income${queryString}`
            );
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            return rejectWithValue(apiError.message || 'Erro ao carregar receitas');
        }
    }
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearOverview: (state) => {
            state.overview = null;
            state.overviewError = null;
        },
        clearExpenses: (state) => {
            state.expenses = null;
            state.expensesError = null;
        },
        clearInvestments: (state) => {
            state.investments = null;
            state.investmentsError = null;
        },
        clearIncome: (state) => {
            state.income = null;
            state.incomeError = null;
        },
        clearAllReports: (state) => {
            state.overview = null;
            state.overviewError = null;
            state.expenses = null;
            state.expensesError = null;
            state.investments = null;
            state.investmentsError = null;
            state.income = null;
            state.incomeError = null;
        },
    },
    extraReducers: (builder) => {
    
        builder
            .addCase(fetchMonthlyOverview.pending, (state) => {
                state.overviewLoading = true;
                state.overviewError = null;
            })
            .addCase(fetchMonthlyOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.overview = action.payload;
            })
            .addCase(fetchMonthlyOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.overviewError = action.payload || 'Erro desconhecido';
            });

    
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.expensesLoading = true;
                state.expensesError = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expensesLoading = false;
                state.expenses = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.expensesLoading = false;
                state.expensesError = action.payload || 'Erro desconhecido';
            });

    
        builder
            .addCase(fetchInvestments.pending, (state) => {
                state.investmentsLoading = true;
                state.investmentsError = null;
            })
            .addCase(fetchInvestments.fulfilled, (state, action) => {
                state.investmentsLoading = false;
                state.investments = action.payload;
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.investmentsLoading = false;
                state.investmentsError = action.payload || 'Erro desconhecido';
            });

    
        builder
            .addCase(fetchIncome.pending, (state) => {
                state.incomeLoading = true;
                state.incomeError = null;
            })
            .addCase(fetchIncome.fulfilled, (state, action) => {
                state.incomeLoading = false;
                state.income = action.payload;
            })
            .addCase(fetchIncome.rejected, (state, action) => {
                state.incomeLoading = false;
                state.incomeError = action.payload || 'Erro desconhecido';
            });
    },
});

export const {
    clearOverview,
    clearExpenses,
    clearInvestments,
    clearIncome,
    clearAllReports,
} = reportsSlice.actions;

export default reportsSlice.reducer;
