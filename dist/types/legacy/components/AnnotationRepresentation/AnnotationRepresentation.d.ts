import React, { CSSProperties } from 'react';
import { Annotation as ManifestoAnnotation } from 'manifesto.js';
import { AnnotationSelector } from '../../../utility/annotation-selector';
import { BemBlockType } from '../Bem/Bem';
declare type Props = {
    annotations?: Array<{
        annotation: ManifestoAnnotation;
        on: AnnotationSelector;
    }>;
    growthStyle?: 'fixed' | 'scaled' | 'absolute';
    annotationStyle?: CSSProperties;
    onClickAnnotation?: (annotation: ManifestoAnnotation, vect: any, e: MouseEvent) => void;
    bemModifiers?: (annotation: ManifestoAnnotation, props: any) => {
        [key: string]: boolean;
    };
    annotationContent?: (annotation: ManifestoAnnotation, bem: BemBlockType) => any;
};
declare const AnnotationRepresentation: React.FC<Props>;
export default AnnotationRepresentation;
