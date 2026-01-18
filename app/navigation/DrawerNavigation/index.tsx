import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/utils/useTheme';
import { HomeRoutes } from '@app/modules/Home/routes';
import ProfileScreen from '@app/modules/profile/screens/ProfileScreen';
import { DrawerProvider, useDrawer } from './DrawerContext';

const DrawerContent: React.FC = () => {
    const { isOpen, closeDrawer } = useDrawer();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const slideAnim = React.useRef(new Animated.Value(-Dimensions.get('window').width)).current;
    const [shouldRender, setShouldRender] = React.useState(false);
    const bottomBarHeight = 8 + 10 + 20 + insets.bottom + 10;

    React.useEffect(() => {
        if (isOpen) {
            slideAnim.setValue(-Dimensions.get('window').width);
            setShouldRender(true);
            requestAnimationFrame(() => {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }).start();
            });
        } else {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get('window').width,
                duration: 250,
                useNativeDriver: true,
            }).start(() => {
                setShouldRender(false);
            });
        }
    }, [isOpen, slideAnim]);

    if (!shouldRender) return null;

    return (
        <>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        backgroundColor: theme.background,
                        transform: [{ translateX: slideAnim }],
                        bottom: bottomBarHeight,
                    },
                ]}
            >
                <ProfileScreen />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 998,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        zIndex: 998,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
});

export const DrawerNavigator: React.FC = () => (
    <DrawerProvider>
        <View style={{ flex: 1 }}>
            <HomeRoutes />
            <DrawerContent />
        </View>
    </DrawerProvider>
);
