import { createSlice } from '@reduxjs/toolkit';
import {
    createFixedIncome,
    createVariableIncome,
    fetchInvestments,
    deleteFixedIncome,
    deleteVariableIncome,
    searchAssets,
    searchInstitutions,
    FixedIncomeInvestment,
    VariableIncomeInvestment,
    AssetSearchResult,
    InstitutionSearchResult,
} from './investimentsApi';

interface InvestmentsState {
    fixedIncome: FixedIncomeInvestment[];
    variableIncome: VariableIncomeInvestment[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    createError: string | null;
    assetSearchResults: AssetSearchResult[];
    assetSearchLoading: boolean;
    institutionSearchResults: InstitutionSearchResult[];
    institutionSearchLoading: boolean;
}

const initialState: InvestmentsState = {
    fixedIncome: [],
    variableIncome: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    assetSearchResults: [],
    assetSearchLoading: false,
    institutionSearchResults: [],
    institutionSearchLoading: false,
};

const investimentsSlice = createSlice({
    name: 'investments',
    initialState,
    reducers: {
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearAssetSearchResults: (state) => {
            state.assetSearchResults = [];
        },
        clearInstitutionSearchResults: (state) => {
            state.institutionSearchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvestments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvestments.fulfilled, (state, action) => {
                state.loading = false;
                state.fixedIncome = action.payload.fixedIncome;
                state.variableIncome = action.payload.variableIncome;
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createFixedIncome.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createFixedIncome.fulfilled, (state, action) => {
                state.createLoading = false;
                state.fixedIncome.push(action.payload);
            })
            .addCase(createFixedIncome.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload as string;
            });

        // Create Variable Income
        builder
            .addCase(createVariableIncome.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createVariableIncome.fulfilled, (state, action) => {
                state.createLoading = false;
                state.variableIncome.push(action.payload);
            })
            .addCase(createVariableIncome.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload as string;
            });

        // Delete Fixed Income
        builder
            .addCase(deleteFixedIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFixedIncome.fulfilled, (state, action) => {
                state.loading = false;
                state.fixedIncome = state.fixedIncome.filter((inv) => inv.id !== action.payload);
            })
            .addCase(deleteFixedIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Variable Income
        builder
            .addCase(deleteVariableIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVariableIncome.fulfilled, (state, action) => {
                state.loading = false;
                state.variableIncome = state.variableIncome.filter(
                    (inv) => inv.id !== action.payload,
                );
            })
            .addCase(deleteVariableIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Search Assets
        builder
            .addCase(searchAssets.pending, (state) => {
                state.assetSearchLoading = true;
            })
            .addCase(searchAssets.fulfilled, (state, action) => {
                state.assetSearchLoading = false;
                state.assetSearchResults = action.payload;
            })
            .addCase(searchAssets.rejected, (state) => {
                state.assetSearchLoading = false;
                state.assetSearchResults = [];
            });

        // Search Institutions
        builder
            .addCase(searchInstitutions.pending, (state) => {
                state.institutionSearchLoading = true;
            })
            .addCase(searchInstitutions.fulfilled, (state, action) => {
                state.institutionSearchLoading = false;
                state.institutionSearchResults = action.payload;
            })
            .addCase(searchInstitutions.rejected, (state) => {
                state.institutionSearchLoading = false;
                state.institutionSearchResults = [];
            });
    },
});

export const { clearCreateError, clearAssetSearchResults, clearInstitutionSearchResults } =
    investimentsSlice.actions;
export default investimentsSlice.reducer;
