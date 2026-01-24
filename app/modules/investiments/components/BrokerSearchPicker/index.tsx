import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput as RNTextInput, ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { searchInstitutions } from '@app/modules/investiments/slices/investimentsApi';
import { clearInstitutionSearchResults } from '@app/modules/investiments/slices/investimentsSlice';
import { styles } from './styles';

export interface InstitutionSearchResult {
    id: string;
    name: string;
    code?: string;
    logo?: string;
}

interface BrokerSearchPickerProps {
    modalizeRef: React.RefObject<IHandles>;
    onSelect: (institution: InstitutionSearchResult) => void;
}

export const BrokerSearchPicker: React.FC<BrokerSearchPickerProps> = ({
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const { institutionSearchResults, institutionSearchLoading } = useAppSelector(
        (state) => state.investments,
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const accentColor = colors?.primary?.[600];

    // Debounced institution search
    const handleSearch = useCallback(
        (searchText: string) => {
            setSearchQuery(searchText);

            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            if (searchText.length >= 2) {
                const timeout = setTimeout(() => {
                    dispatch(searchInstitutions(searchText));
                }, 500);
                setSearchTimeout(timeout);
            } else {
                dispatch(clearInstitutionSearchResults());
            }
        },
        [dispatch, searchTimeout],
    );

    const handleSelect = (institution: InstitutionSearchResult) => {
        onSelect(institution);
        setSearchQuery('');
        dispatch(clearInstitutionSearchResults());
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
                <Text style={styled.title}>Buscar Corretora</Text>

                {/* Search Input */}
                <View style={styled.searchContainer}>
                    <RNTextInput
                        style={styled.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Digite o nome da corretora..."
                        placeholderTextColor={theme.foregroundMuted}
                        autoFocus
                    />
                    {institutionSearchLoading ? (
                        <ActivityIndicator size="small" color={accentColor} />
                    ) : (
                        <Feather name="search" size={20} color={theme.foregroundMuted} />
                    )}
                </View>

                {/* Search Results */}
                <View style={styled.listContainer}>
                    {institutionSearchResults.length > 0 ? (
                        institutionSearchResults.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styled.institutionItem}
                                onPress={() => handleSelect(item)}
                                activeOpacity={0.7}
                            >
                                <View style={styled.institutionInfo}>
                                    <Text style={styled.institutionName}>{item.name}</Text>
                                    {item.code && (
                                        <Text style={styled.institutionCode}>{item.code}</Text>
                                    )}
                                </View>
                                <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                            </TouchableOpacity>
                        ))
                    ) : institutionSearchLoading ? (
                        <View style={styled.emptyState}>
                            <ActivityIndicator size="large" color={accentColor} />
                            <Text style={styled.emptyStateText}>Buscando corretoras...</Text>
                        </View>
                    ) : searchQuery.length >= 2 ? (
                        <View style={styled.emptyState}>
                            <Feather name="search" size={48} color={theme.foregroundMuted} />
                            <Text style={styled.emptyStateText}>Nenhuma corretora encontrada</Text>
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
