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
import { onboardingReducer } from '../modules/onboarding/slices';
import accountsReducer from '../modules/accounts/slices/accountsSlice';
import creditCardReducer from '../modules/credit-card/slices/creditCardSlice';
import { profileReducer } from '../modules/profile/slices';
import { openFinanceReducer } from '../modules/open-finance/slices';
import { errorMiddleware } from './middleware';

type AuthStateType = ReturnType<typeof authReducer>;
type ThemeStateType = ReturnType<typeof themeReducer>;
type FinanceStateType = ReturnType<typeof financeReducer>;
type OnboardingStateType = ReturnType<typeof onboardingReducer>;
type AccountsStateType = ReturnType<typeof accountsReducer>;
type CreditCardStateType = ReturnType<typeof creditCardReducer>;
type ProfileStateType = ReturnType<typeof profileReducer>;
type OpenFinanceStateType = ReturnType<typeof openFinanceReducer>;

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: [
        'token',
        'email',
        'expiresAt',
        'isAuthenticated',
        'needsOnboarding',
        'user',
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
        onboarding: onboardingReducer,
        accounts: accountsReducer,
        creditCard: creditCardReducer,
        profile: profileReducer,
        openFinance: openFinanceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(errorMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export interface TypedRootState {
    auth: AuthStateType;
    theme: ThemeStateType;
    finance: FinanceStateType;
    onboarding: OnboardingStateType;
    accounts: AccountsStateType;
    creditCard: CreditCardStateType;
    profile: ProfileStateType;
    openFinance: OpenFinanceStateType;
}

export type RootStateTyped = RootState & TypedRootState;

export type AppDispatch = typeof store.dispatch;

export type AuthState = AuthStateType;
export type ThemeState = ThemeStateType;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useAppSelector<TSelected>(
    selector: (state: TypedRootState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected {
    return useSelector<RootState, TSelected>(
        (state) => selector(state as unknown as TypedRootState),
        equalityFn,
    );
}
