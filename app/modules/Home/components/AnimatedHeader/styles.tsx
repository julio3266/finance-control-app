import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        wrapper: {
            marginBottom: 0,
        },
        headerGradient: {
            paddingTop: 50,
            paddingBottom: 120,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        avatarButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        titleSection: {
            flex: 1,
            alignItems: 'center',
            marginHorizontal: 16,
        },
        title: {
            fontSize: 22,
            fontWeight: '800',
            letterSpacing: 1.5,
            color: '#ffffff',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 13,
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: 0.5,
        },
        themeButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        whiteCardContainer: {
            backgroundColor: theme.backgroundSecondary,
            marginTop: -90,
            marginHorizontal: 16,
            borderRadius: 24,
            paddingVertical: 20,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
        },
        financeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
        },
        financeItem: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        incomeCircle: {
            backgroundColor: colors.success[500],
        },
        expenseCircle: {
            backgroundColor: colors.error[500],
        },
        financeTextContainer: {
            flex: 1,
        },
        financeLabel: {
            fontSize: 12,
            fontWeight: '500',
            color: theme.foregroundMuted,
            marginBottom: 2,
        },
        financeValue: {
            fontSize: 16,
            fontWeight: '700',
        },
        incomeValue: {
            color: colors.success[600],
        },
        expenseValue: {
            color: colors.error[600],
        },
        graphContainer: {
            marginTop: 24,
            paddingTop: 16,
        },
        graph: {
            marginBottom: 8,
        },
        graphLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 4,
        },
        graphLabel: {
            fontSize: 10,
            fontWeight: '500',
            color: theme.foregroundMuted,
        },
    });
