import { Range } from 'manifesto.js';
declare type Region = {
    x: number;
    y: number;
    width: number;
    height: number;
};
declare type CanvasRegion = {
    canvases: Array<string>;
    regions: Array<Region | null>;
};
export default function extractCanvasAndRegionsFromRange(range: Range): CanvasRegion;
export {};
