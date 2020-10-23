import React, { CSSProperties } from 'react';
declare const CanvasRepresentation: React.FC<{
    position?: {
        x: number;
        y: number;
        width: number;
        zoom: number;
        scale: number;
        rotation: number;
    };
    width?: number;
    height?: number;
    maxWidth?: number;
    ratio?: number;
    style?: CSSProperties;
}>;
export default CanvasRepresentation;
