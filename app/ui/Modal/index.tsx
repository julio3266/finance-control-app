import React from 'react';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

export interface ModalProps {
    modalizeRef: React.RefObject<IHandles | null>;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ modalizeRef, children }) => {
    const theme = useTheme();
    const modalStyles = styles(theme);

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={modalStyles.modal}
            handleStyle={modalStyles.handle}
            overlayStyle={modalStyles.overlay}
            adjustToContentHeight
        >
            {children}
        </Modalize>
    );
};
