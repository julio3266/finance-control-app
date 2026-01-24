import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, type ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface UnifiedTransactionAccount {
    id: string;
    name: string;
    type?: string;
}

export interface UnifiedTransactionCategory {
    id: string;
    name: string;
    icon: string;
    color?: string;
}

export interface UnifiedTransactionCreditCard {
    id: string;
    name: string;
    brand?: string;
}

export interface UnifiedTransaction {
    id: string;
    source: 'manual' | 'open_finance';
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    isPaid?: boolean;
    imported?: boolean;
    category?: UnifiedTransactionCategory;
    account?: UnifiedTransactionAccount;
    bankAccount?: UnifiedTransactionAccount;
    creditCard?: UnifiedTransactionCreditCard;
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ExtractSummary {
    totalDates: number;
    totalTransactions: number;
    transactionsInCurrentPage: number;
}

export type ApiExtractResponse =
    | UnifiedTransaction[]
    | {
          data: UnifiedTransaction[];
          pagination: PaginationInfo;
      }
    | {
          data: {
              date: string;
              transactions: UnifiedTransaction[];
          }[];
          pagination: PaginationInfo;
          summary?: ExtractSummary;
      };

export interface UnifiedTransactionsResponse {
    transactions: UnifiedTransaction[];
    pagination: PaginationInfo | null;
    groupedByDate?: {
        date: string;
        transactions: UnifiedTransaction[];
    }[];
}

export interface FetchUnifiedTransactionsParams {
    accountId?: string; // Para contas manuais
    bankAccountId?: string; // Para contas do Open Finance
    creditCardId?: string;
    type?: 'all' | 'INCOME' | 'EXPENSE';
    status?: 'all' | 'paid' | 'unpaid';
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
    page?: number;
    pageSize?: number;
    sourceType?: 'CARDS' | 'ACCOUNTS'; 
}

export const fetchUnifiedTransactions = createAsyncThunk<
    UnifiedTransactionsResponse,
    FetchUnifiedTransactionsParams,
    { state: RootState; rejectValue: string }
>('extract/fetchUnifiedTransactions', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = new URLSearchParams();

        if (params.accountId) {
            queryParams.append('accountId', params.accountId);
        }
        
        if (params.bankAccountId) {
            queryParams.append('bankAccountId', params.bankAccountId);
        }
        
        if (params.creditCardId) {
            queryParams.append('creditCardId', params.creditCardId);
        }
        
        if (params.type) {
            queryParams.append('type', params.type);
        }
        
        if (params.status) {
            queryParams.append('status', params.status);
        }
        
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }
        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }
        
        if (params.month) {
            queryParams.append('month', params.month.toString());
        }
        if (params.year) {
            queryParams.append('year', params.year.toString());
        }
        
        if (params.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params.pageSize !== undefined) {
            queryParams.append('pageSize', params.pageSize.toString());
        }
        
        if (params.sourceType) {
            queryParams.append('sourceType', params.sourceType);
        }

        const queryString = queryParams.toString();
        const endpoint = `/api/finance/extract${queryString ? `?${queryString}` : ''}`;
            
            const response = await apiClient.get<ApiExtractResponse>(endpoint, {
                Authorization: `Bearer ${token}`,
            });

            let transactions: UnifiedTransaction[] = [];
            let pagination: PaginationInfo | null = null;
            let groupedByDate: { date: string; transactions: UnifiedTransaction[] }[] | undefined = undefined;
            let summary: ExtractSummary | undefined = undefined;

        if (Array.isArray(response)) {
            transactions = response;
        } else if (Array.isArray(response.data)) {
            const firstItem = response.data[0];
            if (firstItem && typeof firstItem === 'object' && 'date' in firstItem && 'transactions' in firstItem) {
                groupedByDate = (response.data as { date: string; transactions: UnifiedTransaction[] }[])
                    .map((item) => ({
                        date: item.date,
                        transactions: Array.isArray(item.transactions) ? item.transactions : [],
                    }))
                    .filter((item) => item.transactions.length > 0); // Remover itens sem transações
                transactions = groupedByDate.flatMap((item) => item.transactions);
            } else {
                // Estrutura antiga: array simples de transações
                transactions = (response.data as UnifiedTransaction[]).filter(
                    (t) => t && typeof t.amount === 'number' && !isNaN(t.amount),
                );
            }
            pagination = response.pagination || null;
            if ('summary' in response && response.summary) {
                summary = response.summary;
            }
        } else {
            transactions = [];
        }

        return {
            transactions,
            pagination,
            groupedByDate,
            summary,
        };
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar transações';
        return rejectWithValue(errorMessage);
    }
});
