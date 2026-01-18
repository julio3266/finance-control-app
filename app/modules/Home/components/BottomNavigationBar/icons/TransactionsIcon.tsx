import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface TransactionsIconProps {
    size?: number;
    color?: string;
    active?: boolean;
}

export const TransactionsIcon: React.FC<TransactionsIconProps> = ({
    size = 24,
    color,
    active = false,
}) => {
    const clipboardColor = color || (active ? '#7c3aed' : '#D4A574');
    const paperColor = '#FFFFFF';

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M9 2h6v4h4v16H5V6h4V2z" fill={clipboardColor} />
            <Path d="M9 2v4h6V2h-6z" fill={clipboardColor} opacity={0.8} />
            <Rect x="7" y="8" width="10" height="12" rx="1" fill={paperColor} />
            <Rect x="9" y="11" width="6" height="1" fill={clipboardColor} opacity={0.3} />
            <Rect x="9" y="14" width="4" height="1" fill={clipboardColor} opacity={0.3} />
        </Svg>
    );
};
