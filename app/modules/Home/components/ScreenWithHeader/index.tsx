import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface ScreenWithHeaderProps {
    children: React.ReactNode;
    customHeader?: React.ReactNode;
}

export const ScreenWithHeader: React.FC<ScreenWithHeaderProps> = ({ children, customHeader }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={[styled.container, { backgroundColor: theme.background }]}>
            {customHeader}
            <View style={[styled.content, { paddingTop: 0 }]}>{children}</View>
        </View>
    );
};
