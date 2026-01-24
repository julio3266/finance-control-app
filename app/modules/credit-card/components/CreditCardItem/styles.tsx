import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (_theme: ReturnType<typeof useTheme>, fullWidth?: boolean) =>
    StyleSheet.create({
        container: {
            marginRight: fullWidth ? 0 : 16,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: fullWidth ? 'center' : 'flex-start',
        },
        card: {
            height: 220,
            padding: 24,
            borderRadius: 20,
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
        },
        decorativeLines: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        line: {
            position: 'absolute',
            height: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
        },
        topSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
        },
        chip: {
            width: 40,
            height: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        chipLines: {
            width: 30,
            height: 20,
            justifyContent: 'space-between',
        },
        chipLine: {
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 1,
        },
        logoContainer: {
            alignItems: 'flex-end',
        },
        logoCircle: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#000000',
        },
        brandLogoImage: {
            width: 50,
            height: 50,
        },
        cardNumberContainer: {
            marginBottom: 20,
        },
        cardNumber: {
            fontSize: 20,
            fontWeight: '600',
            color: '#ffffff',
            letterSpacing: 2,
            fontFamily: 'monospace',
        },
        financialInfo: {
            marginBottom: 16,
        },
        financialRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        financialLabelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        financialLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500',
        },
        financialValue: {
            fontSize: 16,
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'right',
            minWidth: 100,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        footerLeft: {
            flex: 1,
        },
        footerRight: {
            alignItems: 'flex-end',
        },
        footerRightTop: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        footerLabel: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: 4,
        },
        footerValue: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
            textTransform: 'uppercase',
        },
        footerDate: {
            fontSize: 12,
            fontWeight: '600',
            color: '#ffffff',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
        },
        statusText: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500',
        },
    });
