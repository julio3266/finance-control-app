import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '@app/utils/formatCurrency';
import Feather from '@expo/vector-icons/Feather';
import type { GoalResponse } from '../../slices/goalsApi';
import { styles } from './styles';

interface GoalItemProps {
    goal: GoalResponse;
    onPress?: () => void;
    fullWidth?: boolean;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onPress, fullWidth = false }) => {
    const styled = styles(fullWidth);

    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const progressPercentage = Math.min(progress, 100);

    // Gradiente escuro azul/roxo similar ao tema da imagem
    const gradientColors: [string, string, string] = [
        '#1a1a2e', // Azul muito escuro
        '#16213e', // Azul escuro
        '#0f3460', // Azul médio escuro
    ];

    const content = (
        <View style={styled.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styled.card}
            >
                <View style={styled.header}>
                    <View style={styled.categoryIcon}>
                        {/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            goal.category.icon || '',
                        ) ? (
                            <Text style={styled.emojiIcon}>{goal.category.icon}</Text>
                        ) : (
                            <Feather
                                name={(goal.category.icon || 'target') as any}
                                size={24}
                                color="rgba(255, 255, 255, 0.9)"
                            />
                        )}
                    </View>
                    <View style={styled.headerText}>
                        <Text style={styled.goalName} numberOfLines={1}>
                            {goal.name}
                        </Text>
                        {goal.description && (
                            <Text style={styled.goalDescription} numberOfLines={1}>
                                {goal.description}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styled.progressSection}>
                    <View style={styled.progressBarContainer}>
                        <View style={styled.progressBarBackground}>
                            <View
                                style={[
                                    styled.progressBarFill,
                                    { width: `${progressPercentage}%` },
                                ]}
                            />
                        </View>
                    </View>
                    <View style={styled.amountsRow}>
                        <View style={styled.amountContainer}>
                            <Text style={styled.amountLabel}>Atual</Text>
                            <Text style={styled.amountValue}>
                                {formatCurrency(goal.currentAmount)}
                            </Text>
                        </View>
                        <View style={styled.amountContainer}>
                            <Text style={styled.amountLabel}>Meta</Text>
                            <Text style={styled.amountValue}>
                                {formatCurrency(goal.targetAmount)}
                            </Text>
                        </View>
                    </View>
                </View>

                {goal.targetDate && (
                    <View style={styled.footer}>
                        <Feather name="calendar" size={14} color="rgba(255, 255, 255, 0.7)" />
                        <Text style={styled.dateText}>
                            {new Date(goal.targetDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

