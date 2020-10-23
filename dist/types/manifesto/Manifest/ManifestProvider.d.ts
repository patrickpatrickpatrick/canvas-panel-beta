import { Manifest } from 'manifesto.js';
import React from 'react';
declare const useManifest: () => Manifest;
export declare type ManifestProviderProps = {
    url?: string;
    locale?: string;
    fetchOptions?: any;
    jsonLd?: any;
};
export { useManifest };
export declare const ManifestProvider: React.FC<ManifestProviderProps>;
