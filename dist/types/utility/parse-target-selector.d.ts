export default function parseSelectorTarget(toParse: string, scale?: number): string | {
    unit: string;
    scale: number;
    expanded: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    toString(): string;
};
