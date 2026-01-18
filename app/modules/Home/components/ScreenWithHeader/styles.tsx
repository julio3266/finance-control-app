import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});