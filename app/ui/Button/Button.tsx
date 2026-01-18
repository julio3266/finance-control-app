import { useTheme } from '@app/utils/useTheme';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { Loader } from '../Loader';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    disabled,
    icon,
    loading,
    size = 'large',
    variant = 'primary',
}) => {
    const theme = useTheme();
    const buttonStyles = styles(theme);

    const getButtonStyle = (): StyleProp<ViewStyle> => {
        const baseStyle = [buttonStyles.button];

        if (variant === 'primary') baseStyle.push(buttonStyles.buttonPrimary);
        if (variant === 'secondary') baseStyle.push(buttonStyles.buttonSecondary);
        if (variant === 'outline') baseStyle.push(buttonStyles.buttonOutline);
        if (variant === 'ghost') baseStyle.push(buttonStyles.buttonGhost);

        if (size === 'small') baseStyle.push(buttonStyles.buttonSmall);
        if (size === 'medium') baseStyle.push(buttonStyles.buttonMedium);
        if (size === 'large') baseStyle.push(buttonStyles.buttonLarge);

        if (disabled || loading) baseStyle.push(buttonStyles.buttonDisabled);

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [buttonStyles.buttonText];

        if (variant === 'primary') baseStyle.push(buttonStyles.buttonTextPrimary);
        if (variant === 'secondary') baseStyle.push(buttonStyles.buttonTextSecondary);
        if (variant === 'outline') baseStyle.push(buttonStyles.buttonTextOutline);
        if (variant === 'ghost') baseStyle.push(buttonStyles.buttonTextGhost);

        return baseStyle;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={getButtonStyle()}
            activeOpacity={0.8}
        >
            {loading ? (
                <Loader
                    size="small"
                    color={variant === 'primary' ? theme.buttonPrimaryText : theme.foreground}
                />
            ) : (
                <>
                    {icon && <View style={buttonStyles.iconContainer}>{icon}</View>}
                    <Text style={getTextStyle()}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};
