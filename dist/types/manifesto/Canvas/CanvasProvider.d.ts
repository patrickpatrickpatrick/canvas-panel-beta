import { Canvas, Sequence } from 'manifesto.js';
import React from 'react';
export declare type CanvasProviderContext = {
    sequence: Sequence;
    canvas: Canvas;
    startCanvas: number | string;
    currentCanvas: number;
    height: number;
    width: number;
};
declare type CanvasProviderActions = {
    nextCanvas: () => void;
    prevCanvas: () => void;
};
declare const useCanvas: () => CanvasProviderContext & CanvasProviderActions;
export { useCanvas };
export declare type CanvasProviderProps = {
    currentCanvas?: number | string;
    sequence?: number;
    startCanvas?: number | string;
};
export declare const CanvasProvider: React.FC<CanvasProviderProps>;
