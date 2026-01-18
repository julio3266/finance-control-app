import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    address: string;
    complement?: string;
    phoneNumber: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
}

export const updateProfile = createAsyncThunk<
    UpdateProfileResponse,
    UpdateProfileRequest,
    { state: RootState; rejectValue: string }
>('onboarding/updateProfile', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = auth.token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.put<UpdateProfileResponse>(
            '/api/auth/profile/info',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao atualizar perfil';
        return rejectWithValue(errorMessage);
    }
});
