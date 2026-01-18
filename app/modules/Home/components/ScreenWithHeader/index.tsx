import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AnimatedHeader } from '../AnimatedHeader';
import { useTheme } from '@app/utils/useTheme';
import { HomeTabParamList } from '../../routes/homeRoutes';
import { styles } from './styles';

type NavigationProp = BottomTabNavigationProp<HomeTabParamList>;

interface ScreenWithHeaderProps {
    children: React.ReactNode;
    customHeader?: React.ReactNode;
}

export const ScreenWithHeader: React.FC<ScreenWithHeaderProps> = ({ children, customHeader }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const navigation = useNavigation<NavigationProp>();

    const handleProfilePress = () => {
        navigation.navigate('More');
    };

    return (
        <View style={[styled.container, { backgroundColor: theme.background }]}>
            {customHeader || <AnimatedHeader onProfilePress={handleProfilePress} />}
            <View style={[styled.content, { paddingTop: 0 }]}>{children}</View>
        </View>
    );
};
