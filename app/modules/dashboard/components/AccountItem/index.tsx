import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { SvgUri } from 'react-native-svg';
import { formatCurrency } from '@app/utils/formatCurrency';
import { styles } from './styles';

export interface UnifiedAccount {
    id: string;
    name: string;
    institution: string;
    institutionLogo?: string;
    balance: string;
    type: string;
    source: 'manual' | 'openFinance';
    connectionId?: string;
    color?: string;
}

interface AccountItemProps {
    account: UnifiedAccount;
    onPress?: () => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({ account, onPress }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const [logoError, setLogoError] = React.useState(false);

    const getPlaceholderColor = () => {
        if (account.color) {
            return account.color;
        }
        const colorsMap: Record<string, string> = {
            itaú: '#FF6B35',
            itau: '#FF6B35',
            carteira: '#A8E6CF',
        };
        const key = account.institution.toLowerCase();
        return colorsMap[key] || colors.primary[100];
    };

    const renderLogo = () => {
        if (logoError || !account.institutionLogo) {
            return (
                <View style={[styled.logoPlaceholder, { backgroundColor: getPlaceholderColor() }]}>
                    <Text style={styled.logoText}>
                        {account.institution.charAt(0).toUpperCase()}
                    </Text>
                </View>
            );
        }

        const isSvg = account.institutionLogo.toLowerCase().endsWith('.svg');

        if (isSvg) {
            return (
                <View style={styled.logoWrapper}>
                    <SvgUri
                        uri={account.institutionLogo}
                        width={40}
                        height={40}
                        onError={() => setLogoError(true)}
                    />
                </View>
            );
        }

        return (
            <Image
                source={{ uri: account.institutionLogo }}
                style={styled.logo}
                resizeMode="contain"
                onError={() => setLogoError(true)}
            />
        );
    };

    const content = (
        <View style={styled.container}>
            <View style={styled.logoContainer}>{renderLogo()}</View>
            <Text style={styled.name}>{account.name}</Text>
            <View style={styled.balanceContainer}>
                <Text style={styled.balanceLabel}>Saldo de</Text>
                <Text style={styled.balanceValue}>
                    {formatCurrency(parseFloat(account.balance))}
                </Text>
            </View>
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
