import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

// Types
export interface PlanFeature {
    id: string;
    name: string;
    description: string;
    icon: string;
    included: boolean;
    sortOrder: number;
}

export interface PlanLimits {
    maxAccounts: number;
    maxCreditCards: number;
}

export interface Plan {
    id: string;
    type: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year' | null;
    features: PlanFeature[];
    limits: PlanLimits;
}

export interface PlansResponse {
    plans: Plan[];
}

export interface SubscriptionInfo {
    isActive: boolean;
    isPremium: boolean;
    status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING' | 'INCOMPLETE' | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId: string | null;
}

export interface CheckoutResponse {
    sessionId: string;
    url: string;
}

export interface PortalResponse {
    url: string;
}

export interface FeatureAccessResponse {
    feature: string;
    hasAccess: boolean;
}

// Fetch plans (public)
export const fetchPlans = createAsyncThunk<PlansResponse, void, { rejectValue: string }>(
    'subscription/fetchPlans',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<PlansResponse>('/api/plans');
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            return rejectWithValue(apiError.message || 'Erro ao buscar planos');
        }
    },
);

// Fetch plan details (public)
export const fetchPlanDetails = createAsyncThunk<
    Plan,
    string,
    { rejectValue: string }
>('subscription/fetchPlanDetails', async (planType, { rejectWithValue }) => {
    try {
        const response = await apiClient.get<Plan>(`/api/plans/${planType}`);
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao buscar detalhes do plano');
    }
});

// Fetch subscription info
export const fetchSubscriptionInfo = createAsyncThunk<
    SubscriptionInfo,
    void,
    { state: RootState; rejectValue: string }
>('subscription/fetchInfo', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<SubscriptionInfo>('/api/subscription/info', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao buscar informações da assinatura');
    }
});

// Create checkout session
export const createCheckoutSession = createAsyncThunk<
    CheckoutResponse,
    void,
    { state: RootState; rejectValue: string }
>('subscription/createCheckout', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<CheckoutResponse>(
            '/api/subscription/checkout',
            {},
            { Authorization: `Bearer ${token}` },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        if (apiError.message?.includes('already have an active subscription')) {
            return rejectWithValue('Você já possui uma assinatura ativa');
        }
        return rejectWithValue(apiError.message || 'Erro ao criar sessão de checkout');
    }
});

// Open Stripe portal
export const openStripePortal = createAsyncThunk<
    PortalResponse,
    void,
    { state: RootState; rejectValue: string }
>('subscription/openPortal', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<PortalResponse>(
            '/api/subscription/portal',
            {},
            { Authorization: `Bearer ${token}` },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao abrir portal de gerenciamento');
    }
});

// Cancel subscription
export const cancelSubscription = createAsyncThunk<
    { message: string },
    void,
    { state: RootState; rejectValue: string }
>('subscription/cancel', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<{ message: string }>(
            '/api/subscription/cancel',
            {},
            { Authorization: `Bearer ${token}` },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao cancelar assinatura');
    }
});

// Reactivate subscription
export const reactivateSubscription = createAsyncThunk<
    { message: string },
    void,
    { state: RootState; rejectValue: string }
>('subscription/reactivate', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<{ message: string }>(
            '/api/subscription/reactivate',
            {},
            { Authorization: `Bearer ${token}` },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao reativar assinatura');
    }
});

// Check feature access
export const checkFeatureAccess = createAsyncThunk<
    FeatureAccessResponse,
    string,
    { state: RootState; rejectValue: string }
>('subscription/checkFeature', async (feature, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<FeatureAccessResponse>(
            `/api/subscription/feature/${feature}`,
            { Authorization: `Bearer ${token}` },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        return rejectWithValue(apiError.message || 'Erro ao verificar acesso à feature');
    }
});
