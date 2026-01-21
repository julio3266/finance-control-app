import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile, type UserProfileResponse } from './profileApi';

interface ProfileState {
    profile: UserProfileResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar perfil do usuário';
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
