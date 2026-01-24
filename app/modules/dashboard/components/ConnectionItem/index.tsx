import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import type { BankConnection } from '@app/modules/open-finance/slices/openFinanceApi';
import { SvgCssUri } from 'react-native-svg/css';

interface ConnectionItemProps {
    connection: BankConnection;
    onPress?: () => void;
}

export const ConnectionItem: React.FC<ConnectionItemProps> = ({ connection, onPress }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const [logoError, setLogoError] = React.useState(false);
    const [imageLoadError, setImageLoadError] = React.useState(false);
    const accountsCount = connection._count?.bankAccounts || connection.bankAccounts?.length || 0;

    const renderLogo = () => {
        if (logoError || imageLoadError || !connection.connectorLogo) {
            return (
                <View style={styled.logoPlaceholder}>
                    <Text style={styled.logoText}>
                        {connection.connectorName.charAt(0).toUpperCase()}
                    </Text>
                </View>
            );
        }

        const isSvg = connection.connectorLogo.toLowerCase().endsWith('.svg');

        return (
            <View style={styled.logoWrapper}>
                <SvgCssUri uri={connection.connectorLogo} width={40} height={40} />
            </View>
        );
    };

    const content = (
        <View
            style={[
                styled.container,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder || theme.border },
            ]}
        >
            <View style={styled.logoContainer}>{renderLogo()}</View>
            <View style={styled.content}>
                <View style={styled.headerRow}>
                    <Text style={styled.name}>{connection.connectorName}</Text>
                </View>
                <View style={styled.infoRow}>
                    <View style={styled.infoItem}>
                        <Feather name="credit-card" size={14} color={theme.foregroundMuted} />
                        <Text style={styled.infoText}>
                            {accountsCount} {accountsCount === 1 ? 'conta' : 'contas'}
                        </Text>
                    </View>
                </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
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
        logoContainer: {
            marginRight: 12,
        },
        logoWrapper: {
            width: 40,
            height: 40,
            borderRadius: 20,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'transparent',
        },
        logoPlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoText: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.primary[600],
        },
        content: {
            flex: 1,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            minHeight: 24,
            alignContent: 'center',
        },
        name: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
            marginRight: 8,
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexShrink: 0,
            alignSelf: 'center',
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 4,
            alignSelf: 'center',
        },
        statusText: {
            fontSize: 10,
            fontWeight: '600',
            lineHeight: 14,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        infoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        infoText: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
    });
