import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40 - 16;

export const styles = () =>
    StyleSheet.create({
        container: {
            marginRight: 16,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'flex-start',
        },
        card: {
            width: CARD_WIDTH,
            height: 220,
            padding: 24,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderStyle: 'dashed',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        text: {
            fontSize: 16,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
        },
    });
