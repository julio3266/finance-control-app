import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAddressByCep, CepResponse } from './cepApi';

interface OnboardingState {
    cepLoading: boolean;
    cepError: string | null;
    address: CepResponse | null;
}

const initialState: OnboardingState = {
    cepLoading: false,
    cepError: null,
    address: null,
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        clearCepData: (state) => {
            state.address = null;
            state.cepError = null;
        },
        setAddress: (state, action: PayloadAction<CepResponse>) => {
            state.address = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddressByCep.pending, (state) => {
                state.cepLoading = true;
                state.cepError = null;
            })
            .addCase(fetchAddressByCep.fulfilled, (state, action) => {
                state.cepLoading = false;
                state.address = action.payload;
            })
            .addCase(fetchAddressByCep.rejected, (state, action) => {
                state.cepLoading = false;
                state.cepError = action.payload as string;
            });
    },
});

export const { clearCepData, setAddress } = onboardingSlice.actions;
export default onboardingSlice.reducer;
