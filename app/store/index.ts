import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authReducer } from '../modules/auth/slices';
import themeReducer from './themeSlice';
import financeReducer from './financeSlice';

// Define types before persistence to ensure proper typing
type AuthStateType = ReturnType<typeof authReducer>;
type ThemeStateType = ReturnType<typeof themeReducer>;
type FinanceStateType = ReturnType<typeof financeReducer>;

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: [
        'token',
        'email',
        'expiresAt',
        'isAuthenticated',
        'isOnboardingQualified',
        'otpAttempts',
        'lockUntil',
    ],
};

const themePersistConfig = {
    key: 'theme',
    storage: AsyncStorage,
    whitelist: ['mode'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        theme: persistedThemeReducer,
        finance: financeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export interface TypedRootState {
    auth: AuthStateType;
    theme: ThemeStateType;
    finance: FinanceStateType;
}

export type RootStateTyped = RootState & TypedRootState;

export type AppDispatch = typeof store.dispatch;

export type AuthState = AuthStateType;
export type ThemeState = ThemeStateType;

export const useAppDispatch = () => useDispatch<AppDispatch>();

// Wrapper function that ensures proper type inference by casting the state internally
export function useAppSelector<TSelected>(
    selector: (state: TypedRootState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected {
    return useSelector<RootState, TSelected>(
        (state) => selector(state as unknown as TypedRootState),
        equalityFn,
    );
}
