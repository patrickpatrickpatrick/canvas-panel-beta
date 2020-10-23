import { RenderComponent } from '../../../utility/function-or-map-children';
import { AnnotationList, Canvas } from 'manifesto.js';
export declare const AnnotationListProvider: RenderComponent<{
    annotationList: AnnotationList;
    canvas: Canvas;
}, {
    height?: number;
    width?: number;
}>;
export default AnnotationListProvider;
