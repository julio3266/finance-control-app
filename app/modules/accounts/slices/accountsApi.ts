import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, type ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface AccountResponse {
    id: string;
    userId: string;
    name: string;
    institution: string;
    institutionLogo?: string;
    type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
    initialBalance: string;
    currentBalance: string;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UnifiedAccountResponse {
    id: string;
    name: string;
    type: 'CHECKING' | 'CHECKING_ACCOUNT' | 'INVESTMENT' | 'BANK' | 'CREDIT_CARD' | 'CREDIT';
    currentBalance?: number;
    balance?: number;
    source: 'manual' | 'open_finance';
    institution?: string;
    institutionLogo?: string;
    color?: string;
    isActive?: boolean;
    number?: string; // Número da conta (ex: "00001021605-1")
}

export const fetchAccounts = createAsyncThunk<
    AccountResponse[],
    { excludeInvestment?: boolean } | void,
    { state: RootState; rejectValue: string }
>('accounts/fetchAccounts', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = params && params.excludeInvestment ? '?excludeInvestment=true' : '';
        const response = await apiClient.get<AccountResponse[]>(
            `/api/finance/accounts${queryParams}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar contas';
        return rejectWithValue(errorMessage);
    }
});

export const fetchUnifiedAccounts = createAsyncThunk<
    UnifiedAccountResponse[],
    void,
    { state: RootState; rejectValue: string }
>('accounts/fetchUnifiedAccounts', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<UnifiedAccountResponse[]>(
            '/api/finance/accounts/unified',
            {
                Authorization: `Bearer ${token}`,
            },
        );
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar contas unificadas';
        return rejectWithValue(errorMessage);
    }
});
