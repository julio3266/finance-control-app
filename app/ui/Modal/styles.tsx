import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            height: 4,
            marginTop: 12,
            marginBottom: 8,
        },
        overlay: {
            backgroundColor: theme.overlay,
        },
    });