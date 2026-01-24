import React from 'react';
import { View, ScrollView } from 'react-native';
import { GoalItem } from '../GoalItem';
import { EmptyGoal } from '../EmptyGoal';
import type { GoalResponse } from '../../slices/goalsApi';
import { styles } from './styles';

export interface Goal {
    id: string;
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    category: {
        id: string;
        name: string;
        icon: string;
        color?: string;
    };
    targetDate?: string;
}

interface GoalsListProps {
    goals: GoalResponse[];
    onGoalPress?: (goal: GoalResponse) => void;
    onAddGoal?: () => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, onGoalPress, onAddGoal }) => {
    const styled = styles();
    const hasOnlyOneGoal = goals.length === 1;

    if (goals.length === 0) {
        return (
            <View style={styled.container}>
                <View style={styled.centeredContent}>
                    <EmptyGoal onAddGoal={onAddGoal} fullWidth />
                </View>
            </View>
        );
    }

    return (
        <View style={styled.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={[
                    styled.scrollContent,
                    hasOnlyOneGoal && styled.centeredContent,
                ]}
            >
                {goals.map((goal) => (
                    <GoalItem
                        key={goal.id}
                        goal={goal}
                        onPress={() => onGoalPress?.(goal)}
                    />
                ))}
                {goals.length > 0 && <EmptyGoal onAddGoal={onAddGoal} />}
            </ScrollView>
        </View>
    );
};

