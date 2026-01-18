declare module 'redux-persist/integration/react' {
    import { ReactNode } from 'react';
    import { Persistor } from 'redux-persist';

    export interface PersistGateProps {
        persistor: Persistor;
        loading?: ReactNode | null;
        children?: ReactNode | null;
    }

    export const PersistGate: React.FC<PersistGateProps>;
}

