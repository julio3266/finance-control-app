import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        headerButtonLeft: {
            width: 40,
        },
        headerButtonRight: {
            width: 40,
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        title: {
            flex: 1,
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        newInvestmentButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary[600],
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            gap: 8,
        },
        newInvestmentButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        content: {
            padding: 20,
        },
        chartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        chartLegend: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 24,
            gap: 16,
        },
        chartLegendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        chartLegendDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        chartLegendText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            fontWeight: '500',
        },
        cardsRow: {
            flexDirection: 'column',
            gap: 12,
            marginBottom: 20,
        },
        cardHalf: {
            width: '100%',
        },
        filtersContainer: {
            flexDirection: 'row',
            gap: 8,
            marginBottom: 20,
        },
        filterButton: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            alignItems: 'center',
        },
        filterButtonActive: {
            backgroundColor: colors.primary[600],
            borderColor: colors.primary[600],
        },
        filterButtonText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foregroundMuted,
        },
        filterButtonTextActive: {
            color: '#ffffff',
        },
    });
