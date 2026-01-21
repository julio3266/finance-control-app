import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface CardBrandResponse {
    id: string;
    name: string;
    iconUrl: string | null;
    variants: {
        original: string | null;
        small?: string | null;
        medium?: string | null;
        large?: string | null;
    };
}

export interface CreateCreditCardRequest {
    name: string;
    totalLimit: number;
    usedLimit: number;
    brand: string;
    closingDay: number;
    dueDay: number;
    accountId?: string;
}

export interface CreditCardResponse {
    id: string;
    name: string;
    totalLimit: number;
    usedLimit: number;
    brand: string;
    closingDay: number | null;
    dueDay: number | string | null;
    accountId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    source?: string;
    institution?: string;
    institutionLogo?: string;
    connectionId?: string;
    currencyCode?: string;
    number?: string;
}

export const fetchCardBrands = createAsyncThunk<
    CardBrandResponse[],
    void,
    { state: RootState; rejectValue: string }
>('creditCard/fetchBrands', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<CardBrandResponse[]>('/api/credit-card-brands', {
            Authorization: `Bearer ${token}`,
        });
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar bandeiras de cartão';
        return rejectWithValue(errorMessage);
    }
});

export const createCreditCard = createAsyncThunk<
    CreditCardResponse,
    CreateCreditCardRequest,
    { state: RootState; rejectValue: string }
>('creditCard/create', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<CreditCardResponse>('/api/credit-cards', data, {
            Authorization: `Bearer ${token}`,
        });
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao criar cartão de crédito';
        return rejectWithValue(errorMessage);
    }
});

export const fetchCreditCards = createAsyncThunk<
    CreditCardResponse[],
    { includeInactive?: boolean } | void,
    { state: RootState; rejectValue: string }
>('creditCard/fetchCards', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = params && params.includeInactive ? '?includeInactive=true' : '';
        const response = await apiClient.get<CreditCardResponse[]>(
            `/api/credit-cards${queryParams}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar cartões de crédito';
        return rejectWithValue(errorMessage);
    }
});

export interface TransactionCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface CreditCardTransaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    isPaid: boolean;
    category: TransactionCategory;
}

export interface MonthlyTransactionGroup {
    month: string;
    monthLabel: string;
    closingDate: string;
    dueDate: string;
    totalInvoice: number;
    totalExpenses: number;
    totalPaid: number;
    transactions: CreditCardTransaction[];
}

export interface CreditCardDetailsResponse {
    card: CreditCardResponse;
    monthlyTransactions: MonthlyTransactionGroup[];
}

export const fetchCreditCardDetails = createAsyncThunk<
    CreditCardDetailsResponse,
    { cardId: string; year?: number; month?: number },
    { state: RootState; rejectValue: string }
>('creditCard/fetchDetails', async ({ cardId, year, month }, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = [];
        if (year !== undefined) {
            queryParams.push(`year=${year}`);
        }
        if (month !== undefined) {
            queryParams.push(`month=${month}`);
        }
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

        const response = await apiClient.get<CreditCardDetailsResponse>(
            `/api/credit-cards/${cardId}/details${queryString}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar detalhes do cartão';
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Fetch Credit Card Details Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});

export interface DeleteCreditCardResponse {
    message: string;
}

export const deleteCreditCard = createAsyncThunk<
    string,
    string,
    { state: RootState; rejectValue: string }
>('creditCard/delete', async (cardId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        await apiClient.delete<DeleteCreditCardResponse>(`/api/credit-cards/${cardId}`, {
            Authorization: `Bearer ${token}`,
        });

        return cardId;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao deletar cartão de crédito';
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Delete Credit Card Error:', errorMessage, error);
        }
        return rejectWithValue(errorMessage);
    }
});
