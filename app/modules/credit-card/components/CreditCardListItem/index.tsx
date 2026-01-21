import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { SvgUri } from 'react-native-svg';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

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
