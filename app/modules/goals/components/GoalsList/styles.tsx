import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const styles = () =>
    StyleSheet.create({
        container: {
            marginBottom: 20,
            marginHorizontal: -20,
        },
        scrollContent: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'stretch',
        },
        centeredContent: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
    });
