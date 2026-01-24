import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { useAppDispatch, useAppSelector } from '@app/store';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { styles } from './styles';
import { colors } from '@app/utils/colors';
import { logout } from '@app/modules/auth/slices';
import { toggleTheme } from '@app/store/themeSlice';
import { useDrawer } from '@app/navigation/DrawerNavigation/DrawerContext';
import { fetchUserProfile } from '@app/modules/profile/slices';
import { apiClient } from '@app/utils/api';

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    iconBg: string;
    isLogout?: boolean;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onPress,
    iconBg,
    isLogout = false,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
}) => {
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
            disabled={showSwitch}
        >
            <View style={[styled.menuIconContainer, { backgroundColor: iconBg }]}>{icon}</View>
            <Text style={[styled.menuLabel, isLogout && { color: logoutText }]}>{label}</Text>
            {showSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: theme.border, true: colors.primary[600] }}
                    thumbColor="#ffffff"
                    ios_backgroundColor={theme.border}
                />
            ) : (
                <Feather
                    name="chevron-right"
                    size={20}
                    color={isLogout ? logoutText : theme.foregroundMuted}
                />
            )}
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { closeDrawer } = useDrawer();
    const email = useAppSelector((state) => (state.auth as { email: string | null }).email);
    const profile = useAppSelector((state) => state.profile.profile);
    const profileLoading = useAppSelector((state) => state.profile.loading);

    // Buscar perfil quando o componente montar
    useEffect(() => {
        if (!profile && !profileLoading) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, profile, profileLoading]);

    const handleLogout = () => {
        apiClient.setToken(null);
        dispatch(logout());
    };

    const handleThemeToggle = (_value: boolean) => {
        dispatch(toggleTheme());
    };

    const handleBack = () => {
        closeDrawer();
    };

    const handleNewCreditCard = () => {
        (navigation as any).navigate('CreditCard', { screen: 'NewCreditCard' });
        closeDrawer();
    };

    const handleMyConnections = () => {
        (navigation as any).navigate('OpenFinance', { screen: 'MyConnections' });
        closeDrawer();
    };

    const isPremium = profile?.isPremium ?? false;

    const menuItems = useMemo(() => {
        const items: {
            id: string;
            label: string;
            icon: React.ReactNode;
            iconBg: string;
            onPress: () => void;
            showSwitch?: boolean;
            switchValue?: boolean;
            onSwitchChange?: (value: boolean) => void;
        }[] = [
                {
                    id: '1',
                    label: 'Informações pessoais',
                    icon: <Feather name="user" size={20} color="#ffffff" />,
                    iconBg: colors.primary[600],
                    onPress: () => { },
                },
                {
                    id: '3',
                    label: 'Tema',
                    icon: <Feather name="lock" size={20} color="#ffffff" />,
                    iconBg: colors.primary[800],
                    onPress: () => { },
                    showSwitch: true,
                    switchValue: themeMode === 'dark',
                    onSwitchChange: handleThemeToggle,
                },
            ];

        // Adicionar "Minhas conexões" apenas para usuários premium
        if (isPremium) {
            items.push({
                id: '4',
                label: 'Minhas conexões',
                icon: <FontAwesome6 name="link" size={18} color="#ffffff" />,
                iconBg: '#9333EA',
                onPress: handleMyConnections,
            });
        }

        items.push(
            {
                id: '5',
                label: 'Settings',
                icon: <Feather name="settings" size={20} color="#ffffff" />,
                iconBg: '#14B8A6',
                onPress: () => { },
            },
            {
                id: '6',
                label: 'Sair',
                icon: <Feather name="power" size={20} color="#ffffff" />,
                iconBg: colors.error[500],
                onPress: () => handleLogout(),
            },
        );

        return items;
    }, [isPremium, themeMode]);

    const getDisplayName = () => {
        if (profile?.userInfo) {
            const { firstName, lastName } = profile.userInfo;
            if (firstName && lastName) {
                return `${firstName} ${lastName}`;
            }
            if (firstName) {
                return firstName;
            }
            if (lastName) {
                return lastName;
            }
        }
        return 'Usuário';
    };

    const getDisplayEmail = () => profile?.email || email || 'usuario@email.com';

    const renderHeader = () => (
        <>
            <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styled.backButton}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
            </View>
            <View style={styled.profileSection}>
                <View style={styled.avatarContainer}>
                    <View style={styled.avatar}>
                        {profileLoading ? (
                            <ActivityIndicator size="small" color={colors.primary[600]} />
                        ) : (
                            <Feather name="user" size={40} color={colors.primary[600]} />
                        )}
                    </View>
                    <TouchableOpacity style={styled.editButton} activeOpacity={0.7}>
                        <Feather name="edit-2" size={16} color="#ffffff" />
                    </TouchableOpacity>
                </View>
                <Text style={styled.name}>{getDisplayName()}</Text>
                <Text style={styled.email}>{getDisplayEmail()}</Text>
                {profile?.isPremium && (
                    <View style={styled.premiumBadge}>
                        <Feather name="star" size={12} color="#9333EA" />
                        <Text style={styled.premiumText}>Premium</Text>
                    </View>
                )}
            </View>
        </>
    );

    const renderMenuItem = ({ item }: { item: (typeof menuItems)[0] }) => (
        <MenuItem
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
            iconBg={item.iconBg}
            isLogout={item.id === '6'}
            showSwitch={item.showSwitch}
            switchValue={item.switchValue}
            onSwitchChange={item.onSwitchChange}
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
