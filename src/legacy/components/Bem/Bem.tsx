// @ts-ignore
import BEM from '@fesk/bem-js';
import React, { useMemo } from 'react';
import { createContext } from '../../../utility/create-context';

const defaultContext = {
  prefix: '',
  cssClassMap: {},
};

export type BemBlockType = {
  element(name: string): BemElementType & string;
  modifier(name: string): BemBlockType & string;
  modifiers(mods: { [key: string]: boolean }): BemBlockType & string;
};

export type BemElementType = {
  modifier(name: string): BemElementType & string;
};

export type BemType = {
  block(name: string): BemBlockType & string;
};

type Context = {
  prefix: string;
  cssClassMap: { [key: string]: string };
};

const [useBem, BemContextProvider] = createContext<Context>(defaultContext);

export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

export type Subtract<T extends T1, T1 extends object> = Pick<
  T,
  SetComplement<keyof T, keyof T1>
>;

type WithBemProps = { bem: BemBlockType & string };

export const withBemClass = (className: string) => <P extends WithBemProps>(
  Component: React.ComponentType<P>
) => {
  const WithBemClass: React.FC<Subtract<P, WithBemProps>> = props => {
    const bem = useBemClassName(className);
    return <Component {...(props as P)} bem={bem} />;
  };

  return WithBemClass;
};

const Bem: React.FC<Partial<Context>> = ({
  children,
  prefix = '',
  cssClassMap = {},
}) => {
  return (
    <BemContextProvider
      value={useMemo(
        () => ({
          prefix,
          cssClassMap,
        }),
        [prefix, cssClassMap]
      )}
    >
      {children}
    </BemContextProvider>
  );
};

export function useBemClassName(className: string) {
  const bemCtx = useBem();

  return useMemo(
    () =>
      constructBemFromContext(
        className,
        Object.assign({}, defaultContext, bemCtx)
      ),
    [bemCtx, className]
  );
}

function constructBemFromContext(
  className: string,
  ctx: Context
): BemBlockType & string {
  if (ctx.cssClassMap[className]) {
    return BEM.block(`${ctx.prefix}${ctx.cssClassMap[className]}`);
  }
  return BEM.block(`${ctx.prefix}${className}`);
}

export default Bem;
