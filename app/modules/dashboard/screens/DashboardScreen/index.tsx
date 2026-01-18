import React, { useMemo } from 'react';
import { Text, FlatList, View } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { useAppSelector } from '@app/store';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { formatCurrency } from '@app/utils/formatCurrency';
import { BalanceCard, SectionHeader, TransactionItem, HomeHeader } from '../../components';
import { styles } from './styles';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Transaction {
    id: string;
    description: string;
    date: string;
    amount: string;
    type: 'income' | 'expense';
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
}

export default function DashboardScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    const balance = useAppSelector((state) => state.finance.balance);
    const income = useAppSelector((state) => state.finance.income);
    const expenses = useAppSelector((state) => state.finance.expenses);

    const transactions: Transaction[] = useMemo(
        () => [
            {
                id: '1',
                description: 'Money Transfer',
                date: '12:35 PM',
                amount: '$450',
                type: 'expense' as const,
                icon: <Feather name="user" size={20} color="#ffffff" />,
                iconColor: '#ffffff',
                iconBg: '#3B82F6',
            },
            {
                id: '2',
                description: 'Paypal',
                date: '10:20 AM',
                amount: '$1200',
                type: 'income' as const,
                icon: <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>PP</Text>,
                iconColor: '#ffffff',
                iconBg: '#0070BA',
            },
            {
                id: '3',
                description: 'Uber',
                date: '08:40 AM',
                amount: '$150',
                type: 'expense' as const,
                icon: <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>U</Text>,
                iconColor: '#ffffff',
                iconBg: '#000000',
            },
            {
                id: '4',
                description: 'Bata Store',
                date: 'Yesterday',
                amount: '$200',
                type: 'expense' as const,
                icon: <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>B</Text>,
                iconColor: '#ffffff',
                iconBg: '#DC2626',
            },
            {
                id: '5',
                description: 'Bank Transfer',
                date: 'Yesterday',
                amount: '$600',
                type: 'expense' as const,
                icon: <FontAwesome5 name="university" size={16} color="#ffffff" />,
                iconColor: '#ffffff',
                iconBg: '#8B4513',
            },
        ],
        [],
    );

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <TransactionItem
            description={item.description}
            date={item.date}
            amount={item.amount}
            type={item.type}
            icon={item.icon}
            iconColor={item.iconColor}
            iconBg={item.iconBg}
        />
    );

    const ListHeaderComponent = () => (
        <View>
            <BalanceCard
                totalBalance={formatCurrency(balance)}
                income={formatCurrency(income)}
                expenses={formatCurrency(expenses)}
            />
            <SectionHeader title="Transactions" />
        </View>
    );

    return (
        <ScreenWithHeader customHeader={<HomeHeader />}>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={styled.content}
                style={styled.container}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWithHeader>
    );
}
