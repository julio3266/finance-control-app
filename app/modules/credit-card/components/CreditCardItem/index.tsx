import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import Feather from '@expo/vector-icons/Feather';
import { getBrandGradientColors } from '../../utils/brandColors';
import { styles } from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40 - 16;
const CARD_WIDTH_FULL = SCREEN_WIDTH - 60;

interface CreditCardItemProps {
    id: string;
    bankName: string;
    bankIcon?: React.ReactNode;
    bankIconBg?: string;
    brandIconUrl?: string | null;
    brandId?: string;
    cardNumber?: string;
    cardHolder?: string;
    currentBill: number;
    availableLimit: number;
    closingDate: string;
    status: 'open' | 'closed';
    onPress?: () => void;
    fullWidth?: boolean;
}

export const CreditCardItem: React.FC<CreditCardItemProps> = ({
    bankName,
    bankIcon,
    bankIconBg,
    brandIconUrl,
    brandId,
    cardNumber = '**** **** **** ****',
    cardHolder = 'AD SOYAD',
    currentBill,
    availableLimit,
    closingDate,
    status,
    onPress,
    fullWidth = false,
}) => {
    const theme = useTheme();
    const [logoError, setLogoError] = useState(false);

    const statusColor = status === 'open' ? colors.primary[400] : colors.neutral[400];
    const statusText = status === 'open' ? 'Aberta' : 'Fechada';

    const gradientColors: [string, string, string] = brandId
        ? getBrandGradientColors(brandId)
        : ['#1a1a2e', '#16213e', '#0f3460'];
    const cardWidth = fullWidth ? CARD_WIDTH_FULL : CARD_WIDTH;
    const styled = styles(theme, fullWidth);

    const isSvg =
        brandIconUrl?.toLowerCase().includes('.svg') ||
        brandIconUrl?.includes('/assets/credit-cards/');

    const renderBrandLogo = () => {
        if (brandIconUrl && !logoError) {
            if (isSvg) {
                return (
                    <SvgUri
                        uri={brandIconUrl}
                        width={50}
                        height={50}
                        onError={() => setLogoError(true)}
                    />
                );
            }
            return (
                <Image
                    source={{ uri: brandIconUrl }}
                    style={styled.brandLogoImage}
                    resizeMode="contain"
                    onError={() => setLogoError(true)}
                />
            );
        }

        if (bankIcon) {
            return bankIcon;
        }

        return (
            <View style={[styled.logoCircle, { backgroundColor: bankIconBg || '#ffffff' }]}>
                <Text style={styled.logoText}>
                    {bankName
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                </Text>
            </View>
        );
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styled.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styled.card, { width: cardWidth }]}
            >
                <View style={styled.decorativeLines}>
                    <View style={[styled.line, { top: 20, left: 50, width: 60 }]} />
                    <View style={[styled.line, { top: 40, left: 80, width: 40 }]} />
                    <View style={[styled.line, { top: 60, left: 120, width: 50 }]} />
                </View>

                <View style={styled.topSection}>
                    <View style={styled.chip}>
                        <View style={styled.chipLines}>
                            <View style={styled.chipLine} />
                            <View style={styled.chipLine} />
                            <View style={styled.chipLine} />
                        </View>
                    </View>
                    <View style={styled.logoContainer}>{renderBrandLogo()}</View>
                </View>

                <View style={styled.cardNumberContainer}>
                    <Text style={styled.cardNumber}>{cardNumber}</Text>
                </View>

                <View style={styled.financialInfo}>
                    <View style={styled.financialRow}>
                        <View style={styled.financialLabelContainer}>
                            <Text style={styled.financialLabel}>Fatura atual</Text>
                        </View>
                        <Text style={styled.financialValue}>{formatCurrency(currentBill)}</Text>
                    </View>
                    <View style={styled.financialRow}>
                        <View style={styled.financialLabelContainer}>
                            <Feather name="credit-card" size={12} color="rgba(255,255,255,0.7)" />
                            <Text style={styled.financialLabel}>Limite disponível</Text>
                        </View>
                        <Text style={styled.financialValue}>{formatCurrency(availableLimit)}</Text>
                    </View>
                </View>

                <View style={styled.footer}>
                    <View style={styled.footerLeft}>
                        <Text style={styled.footerLabel}>Card Holder</Text>
                        <Text style={styled.footerValue}>{cardHolder}</Text>
                    </View>
                    <View style={styled.footerRight}>
                        <View style={styled.footerRightTop}>
                            <Text style={styled.footerLabel}>Fecha em</Text>
                            <View style={styled.statusBadge}>
                                <View
                                    style={[styled.statusDot, { backgroundColor: statusColor }]}
                                />
                                <Text style={styled.statusText}>{statusText}</Text>
                            </View>
                        </View>
                        <Text style={styled.footerDate}>{closingDate}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};
