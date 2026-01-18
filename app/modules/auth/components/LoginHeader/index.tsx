import { Animated, View } from 'react-native';
import { styles } from './styles';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import Logo from '@app/assets/images/logo.svg';

export interface LoginHeaderProps {
    slideAnim: Animated.Value;
    fadeAnim: Animated.Value;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ slideAnim, fadeAnim }) => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const screenStyles = styles(theme, themeMode);

    return (
        <Animated.View
            style={[
                screenStyles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={screenStyles.animatedContent}>
                <Animated.View
                    style={[
                        screenStyles.logoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Logo width={60} height={60} />
                    <View style={screenStyles.titleContainer}>
                        <Animated.Text
                            style={[
                                screenStyles.titleFinance,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            Finance
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                screenStyles.titleControl,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            Control
                        </Animated.Text>
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={screenStyles.subtitleContainer}>
                        <Animated.Text style={screenStyles.subtitleText}>
                            Controle suas{' '}
                        </Animated.Text>
                        <Animated.Text style={screenStyles.subtitlePurple}>finanças</Animated.Text>
                    </View>
                    <View style={screenStyles.subtitleContainer}>
                        <Animated.Text style={screenStyles.subtitleText}>e </Animated.Text>
                        <Animated.Text style={screenStyles.subtitlePurple}>
                            investimentos
                        </Animated.Text>
                    </View>
                </Animated.View>
            </View>
        </Animated.View>
    );
};
