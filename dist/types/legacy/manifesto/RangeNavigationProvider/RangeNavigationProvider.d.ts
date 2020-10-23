import { Canvas, Manifest, Range } from 'manifesto.js';
import { Component } from 'react';
declare type Props = {
    manifest?: Manifest;
    rangeId?: string;
    rangeViewingHint?: string;
    fallbackToTop?: boolean;
    fallbackToSequence?: boolean;
    children: (ops: {
        nextRange: () => void;
        previousRange: () => void;
        getNextRange: () => null | undefined | Canvas;
        getPreviousRange: () => null | undefined | Canvas;
        goToRange: (key: number) => void;
        currentIndex: number;
        rangeId?: string;
        range?: Range;
        canvasList: string[];
        region: any;
        currentCanvasId: string | null;
        manifest: Manifest;
        canvas?: Canvas | null;
    }) => any;
    currentIndex?: number;
    onNavigate?: (index: number, canvasId: string) => void;
    controlled?: boolean;
};
declare type State = {
    currentIndex: number;
    currentRange?: string;
    currentRangeObject?: Range;
    canvasList: Array<string>;
    regionList: Array<any>;
};
declare type RangeLike = {
    range?: Range;
    canvasList: Array<string>;
    regionList: Array<any>;
    id: string;
};
declare class RangeNavigationProvider extends Component<Props, State> {
    state: {
        currentIndex: number;
        currentRangeObject: undefined;
        currentRange: undefined;
        canvasList: never[];
        regionList: never[];
    };
    static defaultProps: {
        fallbackToTop: boolean;
        fallbackToSequence: boolean;
        controlled: boolean;
    };
    componentWillMount(): void;
    getMatchingRange({ manifest, rangeId, rangeViewingHint }: Props): RangeLike;
    componentWillReceiveProps(newProps: Props, newContext: any): void;
    nextRange: () => void;
    previousRange: () => void;
    goToRange: (newIndex: number) => void;
    getCanvasAtIndex: (currentIndex: number) => Canvas | null;
    getNextRange: (currentIndex: number) => () => Canvas | null | undefined;
    getPreviousRange: (currentIndex: number) => () => Canvas | null | undefined;
    render(): JSX.Element | null;
}
export default RangeNavigationProvider;
