import { createSlice } from '@reduxjs/toolkit';
import {
    fetchCardBrands,
    createCreditCard,
    fetchCreditCards,
    fetchCreditCardDetails,
    deleteCreditCard,
    CardBrandResponse,
    CreditCardResponse,
    CreditCardDetailsResponse,
} from './creditCardApi';

interface CreditCardState {
    brands: CardBrandResponse[];
    brandsLoading: boolean;
    brandsError: string | null;
    cards: CreditCardResponse[];
    cardsLoading: boolean;
    cardsError: string | null;
    createLoading: boolean;
    createError: string | null;
    details: CreditCardDetailsResponse | null;
    detailsLoading: boolean;
    detailsError: string | null;
    deleteLoading: boolean;
    deleteError: string | null;
}

const initialState: CreditCardState = {
    brands: [],
    brandsLoading: false,
    brandsError: null,
    cards: [],
    cardsLoading: false,
    cardsError: null,
    createLoading: false,
    createError: null,
    details: null,
    detailsLoading: false,
    detailsError: null,
    deleteLoading: false,
    deleteError: null,
};

const creditCardSlice = createSlice({
    name: 'creditCard',
    initialState,
    reducers: {
        clearCreditCards: (state) => {
            state.cards = [];
            state.cardsError = null;
        },
        clearBrands: (state) => {
            state.brands = [];
            state.brandsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCardBrands.pending, (state) => {
                state.brandsLoading = true;
                state.brandsError = null;
            })
            .addCase(fetchCardBrands.fulfilled, (state, action) => {
                state.brandsLoading = false;
                state.brands = action.payload;
            })
            .addCase(fetchCardBrands.rejected, (state, action) => {
                state.brandsLoading = false;
                state.brandsError = action.payload || 'Erro ao buscar bandeiras';
            })
            .addCase(createCreditCard.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createCreditCard.fulfilled, (state, action) => {
                state.createLoading = false;
                state.cards.push(action.payload);
            })
            .addCase(createCreditCard.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload || 'Erro ao criar cartão';
            })
            .addCase(fetchCreditCards.pending, (state) => {
                state.cardsLoading = true;
                state.cardsError = null;
            })
            .addCase(fetchCreditCards.fulfilled, (state, action) => {
                state.cardsLoading = false;
                state.cards = action.payload;
            })
            .addCase(fetchCreditCards.rejected, (state, action) => {
                state.cardsLoading = false;
                state.cardsError = action.payload || 'Erro ao buscar cartões';
            })
            .addCase(fetchCreditCardDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
            })
            .addCase(fetchCreditCardDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.details = action.payload;
            })
            .addCase(fetchCreditCardDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError = action.payload || 'Erro ao buscar detalhes do cartão';
            })
            .addCase(deleteCreditCard.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteCreditCard.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.cards = state.cards.filter((card) => card.id !== action.payload);
                // Limpar detalhes se o cartão deletado for o que está sendo visualizado
                if (state.details?.card.id === action.payload) {
                    state.details = null;
                }
            })
            .addCase(deleteCreditCard.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload || 'Erro ao deletar cartão';
            });
    },
});

export const { clearCreditCards, clearBrands } = creditCardSlice.actions;
export default creditCardSlice.reducer;
