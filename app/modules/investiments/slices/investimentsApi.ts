import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@app/utils/api';

const ensureToken = (getState: () => unknown): void => {
    const state = getState() as any;
    const token = state.auth?.token;
    if (token) {
        apiClient.setToken(token);
    }
};

export interface AssetSearchResult {
    ticker: string;
    name: string;
    type: string;
    price?: number;
    change?: number;
    changePercent?: number;
    logo?: string;
    sector?: string;
    currency?: string;
}

export interface InstitutionSearchResult {
    id: string;
    name: string;
    code?: string;
    logo?: string;
}

export interface FixedIncomeInvestment {
    id: string;
    name: string;
    broker: string;
    investedAmount: number;
    purchaseDate: string;
    fixedIncomeType: 'CDB' | 'LCI' | 'LCA' | 'LC' | 'TESOURO_DIRETO' | 'DEBENTURE' | 'CRI' | 'CRA';
    maturityDate?: string;
    indexer?: 'CDI' | 'IPCA' | 'SELIC' | 'PRE_FIXADO';
    rate?: number;
    currentValue?: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface VariableIncomeInvestment {
    id: string;
    name: string;
    ticker: string;
    broker: string;
    variableIncomeType: 'STOCK' | 'FII' | 'ETF' | 'BDR' | 'CRYPTO';
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
    totalInvested: number;
    currentValue?: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFixedIncomePayload {
    name: string;
    broker: string;
    investedAmount: number;
    purchaseDate: string;
    fixedIncomeType: 'CDB' | 'LCI' | 'LCA' | 'LC' | 'TESOURO_DIRETO' | 'DEBENTURE' | 'CRI' | 'CRA';
    maturityDate?: string;
    indexer?: 'CDI' | 'IPCA' | 'SELIC' | 'PRE_FIXADO';
    rate?: number;
}

export interface CreateVariableIncomePayload {
    name: string;
    ticker: string;
    broker: string;
    variableIncomeType: 'STOCK' | 'FII' | 'ETF' | 'BDR' | 'CRYPTO';
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
}

export const searchAssets = createAsyncThunk<AssetSearchResult[], string>(
    'investments/searchAssets',
    async (query, { rejectWithValue, getState }) => {
        try {
            ensureToken(getState);
            const response = await apiClient.get<AssetSearchResult[]>(
                `/api/assets/search?q=${encodeURIComponent(query)}&limit=10`,
            );
            
            return Array.isArray(response) ? response : [];
        } catch (error: any) {
            console.error('Error searching assets:', error);
            return rejectWithValue(error.response?.data?.message || 'Erro ao buscar ativos');
        }
    },
);

export const searchInstitutions = createAsyncThunk<InstitutionSearchResult[], string>(
    'investments/searchInstitutions',
    async (query, { rejectWithValue, getState }) => {
        try {
            ensureToken(getState);
            const response = await apiClient.get<any>(
                `/api/institutions/search?q=${encodeURIComponent(query)}&type=brokers&limit=10`,
            );
            
            return response?.institutions && Array.isArray(response.institutions) 
                ? response.institutions 
                : [];
        } catch (error: any) {
            console.error('Error searching institutions:', error);
            return rejectWithValue(error.response?.data?.message || 'Erro ao buscar instituições');
        }
    },
);

export const createFixedIncome = createAsyncThunk<FixedIncomeInvestment, CreateFixedIncomePayload>(
    'investments/createFixedIncome',
    async (data, { rejectWithValue, getState }) => {
        try {
            ensureToken(getState);
            const response = await apiClient.post<FixedIncomeInvestment>(
                '/api/investments/fixed-income',
                data,
            );
            return response;
        } catch (error: any) {
            console.error('Error creating fixed income investment:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao criar investimento de renda fixa',
            );
        }
    },
);

export const createVariableIncome = createAsyncThunk<
    VariableIncomeInvestment,
    CreateVariableIncomePayload
>('investments/createVariableIncome', async (data, { rejectWithValue, getState }) => {
    try {
        ensureToken(getState);
        const response = await apiClient.post<VariableIncomeInvestment>(
            '/api/investments/variable-income',
            data,
        );
        return response;
    } catch (error: any) {
        console.error('Error creating variable income investment:', error);
        return rejectWithValue(
            error.response?.data?.message || 'Erro ao criar investimento de renda variável',
        );
    }
});

export const fetchInvestments = createAsyncThunk(
    'investments/fetchAll',
    async (_, { rejectWithValue, getState }) => {
        try {
        ensureToken(getState);
            const [fixedIncome, variableIncome] = await Promise.all([
                apiClient.get<FixedIncomeInvestment[]>('/api/investments/fixed-income'),
                apiClient.get<VariableIncomeInvestment[]>('/api/investments/variable-income'),
            ]);
            return {
                fixedIncome,
                variableIncome,
            };
        } catch (error: any) {
            console.error('Error fetching investments:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao buscar investimentos',
            );
        }
    },
);

export const deleteFixedIncome = createAsyncThunk<string, string>(
    'investments/deleteFixedIncome',
    async (id, { rejectWithValue, getState }) => {
        try {
            ensureToken(getState);
            await apiClient.delete(`/api/investments/fixed-income/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao deletar investimento de renda fixa',
            );
        }
    },
);

export const deleteVariableIncome = createAsyncThunk<string, string>(
    'investments/deleteVariableIncome',
    async (id, { rejectWithValue, getState }) => {
        try {
            ensureToken(getState);
            await apiClient.delete(`/api/investments/variable-income/${id}`);
            return id;
        } catch (error: any) {
            console.error('Error deleting variable income investment:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao deletar investimento de renda variável',
            );
        }
    },
);
