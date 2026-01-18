import { createAsyncThunk } from '@reduxjs/toolkit';
import { setOtp, setEmail } from './authSlice';
import { apiClient, ApiError } from '@app/utils/api';

interface SendOtpResponse {
    message: string;
    expiresAt: string;
    emailSent: boolean;
}

interface LoginRequest {
    email: string;
    otp: string;
}

interface LoginResponse {
    message: string;
    token: string;
    expiresAt: string;
    isOnboardingQualified: boolean;
}

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (email: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiClient.post<SendOtpResponse>('/api/auth/otp/request', {
                email,
            });

            dispatch(setEmail(email));
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Erro ao enviar código';
            return rejectWithValue(errorMessage);
        }
    },
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, otp }: LoginRequest, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiClient.post<LoginResponse>('/api/auth/otp/validate', {
                email,
                otp,
            });

            dispatch(setOtp(otp));
            dispatch(setEmail(email));
            return {
                token: response.token,
                expiresAt: response.expiresAt,
                isOnboardingQualified: response.isOnboardingQualified,
            };
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Erro ao fazer login';
            return rejectWithValue(errorMessage);
        }
    },
);

interface UserInfoResponse {
    id: string;
    email: string;
    plan: string;
    role: string;
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
    subscription: string | null;
}

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            const token = state.auth.token;

            if (!token) {
                return rejectWithValue('Token não encontrado');
            }

            const response = await apiClient.get<UserInfoResponse>('/api/auth/profile', {
                Authorization: `Bearer ${token}`,
            });
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Erro ao buscar informações do usuário';
            return rejectWithValue(errorMessage);
        }
    },
);
