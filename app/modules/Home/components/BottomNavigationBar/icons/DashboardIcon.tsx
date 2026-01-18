import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DashboardIconProps {
    size?: number;
    color?: string;
    active?: boolean;
}

export const DashboardIcon: React.FC<DashboardIconProps> = ({
    size = 24,
    color,
    active = false,
}) => {
    const fillColor = color || (active ? '#7c3aed' : '#D4A574');
    const roofColor = active ? '#7c3aed' : '#8B6F47';
    const windowColor = '#FFFFFF';
    const baseColor = active ? '#7c3aed' : '#22c55e';

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M2 18h20v4H2v-4z" fill={baseColor} />
            <Path d="M4 14h16v4H4v-4z" fill={fillColor} />
            <Path d="M2 10l10-6 10 6v4H2v-4z" fill={roofColor} />
            <Path d="M6 12h4v4H6v-4z" fill={windowColor} />
            <Path d="M14 12h4v4h-4v-4z" fill={windowColor} />
        </Svg>
    );
};
