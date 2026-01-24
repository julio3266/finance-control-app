import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppSelector, useAppDispatch } from '@app/store';
import { fetchUnifiedAccounts, type UnifiedAccountResponse } from '../../slices/accountsApi';
import { AccountItem, type UnifiedAccount } from '@app/modules/dashboard/components';
import { styles } from './styles';

export default function AccountListScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const unifiedAccountsRaw = useAppSelector(
        (state) => (state as any).accounts?.unifiedAccounts || [],
    );
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const unifiedAccounts: UnifiedAccount[] = unifiedAccountsRaw
        .filter((acc: UnifiedAccountResponse) => acc.type !== 'CREDIT')
        .map((acc: UnifiedAccountResponse) => ({
            id: acc.id,
            name: acc.name,
            institution: acc.institution || acc.name,
            institutionLogo: acc.institutionLogo,
            balance: String(acc.currentBalance ?? acc.balance ?? 0),
            type: acc.type,
            source: acc.source === 'open_finance' ? 'openFinance' : 'manual',
            color: acc.color,
        }));

    useEffect(() => {
        const loadData = async () => {
            setInitialLoading(true);
            try {
                await dispatch(fetchUnifiedAccounts() as any);
            } catch (err) {
                // Handle error
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchUnifiedAccounts() as any).unwrap();
        } catch (err) {
            // Handle error
        } finally {
            setRefreshing(false);
        }
    };

    const handleAddAccount = () => {
        navigation.navigate('Accounts', { screen: 'NewAccount' });
    };

    const handleAccountPress = (account: UnifiedAccount) => {
        navigation.navigate('Accounts', {
            screen: 'AccountDetails',
            params: { accountId: account.id, source: account.source },
        });
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.title}>Minhas contas</Text>
            <TouchableOpacity onPress={handleAddAccount} style={styled.addButton}>
                <Feather name="plus" size={24} color={theme.foreground} />
            </TouchableOpacity>
        </View>
    );

    const renderAccount = ({ item, index }: { item: UnifiedAccount; index: number }) => (
        <View>
            <AccountItem account={item} onPress={() => handleAccountPress(item)} />
            {index < unifiedAccounts.length - 1 && <View style={styled.divider} />}
        </View>
    );

    const renderEmpty = () => (
        <View style={styled.emptyContainer}>
            <Feather name="credit-card" size={48} color={theme.foregroundMuted} />
            <Text style={styled.emptyText}>Nenhuma conta cadastrada</Text>
            <TouchableOpacity
                style={styled.addAccountButton}
                onPress={handleAddAccount}
                activeOpacity={0.7}
            >
                <Feather name="plus" size={16} color={colors.primary[600]} />
                <Text style={styled.addAccountText}>Adicionar conta</Text>
            </TouchableOpacity>
        </View>
    );

    if (initialLoading) {
        return (
            <View style={styled.container}>
                {renderHeader()}
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            </View>
        );
    }

    return (
        <View style={styled.container}>
            {renderHeader()}
            <View style={styled.cardContainer}>
                <FlatList
                    data={unifiedAccounts}
                    renderItem={renderAccount}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styled.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.foreground}
                            colors={[colors.primary[600]]}
                        />
                    }
                />
            </View>
        </View>
    );
}
