import React from 'react';
import * as Manifesto from 'manifesto.js';
import { BemBlockType } from '../Bem/Bem';
declare type Props = {
    annotation: Manifesto.Annotation;
    onClose?: (e: any) => void;
    closeText?: string;
    bem: BemBlockType & string;
};
declare const _default: React.FC<Pick<Props, "annotation" | "onClose" | "closeText">>;
export default _default;
