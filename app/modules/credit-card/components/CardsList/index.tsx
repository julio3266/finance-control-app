import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CreditCardItem } from '../CreditCardItem';
import { EmptyCard } from '../EmptyCard';

export interface CreditCard {
    id: string;
    bankName: string;
    bankIcon?: React.ReactNode;
    bankIconBg?: string;
    brandIconUrl?: string | null;
    brandId?: string;
    cardNumber?: string;
    cardHolder?: string;
    currentBill: number;
    availableLimit: number;
    closingDate: string;
    status: 'open' | 'closed';
}

interface CardsListProps {
    cards: CreditCard[];
    onCardPress?: (card: CreditCard) => void;
    onAddCard?: () => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, onCardPress, onAddCard }) => {
    const styled = styles();

    return (
        <View style={styled.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styled.scrollContent}
            >
                {cards.map((card) => (
                    <CreditCardItem
                        key={card.id}
                        id={card.id}
                        bankName={card.bankName}
                        bankIcon={card.bankIcon}
                        bankIconBg={card.bankIconBg}
                        brandIconUrl={card.brandIconUrl}
                        brandId={card.brandId}
                        cardNumber={card.cardNumber}
                        cardHolder={card.cardHolder}
                        currentBill={card.currentBill}
                        availableLimit={card.availableLimit}
                        closingDate={card.closingDate}
                        status={card.status}
                        onPress={() => onCardPress?.(card)}
                    />
                ))}
                {/* Sempre mostra o EmptyCard no final para adicionar novo cartão */}
                <EmptyCard onAddCard={onAddCard} />
            </ScrollView>
        </View>
    );
};

const styles = () =>
    StyleSheet.create({
        container: {
            marginBottom: 24,
        },
        scrollContent: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingVertical: 4,
        },
    });
