import { AnnotationList } from 'manifesto.js';
export declare function useAnnotationLists(): readonly [AnnotationList[], {
    readonly embeddedAnnotationLists: AnnotationList[];
    readonly externalAnnotationLists: AnnotationList[];
}];
