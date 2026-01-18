import { Animated } from 'react-native';
import { styles } from './styles';
import { useTheme, useThemeMode } from '@app/utils/useTheme';

export interface ThemeToggleProps {
    slideAnim: Animated.Value;
    fadeAnim: Animated.Value;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ slideAnim, fadeAnim }) => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const styled = styles(theme);

    return <></>;
};
