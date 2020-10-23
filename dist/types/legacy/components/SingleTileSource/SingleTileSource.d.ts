import { RenderComponent } from '../../../utility/function-or-map-children';
import { Canvas } from 'manifesto.js';
export declare const SingleTileSource: RenderComponent<{
    canvas: Canvas;
}, {
    viewportController?: boolean;
    canvas?: Canvas | null;
    preLoad?: (props: any) => void;
    fallbackWidth?: number;
}>;
export default SingleTileSource;
