import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';

export interface CepResponse {
    cep: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    ibgeCode: string;
    ddd: string;
}

export const fetchAddressByCep = createAsyncThunk(
    'onboarding/fetchAddressByCep',
    async (cep: string, { rejectWithValue }) => {
        try {
            const cleanCep = cep.replace(/\D/g, '');

            if (cleanCep.length !== 8) {
                return rejectWithValue('CEP deve ter 8 dígitos');
            }

            const response = await apiClient.get<CepResponse>(`/api/cep/${cleanCep}`);
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Erro ao buscar endereço';
            return rejectWithValue(errorMessage);
        }
    },
);
