import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40 - 16; // Mesmo tamanho do cartão de crédito
const FULL_WIDTH = SCREEN_WIDTH - 40;

export const styles = (fullWidth: boolean = false) =>
    StyleSheet.create({
        container: {
            marginRight: fullWidth ? 0 : 16,
        },
        card: {
            width: fullWidth ? FULL_WIDTH : CARD_WIDTH,
            borderRadius: 20,
            padding: 24,
            height: 220,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 16,
        },
        categoryIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            flexShrink: 0,
        },
        headerText: {
            flex: 1,
            justifyContent: 'center',
        },
        goalName: {
            fontSize: 18,
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 4,
        },
        goalDescription: {
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 20,
        },
        progressSection: {
            marginBottom: 12,
        },
        progressBarContainer: {
            marginBottom: 16,
        },
        progressBarBackground: {
            height: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 4,
        },
        amountsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        amountContainer: {
            flex: 1,
        },
        amountLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: 4,
        },
        amountValue: {
            fontSize: 18,
            fontWeight: '700',
            color: '#ffffff',
        },
        footer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        dateText: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
        },
        emojiIcon: {
            fontSize: 24,
        },
    });

