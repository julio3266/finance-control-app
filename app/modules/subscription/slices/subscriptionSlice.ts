import { createSlice } from '@reduxjs/toolkit';
import {
    fetchPlans,
    fetchPlanDetails,
    fetchSubscriptionInfo,
    createCheckoutSession,
    createSetupIntent,
    createPaymentIntent,
    openStripePortal,
    cancelSubscription,
    reactivateSubscription,
    type Plan,
    type SubscriptionInfo,
} from './subscriptionApi';

interface SubscriptionState {
    plans: Plan[];
    selectedPlan: Plan | null;
    subscriptionInfo: SubscriptionInfo | null;
    checkoutUrl: string | null;
    clientSecret: string | null;
    portalUrl: string | null;
    loading: boolean;
    plansLoading: boolean;
    checkoutLoading: boolean;
    portalLoading: boolean;
    cancelLoading: boolean;
    reactivateLoading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    plans: [],
    selectedPlan: null,
    subscriptionInfo: null,
    checkoutUrl: null,
    clientSecret: null,
    portalUrl: null,
    loading: false,
    plansLoading: false,
    checkoutLoading: false,
    portalLoading: false,
    cancelLoading: false,
    reactivateLoading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCheckoutUrl: (state) => {
            state.checkoutUrl = null;
        },
        clearClientSecret: (state) => {
            state.clientSecret = null;
        },
        clearPortalUrl: (state) => {
            state.portalUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch plans
            .addCase(fetchPlans.pending, (state) => {
                state.plansLoading = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.plansLoading = false;
                state.plans = action.payload.plans;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.plansLoading = false;
                state.error = action.payload || 'Erro ao buscar planos';
            })

            // Fetch plan details
            .addCase(fetchPlanDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlanDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(fetchPlanDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar detalhes do plano';
            })

            // Fetch subscription info
            .addCase(fetchSubscriptionInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptionInfo = action.payload;
            })
            .addCase(fetchSubscriptionInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar informações da assinatura';
            })

            // Create checkout
            .addCase(createCheckoutSession.pending, (state) => {
                state.checkoutLoading = true;
                state.error = null;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action) => {
                state.checkoutLoading = false;
                state.checkoutUrl = action.payload.url;
            })
            .addCase(createCheckoutSession.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.error = action.payload || 'Erro ao criar checkout';
            })

            // Create setup intent (for subscriptions)
            .addCase(createSetupIntent.pending, (state) => {
                state.checkoutLoading = true;
                state.error = null;
            })
            .addCase(createSetupIntent.fulfilled, (state, action) => {
                state.checkoutLoading = false;
                state.clientSecret = action.payload.clientSecret;
            })
            .addCase(createSetupIntent.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.error = action.payload || 'Erro ao criar setup intent';
            })

            // Create payment intent (native SDK)
            .addCase(createPaymentIntent.pending, (state) => {
                state.checkoutLoading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.checkoutLoading = false;
                state.clientSecret = action.payload.clientSecret;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.error = action.payload || 'Erro ao criar pagamento';
            })

            // Open portal
            .addCase(openStripePortal.pending, (state) => {
                state.portalLoading = true;
                state.error = null;
            })
            .addCase(openStripePortal.fulfilled, (state, action) => {
                state.portalLoading = false;
                state.portalUrl = action.payload.url;
            })
            .addCase(openStripePortal.rejected, (state, action) => {
                state.portalLoading = false;
                state.error = action.payload || 'Erro ao abrir portal';
            })

            // Cancel subscription
            .addCase(cancelSubscription.pending, (state) => {
                state.cancelLoading = true;
                state.error = null;
            })
            .addCase(cancelSubscription.fulfilled, (state) => {
                state.cancelLoading = false;
                if (state.subscriptionInfo) {
                    state.subscriptionInfo.cancelAtPeriodEnd = true;
                }
            })
            .addCase(cancelSubscription.rejected, (state, action) => {
                state.cancelLoading = false;
                state.error = action.payload || 'Erro ao cancelar assinatura';
            })

            // Reactivate subscription
            .addCase(reactivateSubscription.pending, (state) => {
                state.reactivateLoading = true;
                state.error = null;
            })
            .addCase(reactivateSubscription.fulfilled, (state) => {
                state.reactivateLoading = false;
                if (state.subscriptionInfo) {
                    state.subscriptionInfo.cancelAtPeriodEnd = false;
                }
            })
            .addCase(reactivateSubscription.rejected, (state, action) => {
                state.reactivateLoading = false;
                state.error = action.payload || 'Erro ao reativar assinatura';
            });
    },
});

export const { clearError, clearCheckoutUrl, clearClientSecret, clearPortalUrl } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
