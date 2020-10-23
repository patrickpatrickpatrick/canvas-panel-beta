import * as React from 'react';
export declare function createContext<A>(defaultValue?: A): readonly [() => A, React.Provider<A | undefined>];
