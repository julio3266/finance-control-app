import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput as RNTextInput, ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { searchAssets } from '@app/modules/investiments/slices/investimentsApi';
import { clearAssetSearchResults } from '@app/modules/investiments/slices/investimentsSlice';
import { styles } from './styles';

export interface AssetSearchResult {
    ticker: string;
    name: string;
    type: string;
    price?: number;
    change?: number;
    changePercent?: number;
    logo?: string;
    sector?: string;
    currency?: string;
}

interface AssetSearchPickerProps {
    modalizeRef: React.RefObject<IHandles>;
    onSelect: (asset: AssetSearchResult) => void;
}

export const AssetSearchPicker: React.FC<AssetSearchPickerProps> = ({
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const { assetSearchResults, assetSearchLoading } = useAppSelector(
        (state) => state.investments,
    );

    const [assetSearch, setAssetSearch] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const accentColor = colors?.primary?.[600];

    // Debounced asset search
    const handleAssetSearch = useCallback(
        (searchText: string) => {
            setAssetSearch(searchText);

            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            if (searchText.length >= 2) {
                const timeout = setTimeout(() => {
                    dispatch(searchAssets(searchText));
                }, 500);
                setSearchTimeout(timeout);
            } else {
                dispatch(clearAssetSearchResults());
            }
        },
        [dispatch, searchTimeout],
    );

    const handleSelect = (asset: AssetSearchResult) => {
        onSelect(asset);
        setAssetSearch('');
        dispatch(clearAssetSearchResults());
        modalizeRef.current?.close();
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight={false}
            modalHeight={600}
        >
            <View style={[styled.content, { paddingBottom: insets.bottom }]}>
                <Text style={styled.title}>Buscar Ativo</Text>

                {/* Search Input */}
                <View style={styled.searchContainer}>
                    <RNTextInput
                        style={styled.searchInput}
                        value={assetSearch}
                        onChangeText={handleAssetSearch}
                        placeholder="Digite o ticker ou nome do ativo..."
                        placeholderTextColor={theme.foregroundMuted}
                        autoFocus
                    />
                    {assetSearchLoading ? (
                        <ActivityIndicator size="small" color={accentColor} />
                    ) : (
                        <Feather name="search" size={20} color={theme.foregroundMuted} />
                    )}
                </View>

                {/* Search Results */}
                <View style={styled.listContainer}>
                    {assetSearchResults.length > 0 ? (
                        assetSearchResults.map((item) => (
                            <TouchableOpacity
                                key={item.ticker}
                                style={styled.assetItem}
                                onPress={() => handleSelect(item)}
                                activeOpacity={0.7}
                            >
                                <View style={styled.assetInfo}>
                                    <Text style={styled.assetTicker}>{item.ticker}</Text>
                                    <Text style={styled.assetName} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    {item.sector && (
                                        <Text style={styled.assetSector}>{item.sector}</Text>
                                    )}
                                </View>
                                {item.price && (
                                    <View style={styled.assetPriceContainer}>
                                        <Text style={styled.assetPrice}>
                                            R$ {item.price.toFixed(2).replace('.', ',')}
                                        </Text>
                                        {item.changePercent !== undefined && (
                                            <Text
                                                style={[
                                                    styled.assetChange,
                                                    {
                                                        color:
                                                            item.changePercent >= 0
                                                                ? '#10b981'
                                                                : '#ef4444',
                                                    },
                                                ]}
                                            >
                                                {item.changePercent >= 0 ? '+' : ''}
                                                {item.changePercent.toFixed(2)}%
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    ) : assetSearchLoading ? (
                        <View style={styled.emptyState}>
                            <ActivityIndicator size="large" color={accentColor} />
                            <Text style={styled.emptyStateText}>Buscando ativos...</Text>
                        </View>
                    ) : assetSearch.length >= 2 ? (
                        <View style={styled.emptyState}>
                            <Feather name="search" size={48} color={theme.foregroundMuted} />
                            <Text style={styled.emptyStateText}>Nenhum ativo encontrado</Text>
                        </View>
                    ) : (
                        <View style={styled.emptyState}>
                            <Feather name="search" size={48} color={theme.foregroundMuted} />
                            <Text style={styled.emptyStateText}>
                                Digite pelo menos 2 caracteres para buscar
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modalize>
    );
};
