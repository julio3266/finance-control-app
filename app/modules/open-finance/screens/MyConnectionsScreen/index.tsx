import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SvgCssUri } from 'react-native-svg/css';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme } from '@app/utils/useTheme';
import { useAppDispatch, useAppSelector } from '@app/store';
import { toggleHideValues } from '@app/store/themeSlice';
import { colors } from '@app/utils/colors';
import { formatCurrencyWithHide } from '@app/utils/formatCurrency';
import {
    fetchConnections,
    deleteConnection,
    syncConnection,
    type BankConnection,
} from '@app/modules/open-finance/slices';
import { DeleteConnectionBottomSheet } from '@app/modules/open-finance/components';
import { styles } from './styles';

export default function MyConnectionsScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { connections, connectionsLoading } = useAppSelector((state) => state.openFinance);
    const hideValues = useAppSelector((state) => state.theme.hideValues);
    const [refreshing, setRefreshing] = React.useState(false);
    const [expandedConnections, setExpandedConnections] = useState<Set<string>>(new Set());
    const [selectedConnection, setSelectedConnection] = useState<BankConnection | null>(null);
    const [isDeletingConnection, setIsDeletingConnection] = useState(false);
    const deleteModalRef = useRef<IHandles | null>(null);

    useEffect(() => {
        dispatch(fetchConnections())

    }, [dispatch]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchConnections());
        setRefreshing(false);
    }, [dispatch]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleAddConnection = () => {
        (navigation as any).navigate('ConnectAccounts');
    };

    const handleToggleHideValues = () => {
        dispatch(toggleHideValues());
    };

    const toggleExpandConnection = (connectionId: string) => {
        setExpandedConnections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(connectionId)) {
                newSet.delete(connectionId);
            } else {
                newSet.add(connectionId);
            }
            return newSet;
        });
    };

    const handleSyncConnection = async (connectionId: string) => {
        try {
            await dispatch(syncConnection(connectionId)).unwrap();
        } catch (error) {
        }
    };

    const handleDeleteConnection = (connection: BankConnection) => {
        setSelectedConnection(connection);
        deleteModalRef.current?.open();
    };

    const handleConfirmDelete = async () => {
        if (!selectedConnection) return;

        setIsDeletingConnection(true);
        try {
            await dispatch(deleteConnection(selectedConnection.id)).unwrap();
            deleteModalRef.current?.close();
            Alert.alert('Sucesso', 'Conexão removida com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover a conexão.');
        } finally {
            setIsDeletingConnection(false);
        }
    };

    const handleCancelDelete = () => {
        setSelectedConnection(null);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONNECTED':
            case 'UPDATED':
                return '#059669';
            case 'UPDATING':
            case 'LOGIN_ERROR':
                return colors.warning[500];
            case 'OUTDATED':
            case 'ERROR':
                return colors.error[500];
            default:
                return theme.foregroundMuted;
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONNECTED':
            case 'UPDATED':
                return 'Conectado';
            case 'UPDATING':
                return 'Atualizando';
            case 'LOGIN_ERROR':
                return 'Erro de login';
            case 'OUTDATED':
                return 'Desatualizado';
            case 'ERROR':
                return 'Erro';
            default:
                return status;
        }
    };

    const formatLastSync = (lastSyncAt: string | null) => {
        if (!lastSyncAt) return 'Nunca sincronizado';
        const date = new Date(lastSyncAt);
        return `Última sync: ${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const renderConnectionItem = ({ item }: { item: BankConnection }) => {
        const isExpanded = expandedConnections.has(item.id);
        const accountsCount = item._count?.bankAccounts || item.bankAccounts?.length || 0;

        return (
            <View style={styled.connectionCard}>
                <View style={styled.connectionHeader}>
                    <View style={styled.logoContainer}>
                        {item.connectorLogo ? (
                            <View style={styled.logoWrapper}>
                                <SvgCssUri
                                    uri={item.connectorLogo}
                                    width={40}
                                    height={40}
                                />
                            </View>
                        ) : (
                            <View style={styled.logoPlaceholder}>
                                <Feather name="credit-card" size={24} color={theme.foregroundMuted} />
                            </View>
                        )}
                    </View>
                    <View style={styled.connectionInfo}>
                        <Text style={styled.connectorName}>{item.connectorName}</Text>
                        <View style={styled.statusRow}>
                            <View
                                style={[
                                    styled.statusDot,
                                    { backgroundColor: getStatusColor(item.status) },
                                ]}
                            />
                            <Text
                                style={[
                                    styled.statusText,
                                    { color: getStatusColor(item.status) },
                                ]}
                            >
                                {getStatusText(item.status)}
                            </Text>
                        </View>
                        <Text style={styled.lastSync}>{formatLastSync(item.lastSyncAt)}</Text>
                    </View>
                </View>

                {/* Contas bancárias */}
                {accountsCount > 0 && (
                    <TouchableOpacity
                        style={styled.accountsInfo}
                        onPress={() => toggleExpandConnection(item.id)}
                        activeOpacity={0.7}
                    >
                        <Feather name="layers" size={14} color={theme.foregroundMuted} />
                        <Text style={styled.accountsText}>
                            {accountsCount} conta(s) vinculada(s)
                        </Text>
                        <Feather
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={theme.foregroundMuted}
                            style={{ marginLeft: 'auto' }}
                        />
                    </TouchableOpacity>
                )}

                {/* Lista de contas expandida */}
                {isExpanded && item.bankAccounts && item.bankAccounts.length > 0 && (
                    <View style={styled.accountsList}>
                        {item.bankAccounts.map((account, index) => (
                            <View
                                key={account.id}
                                style={[
                                    styled.accountItem,
                                    index === item.bankAccounts!.length - 1 && styled.accountItemLast,
                                ]}
                            >
                                <View style={styled.accountIcon}>
                                    <Feather
                                        name={account.type === 'CREDIT' ? 'credit-card' : 'dollar-sign'}
                                        size={16}
                                        color={colors.primary[600]}
                                    />
                                </View>
                                <View style={styled.accountDetails}>
                                    <Text style={styled.accountName}>{account.name}</Text>
                                    {account.number && (
                                        <Text style={styled.accountNumber}>
                                            {account.type === 'CREDIT' ? 'Cartão' : 'Conta'} {account.number}
                                        </Text>
                                    )}
                                </View>
                                <View style={styled.accountBalance}>
                                    <Text style={styled.accountBalanceValue}>
                                        {formatCurrencyWithHide(account.balance, hideValues)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styled.connectionActions}>
                    <TouchableOpacity
                        style={styled.actionButton}
                        onPress={() => handleSyncConnection(item.id)}
                        activeOpacity={0.7}
                    >
                        <Feather name="refresh-cw" size={18} color={colors.primary[600]} />
                        <Text style={styled.actionButtonText}>Sincronizar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styled.actionButton, styled.deleteButton]}
                        onPress={() => handleDeleteConnection(item)}
                        activeOpacity={0.7}
                    >
                        <Feather name="trash-2" size={18} color={colors.error[500]} />
                        <Text style={[styled.actionButtonText, styled.deleteButtonText]}>
                            Remover
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styled.emptyContainer}>
            <View style={styled.emptyIconContainer}>
                <FontAwesome6 name="link" size={48} color={theme.foregroundMuted} />
            </View>
            <Text style={styled.emptyTitle}>Nenhuma conexão</Text>
            <Text style={styled.emptyMessage}>
                Conecte sua conta bancária para sincronizar suas transações automaticamente.
            </Text>
            <TouchableOpacity
                style={styled.addConnectionButton}
                onPress={handleAddConnection}
                activeOpacity={0.7}
            >
                <Feather name="plus" size={20} color="#ffffff" />
                <Text style={styled.addConnectionButtonText}>Adicionar conexão</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
                onPress={handleBack}
                style={styled.backButton}
                activeOpacity={0.7}
            >
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Minhas conexões</Text>
            <View style={styled.headerActions}>
                <TouchableOpacity
                    onPress={handleToggleHideValues}
                    style={styled.headerActionButton}
                    activeOpacity={0.7}
                >
                    <Feather
                        name={hideValues ? 'eye-off' : 'eye'}
                        size={20}
                        color={theme.foreground}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleAddConnection}
                    style={styled.addButton}
                    activeOpacity={0.7}
                >
                    <Feather name="plus" size={24} color={colors.primary[600]} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (connectionsLoading && !refreshing && connections.length === 0) {
        return (
            <View style={styled.container}>
                {renderHeader()}
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                    <Text style={styled.loadingText}>Carregando conexões...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styled.container}>
            {renderHeader()}
            <FlatList
                data={connections}
                renderItem={renderConnectionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styled.listContent,
                    connections.length === 0 && styled.emptyListContent,
                ]}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary[600]}
                        colors={[colors.primary[600]]}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <DeleteConnectionBottomSheet
                modalizeRef={deleteModalRef}
                connectionName={selectedConnection?.connectorName || ''}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeletingConnection}
            />
        </View>
    );
}
