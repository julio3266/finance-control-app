import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAddressByCep, CepResponse } from './cepApi';
import { searchInstitutions, fetchAllInstitutions, Institution } from './institutionsApi';
import { updateProfile } from './profileApi';
import { createAccount, CreateAccountResponse } from './accountsApi';

interface OnboardingState {
    cepLoading: boolean;
    cepError: string | null;
    address: CepResponse | null;
    institutionsLoading: boolean;
    institutionsError: string | null;
    institutions: Institution[];
    selectedInstitution: Institution | null;
    profileLoading: boolean;
    profileError: string | null;
    profileSuccess: boolean;
    accountLoading: boolean;
    accountError: string | null;
    accountSuccess: boolean;
    createdAccount: CreateAccountResponse | null;
}

const initialState: OnboardingState = {
    cepLoading: false,
    cepError: null,
    address: null,
    institutionsLoading: false,
    institutionsError: null,
    institutions: [],
    selectedInstitution: null,
    profileLoading: false,
    profileError: null,
    profileSuccess: false,
    accountLoading: false,
    accountError: null,
    accountSuccess: false,
    createdAccount: null,
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
        clearInstitutions: (state) => {
            state.institutions = [];
            state.institutionsError = null;
        },
        selectInstitution: (state, action: PayloadAction<Institution | null>) => {
            state.selectedInstitution = action.payload;
            state.institutions = [];
        },
        resetOnboarding: (state) => {
            state.profileLoading = false;
            state.profileError = null;
            state.profileSuccess = false;
            state.accountLoading = false;
            state.accountError = null;
            state.accountSuccess = false;
            state.createdAccount = null;
        },
        clearProfileError: (state) => {
            state.profileError = null;
        },
        clearAccountError: (state) => {
            state.accountError = null;
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
            })
            .addCase(fetchAllInstitutions.pending, (state) => {
                state.institutionsLoading = true;
                state.institutionsError = null;
            })
            .addCase(fetchAllInstitutions.fulfilled, (state, action) => {
                state.institutionsLoading = false;
                state.institutions = action.payload.institutions;
            })
            .addCase(fetchAllInstitutions.rejected, (state, action) => {
                state.institutionsLoading = false;
                state.institutionsError = action.payload as string;
            })
            .addCase(searchInstitutions.pending, (state) => {
                state.institutionsLoading = true;
                state.institutionsError = null;
            })
            .addCase(searchInstitutions.fulfilled, (state, action) => {
                state.institutionsLoading = false;
                state.institutions = action.payload.institutions;
            })
            .addCase(searchInstitutions.rejected, (state, action) => {
                state.institutionsLoading = false;
                state.institutionsError = action.payload as string;
            })
            .addCase(updateProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
                state.profileSuccess = false;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.profileLoading = false;
                state.profileSuccess = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload as string;
            })
            .addCase(createAccount.pending, (state) => {
                state.accountLoading = true;
                state.accountError = null;
                state.accountSuccess = false;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.accountSuccess = true;
                state.createdAccount = action.payload;
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.accountLoading = false;
                state.accountError = action.payload as string;
            });
    },
});

export const {
    clearCepData,
    setAddress,
    clearInstitutions,
    selectInstitution,
    resetOnboarding,
    clearProfileError,
    clearAccountError,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
