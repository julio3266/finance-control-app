import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchUserProfile } from '@app/modules/profile/slices';
import { fetchFinanceOverview } from '@app/modules/dashboard/slices/financeApi';
import { colors } from '@app/utils/colors';

interface SessionProviderProps {
    children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [isInitialized, setIsInitialized] = useState(false);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const initializeSession = async () => {
            if (isAuthenticated) {
                try {
                    dispatch(fetchUserProfile()).catch(() => { });
                    dispatch(fetchFinanceOverview()).catch(() => { });
                } catch (error) {

                }
            }

            setIsInitialized(true);
        };

        initializeSession();
    }, [isAuthenticated, dispatch]);

    if (!isInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
});
