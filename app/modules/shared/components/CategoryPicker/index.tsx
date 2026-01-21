import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput as RNTextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchCategories } from '@app/modules/dashboard/slices/financeApi';
import { styles } from './styles';

export interface Category {
    id: string;
    name: string;
    icon: string;
    iconColor: string;
    iconBg: string;
}

interface CategoryPickerProps {
    type: 'income' | 'expense';
    selectedCategory?: Category | null;
    onSelect: (category: Category) => void;
}

// Função para converter CategoryResponse do backend para Category do componente
const convertCategoryResponse = (categoryResponse: {
    id: string;
    name: string;
    icon: string;
    color: string;
}): Category => ({
    id: categoryResponse.id,
    name: categoryResponse.name,
    icon: categoryResponse.icon, // Emoji do backend
    iconColor: '#ffffff',
    iconBg: categoryResponse.color,
});

interface CategoryPickerModalProps extends CategoryPickerProps {
    modalizeRef: React.RefObject<IHandles>;
}

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
    type,
    selectedCategory,
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');

    const allCategories = useAppSelector((state) => state.finance.categories);
    const categoriesLoading = useAppSelector((state) => state.finance.categoriesLoading);

    // Buscar categorias quando o componente montar
    useEffect(() => {
        if (allCategories.length === 0 && !categoriesLoading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, allCategories.length, categoriesLoading]);

    // Filtrar categorias por tipo (INCOME ou EXPENSE)
    const typeFilter = type === 'income' ? 'INCOME' : 'EXPENSE';
    const categoriesByType = allCategories
        .filter((cat) => cat.type === typeFilter)
        .map(convertCategoryResponse);

    const filteredCategories = categoriesByType.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSelect = (category: Category) => {
        onSelect(category);
        modalizeRef.current?.close();
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight
        >
            <View style={[styled.content, { paddingBottom: insets.bottom }]}>
                <ScrollView style={styled.listContainer} showsVerticalScrollIndicator={false}>
                    {categoriesLoading ? (
                        <View style={styled.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.foreground} />
                            <Text style={styled.loadingText}>Carregando categorias...</Text>
                        </View>
                    ) : filteredCategories.length === 0 ? (
                        <View style={styled.emptyContainer}>
                            <Text style={styled.emptyText}>
                                {searchQuery
                                    ? 'Nenhuma categoria encontrada'
                                    : 'Nenhuma categoria disponível'}
                            </Text>
                        </View>
                    ) : (
                        filteredCategories.map((category) => {
                            const isSelected = selectedCategory?.id === category.id;
                            const isEmoji =
                                /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                                    category.icon,
                                );

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styled.categoryItem}
                                    onPress={() => handleSelect(category)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styled.categoryIcon,
                                            { backgroundColor: category.iconBg },
                                        ]}
                                    >
                                        {isEmoji ? (
                                            <Text style={styled.emojiIcon}>{category.icon}</Text>
                                        ) : (
                                            <Feather
                                                name={category.icon as any}
                                                size={20}
                                                color={category.iconColor}
                                            />
                                        )}
                                    </View>
                                    <Text style={styled.categoryName}>{category.name}</Text>
                                    {isSelected ? (
                                        <Feather
                                            name="check"
                                            size={20}
                                            color={colors.success[500]}
                                        />
                                    ) : (
                                        <View style={styled.radioButton} />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
                <View style={styled.actionsContainer}>
                    <TouchableOpacity
                        style={styled.actionItem}
                        onPress={() => modalizeRef.current?.close()}
                    >
                        <Feather name="settings" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.actionText}>Gerenciar categorias</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styled.actionItem}
                        onPress={() => modalizeRef.current?.close()}
                    >
                        <Feather name="plus" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.actionText}>Criar nova categoria</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    );
};
