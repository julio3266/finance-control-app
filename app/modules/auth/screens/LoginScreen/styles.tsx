import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        footer: {
            padding: 24,
            paddingBottom: 40,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
    });
