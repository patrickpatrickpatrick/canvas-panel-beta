import React, { ReactNode } from 'react';
export declare type MapChildrenType<T> = ReactNode | ((props: T) => ReactNode);
export declare type RenderComponent<R = {}, T = {}> = React.FC<T & {
    children: MapChildrenType<R>;
}>;
export default function functionOrMapChildren<T>(children: MapChildrenType<T>, withProps: T): any;
