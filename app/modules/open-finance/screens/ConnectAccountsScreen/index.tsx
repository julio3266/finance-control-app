import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput as RNTextInput,
    ActivityIndicator,
    Image,
} from 'react-native';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchConnectors, setSearchQuery, resetConnectors, type Connector } from '../../slices';
import type { OpenFinanceStackParamList } from '../../routes';
import { ConnectInstitutionBottomSheet } from '../../components/ConnectInstitutionBottomSheet';
import { styles } from './styles';

const ITEMS_PER_PAGE = 20;

type ConnectAccountsRouteProp = RouteProp<OpenFinanceStackParamList, 'ConnectAccounts'>;

const formatColor = (color?: string): string => {
    if (!color) return colors.primary[600];
    // Se já começa com #, retorna como está
    if (color.startsWith('#')) return color;
    // Caso contrário, adiciona #
    return `#${color}`;
};

const formatInstitutionType = (type: string): string => {
    const typeMap: Record<string, string> = {
        PERSONAL_BANK: 'Pessoa Física',
        BUSINESS_BANK: 'Pessoa Jurídica',
        INVESTMENT: 'Investimento',
    };

    return typeMap[type] || type;
};

export const ConnectAccountsScreen: React.FC = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<ConnectAccountsRouteProp>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

    const connectors = useAppSelector((state) => state.openFinance.connectors);
    const loading = useAppSelector((state) => state.openFinance.connectorsLoading);
    const searchQuery = useAppSelector((state) => state.openFinance.searchQuery);
    const pagination = useAppSelector((state) => state.openFinance.pagination);

    const [searchText, setSearchText] = useState('');
    const [logoErrors, setLogoErrors] = useState<Record<number, boolean>>({});
    const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const connectInstitutionModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;

    const onlyCreditCards = route.params?.onlyCreditCards ?? false;

    // Buscar connectors iniciais
    useEffect(() => {
        dispatch(resetConnectors());
        dispatch(
            fetchConnectors({
                page: 1,
                pageSize: ITEMS_PER_PAGE,
                onlyCreditCards,
            }),
        );
    }, [dispatch, onlyCreditCards]);

    // Debounce para busca
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchText.trim().length === 0) {
            dispatch(setSearchQuery(''));
            dispatch(resetConnectors());
            dispatch(
                fetchConnectors({
                    page: 1,
                    pageSize: ITEMS_PER_PAGE,
                    onlyCreditCards,
                }),
            );
            return;
        }

        if (searchText.trim().length < 2) {
            return;
        }

        debounceRef.current = setTimeout(() => {
            dispatch(setSearchQuery(searchText.trim()));
            dispatch(resetConnectors());
            dispatch(
                fetchConnectors({
                    search: searchText.trim(),
                    page: 1,
                    pageSize: ITEMS_PER_PAGE,
                    onlyCreditCards,
                }),
            );
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchText, dispatch, onlyCreditCards]);

    const handleLoadMore = useCallback(() => {
        if (!loading && pagination?.hasNextPage) {
            const nextPage = pagination.currentPage + 1;
            dispatch(
                fetchConnectors({
                    search: searchQuery || undefined,
                    page: nextPage,
                    pageSize: ITEMS_PER_PAGE,
                    onlyCreditCards,
                }),
            );
        }
    }, [loading, pagination, searchQuery, dispatch, onlyCreditCards]);

    const handleInstitutionPress = (connector: Connector) => {
        setSelectedConnector(connector);
        // O BottomSheet será aberto automaticamente via useEffect quando connector mudar
    };

    const handleConnectionSuccess = () => {
        // Recarregar lista de connectors se necessário
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const renderInstitutionItem = ({ item }: { item: Connector }) => {
        const hasLogoError = logoErrors[item.id];

        const renderLogo = () => {
            if (!item.imageUrl || hasLogoError) {
                return (
                    <View
                        style={[
                            styled.institutionLogoPlaceholder,
                            { backgroundColor: formatColor(item.primaryColor) },
                        ]}
                    >
                        <Text style={styled.institutionLogoText}>
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                );
            }

            return (
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styled.institutionLogo}
                    resizeMode="contain"
                    onError={() => setLogoErrors((prev) => ({ ...prev, [item.id]: true }))}
                />
            );
        };

        return (
            <TouchableOpacity
                style={styled.institutionItem}
                onPress={() => handleInstitutionPress(item)}
                activeOpacity={0.7}
            >
                <View style={styled.institutionLogoContainer}>{renderLogo()}</View>
                <View style={styled.institutionInfo}>
                    <Text style={styled.institutionName}>{item.name}</Text>
                    <Text style={styled.institutionType}>{formatInstitutionType(item.type)}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styled.footerLoader}>
                <ActivityIndicator size="small" color={theme.foreground} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading && connectors.length === 0) {
            return null;
        }
        return (
            <View style={styled.emptyContainer}>
                <Feather name="search" size={48} color={theme.foregroundMuted} />
                <Text style={styled.emptyText}>
                    {searchQuery
                        ? 'Nenhuma instituição encontrada'
                        : 'Nenhuma instituição disponível'}
                </Text>
            </View>
        );
    };

    if (loading && connectors.length === 0) {
        return (
            <View style={[styled.container, { paddingTop: insets.top }]}>
                <View style={styled.header}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styled.backButton}
                        activeOpacity={0.7}
                    >
                        <Feather name="arrow-left" size={24} color={theme.foreground} />
                    </TouchableOpacity>
                    <Text style={styled.headerTitle}>Conectar contas</Text>
                    <View style={styled.backButton} />
                </View>

                <View style={styled.searchContainer}>
                    <Feather name="search" size={20} color={theme.foregroundMuted} />
                    <RNTextInput
                        style={styled.searchInput}
                        placeholder="Buscar instituição..."
                        placeholderTextColor={theme.foregroundMuted}
                        value={searchText}
                        onChangeText={setSearchText}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchText('');
                                dispatch(setSearchQuery(''));
                            }}
                            style={styled.clearButton}
                        >
                            <Feather name="x" size={18} color={theme.foregroundMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styled.container, { paddingTop: insets.top }]}>
            <View style={styled.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styled.backButton}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
                <Text style={styled.headerTitle}>Conectar contas</Text>
                <View style={styled.backButton} />
            </View>

            <View style={styled.searchContainer}>
                <Feather name="search" size={20} color={theme.foregroundMuted} />
                <RNTextInput
                    style={styled.searchInput}
                    placeholder="Buscar instituição..."
                    placeholderTextColor={theme.foregroundMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setSearchText('');
                            dispatch(setSearchQuery(''));
                        }}
                        style={styled.clearButton}
                    >
                        <Feather name="x" size={18} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={connectors}
                renderItem={renderInstitutionItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styled.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={10}
            />

            <ConnectInstitutionBottomSheet
                modalizeRef={connectInstitutionModalRef}
                connector={selectedConnector}
                onSuccess={handleConnectionSuccess}
                onClose={() => setSelectedConnector(null)}
            />
        </View>
    );
};
