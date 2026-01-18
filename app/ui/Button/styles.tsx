import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        button: {
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            minHeight: 56,
        },
        buttonPrimary: {
            backgroundColor: theme.buttonPrimaryBg,
        },
        buttonSecondary: {
            backgroundColor: theme.buttonSecondaryBg,
            borderWidth: 1,
            borderColor: theme.buttonSecondaryBorder,
        },
        buttonOutline: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.border,
        },
        buttonGhost: {
            backgroundColor: 'transparent',
        },
        buttonSmall: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            minHeight: 36,
        },
        buttonMedium: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            minHeight: 44,
        },
        buttonLarge: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            minHeight: 56,
        },
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonText: {
            fontSize: 16,
            fontWeight: '600',
        },
        buttonTextPrimary: {
            color: theme.buttonPrimaryText,
        },
        buttonTextSecondary: {
            color: theme.buttonSecondaryText,
        },
        buttonTextOutline: {
            color: theme.foreground,
        },
        buttonTextGhost: {
            color: theme.foreground,
        },
        iconContainer: {
            marginRight: 8,
        },
    });
