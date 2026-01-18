import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import Feather from '@expo/vector-icons/Feather';

interface SectionHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    showSeeAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAllPress,
    showSeeAll = true,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.container}>
            <Text style={styled.title}>{title}</Text>
            {showSeeAll && (
                <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
                    <View style={styled.seeAllContainer}>
                        <Text style={styled.seeAllText}>Ver todas</Text>
                        <Feather name="chevron-right" size={16} color={theme.foregroundMuted} />
                    </View>
                </TouchableOpacity>
            )}
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
    });
