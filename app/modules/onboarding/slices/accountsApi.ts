import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CASH' | 'CREDIT' | 'INVESTMENT' | 'OTHER';

export interface CreateAccountRequest {
    name: string;
    institution: string;
    institutionLogo?: string;
    type: AccountType;
    color: string;
    initialBalance: number;
}

export interface CreateAccountResponse {
    id: string;
    name: string;
    institution: string;
    institutionLogo?: string;
    type: AccountType;
    color: string;
    balance: number;
    createdAt: string;
}

export const createAccount = createAsyncThunk<
    CreateAccountResponse,
    CreateAccountRequest,
    { state: RootState; rejectValue: string }
>('onboarding/createAccount', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = auth.token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<CreateAccountResponse>(
            '/api/finance/accounts',
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao criar conta';
        return rejectWithValue(errorMessage);
    }
});
