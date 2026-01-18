import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    useColorScheme,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { config } from '@app/utils/config';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { TextInput } from '@app/ui/TextInput';
import {
    searchInstitutions,
    clearInstitutions,
    selectInstitution,
    Institution,
} from '../../slices';
import { styles } from './styles';

interface InstitutionAutocompleteProps {
    value: string;
    onChangeText: (text: string) => void;
    onSelectInstitution: (institution: Institution) => void;
    placeholder?: string;
}

export const InstitutionAutocomplete: React.FC<InstitutionAutocompleteProps> = ({
    value,
    onChangeText,
    onSelectInstitution,
    placeholder = 'Digite para buscar...',
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const { institutions, institutionsLoading, selectedInstitution } = useAppSelector(
        (state) => state.onboarding,
    );

    const handleSearch = useCallback(
        (text: string) => {
            onChangeText(text);

            if (selectedInstitution) {
                dispatch(selectInstitution(null));
            }

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (text.trim().length < 2) {
                dispatch(clearInstitutions());
                return;
            }

            debounceRef.current = setTimeout(() => {
                dispatch(searchInstitutions(text));
            }, 300);
        },
        [dispatch, onChangeText, selectedInstitution],
    );

    const handleSelect = useCallback(
        (institution: Institution) => {
            dispatch(selectInstitution(institution));
            onChangeText(institution.name);
            onSelectInstitution(institution);
        },
        [dispatch, onChangeText, onSelectInstitution],
    );

    useEffect(
        () => () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            dispatch(clearInstitutions());
        },
        [dispatch],
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

    const LogoImage = ({ uri, name }: { uri: string | null; name: string }) => {
        const [hasError, setHasError] = useState(false);
        const isSvg = uri?.toLowerCase().includes('.svg') || uri?.includes('/serve/');

        if (!uri || hasError) {
            return (
                <View style={styled.logoPlaceholder}>
                    <Text style={styled.logoPlaceholderText}>{name.charAt(0).toUpperCase()}</Text>
                </View>
            );
        }

        if (isSvg) {
            return <SvgUri uri={uri} width={32} height={32} onError={() => setHasError(true)} />;
        }

        return (
            <Image
                source={{ uri }}
                style={styled.logo}
                resizeMode="contain"
                onError={() => setHasError(true)}
            />
        );
    };

    const renderInstitutionItem = (item: Institution) => {
        const logoUri = getLogoUri(item);

        return (
            <TouchableOpacity
                key={item.id}
                style={styled.suggestionItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
            >
                <View style={styled.logoContainer}>
                    <LogoImage uri={logoUri} name={item.name} />
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
            </TouchableOpacity>
        );
    };

    const showSuggestions = institutions.length > 0 && !selectedInstitution;

    return (
        <View style={styled.container}>
            <View style={styled.inputWrapper}>
                <TextInput placeholder={placeholder} value={value} onChangeText={handleSearch} />
                {institutionsLoading && (
                    <View style={styled.loadingIndicator}>
                        <ActivityIndicator size="small" color={colors.primary[500]} />
                    </View>
                )}
            </View>

            {showSuggestions && (
                <View style={styled.suggestionsContainer}>
                    <ScrollView
                        key={institutions.length.toString()}
                        style={styled.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                    >
                        {institutions.map(renderInstitutionItem)}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default InstitutionAutocomplete;
