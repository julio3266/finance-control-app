import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';

let showToast: ((message: string, type?: 'error' | 'success' | 'info') => void) | null = null;

export const setToastHandler = (
    handler: (message: string, type?: 'error' | 'success' | 'info') => void,
) => {
    showToast = handler;
};

export const errorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const errorMessage = action.payload as string | undefined;

        if (errorMessage && showToast) {
            showToast(errorMessage, 'error');
        } else if (showToast) {
            showToast('Ocorreu um erro. Tente novamente.', 'error');
        }
    }

    return next(action);
};
