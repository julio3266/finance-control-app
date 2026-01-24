import { createSlice } from '@reduxjs/toolkit';
import {
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    fetchGoalCategories,
    type GoalResponse,
    type GoalCategoryResponse,
} from './goalsApi';

interface GoalsState {
    goals: GoalResponse[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    createError: string | null;
    updateLoading: boolean;
    updateError: string | null;
    deleteLoading: boolean;
    deleteError: string | null;
    categories: GoalCategoryResponse[];
    categoriesLoading: boolean;
    categoriesError: string | null;
}

const initialState: GoalsState = {
    goals: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null,
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
};

const goalsSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {
        clearGoalsError: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Goals
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erro ao buscar metas';
            })
            // Create Goal
            .addCase(createGoal.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.createLoading = false;
                state.goals.push(action.payload);
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload || 'Erro ao criar meta';
            })
            // Update Goal
            .addCase(updateGoal.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                state.updateLoading = false;
                const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload || 'Erro ao atualizar meta';
            })
            // Delete Goal
            .addCase(deleteGoal.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.goals = state.goals.filter((goal) => goal.id !== action.meta.arg);
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload || 'Erro ao deletar meta';
            })
            // Fetch Goal Categories
            .addCase(fetchGoalCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchGoalCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchGoalCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload || 'Erro ao buscar categorias de metas';
            });
    },
});

export const { clearGoalsError } = goalsSlice.actions;
export default goalsSlice.reducer;

