import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface UserProfileResponse {
    id: string;
    email: string;
    plan: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    role: 'USER' | 'ADMIN';
    isPremium: boolean;
    isAdmin: boolean;
    needsOnboarding: boolean;
    createdAt: string;
    userInfo: {
        firstName: string;
        lastName: string;
        address: string;
        complement: string;
        phoneNumber: string;
    } | null;
    subscription: {
        status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
    } | null;
}

export const fetchUserProfile = createAsyncThunk<
    UserProfileResponse,
    void,
    { state: RootState; rejectValue: string }
>('profile/fetchUserProfile', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<UserProfileResponse>('/api/auth/profile', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar perfil do usuário';
        return rejectWithValue(errorMessage);
    }
});
