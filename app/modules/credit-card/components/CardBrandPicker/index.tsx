import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchCardBrands } from '../../slices/creditCardApi';
import { styles } from './styles';

export interface CardBrand {
    id: string;
    name: string;
    iconUrl?: string;
    color?: string;
}

interface CardBrandPickerModalProps {
    modalizeRef: React.RefObject<IHandles>;
    selectedBrand?: CardBrand | null;
    onSelect: (brand: CardBrand) => void;
}

export const CardBrandPickerModal: React.FC<CardBrandPickerModalProps> = ({
    selectedBrand,
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

    const brandsResponse = useAppSelector((state) => state.creditCard.brands);
    const brandsLoading = useAppSelector((state) => state.creditCard.brandsLoading);

    useEffect(() => {
        dispatch(fetchCardBrands() as any);
    }, [dispatch]);

    const brands: CardBrand[] = brandsResponse.map((brand) => ({
        id: brand.id,
        name: brand.name,
        iconUrl: brand.iconUrl || undefined,
    }));

    const BrandLogo = ({ uri, id }: { uri: string | null | undefined; id: string }) => {
        const hasError = logoErrors[id];
        const isSvg = uri?.toLowerCase().includes('.svg') || uri?.includes('/assets/credit-cards/');

        if (!uri || hasError) {
            return (
                <View style={[styled.brandIcon, { backgroundColor: colors.primary[600] + '20' }]}>
                    <Feather name="credit-card" size={20} color={colors.primary[600]} />
                </View>
            );
        }

        if (isSvg) {
            return (
                <View style={styled.brandIconImageContainer}>
                    <SvgUri
                        uri={uri}
                        width={40}
                        height={40}
                        onError={() => setLogoErrors((prev) => ({ ...prev, [id]: true }))}
                    />
                </View>
            );
        }

        return (
            <View style={styled.brandIconImageContainer}>
                <Image
                    source={{ uri }}
                    style={styled.brandIconImage}
                    resizeMode="contain"
                    onError={() => setLogoErrors((prev) => ({ ...prev, [id]: true }))}
                />
            </View>
        );
    };

    const handleSelect = (brand: CardBrand) => {
        onSelect(brand);
        modalizeRef.current?.close();
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight
        >
            <View style={[styled.content, { paddingBottom: insets.bottom }]}>
                <Text style={styled.title}>Bandeira do Cartão</Text>

                {/* Brands List */}
                <ScrollView style={styled.listContainer} showsVerticalScrollIndicator={false}>
                    {brandsLoading ? (
                        <View style={styled.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary[600]} />
                        </View>
                    ) : (
                        brands.map((brand) => {
                            const isSelected = selectedBrand?.id === brand.id;
                            return (
                                <TouchableOpacity
                                    key={brand.id}
                                    style={styled.brandItem}
                                    onPress={() => handleSelect(brand)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styled.brandInfo}>
                                        <BrandLogo uri={brand.iconUrl} id={brand.id} />
                                        <Text style={styled.brandName}>{brand.name}</Text>
                                    </View>
                                    {isSelected ? (
                                        <Feather
                                            name="check"
                                            size={20}
                                            color={colors.primary[600]}
                                        />
                                    ) : (
                                        <View style={styled.radioButton} />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </Modalize>
    );
};
