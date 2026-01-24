import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchGoalCategories, type GoalCategoryResponse } from '../../slices/goalsApi';
import { styles } from './styles';

export type GoalCategory = GoalCategoryResponse;

interface GoalCategoryPickerModalProps {
    selectedCategory: GoalCategory | null;
    onSelect: (category: GoalCategory) => void;
    modalizeRef: React.RefObject<IHandles>;
}

export const GoalCategoryPickerModal: React.FC<GoalCategoryPickerModalProps> = ({
    selectedCategory,
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const categories = useAppSelector((state) => state.goals.categories);
    const categoriesLoading = useAppSelector((state) => state.goals.categoriesLoading);

    useEffect(() => {
        if (categories.length === 0 && !categoriesLoading) {
            dispatch(fetchGoalCategories());
        }
    }, [dispatch, categories.length, categoriesLoading]);

    const handleSelect = (category: GoalCategory) => {
        onSelect(category);
        modalizeRef.current?.close();
    };

    const isEmoji = (icon: string) => {
        return /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(icon);
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
                <Text style={styled.title}>Selecionar Categoria</Text>

                <ScrollView style={styled.listContainer} showsVerticalScrollIndicator={false}>
                    {categoriesLoading ? (
                        <View style={styled.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.foreground} />
                            <Text style={styled.loadingText}>Carregando categorias...</Text>
                        </View>
                    ) : categories.length === 0 ? (
                        <View style={styled.emptyContainer}>
                            <Text style={styled.emptyText}>Nenhuma categoria disponível</Text>
                        </View>
                    ) : (
                        categories.map((category) => {
                            const isSelected = selectedCategory?.id === category.id;
                            const emoji = isEmoji(category.icon);

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
                                            { backgroundColor: category.color + '20' },
                                        ]}
                                    >
                                        {emoji ? (
                                            <Text style={styled.emojiIcon}>{category.icon}</Text>
                                        ) : (
                                            <Feather
                                                name={category.icon as any}
                                                size={20}
                                                color={category.color}
                                            />
                                        )}
                                    </View>
                                    <Text style={styled.categoryName}>{category.name}</Text>
                                    {isSelected ? (
                                        <Feather
                                            name="check"
                                            size={20}
                                            color={colors.primary[600]}
                                        />
                                    ) : (
                                        <View style={styled.radioButton} />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </Modalize>
    );
};

