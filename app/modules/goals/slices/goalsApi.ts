import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, type ApiError } from '@app/utils/api';
import { RootState } from '@app/store';

export interface GoalResponse {
    id: string;
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    category: GoalCategory;
    targetDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GoalCategory {
    id: string;
    name: string;
    icon: string;
    color?: string;
}

export interface GoalCategoryResponse {
    id: string;
    name: string;
    icon: string;
    color: string;
    isPredefined: boolean;
    createdAt: string;
}

export interface CreateGoalRequest {
    name: string;
    description?: string;
    targetAmount: number;
    categoryId: string;
    targetDate?: string;
}

export interface UpdateGoalRequest {
    name?: string;
    description?: string;
    targetAmount?: number;
    categoryId?: string;
    targetDate?: string;
}

export interface FetchGoalsParams {
    status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export const fetchGoals = createAsyncThunk<
    GoalResponse[],
    FetchGoalsParams | void,
    { state: RootState; rejectValue: string }
>('goals/fetchGoals', async (params, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const queryParams = new URLSearchParams();
        if (params && params.status) {
            queryParams.append('status', params.status);
        }

        const queryString = queryParams.toString();
        const endpoint = `/api/goals${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get<GoalResponse[]>(endpoint, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar metas';
        return rejectWithValue(errorMessage);
    }
});

export const createGoal = createAsyncThunk<
    GoalResponse,
    CreateGoalRequest,
    { state: RootState; rejectValue: string }
>('goals/createGoal', async (data, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.post<GoalResponse>('/api/goals', data, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao criar meta';
        return rejectWithValue(errorMessage);
    }
});

export const updateGoal = createAsyncThunk<
    GoalResponse,
    { id: string; data: UpdateGoalRequest },
    { state: RootState; rejectValue: string }
>('goals/updateGoal', async ({ id, data }, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.put<GoalResponse>(`/api/goals/${id}`, data, {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao atualizar meta';
        return rejectWithValue(errorMessage);
    }
});

export const deleteGoal = createAsyncThunk<
    void,
    string,
    { state: RootState; rejectValue: string }
>('goals/deleteGoal', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        await apiClient.delete(`/api/goals/${id}`, {
            Authorization: `Bearer ${token}`,
        });

        return;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao deletar meta';
        return rejectWithValue(errorMessage);
    }
});

export const fetchGoalCategories = createAsyncThunk<
    GoalCategoryResponse[],
    void,
    { state: RootState; rejectValue: string }
>('goals/fetchGoalCategories', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const token = (auth as { token: string | null }).token;

        if (!token) {
            return rejectWithValue('Token não encontrado');
        }

        const response = await apiClient.get<GoalCategoryResponse[]>('/api/goals/categories', {
            Authorization: `Bearer ${token}`,
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erro ao buscar categorias de metas';
        return rejectWithValue(errorMessage);
    }
});

