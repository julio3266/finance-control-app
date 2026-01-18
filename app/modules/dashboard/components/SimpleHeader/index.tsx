import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/utils/useTheme';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '@app/modules/Home/routes/homeRoutes';

type NavigationProp = BottomTabNavigationProp<HomeTabParamList>;

interface SimpleHeaderProps {
    onMenuPress?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({ onMenuPress }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const navigation = useNavigation<NavigationProp>();
    const insets = useSafeAreaInsets();

    const handleMenuPress = () => {
        if (onMenuPress) {
            onMenuPress();
        } else {
            navigation.navigate('More');
        }
    };

    return (
        <View
            style={[
                styled.container,
                { backgroundColor: theme.background, paddingTop: insets.top + 8 },
            ]}
        >
            <TouchableOpacity
                style={styled.menuButton}
                onPress={handleMenuPress}
                activeOpacity={0.7}
            >
                <Feather name="menu" size={24} color={theme.foreground} />
            </TouchableOpacity>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            paddingBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
        },
        menuButton: {
            padding: 8,
        },
    });
