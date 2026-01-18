import { useTheme } from "@app/utils/useTheme";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";


export interface LoaderProps {
    size?: number | 'small' | 'large' | undefined;
    color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size, color }) => {
    const theme = useTheme();
    return (
        <ActivityIndicator size={size} color={color || theme.foreground} />
    )
}

