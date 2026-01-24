import { createSlice } from '@reduxjs/toolkit';
import {
    fetchConnectors,
    fetchConnectToken,
    createConnection,
    fetchConnections,
    syncConnection,
    deleteConnection,
    fetchBankTransactions,
    analyzeReconciliation,
    fetchJobsStatus,
    fetchJobDetails,
    type Connector,
    type BankConnection,
    type BankTransaction,
    type ReconciliationAnalysisResponse,
    type JobsStatusResponse,
    type JobResponse,
} from './openFinanceApi';

interface OpenFinanceState {
    connectors: Connector[];
    connectorsLoading: boolean;
    connectorsError: string | null;
    searchQuery: string;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null;

    connectToken: string | null;
    connectTokenLoading: boolean;
    connectTokenError: string | null;

    connections: BankConnection[];
    connectionsLoading: boolean;
    connectionsError: string | null;

    bankTransactions: BankTransaction[];
    bankTransactionsLoading: boolean;
    bankTransactionsError: string | null;

    reconciliation: ReconciliationAnalysisResponse | null;
    reconciliationLoading: boolean;
    reconciliationError: string | null;

    jobsStatus: JobsStatusResponse | null;
    jobsStatusLoading: boolean;
    jobsStatusError: string | null;
    currentJob: JobResponse | null;
    currentJobLoading: boolean;
    currentJobError: string | null;
}

const initialState: OpenFinanceState = {
    connectors: [],
    connectorsLoading: false,
    connectorsError: null,
    searchQuery: '',
    pagination: null,

    connectToken: null,
    connectTokenLoading: false,
    connectTokenError: null,

    connections: [],
    connectionsLoading: false,
    connectionsError: null,

    bankTransactions: [],
    bankTransactionsLoading: false,
    bankTransactionsError: null,

    reconciliation: null,
    reconciliationLoading: false,
    reconciliationError: null,

    jobsStatus: null,
    jobsStatusLoading: false,
    jobsStatusError: null,
    currentJob: null,
    currentJobLoading: false,
    currentJobError: null,
};

const openFinanceSlice = createSlice({
    name: 'openFinance',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.connectors = [];
        },
        resetConnectors: (state) => {
            state.connectors = [];
            state.connectorsError = null;
        },
        clearConnectToken: (state) => {
            state.connectToken = null;
        },
        clearReconciliation: (state) => {
            state.reconciliation = null;
        },
        clearCurrentJob: (state) => {
            state.currentJob = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnectors.pending, (state) => {
                state.connectorsLoading = true;
                state.connectorsError = null;
            })
            .addCase(fetchConnectors.fulfilled, (state, action) => {
                state.connectorsLoading = false;
                state.connectors = action.payload.connectors || [];
                state.pagination = null;
            })
            .addCase(fetchConnectors.rejected, (state, action) => {
                state.connectorsLoading = false;
                state.connectorsError = action.payload || 'Erro ao buscar instituições';
            })
            .addCase(fetchConnectToken.pending, (state) => {
                state.connectTokenLoading = true;
                state.connectTokenError = null;
            })
            .addCase(fetchConnectToken.fulfilled, (state, action) => {
                state.connectTokenLoading = false;
                state.connectToken = action.payload.accessToken;
            })
            .addCase(fetchConnectToken.rejected, (state, action) => {
                state.connectTokenLoading = false;
                state.connectTokenError = action.payload || 'Erro ao obter token de conexão';
            })
            .addCase(createConnection.pending, (state) => {
                state.connectionsLoading = true;
                state.connectionsError = null;
            })
            .addCase(createConnection.fulfilled, (state, action) => {
                state.connectionsLoading = false;
                state.connections = [...state.connections, action.payload];
            })
            .addCase(createConnection.rejected, (state, action) => {
                state.connectionsLoading = false;
                state.connectionsError = action.payload || 'Erro ao criar conexão';
            })
            .addCase(fetchConnections.pending, (state) => {
                state.connectionsLoading = true;
                state.connectionsError = null;
            })
            .addCase(fetchConnections.fulfilled, (state, action) => {
                state.connectionsLoading = false;
                state.connections = action.payload;
            })
            .addCase(fetchConnections.rejected, (state, action) => {
                state.connectionsLoading = false;
                state.connectionsError = action.payload || 'Erro ao buscar conexões';
            })
            .addCase(syncConnection.pending, (state) => {
                state.connectionsLoading = true;
            })
            .addCase(syncConnection.fulfilled, (state) => {
                state.connectionsLoading = false;
            })
            .addCase(syncConnection.rejected, (state, action) => {
                state.connectionsLoading = false;
                state.connectionsError = action.payload || 'Erro ao sincronizar conexão';
            })
            .addCase(deleteConnection.fulfilled, (state, action) => {
                state.connections = state.connections.filter((conn) => conn.id !== action.meta.arg);
            })
            .addCase(fetchBankTransactions.pending, (state) => {
                state.bankTransactionsLoading = true;
                state.bankTransactionsError = null;
            })
            .addCase(fetchBankTransactions.fulfilled, (state, action) => {
                state.bankTransactionsLoading = false;
                state.bankTransactions = action.payload.transactions;
            })
            .addCase(fetchBankTransactions.rejected, (state, action) => {
                state.bankTransactionsLoading = false;
                state.bankTransactionsError = action.payload || 'Erro ao buscar transações';
            })
            .addCase(analyzeReconciliation.pending, (state) => {
                state.reconciliationLoading = true;
                state.reconciliationError = null;
            })
            .addCase(analyzeReconciliation.fulfilled, (state, action) => {
                state.reconciliationLoading = false;
                state.reconciliation = action.payload;
            })
            .addCase(analyzeReconciliation.rejected, (state, action) => {
                state.reconciliationLoading = false;
                state.reconciliationError = action.payload || 'Erro ao analisar reconciliação';
            })
            .addCase(fetchJobsStatus.pending, (state) => {
                state.jobsStatusLoading = true;
                state.jobsStatusError = null;
            })
            .addCase(fetchJobsStatus.fulfilled, (state, action) => {
                state.jobsStatusLoading = false;
                state.jobsStatus = action.payload;
            })
            .addCase(fetchJobsStatus.rejected, (state, action) => {
                state.jobsStatusLoading = false;
                state.jobsStatusError = action.payload || 'Erro ao buscar status dos jobs';
            })
            .addCase(fetchJobDetails.pending, (state) => {
                state.currentJobLoading = true;
                state.currentJobError = null;
            })
            .addCase(fetchJobDetails.fulfilled, (state, action) => {
                state.currentJobLoading = false;
                state.currentJob = action.payload;
            })
            .addCase(fetchJobDetails.rejected, (state, action) => {
                state.currentJobLoading = false;
                state.currentJobError = action.payload || 'Erro ao buscar detalhes do job';
            });
    },
});

export const {
    setSearchQuery,
    resetConnectors,
    clearConnectToken,
    clearReconciliation,
    clearCurrentJob,
} = openFinanceSlice.actions;
export default openFinanceSlice.reducer;
