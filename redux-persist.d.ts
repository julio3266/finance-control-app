declare module 'redux-persist' {
    import { Reducer, Action, Store } from 'redux';
    import { Storage } from 'redux-persist';

    export interface PersistConfig {
        key: string;
        storage: Storage;
        whitelist?: string[];
        blacklist?: string[];
    }

    export function persistReducer<S, A extends Action>(
        config: PersistConfig,
        baseReducer: Reducer<S, A>,
    ): Reducer<S, A> & { _persist?: { version: number; rehydrated: boolean } };

    export function persistStore(store: Store): Persistor;

    export interface Persistor {
        purge: () => Promise<void>;
        flush: () => Promise<void>;
        pause: () => void;
        persist: () => void;
    }

    export const FLUSH: string;
    export const REHYDRATE: string;
    export const PAUSE: string;
    export const PERSIST: string;
    export const PURGE: string;
    export const REGISTER: string;
}

declare module 'redux-persist/integration/react' {
    import * as React from 'react';

    export interface Persistor {
        purge: () => Promise<void>;
        flush: () => Promise<void>;
        pause: () => void;
        persist: () => void;
    }

    export interface PersistGateProps {
        persistor: Persistor;
        loading?: React.ReactNode | null;
        children?: React.ReactNode | null;
    }

    export const PersistGate: React.ComponentType<PersistGateProps>;
    export default PersistGate;
}

export {};
