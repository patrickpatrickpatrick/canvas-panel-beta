import { RenderComponent } from '../../../utility/function-or-map-children';
import { Annotation, AnnotationList } from 'manifesto.js';
import { AnnotationSelector } from '../../../utility/annotation-selector';
export declare const AnnotationProvider: RenderComponent<{
    annotationList: AnnotationList;
    annotations: Array<{
        annotationList: AnnotationList;
        annotation: Annotation;
        on?: AnnotationSelector;
    }>;
}> & {
    parseAnnotation?: any;
};
export default AnnotationProvider;
