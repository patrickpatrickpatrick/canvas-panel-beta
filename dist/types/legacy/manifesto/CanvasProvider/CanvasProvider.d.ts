import { Manifest } from 'manifesto.js';
import { CanvasProviderProps, CanvasProviderContext } from '../../../manifesto/Canvas/CanvasProvider';
import { RenderComponent } from '../../../utility/function-or-map-children';
declare type LegacyCanvasActions = {
    type: CanvasProviderStaticMembers['NEXT_CANVAS'];
} | {
    type: CanvasProviderStaticMembers['PREV_CANVAS'];
};
declare type LegacyCanvasProviderRenderProps = {
    manifest: Manifest;
    dispatch: (action: LegacyCanvasActions) => void;
} & CanvasProviderContext;
declare type CanvasProviderStaticMembers = {
    NEXT_CANVAS: 'NEXT_CANVAS';
    PREV_CANVAS: 'PREV_CANVAS';
    reducer: () => never;
    nextCanvas: () => LegacyCanvasActions;
    prevCanvas: () => LegacyCanvasActions;
};
export declare const CanvasProvider: RenderComponent<LegacyCanvasProviderRenderProps, CanvasProviderProps> & CanvasProviderStaticMembers;
export default CanvasProvider;
