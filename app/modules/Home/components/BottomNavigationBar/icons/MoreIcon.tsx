import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface MoreIconProps {
    size?: number;
    color?: string;
    active?: boolean;
}

export const MoreIcon: React.FC<MoreIconProps> = ({ size = 24, color, active = false }) => {
    const dotColor = color || (active ? '#7c3aed' : '#64748b');

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Três pontos horizontais */}
            <Circle cx="6" cy="12" r="2" fill={dotColor} />
            <Circle cx="12" cy="12" r="2" fill={dotColor} />
            <Circle cx="18" cy="12" r="2" fill={dotColor} />
        </Svg>
    );
};
