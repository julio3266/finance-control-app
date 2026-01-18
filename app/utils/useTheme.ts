import { useAppSelector } from '../store';
import { darkTheme, lightTheme, Theme } from './colors';

export const useTheme = (): Theme => {
    const themeMode = useAppSelector((state) => state.theme.mode);
    return themeMode === 'dark' ? darkTheme : lightTheme;
};

export const useThemeMode = () => {
    return useAppSelector((state) => state.theme.mode);
};

