import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, sendOtp } from './authApi';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    otp: string | null;
    email: string | null;
    expiresAt: string | null;
    loading: boolean;
    error: string | null;
    isOnboardingQualified: boolean;
    otpAttempts: number;
    lockUntil: string | null; 
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    otp: null,
    email: null,
    expiresAt: null,
    loading: false,
    error: null,    
    isOnboardingQualified: false,
    otpAttempts: 0,
    lockUntil: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
     setOtp: (state, action: PayloadAction<string>) => {
        state.otp = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.otp = null;
            state.email = null;
            state.expiresAt = null;
            state.error = null;
            state.otpAttempts = 0;
            state.lockUntil = null;
        },
        setExpiresAt: (state, action: PayloadAction<string>) => {
            state.expiresAt = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        incrementOtpAttempts: (state) => {
            state.otpAttempts += 1;
            if (state.otpAttempts >= 3) {
                const lockDuration = 60;
                const lockUntil = new Date(Date.now() + lockDuration * 1000).toISOString();
                state.lockUntil = lockUntil;
            }
        },
        resetOtpAttempts: (state) => {
            state.otpAttempts = 0;
            state.lockUntil = null;
        },
        unlockAccount: (state) => {
            state.otpAttempts = 0;
            state.lockUntil = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isOnboardingQualified = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.expiresAt = action.payload.expiresAt;
                state.isAuthenticated = true;
                state.isOnboardingQualified = action.payload.isOnboardingQualified;
                state.otpAttempts = 0;
                state.lockUntil = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isOnboardingQualified = false;
            });
    },
});

export const { 
    setOtp, 
    setEmail, 
    setToken, 
    logout, 
    clearError, 
    setExpiresAt,
    incrementOtpAttempts,
    resetOtpAttempts,
    unlockAccount,
} = authSlice.actions;
export default authSlice.reducer;

