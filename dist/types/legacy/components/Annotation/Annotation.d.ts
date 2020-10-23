import React, { CSSProperties } from 'react';
import { BemBlockType } from '../Bem/Bem';
import { Annotation as ManifestoAnnotation } from 'manifesto.js';
declare type Vector = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};
declare type Props = Vector & {
    annotation: ManifestoAnnotation;
    style?: CSSProperties;
    growthStyle?: 'fixed' | 'scaled' | 'absolute';
    annotationContent?: (annotation: ManifestoAnnotation, bem: BemBlockType) => any;
    bemModifiers?: (annotation: ManifestoAnnotation, props: Props) => {
        [key: string]: boolean;
    };
    onClick?: (annotation: ManifestoAnnotation, vect: Vector, e: MouseEvent) => void;
};
export declare const Annotation: React.FC<Props>;
export default Annotation;
