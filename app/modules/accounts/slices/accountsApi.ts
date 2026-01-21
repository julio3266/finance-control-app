import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
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
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Fetch Accounts Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});
