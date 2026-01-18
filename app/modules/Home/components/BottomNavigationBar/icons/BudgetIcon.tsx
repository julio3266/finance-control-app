import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BudgetIconProps {
    size?: number;
    color?: string;
    active?: boolean;
}

export const BudgetIcon: React.FC<BudgetIconProps> = ({ size = 24, color, active = false }) => {
    const flagColor = color || (active ? '#7c3aed' : '#ef4444');
    const poleColor = active ? '#7c3aed' : '#94a3b8';

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M11 2v20" stroke={poleColor} strokeWidth="2" strokeLinecap="round" />
            <Path d="M11 2l8 4-8 4V2z" fill={flagColor} />
        </Svg>
    );
};
