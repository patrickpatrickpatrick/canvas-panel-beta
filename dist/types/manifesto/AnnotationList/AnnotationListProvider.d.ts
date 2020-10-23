import React from 'react';
import { AnnotationList } from 'manifesto.js';
declare type AnnotationListContext = {
    annotationList: AnnotationList;
};
declare const useAnnotationList: () => AnnotationListContext;
export { useAnnotationList };
export declare const AnnotationListProvider: React.FC<{
    annotationList: AnnotationList;
}>;
