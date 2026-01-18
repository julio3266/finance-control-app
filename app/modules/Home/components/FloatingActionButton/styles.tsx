import { colors } from "@app/utils/colors";
import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        fab: {
            position: 'absolute',
            bottom: 100,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary[600],
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.primary[600],
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            zIndex: 1000,
        },
        fabIcon: {
            fontSize: 28,
            color: '#ffffff',
            fontWeight: '300',
        },
    });

