/* eslint-disable no-console */
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';

import { UnifiedTransactionItem } from '../../components';

import { styles } from './styles';

export default function ExtractScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <FlatList
                data={[]}
                renderItem={({ item }) => <UnifiedTransactionItem transaction={item} />}
                ListHeaderComponent={<></>}
                ListEmptyComponent={<></>}
                contentContainerStyle={styled.content}
                style={styled.container}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => console.log('onEndReached')}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
                onEndReached={() => console.log('onEndReached')}
                onEndReachedThreshold={0.5}
                ListFooterComponent={<></>}
            />
        </ScreenWithHeader>
    );
}
