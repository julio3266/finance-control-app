import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput as RNTextInput,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchConnectors, setSearchQuery, resetConnectors, type Connector } from '../../slices';
import type { OpenFinanceStackParamList } from '../../routes';
import { styles } from './styles';

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

    const profile = useAppSelector((state) => state.profile.profile);
    const isPremium = profile?.isPremium ?? false;

    const connectors = useAppSelector((state) => state.openFinance.connectors);
    const loading = useAppSelector((state) => state.openFinance.connectorsLoading);
    const searchQuery = useAppSelector((state) => state.openFinance.searchQuery);
    const [searchText, setSearchText] = useState('');
    const [logoErrors, setLogoErrors] = useState<Record<number, boolean>>({});
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const onlyCreditCards = route.params?.onlyCreditCards ?? false;
    const filteredConnectors = useMemo(() => {
        if (!onlyCreditCards) return connectors;
        return connectors.filter((connector) => connector.supportsCreditCards);
    }, [connectors, onlyCreditCards]);

    // Redirect non-premium users to subscription immediately
    useEffect(() => {
        if (!isPremium) {
            navigation.goBack();
            // Small delay to ensure goBack completes before navigating
            setTimeout(() => {
                (navigation as any).navigate('Subscription', { screen: 'Subscription' });
            }, 100);
        }
    }, [isPremium, navigation]);

    useEffect(() => {
        // Only fetch connectors if user is premium
        if (isPremium) {
            dispatch(resetConnectors());
            dispatch(fetchConnectors());
        }
    }, [dispatch, isPremium]);

    useEffect(() => {
        // Only handle search if user is premium
        if (!isPremium) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchText.trim().length === 0) {
            dispatch(setSearchQuery(''));
            dispatch(resetConnectors());
            dispatch(fetchConnectors());
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
                }),
            );
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchText, dispatch, isPremium]);

    const handleInstitutionPress = (connector: Connector) => {
        const onlyCreditCards = route.params?.onlyCreditCards ?? false;
        (navigation as any).navigate('ConnectInstitution', {
            connector,
            products: onlyCreditCards ? ['CREDIT_CARDS'] : undefined,
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Don't render anything if not premium (will redirect)
    if (!isPremium) {
        return null;
    }

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
                data={filteredConnectors}
                renderItem={renderInstitutionItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styled.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={10}
            />

        </View>
    );
};
