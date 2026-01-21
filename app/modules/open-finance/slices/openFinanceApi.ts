import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface ConnectorCredential {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    placeholder?: string;
    validation?: string;
    validationMessage?: string;
}

export interface Connector {
    id: number;
    name: string;
    institutionUrl: string;
    imageUrl: string;
    primaryColor: string;
    type: string;
    country: string;
    credentials: ConnectorCredential[];
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ConnectorsResponse {
    connectors: Connector[];
    pagination: PaginationInfo;
}

export interface FetchConnectorsParams {
    search?: string;
    page?: number;
    pageSize?: number;
}

export const fetchConnectors = createAsyncThunk<
    ConnectorsResponse,
    FetchConnectorsParams | void,
    { rejectValue: string }
>('openFinance/fetchConnectors', async (params, { rejectWithValue }) => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.pageSize) {
            queryParams.append('pageSize', params.pageSize.toString());
        }
        const queryString = queryParams.toString();
        const endpoint = `/api/bank/connectors${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get<ConnectorsResponse>(endpoint);
        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar instituições';
        return rejectWithValue(errorMessage);
    }
});

export interface ConnectTokenResponse {
    accessToken: string;
}

export const fetchConnectToken = createAsyncThunk<
    ConnectTokenResponse,
    void,
    { state: RootState; rejectValue: string }
>('openFinance/fetchConnectToken', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<ConnectTokenResponse>(
            '/api/bank/connect-token',
            {},
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao obter token de conexão';
        return rejectWithValue(errorMessage);
    }
});

export interface BankAccount {
    id: string;
    name: string;
    type: string;
    balance: string;
    accountId: string | null;
}

export interface BankConnection {
    id: string;
    pluggyItemId: string;
    connectorName: string;
    connectorLogo: string;
    status: string;
    lastSyncAt: string | null;
    bankAccounts: BankAccount[];
    _count?: {
        bankAccounts: number;
    };
}

export interface CreateConnectionRequest {
    pluggyItemId: string;
    connectorId: number;
    connectorName: string;
    connectorLogo: string;
}

export const createConnection = createAsyncThunk<
    BankConnection,
    CreateConnectionRequest,
    { state: RootState; rejectValue: string }
>('openFinance/createConnection', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<BankConnection>('/api/bank/connections', data, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao criar conexão';
        return rejectWithValue(errorMessage);
    }
});

export const fetchConnections = createAsyncThunk<
    BankConnection[],
    void,
    { state: RootState; rejectValue: string }
>('openFinance/fetchConnections', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<BankConnection[]>('/api/bank/connections', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar conexões';
        return rejectWithValue(errorMessage);
    }
});

export interface SyncConnectionResponse {
    jobId: string;
    status: string;
}

export const syncConnection = createAsyncThunk<
    SyncConnectionResponse,
    string,
    { state: RootState; rejectValue: string }
>('openFinance/syncConnection', async (connectionId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<SyncConnectionResponse>(
            `/api/bank/connections/${connectionId}/sync`,
            {},
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao sincronizar conexão';
        return rejectWithValue(errorMessage);
    }
});

export const deleteConnection = createAsyncThunk<
    { success: boolean },
    string,
    { state: RootState; rejectValue: string }
>('openFinance/deleteConnection', async (connectionId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.delete<{ success: boolean }>(
            `/api/bank/connections/${connectionId}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao deletar conexão';
        return rejectWithValue(errorMessage);
    }
});

// ==================== Vinculação de Contas ====================

export interface LinkAccountRequest {
    bankAccountId: string;
    accountId: string;
}

export const linkAccount = createAsyncThunk<
    { success: boolean },
    LinkAccountRequest,
    { state: RootState; rejectValue: string }
>('openFinance/linkAccount', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<{ success: boolean }>(
            '/api/bank/link-account',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao vincular conta';
        return rejectWithValue(errorMessage);
    }
});

// ==================== Importação ====================

export interface ImportTransactionsRequest {
    bankAccountId: string;
    accountId: string;
    importCreditCards?: boolean;
    importTransactions?: boolean;
    importInvestments?: boolean;
}

export interface ImportTransactionsResponse {
    message: string;
    jobId: string;
    status: string;
}

export const importTransactions = createAsyncThunk<
    ImportTransactionsResponse,
    ImportTransactionsRequest,
    { state: RootState; rejectValue: string }
>('openFinance/importTransactions', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<ImportTransactionsResponse>(
            '/api/bank/import-transactions',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao importar transações';
        return rejectWithValue(errorMessage);
    }
});

// ==================== Transações Bancárias ====================

export interface BankTransaction {
    id: string;
    description: string;
    amount: string;
    type: string;
    date: string;
    imported: boolean;
    transactionId: string | null;
    merchantName?: string;
}

export interface BankTransactionsResponse {
    transactions: BankTransaction[];
}

export interface FetchBankTransactionsParams {
    bankAccountId: string;
    imported?: boolean;
    startDate?: string;
    endDate?: string;
}

export const fetchBankTransactions = createAsyncThunk<
    BankTransactionsResponse,
    FetchBankTransactionsParams,
    { state: RootState; rejectValue: string }
>('openFinance/fetchBankTransactions', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = new URLSearchParams();
        if (params.imported !== undefined) {
            queryParams.append('imported', params.imported.toString());
        }
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }
        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }

        const queryString = queryParams.toString();
        const endpoint = `/api/bank/transactions/${params.bankAccountId}${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get<BankTransactionsResponse>(endpoint, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar transações bancárias';
        return rejectWithValue(errorMessage);
    }
});

// ==================== Reconciliação ====================

export interface TransactionMatch {
    bankTransaction: BankTransaction;
    appTransaction: {
        id: string;
        description: string;
        amount: number;
        date: string;
    };
    matchScore: number;
    matchType: 'exact' | 'partial';
    suggestions: string[];
}

export interface ReconciliationAnalysisResponse {
    totalBankTransactions: number;
    exactMatches: number;
    partialMatches: number;
    unmatched: number;
    matches: TransactionMatch[];
}

export interface ReconciliationAnalysisParams {
    bankAccountId: string;
    onlyUnimported?: boolean;
    startDate?: string;
    endDate?: string;
}

export const analyzeReconciliation = createAsyncThunk<
    ReconciliationAnalysisResponse,
    ReconciliationAnalysisParams,
    { state: RootState; rejectValue: string }
>('openFinance/analyzeReconciliation', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = new URLSearchParams();
        if (params.onlyUnimported !== undefined) {
            queryParams.append('onlyUnimported', params.onlyUnimported.toString());
        }
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }
        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }

        const queryString = queryParams.toString();
        const endpoint = `/api/bank/reconciliation/${params.bankAccountId}/analyze${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get<ReconciliationAnalysisResponse>(endpoint, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao analisar reconciliação';
        return rejectWithValue(errorMessage);
    }
});

export interface ResolveMatchRequest {
    bankTransactionId: string;
    appTransactionId?: string;
    action: 'link' | 'import' | 'skip';
}

export const resolveMatch = createAsyncThunk<
    { message: string; transactionId?: string },
    ResolveMatchRequest,
    { state: RootState; rejectValue: string }
>('openFinance/resolveMatch', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<{ message: string; transactionId?: string }>(
            '/api/bank/reconciliation/resolve',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao resolver match';
        return rejectWithValue(errorMessage);
    }
});

export interface LinkTransactionRequest {
    bankTransactionId: string;
    appTransactionId: string;
}

export const linkTransaction = createAsyncThunk<
    { message: string },
    LinkTransactionRequest,
    { state: RootState; rejectValue: string }
>('openFinance/linkTransaction', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<{ message: string }>(
            '/api/bank/reconciliation/link',
            data,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao vincular transação';
        return rejectWithValue(errorMessage);
    }
});

export const unlinkTransaction = createAsyncThunk<
    { message: string },
    string,
    { state: RootState; rejectValue: string }
>('openFinance/unlinkTransaction', async (bankTransactionId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.delete<{ message: string }>(
            `/api/bank/reconciliation/unlink/${bankTransactionId}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao desvincular transação';
        return rejectWithValue(errorMessage);
    }
});

// ==================== Monitoramento de Jobs ====================

export interface QueueStatus {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed?: number;
    paused?: number;
}

export interface JobsStatusResponse {
    available: boolean;
    queues: {
        bankSync: QueueStatus;
        batchImport: QueueStatus;
        scheduledSync: QueueStatus;
    };
}

export const fetchJobsStatus = createAsyncThunk<
    JobsStatusResponse,
    void,
    { state: RootState; rejectValue: string }
>('openFinance/fetchJobsStatus', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<JobsStatusResponse>('/api/bank/jobs/status', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar status dos jobs';
        return rejectWithValue(errorMessage);
    }
});

export interface JobData {
    type: string;
    userId: string;
    bankAccountId?: string;
    targetAccountId?: string;
    options?: {
        importCreditCards?: boolean;
        importTransactions?: boolean;
        importInvestments?: boolean;
    };
}

export interface JobResponse {
    id: string;
    name: string;
    data: JobData;
    progress: number;
    attemptsMade: number;
    processedOn: number | null;
    finishedOn: number | null;
    failedReason: string | null;
    returnvalue: any;
}

export const fetchJobDetails = createAsyncThunk<
    JobResponse,
    { queueName: string; jobId: string },
    { state: RootState; rejectValue: string }
>('openFinance/fetchJobDetails', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<JobResponse>(
            `/api/bank/jobs/${params.queueName}/${params.jobId}`,
            {
                Authorization: `Bearer ${token}`,
            },
        );

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar detalhes do job';
        return rejectWithValue(errorMessage);
    }
});
