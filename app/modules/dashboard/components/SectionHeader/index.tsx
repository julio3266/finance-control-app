import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';

interface SectionHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    showSeeAll?: boolean;
    onAddPress?: () => void;
    showAddButton?: boolean;
    showIcon?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAllPress,
    showSeeAll = true,
    onAddPress,
    showAddButton = false,
    showIcon = false,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.container}>
            <View style={styled.leftContainer}>
                {showIcon && (
                    <Feather
                        name="credit-card"
                        size={20}
                        color={theme.foreground}
                        style={styled.icon}
                    />
                )}
                <Text style={styled.title}>{title}</Text>
            </View>
            <View style={styled.rightContainer}>
                {showAddButton && onAddPress && (
                    <TouchableOpacity
                        onPress={onAddPress}
                        activeOpacity={0.7}
                        style={styled.addButton}
                    >
                        <Feather name="plus" size={24} color={colors.success[500]} />
                    </TouchableOpacity>
                )}
                {showSeeAll && (
                    <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
                        <View style={styled.seeAllContainer}>
                            <Text style={styled.seeAllText}>Ver todos</Text>
                            <Feather name="chevron-right" size={16} color={theme.foregroundMuted} />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            marginTop: 8,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            marginRight: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        seeAllContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        seeAllText: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        rightContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        addButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
