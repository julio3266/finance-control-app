import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { SvgUri } from 'react-native-svg';
import Feather from '@expo/vector-icons/Feather';

interface CreditCardListItemProps {
    id: string;
    bankName: string;
    brandIconUrl?: string | null;
    brandId?: string;
    currentBill: number;
    availableLimit: number;
    closingDate: string;
    status: 'open' | 'closed';
    onPress?: () => void;
}

export const CreditCardListItem: React.FC<CreditCardListItemProps> = ({
    bankName,
    brandIconUrl,
    brandId,
    currentBill,
    availableLimit,
    closingDate,
    status,
    onPress,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const [logoError, setLogoError] = useState(false);

    const statusColor = status === 'open' ? colors.success[500] : colors.neutral[400];
    const statusText = status === 'open' ? 'Aberta' : 'Fechada';

    const isSvg =
        brandIconUrl?.toLowerCase().includes('.svg') ||
        brandIconUrl?.includes('/assets/credit-cards/');

    const renderBrandLogo = () => {
        if (brandIconUrl && !logoError) {
            if (isSvg) {
                return (
                    <View style={styled.brandLogoContainer}>
                        <SvgUri
                            uri={brandIconUrl}
                            width={32}
                            height={32}
                            onError={() => setLogoError(true)}
                        />
                    </View>
                );
            }
            return (
                <View style={styled.brandLogoContainer}>
                    <Text style={styled.brandLogoText}>Logo</Text>
                </View>
            );
        }

        return (
            <View style={[styled.iconContainer, { backgroundColor: colors.primary[100] }]}>
                <Feather name="credit-card" size={20} color={colors.primary[600]} />
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={[
                styled.container,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder || theme.border },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {renderBrandLogo()}
            <View style={styled.content}>
                <Text style={styled.bankName}>{bankName}</Text>
                <View style={styled.infoRow}>
                    <Text style={styled.infoLabel}>Fatura atual: </Text>
                    <Text style={styled.infoValue}>{formatCurrency(currentBill)}</Text>
                </View>
                <View style={styled.infoRow}>
                    <Text style={styled.infoLabel}>Limite disponível: </Text>
                    <Text style={styled.infoValue}>{formatCurrency(availableLimit)}</Text>
                </View>
            </View>
            <View style={styled.rightSection}>
                <View style={[styled.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <View style={[styled.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styled.statusText, { color: statusColor }]}>{statusText}</Text>
                </View>
                <Text style={styled.closingDate}>Fecha em {closingDate}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            marginBottom: 8,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        brandLogoContainer: {
            width: 40,
            height: 40,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brandLogoText: {
            fontSize: 10,
            color: theme.foregroundMuted,
        },
        content: {
            flex: 1,
        },
        bankName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 6,
        },
        infoRow: {
            flexDirection: 'row',
            marginBottom: 4,
        },
        infoLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        infoValue: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.foreground,
        },
        rightSection: {
            alignItems: 'flex-end',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 4,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 4,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '600',
        },
        closingDate: {
            fontSize: 11,
            color: theme.foregroundMuted,
        },
    });
