import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    WelcomeScreen,
    PersonalDataScreen,
    FirstAccountScreen,
    PersonalData,
    AccountData,
} from '../screens';
import { useAppDispatch, useAppSelector } from '@app/store';
import { setNeedsOnboarding } from '@app/modules/auth/slices/authSlice';
import { apiClient } from '@app/utils/api';

export type OnboardingStackParamList = {
    Welcome: undefined;
    PersonalData: undefined;
    FirstAccount: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingRoutes: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => (state.auth as { token: string | null }).token);
    const [personalData, setPersonalData] = useState<PersonalData | null>(null);
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${token}`,
    });

    const handleFinishOnboarding = async (accountData: AccountData) => {
        setLoading(true);
        try {
            if (personalData) {
                const fullAddress = [
                    personalData.street,
                    personalData.number,
                    personalData.neighborhood,
                    personalData.city,
                    personalData.state,
                ]
                    .filter(Boolean)
                    .join(', ');

                await apiClient.post(
                    '/api/user/profile',
                    {
                        firstName: personalData.firstName,
                        lastName: personalData.lastName,
                        phoneNumber: personalData.phone.replace(/\D/g, ''),
                        address: fullAddress,
                        complement: personalData.complement,
                    },
                    getAuthHeaders(),
                );
            }

            await apiClient.post(
                '/api/accounts',
                {
                    name: accountData.name,
                    institution: accountData.institution,
                    type: accountData.type,
                    initialBalance: parseFloat(accountData.initialBalance.replace(',', '.')) || 0,
                    color: accountData.color,
                },
                getAuthHeaders(),
            );

            dispatch(setNeedsOnboarding(false));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Welcome">
                {(props) => (
                    <WelcomeScreen onStart={() => props.navigation.navigate('PersonalData')} />
                )}
            </Stack.Screen>
            <Stack.Screen name="PersonalData">
                {(props) => (
                    <PersonalDataScreen
                        onContinue={(data) => {
                            setPersonalData(data);
                            props.navigation.navigate('FirstAccount');
                        }}
                        onBack={() => props.navigation.goBack()}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="FirstAccount">
                {(props) => (
                    <FirstAccountScreen
                        onFinish={handleFinishOnboarding}
                        onBack={() => props.navigation.goBack()}
                        loading={loading}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
};
