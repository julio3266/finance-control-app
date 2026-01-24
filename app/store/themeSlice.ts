import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
    hideValues: boolean;
}

const initialState: ThemeState = {
    mode: 'light',
    hideValues: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
        },
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        toggleHideValues: (state) => {
            state.hideValues = !state.hideValues;
        },
        setHideValues: (state, action: PayloadAction<boolean>) => {
            state.hideValues = action.payload;
        },
    },
});

export const { setTheme, toggleTheme, toggleHideValues, setHideValues } = themeSlice.actions;
export default themeSlice.reducer;
