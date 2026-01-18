import { colors } from "@app/utils/colors";
import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            padding: 24,
            paddingTop: 32,
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.backgroundTertiary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primary[400],
        },
        iconText: {
            fontSize: 40,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundSecondary,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 22,
        },
        inputIcon: {
            fontSize: 20,
            color: theme.foregroundMuted,
        },
        legalText: {
            fontSize: 12,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 18,
            marginTop: 16,
        },
        legalLink: {
            color: colors.primary[400],
            textDecorationLine: 'underline',
        },
    });

