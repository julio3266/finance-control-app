import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    type UnifiedTransaction,
    type FetchUnifiedTransactionsParams,
    type PaginationInfo,
    fetchUnifiedTransactions,
} from './extractApi';
import { logout } from '@app/modules/auth/slices/authSlice';

export interface ExtractState {
    transactions: UnifiedTransaction[];
    loading: boolean;
    error: string | null;
    filters: FetchUnifiedTransactionsParams;
    pagination: PaginationInfo | null;
    groupedByDate?: {
        date: string;
        transactions: UnifiedTransaction[];
    }[];
}

const initialState: ExtractState = {
    transactions: [],
    loading: false,
    error: null,
    filters: {
        type: 'all',
        status: 'all',
        page: 1,
        pageSize: 20,
    },
    pagination: null,
};

const extractSlice = createSlice({
    name: 'extract',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<FetchUnifiedTransactionsParams>>) => {
            // Se todos os campos principais estão sendo passados, substituir completamente os filtros
            // Isso garante que valores antigos sejam removidos quando não são mais necessários
            const hasAllMainFields = 
                'type' in action.payload &&
                'status' in action.payload &&
                'accountId' in action.payload &&
                'bankAccountId' in action.payload &&
                'creditCardId' in action.payload;
               
            let newFilters: any;
            
            if (hasAllMainFields) {
                // Substituir completamente os filtros, garantindo que campos undefined sejam removidos
                // Começar com um objeto limpo apenas com os campos obrigatórios
                newFilters = {
                    type: action.payload.type || 'all',
                    status: action.payload.status || 'all',
                    page: action.payload.page || 1,
                    pageSize: action.payload.pageSize !== undefined ? action.payload.pageSize : 20,
                };
                
                // Processar accountId, bankAccountId e creditCardId
                // Se estão no payload, adicionar (mesmo que undefined) ou remover explicitamente
                if ('accountId' in action.payload) {
                    if (action.payload.accountId !== undefined) {
                        newFilters.accountId = action.payload.accountId;
                    }
                    // Se é undefined, não adicionamos (já está limpo no objeto base)
                }
                
                if ('bankAccountId' in action.payload) {
                    if (action.payload.bankAccountId !== undefined) {
                        newFilters.bankAccountId = action.payload.bankAccountId;
                    }
                    // Se é undefined, não adicionamos (já está limpo no objeto base)
                }
                
                if ('creditCardId' in action.payload) {
                    if (action.payload.creditCardId !== undefined) {
                        newFilters.creditCardId = action.payload.creditCardId;
                    }
                    // Se é undefined, não adicionamos (já está limpo no objeto base)
                }
                
                // Adicionar campos opcionais apenas se estiverem definidos
                if (action.payload.startDate !== undefined) {
                    newFilters.startDate = action.payload.startDate;
                }
                if (action.payload.endDate !== undefined) {
                    newFilters.endDate = action.payload.endDate;
                }
                if (action.payload.month !== undefined) {
                    newFilters.month = action.payload.month;
                }
                if (action.payload.year !== undefined) {
                    newFilters.year = action.payload.year;
                }
                if (action.payload.sourceType !== undefined) {
                    newFilters.sourceType = action.payload.sourceType;
                }
            } else {
                // Modo incremental: mesclar com filtros existentes
                newFilters = { ...state.filters };
                
                // Atualizar accountId - remover se undefined, manter se definido
                if ('accountId' in action.payload) {
                    if (action.payload.accountId === undefined) {
                        delete newFilters.accountId;
                    } else {
                        newFilters.accountId = action.payload.accountId;
                    }
                }
                
                // Atualizar bankAccountId - remover se undefined, manter se definido
                if ('bankAccountId' in action.payload) {
                    if (action.payload.bankAccountId === undefined) {
                        delete newFilters.bankAccountId;
                    } else {
                        newFilters.bankAccountId = action.payload.bankAccountId;
                    }
                }
                
                // Atualizar creditCardId - remover se undefined, manter se definido
                if ('creditCardId' in action.payload) {
                    if (action.payload.creditCardId === undefined) {
                        delete newFilters.creditCardId;
                    } else {
                        newFilters.creditCardId = action.payload.creditCardId;
                    }
                }
                
                // Atualizar startDate - remover se undefined, manter se definido
                if ('startDate' in action.payload) {
                    if (action.payload.startDate === undefined) {
                        delete newFilters.startDate;
                    } else {
                        newFilters.startDate = action.payload.startDate;
                    }
                }
                
                // Atualizar endDate - remover se undefined, manter se definido
                if ('endDate' in action.payload) {
                    if (action.payload.endDate === undefined) {
                        delete newFilters.endDate;
                    } else {
                        newFilters.endDate = action.payload.endDate;
                    }
                }
                
                // Atualizar month - remover se undefined, manter se definido
                if ('month' in action.payload) {
                    if (action.payload.month === undefined) {
                        delete newFilters.month;
                    } else {
                        newFilters.month = action.payload.month;
                    }
                }
                
                // Atualizar year - remover se undefined, manter se definido
                if ('year' in action.payload) {
                    if (action.payload.year === undefined) {
                        delete newFilters.year;
                    } else {
                        newFilters.year = action.payload.year;
                    }
                }
                
                // Atualizar sourceType - remover se undefined, manter se definido
                if ('sourceType' in action.payload) {
                    if (action.payload.sourceType === undefined) {
                        delete newFilters.sourceType;
                    } else {
                        newFilters.sourceType = action.payload.sourceType;
                    }
                }
                
                // Atualizar outras propriedades normalmente
                if (action.payload.type !== undefined) newFilters.type = action.payload.type;
                if (action.payload.status !== undefined) newFilters.status = action.payload.status;
                if (action.payload.page !== undefined) newFilters.page = action.payload.page;
                if (action.payload.pageSize !== undefined) newFilters.pageSize = action.payload.pageSize;
            }
            
            const filtersChanged =
                newFilters.type !== state.filters.type ||
                newFilters.status !== state.filters.status ||
                newFilters.accountId !== state.filters.accountId ||
                (newFilters as any).bankAccountId !== (state.filters as any).bankAccountId ||
                newFilters.creditCardId !== state.filters.creditCardId ||
                newFilters.month !== state.filters.month ||
                newFilters.year !== state.filters.year ||
                newFilters.startDate !== state.filters.startDate ||
                newFilters.endDate !== state.filters.endDate ||
                (newFilters as any).sourceType !== (state.filters as any).sourceType;

            if (filtersChanged && !action.payload.page) {
                newFilters.page = 1;
                state.transactions = [];
                state.groupedByDate = undefined;
                state.pagination = null;
                state.loading = true;
            }

            state.filters = newFilters as FetchUnifiedTransactionsParams;
        },
        clearFilters: (state) => {
            state.filters = {
                type: 'all',
                status: 'all',
                page: 1,
                pageSize: 20,
            };
            state.transactions = [];
            state.pagination = null;
            state.groupedByDate = undefined;
        },
        resetExtract: (state) => {
            state.transactions = [];
            state.loading = false;
            state.error = null;
            state.pagination = null;
            state.groupedByDate = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnifiedTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnifiedTransactions.fulfilled, (state, action) => {
                state.loading = false;
                const isFirstPage = state.filters.page === 1 || !state.pagination;
                const hasNoPagination = !action.payload.pagination || action.payload.pagination.pageSize === 0;

                if (isFirstPage || hasNoPagination) {
                    // Primeira página ou sem paginação: substituir dados
                    state.transactions = action.payload.transactions;
                    state.groupedByDate = action.payload.groupedByDate;
                } else {
                    // Páginas subsequentes: acumular dados apenas se as transações corresponderem ao filtro
                    const transactionsMatch = action.payload.transactions.length > 0 ? action.payload.transactions.every(t => {
                        if ((state.filters as any).bankAccountId) {
                            return t.bankAccount?.id === (state.filters as any).bankAccountId;
                        }
                        if (state.filters.accountId) {
                            return t.account?.id === state.filters.accountId;
                        }
                        return true;
                    }) : true;
                    
                    if (transactionsMatch) {
                        // Acumular apenas se as transações corresponderem ao filtro
                        state.transactions = [...state.transactions, ...action.payload.transactions];
                        // Acumular groupedByDate quando há paginação
                        if (action.payload.groupedByDate && action.payload.groupedByDate.length > 0) {
                            const existingDates = new Set(
                                (state.groupedByDate || []).map((item) => item.date),
                            );
                            const newItems = action.payload.groupedByDate.filter(
                                (item) => !existingDates.has(item.date),
                            );
                            state.groupedByDate = [...(state.groupedByDate || []), ...newItems];
                        }
                    } else {
                        // Se as transações não corresponderem ao filtro, substituir (pode ser que o filtro mudou)
                        // eslint-disable-next-line no-console
                        console.warn('🔍 [Extract Slice] Transactions do not match filter, replacing instead of appending');
                        state.transactions = action.payload.transactions;
                        state.groupedByDate = action.payload.groupedByDate;
                    }
                }
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchUnifiedTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar transações';
            })
            .addCase(logout, () => {
                // Reset to initial state when user logs out
                return initialState;
            });
    },
});

export const { setFilters, clearFilters, resetExtract } = extractSlice.actions;
export default extractSlice.reducer;
