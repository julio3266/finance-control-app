import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    TextInput,
    useColorScheme,
    Keyboard,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { config } from '@app/utils/config';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { searchInstitutions, fetchAllInstitutions, Institution } from '../../slices';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InstitutionPickerProps {
    value: Institution | null;
    onSelect: (institution: Institution) => void;
    placeholder?: string;
}

export const InstitutionPicker: React.FC<InstitutionPickerProps> = ({
    value,
    onSelect,
    placeholder = 'Selecione uma instituição',
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

    const [isVisible, setIsVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

    const { institutions, institutionsLoading } = useAppSelector((state) => state.onboarding);

    const openScreen = () => {
        Keyboard.dismiss();
        setSearchText('');
        setIsVisible(true);
        slideAnim.setValue(SCREEN_WIDTH);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
        dispatch(fetchAllInstitutions());
    };

    const closeScreen = useCallback(() => {
        Keyboard.dismiss();
        Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
        });
    }, [slideAnim]);

    const handleSearch = useCallback(
        (text: string) => {
            setSearchText(text);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (text.trim().length === 0) {
                dispatch(fetchAllInstitutions());
                return;
            }

            if (text.trim().length < 2) {
                return;
            }

            debounceRef.current = setTimeout(() => {
                dispatch(searchInstitutions(text));
            }, 300);
        },
        [dispatch],
    );

    const handleSelect = useCallback(
        (institution: Institution) => {
            onSelect(institution);
            closeScreen();
        },
        [onSelect, closeScreen],
    );

    useEffect(
        () => () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        },
        [],
    );

    const getLogoUri = (institution: Institution): string | null => {
        let logoPath: string | null = null;

        if (institution.logoVariants) {
            const variant = colorScheme === 'dark' ? 'dark' : 'light';
            logoPath = institution.logoVariants[variant];
        } else if (institution.localLogo) {
            logoPath = institution.localLogo;
        } else if (institution.logo) {
            return institution.logo;
        }

        if (logoPath && logoPath.startsWith('/')) {
            const baseUrl = config.apiUrl.endsWith('/')
                ? config.apiUrl.slice(0, -1)
                : config.apiUrl;
            return `${baseUrl}${logoPath}`;
        }

        return logoPath;
    };

    const LogoImage = ({ uri, name, id }: { uri: string | null; name: string; id: string }) => {
        const hasError = logoErrors[id];
        const isSvg = uri?.toLowerCase().includes('.svg') || uri?.includes('/serve/');

        if (!uri || hasError) {
            return (
                <View style={styled.logoPlaceholder}>
                    <Text style={styled.logoPlaceholderText}>{name.charAt(0).toUpperCase()}</Text>
                </View>
            );
        }

        if (isSvg) {
            return (
                <View style={styled.svgWrapper}>
                    <SvgCssUri
                        uri={uri}
                        width={32}
                        height={32}
                        onError={() => setLogoErrors((prev) => ({ ...prev, [id]: true }))}
                    />
                </View>
            );
        }

        return (
            <Image
                source={{ uri }}
                style={styled.logo}
                resizeMode="contain"
                onError={() => setLogoErrors((prev) => ({ ...prev, [id]: true }))}
            />
        );
    };

    const renderInstitutionItem = ({ item }: { item: Institution }) => {
        const logoUri = getLogoUri(item);

        return (
            <TouchableOpacity
                style={styled.institutionItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
            >
                <View style={styled.logoContainer}>
                    <LogoImage uri={logoUri} name={item.name} id={item.id} />
                </View>
                <View style={styled.institutionInfo}>
                    <Text style={styled.institutionName}>{item.name}</Text>
                    <Text style={styled.institutionType}>
                        {item.type === 'digital_bank'
                            ? 'Banco Digital'
                            : item.type === 'traditional_bank'
                                ? 'Banco Tradicional'
                                : item.type === 'credit_union'
                                    ? 'Cooperativa'
                                    : item.type === 'brokerage'
                                        ? 'Corretora'
                                        : 'Instituição Financeira'}
                    </Text>
                </View>
                <Feather
                    name="check"
                    size={20}
                    color={colors.primary[500]}
                    style={{ opacity: 0 }}
                />
            </TouchableOpacity>
        );
    };

    const selectedLogoUri = value ? getLogoUri(value) : null;

    return (
        <>
            <TouchableOpacity style={styled.selector} onPress={openScreen} activeOpacity={0.7}>
                {value ? (
                    <View style={styled.selectedValue}>
                        <View style={styled.selectedLogoContainer}>
                            <LogoImage uri={selectedLogoUri} name={value.name} id={value.id} />
                        </View>
                        <Text style={styled.selectedText} numberOfLines={1}>
                            {value.name}
                        </Text>
                    </View>
                ) : (
                    <Text style={styled.placeholderText}>{placeholder}</Text>
                )}
                <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent
                animationType="none"
                onRequestClose={closeScreen}
                statusBarTranslucent
            >
                <View style={styled.modalOverlay}>
                    <Animated.View
                        style={[
                            styled.screenContainer,
                            {
                                backgroundColor: theme.background,
                                transform: [{ translateX: slideAnim }],
                            },
                        ]}
                    >
                        <View style={[styled.screenHeader, { paddingTop: insets.top + 8 }]}>
                            <TouchableOpacity
                                style={styled.backButton}
                                onPress={closeScreen}
                                activeOpacity={0.7}
                            >
                                <Feather name="arrow-left" size={24} color={theme.foreground} />
                            </TouchableOpacity>
                            <Text style={styled.screenTitle}>Selecionar Instituição</Text>
                            <View style={styled.backButton} />
                        </View>

                        <View style={styled.searchWrapper}>
                            <View style={styled.searchContainer}>
                                <Feather
                                    name="search"
                                    size={20}
                                    color={theme.foregroundMuted}
                                    style={styled.searchIcon}
                                />
                                <TextInput
                                    style={styled.searchInput}
                                    placeholder="Buscar instituição..."
                                    placeholderTextColor={theme.foregroundMuted}
                                    value={searchText}
                                    onChangeText={handleSearch}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {institutionsLoading && (
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.primary[500]}
                                        style={styled.searchLoading}
                                    />
                                )}
                                {searchText.length > 0 && !institutionsLoading && (
                                    <TouchableOpacity
                                        onPress={() => handleSearch('')}
                                        style={styled.clearButton}
                                    >
                                        <Feather name="x" size={18} color={theme.foregroundMuted} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <FlatList
                            data={institutions}
                            renderItem={renderInstitutionItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: insets.bottom + 16,
                                flexGrow: 1,
                            }}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View style={styled.emptyContainer}>
                                    {institutionsLoading ? (
                                        <>
                                            <ActivityIndicator
                                                size="large"
                                                color={colors.primary[500]}
                                            />
                                            <Text style={styled.emptyText}>
                                                Carregando instituições...
                                            </Text>
                                        </>
                                    ) : searchText.length >= 2 ? (
                                        <>
                                            <View style={styled.emptyIconContainer}>
                                                <Feather
                                                    name="search"
                                                    size={32}
                                                    color={theme.foregroundMuted}
                                                />
                                            </View>
                                            <Text style={styled.emptyText}>
                                                Nenhuma instituição encontrada
                                            </Text>
                                            <Text style={styled.emptySubtext}>
                                                Tente buscar por outro nome
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <View style={styled.emptyIconContainer}>
                                                <Feather
                                                    name="alert-circle"
                                                    size={32}
                                                    color={theme.foregroundMuted}
                                                />
                                            </View>
                                            <Text style={styled.emptyText}>
                                                Nenhuma instituição disponível
                                            </Text>
                                            <Text style={styled.emptySubtext}>
                                                Tente novamente mais tarde
                                            </Text>
                                        </>
                                    )}
                                </View>
                            }
                        />
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
};

export default InstitutionPicker;
