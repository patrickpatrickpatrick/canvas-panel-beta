import React, { CSSProperties } from 'react';
import { Annotation, Annotation as ManifestoAnnotation, AnnotationList, Canvas } from 'manifesto.js';
import { Selector } from '../../../utility/annotation-selector';
export declare const AnnotationCanvasRepresentation: React.FC<{
    ratio?: number;
    annotationList?: AnnotationList;
    canvas?: Canvas;
    annotationStyle?: CSSProperties;
    onClickAnnotation: (annotation: Annotation, bounds: Selector) => void;
    growthStyle: 'fixed' | 'scaled' | 'absolute';
    bemModifiers?: (annotation: ManifestoAnnotation, props: any) => {
        [key: string]: boolean;
    };
}>;
export default AnnotationCanvasRepresentation;
