import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import Feather from '@expo/vector-icons/Feather';
import { getBrandGradientColors } from '../../utils/brandColors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40 - 16;
// Para fullWidth: considera padding do content (20 de cada lado = 40) + padding do billSummary (10 de cada lado = 20)
// Total: SCREEN_WIDTH - 40 (content) - 20 (billSummary) = SCREEN_WIDTH - 60
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
                {/* Decorative lines pattern */}
                <View style={styled.decorativeLines}>
                    <View style={[styled.line, { top: 20, left: 50, width: 60 }]} />
                    <View style={[styled.line, { top: 40, left: 80, width: 40 }]} />
                    <View style={[styled.line, { top: 60, left: 120, width: 50 }]} />
                </View>

                {/* Header with chip and logo */}
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

                {/* Card Number */}
                <View style={styled.cardNumberContainer}>
                    <Text style={styled.cardNumber}>{cardNumber}</Text>
                </View>

                {/* Financial Info Section */}
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

                {/* Footer with cardholder, date and status */}
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

const styles = (_theme: ReturnType<typeof useTheme>, fullWidth?: boolean) =>
    StyleSheet.create({
        container: {
            marginRight: fullWidth ? 0 : 16,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'flex-start',
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
            flex: 1,
            minWidth: 0,
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
            marginLeft: 12,
            flexShrink: 0,
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
