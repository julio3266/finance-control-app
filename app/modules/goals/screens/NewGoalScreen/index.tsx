import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput as RNTextInput,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { GoalsStackParamList } from '../../routes/goalsRoutes';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useFormValidation } from '@app/utils/useFormValidation';
import { useAppDispatch, useAppSelector } from '@app/store';
import { DatePicker } from '@app/modules/shared/components';
import { GoalCategoryPickerModal, DeleteGoalBottomSheet, type GoalCategory } from '../../components';
import { goalSchema, type GoalFormValues } from '../../schemas/goalSchema';
import { createGoal, updateGoal, deleteGoal, fetchGoals, type GoalResponse } from '../../slices/goalsApi';
import { styles } from './styles';

type NewGoalRouteParams = {
    goalId?: string;
};

export const NewGoalScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<GoalsStackParamList, 'NewGoal'>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const goalId = (route.params as NewGoalRouteParams)?.goalId;
    const goals = useAppSelector((state) => state.goals.goals);
    const goalToEdit = goalId ? goals.find((g) => g.id === goalId) : null;

    const [name, setName] = useState(goalToEdit?.name || '');
    const [description, setDescription] = useState(goalToEdit?.description || '');
    const [targetAmount, setTargetAmount] = useState(
        goalToEdit ? goalToEdit.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
    );
    const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(
        goalToEdit?.category || null,
    );
    const [targetDate, setTargetDate] = useState<Date | null>(
        goalToEdit?.targetDate ? new Date(goalToEdit.targetDate) : null,
    );

    const dateModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const categoryModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const deleteModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const scrollViewRef = useRef<ScrollView>(null);

    const { validate, getFieldError, validateField } =
        useFormValidation<GoalFormValues>(goalSchema);

    const createLoading = useAppSelector((state) => (state as any).goals.createLoading);
    const createError = useAppSelector((state) => (state as any).goals.createError);
    const updateLoading = useAppSelector((state) => (state as any).goals.updateLoading);
    const updateError = useAppSelector((state) => (state as any).goals.updateError);
    const deleteLoading = useAppSelector((state) => (state as any).goals.deleteLoading);
    const deleteError = useAppSelector((state) => (state as any).goals.deleteError);

    const isLoading = createLoading || updateLoading || deleteLoading;
    const isEditing = !!goalId;

    const accentColor = colors.primary[600];

    useEffect(() => {
        if (goalToEdit) {
            setName(goalToEdit.name || '');
            setDescription(goalToEdit.description || '');
            setTargetAmount(
                goalToEdit.targetAmount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            );
            setSelectedCategory(goalToEdit.category || null);
            setTargetDate(goalToEdit.targetDate ? new Date(goalToEdit.targetDate) : null);
        }
    }, [goalToEdit]);

    const handleBack = () => {
        navigation.goBack();
    };

    const parseCurrencyToNumber = (value: string): number => {
        // Remove tudo que não é dígito
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return 0;

        // Converte para número e divide por 100 para ter os centavos
        return parseInt(numbers, 10) / 100;
    };

    const handleSave = async () => {
        const formData: GoalFormValues = {
            name,
            description: description || undefined,
            targetAmount,
            categoryId: selectedCategory?.id || '',
            targetDate: targetDate ? targetDate.toISOString() : undefined,
        };

        const isValid = validate(formData);

        if (!isValid) {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            return;
        }

        try {
            const targetAmountNum = parseCurrencyToNumber(targetAmount);

            if (isEditing && goalId) {
                await dispatch(
                    updateGoal({
                        id: goalId,
                        data: {
                            name,
                            description: description || undefined,
                            targetAmount: targetAmountNum,
                            categoryId: selectedCategory!.id,
                            targetDate: targetDate ? targetDate.toISOString() : undefined,
                        },
                    }) as any,
                ).unwrap();
            } else {
                await dispatch(
                    createGoal({
                        name,
                        description: description || undefined,
                        targetAmount: targetAmountNum,
                        categoryId: selectedCategory!.id,
                        targetDate: targetDate ? targetDate.toISOString() : undefined,
                    }) as any,
                ).unwrap();
            }

            navigation.goBack();
        } catch (error) {
            // Error handled by Redux
        }
    };

    const handleDeletePress = () => {
        deleteModalRef.current?.open();
    };

    const handleDeleteConfirm = async () => {
        if (!goalId) return;

        try {
            await dispatch(deleteGoal(goalId) as any).unwrap();
            // Recarregar lista de metas
            await dispatch(fetchGoals() as any);
            // Fechar modal
            deleteModalRef.current?.close();
            // Navegar de volta
            navigation.goBack();
        } catch (error) {
            // Erro será tratado pelo Redux
            deleteModalRef.current?.close();
        }
    };

    const handleDeleteCancel = () => {
        deleteModalRef.current?.close();
    };

    const formatCurrency = (value: string): string => {
        // Remove tudo que não é dígito
        const numbers = value.replace(/\D/g, '');

        // Se estiver vazio, retorna vazio
        if (!numbers) return '';

        // Converte para número e divide por 100 para ter os centavos
        const amount = parseInt(numbers, 10) / 100;

        // Formata como moeda brasileira
        return amount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <View style={[styled.container, { backgroundColor: theme.background }]}>
            <StatusBar
                barStyle={theme.foreground === '#f8fafc' ? 'light-content' : 'dark-content'}
            />
            <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={handleBack} style={styled.headerButton}>
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
                <Text style={styled.headerTitle}>{isEditing ? 'Editar Meta' : 'Nova Meta'}</Text>
                {isEditing ? (
                    <TouchableOpacity onPress={handleDeletePress} style={styled.headerButton}>
                        <Feather name="trash-2" size={24} color={colors.error[500]} />
                    </TouchableOpacity>
                ) : (
                    <View style={styled.headerButton} />
                )}
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styled.scrollView}
                contentContainerStyle={styled.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styled.formSection}>
                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>Nome da Meta</Text>
                        <RNTextInput
                            style={[
                                styled.input,
                                name &&
                                    !getFieldError('name') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('name') && styled.inputError,
                            ]}
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                validateField('name', text);
                            }}
                            placeholder="Ex: Reserva de Emergência"
                            placeholderTextColor={theme.foregroundMuted}
                        />
                        {getFieldError('name') && (
                            <Text style={styled.errorText}>{getFieldError('name')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>Descrição (opcional)</Text>
                        <RNTextInput
                            style={[
                                styled.input,
                                description &&
                                    !getFieldError('description') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('description') && styled.inputError,
                            ]}
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                                validateField('description', text);
                            }}
                            placeholder="Descreva sua meta..."
                            placeholderTextColor={theme.foregroundMuted}
                            multiline
                            numberOfLines={3}
                        />
                        {getFieldError('description') && (
                            <Text style={styled.errorText}>{getFieldError('description')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>
                            Valor Alvo <Text style={styled.required}>*</Text>
                        </Text>
                        <View
                            style={[
                                styled.currencyInput,
                                targetAmount &&
                                    !getFieldError('targetAmount') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('targetAmount') && styled.inputError,
                            ]}
                        >
                            <Text style={styled.currencyText}>R$</Text>
                            <RNTextInput
                                style={styled.inputText}
                                value={targetAmount}
                                onChangeText={(text) => {
                                    const formatted = formatCurrency(text);
                                    setTargetAmount(formatted);
                                    validateField('targetAmount', formatted);
                                }}
                                placeholder="0,00"
                                placeholderTextColor={theme.foregroundMuted}
                                keyboardType="numeric"
                            />
                        </View>
                        {getFieldError('targetAmount') && (
                            <Text style={styled.errorText}>{getFieldError('targetAmount')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>
                            Categoria <Text style={styled.required}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styled.formRow,
                                styled.selectField,
                                selectedCategory &&
                                    !getFieldError('categoryId') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('categoryId') && styled.inputError,
                            ]}
                            onPress={() => categoryModalRef.current?.open()}
                        >
                            <View style={styled.formRowLeft}>
                                {selectedCategory ? (
                                    <>
                                        <View
                                            style={[
                                                styled.iconCircle,
                                                { backgroundColor: selectedCategory.color + '20' },
                                            ]}
                                        >
                                            {/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                                                selectedCategory.icon,
                                            ) ? (
                                                <Text style={styled.emojiIcon}>{selectedCategory.icon}</Text>
                                            ) : (
                                                <Feather
                                                    name={selectedCategory.icon as any}
                                                    size={20}
                                                    color={selectedCategory.color}
                                                />
                                            )}
                                        </View>
                                        <Text style={styled.formLabel}>{selectedCategory.name}</Text>
                                    </>
                                ) : (
                                    <>
                                        <View
                                            style={[
                                                styled.iconCircle,
                                                { backgroundColor: theme.border },
                                            ]}
                                        >
                                            <Feather name="tag" size={20} color={theme.foregroundMuted} />
                                        </View>
                                        <Text style={[styled.formLabel, { color: theme.foregroundMuted }]}>
                                            Selecione uma categoria
                                        </Text>
                                    </>
                                )}
                            </View>
                            <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                        </TouchableOpacity>
                        {getFieldError('categoryId') && (
                            <Text style={styled.errorText}>{getFieldError('categoryId')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>Data Alvo (opcional)</Text>
                        <TouchableOpacity
                            style={[styled.formRow, styled.selectField]}
                            onPress={() => dateModalRef.current?.open()}
                        >
                            <View style={styled.formRowLeft}>
                                <View
                                    style={[
                                        styled.iconCircle,
                                        { backgroundColor: accentColor + '20' },
                                    ]}
                                >
                                    <Feather name="calendar" size={20} color={accentColor} />
                                </View>
                                {targetDate ? (
                                    <Text style={styled.formLabel}>
                                        {targetDate.toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                ) : (
                                    <Text style={[styled.formLabel, { color: theme.foregroundMuted }]}>
                                        dd/mm/aaaa
                                    </Text>
                                )}
                            </View>
                            <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                        </TouchableOpacity>
                    </View>
                </View>

                {(createError || updateError) && (
                    <View style={styled.errorContainer}>
                        <Text style={styled.errorText}>{createError || updateError}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styled.saveButton, isLoading && styled.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styled.saveButtonText}>{isEditing ? 'Atualizar' : 'Salvar'}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <DatePicker
                modalizeRef={dateModalRef}
                selectedDate={targetDate}
                onSelect={setTargetDate}
                accentColor={accentColor}
            />

            <GoalCategoryPickerModal
                modalizeRef={categoryModalRef}
                selectedCategory={selectedCategory}
                onSelect={(category) => {
                    setSelectedCategory(category);
                    validateField('categoryId', category.id);
                }}
            />

            {isEditing && goalToEdit && (
                <DeleteGoalBottomSheet
                    modalizeRef={deleteModalRef}
                    goalName={goalToEdit.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    isLoading={deleteLoading}
                />
            )}
        </View>
    );
};

