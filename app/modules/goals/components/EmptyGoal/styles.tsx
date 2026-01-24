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
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        text: {
            fontSize: 14,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
        },
    });
