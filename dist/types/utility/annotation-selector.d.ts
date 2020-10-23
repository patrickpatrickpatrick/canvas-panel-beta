import { Annotation } from 'manifesto.js';
export declare type TextDir = 'ltr' | 'rtl' | 'auto';
export declare type Selector = {
    type?: string;
    value?: string;
    x: number;
    y: number;
    width?: number | null;
    height?: number | null;
};
export declare function parseAnnotation(annotation: Annotation): AnnotationSelector | undefined;
export declare class AnnotationSelector {
    static DIRECTION_LTR: string;
    static DIRECTION_RTL: string;
    static DIRECTION_AUTO: string;
    static fromJsonLD(jsonLd: any): AnnotationSelector | null;
    static fromArray(multipleSelectors: any[]): (AnnotationSelector | null)[];
    id?: string;
    format?: string;
    language?: string;
    processingLanguage?: string;
    textDirection?: TextDir;
    selector?: Selector | string;
    source?: string;
    constructor(id?: string, scale?: number, format?: string, language?: string, processingLanguage?: string, textDirection?: TextDir, selector?: Selector);
    static fromTarget(target: string, selector?: Selector): AnnotationSelector;
    static parse(text: string | Partial<{
        id: string;
        format: string;
        language: string;
        processingLanguage: string;
        textDirection: TextDir;
        source: string;
        selector: Selector;
    }>, scale?: number): AnnotationSelector | null;
    static parseTarget(source?: string, scale?: number, selector?: Selector): string | {
        unit: string;
        scale: number;
        expanded: boolean;
        x: number;
        y: number;
        width: number;
        height: number;
        toString(): string;
    } | undefined;
    toJSON(): string | undefined;
    toString(): string | undefined;
}
