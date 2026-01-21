import React, { useMemo, useEffect, useState } from 'react';
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
import { ScreenWithHeader } from '@app/modules/Home/components';
import { CreditCardResponse, fetchCreditCards, fetchCardBrands } from '../../slices/creditCardApi';
import { CreditCardItem } from '../../components/CreditCardItem';
import { type CreditCard } from '../../components/CardsList';
import { styles } from './styles';

export default function CreditCardsScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const creditCardsResponse = useAppSelector((state) => state.creditCard.cards);
    const cardBrands = useAppSelector((state) => state.creditCard.brands);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const CARDS_PER_PAGE = 4;

    useEffect(() => {
        const loadData = async () => {
            setInitialLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchCreditCards() as any),
                    dispatch(fetchCardBrands() as any),
                ]);
            } catch (err) {
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                dispatch(fetchCreditCards() as any).unwrap(),
                dispatch(fetchCardBrands() as any).unwrap(),
            ]);
        } catch (err) {
        } finally {
            setRefreshing(false);
        }
    };

    const creditCards: CreditCard[] = useMemo(
        () =>
            creditCardsResponse
                .filter((card: CreditCardResponse) => card.isActive)
                .map((card: CreditCardResponse) => {
                    const currentDate = new Date();
                    let closingDate: Date;
                    let isOpen: boolean;
                    let closingDateString: string;

                    // Tratar cartões do Open Finance que podem ter closingDay null
                    if (card.closingDay === null || card.closingDay === undefined) {
                        // Se não tem closingDay, usar uma data padrão ou baseada no dueDay
                        if (card.dueDay) {
                            const dueDate =
                                typeof card.dueDay === 'string'
                                    ? new Date(card.dueDay)
                                    : new Date(
                                          currentDate.getFullYear(),
                                          currentDate.getMonth(),
                                          card.dueDay,
                                      );
                            // Estimar closingDay como 20 dias antes do dueDay
                            closingDate = new Date(dueDate);
                            closingDate.setDate(closingDate.getDate() - 20);
                        } else {
                            // Data padrão se não tiver nenhuma informação
                            closingDate = new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                10,
                            );
                        }
                        isOpen = true; // Assumir aberto se não tiver informação
                        closingDateString = closingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                        });
                    } else {
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();
                        closingDate = new Date(currentYear, currentMonth, card.closingDay);
                        isOpen = currentDate.getDate() <= card.closingDay;
                        closingDateString = closingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                        });
                    }

                    const brand = cardBrands.find((b) => b.id === card.brand);
                    const brandIconUrl = brand?.iconUrl || null;

                    return {
                        id: card.id,
                        bankName: card.name,
                        brandIconUrl,
                        brandId: card.brand,
                        currentBill: card.usedLimit,
                        availableLimit: card.totalLimit - card.usedLimit,
                        closingDate: closingDateString,
                        status: isOpen ? 'open' : 'closed',
                    };
                }),
        [creditCardsResponse, cardBrands],
    );

    const totalPages = Math.ceil(creditCards.length / CARDS_PER_PAGE);
    const paginatedCards = useMemo(() => {
        if (creditCards.length <= CARDS_PER_PAGE) {
            return creditCards;
        }
        const startIndex = currentPage * CARDS_PER_PAGE;
        return creditCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
    }, [creditCards, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAddCard = () => {
        navigation.navigate('CreditCard', { screen: 'NewCreditCard' });
    };

    const handleCardPress = (card: CreditCard) => {
        const cardResponse = creditCardsResponse.find((c: CreditCardResponse) => c.id === card.id);
        if (cardResponse) {
            navigation.navigate('CreditCard', {
                screen: 'CreditCardDetails',
                params: {
                    cardId: card.id,
                    bankName: card.bankName,
                    brandIconUrl: card.brandIconUrl,
                    brandId: card.brandId,
                    currentBill: card.currentBill,
                    availableLimit: card.availableLimit,
                    closingDay: cardResponse.closingDay,
                    dueDay: cardResponse.dueDay,
                    status: card.status,
                },
            });
        }
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.title}>Meus cartões</Text>
            <TouchableOpacity onPress={handleAddCard} style={styled.addButton}>
                <Feather name="plus" size={24} color={theme.foreground} />
            </TouchableOpacity>
        </View>
    );

    const renderCardItem = ({ item }: { item: CreditCard }) => (
        <View style={styled.cardWrapper}>
            <CreditCardItem
                id={item.id}
                bankName={item.bankName}
                brandIconUrl={item.brandIconUrl}
                brandId={item.brandId}
                currentBill={item.currentBill}
                availableLimit={item.availableLimit}
                closingDate={item.closingDate}
                status={item.status}
                onPress={() => handleCardPress(item)}
                fullWidth
            />
        </View>
    );

    if (initialLoading) {
        return (
            <ScreenWithHeader customHeader={renderHeader()}>
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            </ScreenWithHeader>
        );
    }

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <FlatList
                data={paginatedCards}
                renderItem={renderCardItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 20 }]}
                style={styled.container}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
                ListEmptyComponent={
                    <View style={styled.emptyContainer}>
                        <Feather name="credit-card" size={48} color={theme.foregroundMuted} />
                        <Text style={styled.emptyText}>Nenhum cartão cadastrado</Text>
                        <Text style={styled.emptySubtext}>
                            Toque no botão + para adicionar um novo cartão
                        </Text>
                    </View>
                }
            />
            {creditCards.length > CARDS_PER_PAGE && (
                <View style={[styled.paginationContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <TouchableOpacity
                        onPress={handlePrevPage}
                        disabled={currentPage === 0}
                        style={[
                            styled.paginationButton,
                            currentPage === 0 && styled.paginationButtonDisabled,
                        ]}
                    >
                        <Feather
                            name="chevron-left"
                            size={20}
                            color={currentPage === 0 ? theme.foregroundMuted : theme.foreground}
                        />
                    </TouchableOpacity>
                    <View style={styled.paginationIndicators}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styled.paginationDot,
                                    index === currentPage && styled.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        onPress={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        style={[
                            styled.paginationButton,
                            currentPage === totalPages - 1 && styled.paginationButtonDisabled,
                        ]}
                    >
                        <Feather
                            name="chevron-right"
                            size={20}
                            color={
                                currentPage === totalPages - 1
                                    ? theme.foregroundMuted
                                    : theme.foreground
                            }
                        />
                    </TouchableOpacity>
                </View>
            )}
        </ScreenWithHeader>
    );
}
