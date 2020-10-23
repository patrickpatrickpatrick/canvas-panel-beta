import React from 'react';
export declare type BemBlockType = {
    element(name: string): BemElementType & string;
    modifier(name: string): BemBlockType & string;
    modifiers(mods: {
        [key: string]: boolean;
    }): BemBlockType & string;
};
export declare type BemElementType = {
    modifier(name: string): BemElementType & string;
};
export declare type BemType = {
    block(name: string): BemBlockType & string;
};
declare type Context = {
    prefix: string;
    cssClassMap: {
        [key: string]: string;
    };
};
export declare type SetDifference<A, B> = A extends B ? never : A;
export declare type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export declare type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
declare type WithBemProps = {
    bem: BemBlockType & string;
};
export declare const withBemClass: (className: string) => <P extends WithBemProps>(Component: React.ComponentType<P>) => React.FC<Pick<P, SetDifference<keyof P, "bem">>>;
declare const Bem: React.FC<Partial<Context>>;
export declare function useBemClassName(className: string): BemBlockType & string;
export default Bem;
