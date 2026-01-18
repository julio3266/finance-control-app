import { StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            position: 'relative',
            zIndex: 10,
        },
        inputWrapper: {
            position: 'relative',
        },
        loadingIndicator: {
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: [{ translateY: -10 }],
        },
        suggestionsContainer: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginTop: 4,
            maxHeight: 220,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            overflow: 'hidden',
        },
        suggestionsList: {
            flex: 1,
        },
        suggestionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
        },
        logoContainer: {
            width: 40,
            height: 40,
            borderRadius: 8,
            overflow: 'hidden',
            marginRight: 12,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: 32,
            height: 32,
        },
        logoPlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: colors.primary[600],
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoPlaceholderText: {
            fontSize: 18,
            fontWeight: '700',
            color: '#ffffff',
        },
        institutionInfo: {
            flex: 1,
        },
        institutionName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 2,
        },
        institutionType: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
    });
