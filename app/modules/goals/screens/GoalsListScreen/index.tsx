import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppSelector, useAppDispatch } from '@app/store';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { fetchGoals, type GoalResponse } from '../../slices/goalsApi';
import { GoalItem } from '../../components/GoalItem';
import { styles } from './styles';

export default function GoalsListScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const goals = useAppSelector((state) => state.goals.goals);
    const loading = useAppSelector((state) => state.goals.loading);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setInitialLoading(true);
            try {
                await dispatch(fetchGoals() as any);
            } catch (err) {
                // Handle error
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchGoals() as any).unwrap();
        } catch (err) {
            // Handle error
        } finally {
            setRefreshing(false);
        }
    };

    const handleAddGoal = () => {
        navigation.navigate('Goals', { screen: 'NewGoal' });
    };

    const handleGoalPress = (goal: GoalResponse) => {
        navigation.navigate('Goals', {
            screen: 'NewGoal',
            params: { goalId: goal.id },
        });
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.title}>Minhas metas</Text>
            <TouchableOpacity onPress={handleAddGoal} style={styled.addButton}>
                <Feather name="plus" size={24} color={theme.foreground} />
            </TouchableOpacity>
        </View>
    );

    const renderGoalItem = ({ item }: { item: GoalResponse }) => (
        <View style={styled.goalWrapper}>
            <GoalItem goal={item} onPress={() => handleGoalPress(item)} fullWidth />
        </View>
    );

    if (initialLoading) {
        return (
            <ScreenWithHeader customHeader={renderHeader()}>
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            </ScreenWithHeader>
        );
    }

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <FlatList
                data={goals}
                renderItem={renderGoalItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 20 }]}
                style={styled.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
                ListEmptyComponent={
                    <View style={styled.emptyContainer}>
                        <Feather name="target" size={48} color={theme.foregroundMuted} />
                        <Text style={styled.emptyText}>Nenhuma meta cadastrada</Text>
                        <Text style={styled.emptySubtext}>
                            Toque no botão + para adicionar uma nova meta
                        </Text>
                    </View>
                }
            />
        </ScreenWithHeader>
    );
}

