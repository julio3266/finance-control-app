import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/utils/useTheme';
import Feather from '@expo/vector-icons/Feather';
import { useDrawer } from '@app/navigation/DrawerNavigation/DrawerContext';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationPress }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const insets = useSafeAreaInsets();
    const { openDrawer } = useDrawer();

    return (
        <View
            style={[
                styled.container,
                { backgroundColor: theme.background, paddingTop: insets.top + 8 },
            ]}
        >
            <TouchableOpacity style={styled.menuButton} onPress={openDrawer} activeOpacity={0.7}>
                <Feather name="grid" size={24} color={theme.foreground} />
            </TouchableOpacity>

            <Text style={styled.title}>Home</Text>

            <TouchableOpacity
                style={styled.notificationButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
            >
                <Feather name="bell" size={24} color={theme.foreground} />
                <View style={styled.badge} />
            </TouchableOpacity>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 16,
        },
        menuButton: {
            padding: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        notificationButton: {
            padding: 8,
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#EF4444',
        },
    });
