import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, sendOtp, fetchUserProfile } from './authApi';

interface UserInfo {
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

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    otp: string | null;
    email: string | null;
    expiresAt: string | null;
    loading: boolean;
    profileLoading: boolean;
    user: UserInfo | null;
    error: string | null;
    needsOnboarding: boolean;
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
    profileLoading: false,
    error: null,
    user: null,
    needsOnboarding: false,
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
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload;
            state.needsOnboarding = action.payload.needsOnboarding;
        },
        setNeedsOnboarding: (state, action: PayloadAction<boolean>) => {
            state.needsOnboarding = action.payload;
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
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.expiresAt = action.payload.expiresAt;
                state.isAuthenticated = true;
                state.otpAttempts = 0;
                state.lockUntil = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.user = action.payload;
                state.needsOnboarding = action.payload.needsOnboarding;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.error = action.payload as string;
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
    setUserInfo,
    setNeedsOnboarding,
} = authSlice.actions;
export default authSlice.reducer;
