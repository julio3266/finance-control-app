import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export interface CustomTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
    label,
    error,
    icon,
    style,
    ...props
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputError,
                    props.editable === false && styles.inputDisabled,
                ]}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <RNTextInput
                    style={[styles.input, icon && styles.inputWithIcon, style]}
                    placeholderTextColor={theme.foregroundMuted}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            paddingHorizontal: 16,
            minHeight: 56,
        },
        inputError: {
            borderColor: colors.error[500],
        },
        inputDisabled: {
            opacity: 0.6,
        },
        iconContainer: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            paddingVertical: 16,
        },
        inputWithIcon: {
            paddingLeft: 0,
        },
        errorText: {
            color: colors.error[500],
            fontSize: 12,
            marginTop: 4,
        },
    });
