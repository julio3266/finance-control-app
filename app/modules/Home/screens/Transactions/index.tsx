import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader, TransactionsHeader } from '../../components';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';



export default function TransactionsScreen() {
    const theme = useTheme();
    const styled = styles(theme);



    return (
        <ScreenWithHeader

        >
            <ScrollView
                style={styled.container}
                contentContainerStyle={styled.content}
            >

                <View style={styled.balanceContainer}>

                </View>
            </ScrollView>
        </ScreenWithHeader>
    );
}

