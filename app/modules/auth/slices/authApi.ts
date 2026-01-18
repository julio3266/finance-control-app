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
