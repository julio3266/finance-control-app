import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";
import { colors } from "@app/utils/colors";

export const styles = (theme: ReturnType<typeof useTheme>, themeMode: 'light' | 'dark') =>
    StyleSheet.create({
        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
        },
        animatedContent: {
            alignItems: 'center',
        },
        logoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            gap: 12,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        titleFinance: {
            fontSize: 32,
            fontWeight: '700',
            color: theme.foreground,
        },
        titleControl: {
            fontSize: 32,
            fontWeight: '700',
            color: themeMode === 'dark' ? colors.primary[400] : colors.primary[600],
        },
        subtitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
        },
        subtitleText: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
        },
        subtitlePurple: {
            fontSize: 24,
            fontWeight: '700',
            color: themeMode === 'dark' ? colors.primary[400] : colors.primary[600],
            textAlign: 'center',
        },
        footer: {
            padding: 24,
            paddingBottom: 40,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
    });