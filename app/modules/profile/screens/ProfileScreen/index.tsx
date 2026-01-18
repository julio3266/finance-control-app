import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { useAppDispatch, useAppSelector } from '@app/store';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';
import { colors } from '@app/utils/colors';
import { logout } from '@app/modules/auth/slices';

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    iconBg: string;
    isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, iconBg, isLogout = false }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const isDark = theme.background === '#0a0a12';
    const logoutText = isDark ? '#FFFFFF' : colors.error[600];

    return (
        <TouchableOpacity
            style={[
                styled.menuItem,
                isLogout &&
                    isDark && {
                        backgroundColor: '#1a1a2e',
                        borderColor: '#2a2a3e',
                    },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styled.menuIconContainer, { backgroundColor: iconBg }]}>{icon}</View>
            <Text style={[styled.menuLabel, isLogout && { color: logoutText }]}>{label}</Text>
            <Feather
                name="chevron-right"
                size={20}
                color={isLogout ? logoutText : theme.foregroundMuted}
            />
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => (state.auth as { email: string | null }).email);

    const handleLogout = () => {
        dispatch(logout());
    };

    const menuItems = [
        {
            id: '1',
            label: 'Informações pessoais',
            icon: <Feather name="user" size={20} color="#ffffff" />,
            iconBg: colors.primary[600],
            onPress: () => {},
        },

        {
            id: '3',
            label: 'Tema',
            icon: <Feather name="lock" size={20} color="#ffffff" />,
            iconBg: colors.primary[800],
            onPress: () => {},
        },
        {
            id: '4',
            label: 'Settings',
            icon: <Feather name="settings" size={20} color="#ffffff" />,
            iconBg: '#14B8A6',
            onPress: () => {},
        },
        {
            id: '5',
            label: 'Sair',
            icon: <Feather name="power" size={20} color="#ffffff" />,
            iconBg: colors.error[500],
            onPress: () => handleLogout(),
        },
    ];

    const renderHeader = () => (
        <View style={styled.profileSection}>
            <View style={styled.avatarContainer}>
                <View style={styled.avatar}>
                    <Feather name="user" size={40} color={colors.primary[600]} />
                </View>
                <TouchableOpacity style={styled.editButton} activeOpacity={0.7}>
                    <Feather name="edit-2" size={16} color="#ffffff" />
                </TouchableOpacity>
            </View>
            <Text style={styled.name}>Julio Valente</Text>
            <Text style={styled.email}>{email || 'leslie@gmail.com'}</Text>
        </View>
    );

    const renderMenuItem = ({ item }: { item: (typeof menuItems)[0] }) => (
        <MenuItem
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
            iconBg={item.iconBg}
            isLogout={item.id === '5'}
        />
    );

    return (
        <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            style={styled.container}
            contentContainerStyle={styled.content}
            showsVerticalScrollIndicator={false}
        />
    );
}
