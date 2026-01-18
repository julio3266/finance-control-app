import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';

export interface Institution {
    id: string;
    name: string;
    logo?: string;
    localLogo?: string;
    logoVariants?: {
        light: string;
        dark: string;
    };
    type: string;
    ispb?: string;
}

export interface InstitutionSearchResponse {
    query: string;
    type: string;
    count: number;
    institutions: Institution[];
}

export const searchInstitutions = createAsyncThunk(
    'onboarding/searchInstitutions',
    async (query: string, { rejectWithValue }) => {
        try {
            if (query.trim().length < 2) {
                return { query, type: 'all', count: 0, institutions: [] };
            }

            const response = await apiClient.get<InstitutionSearchResponse>(
                `/api/institutions/search?q=${encodeURIComponent(query)}&withLogos=true`,
            );
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Erro ao buscar instituições';
            return rejectWithValue(errorMessage);
        }
    },
);
