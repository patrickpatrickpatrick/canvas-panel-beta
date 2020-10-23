'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var manifesto_js = require('manifesto.js');
var BEM = _interopDefault(require('@fesk/bem-js'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function createContext(defaultValue) {
    const ctx = React.createContext(defaultValue);
    function useContext() {
        const c = React.useContext(ctx);
        if (!c)
            throw new Error('useCtx must be inside a Provider with a value');
        return c;
    }
    return [useContext, ctx.Provider];
}

function parseManifest(jsonLd, options) {
    return manifesto_js.parseManifest(jsonLd, options);
}

const [useManifest, InternalManifestProvider] = createContext();
const ManifestProvider = ({ url, locale = 'en-GB', fetchOptions, jsonLd, children, }) => {
    const [error, setError] = React.useState();
    const [manifest, setManifest] = React.useState();
    React.useEffect(() => {
        if (jsonLd) {
            setManifest(parseManifest(jsonLd, { locale }));
            return;
        }
        if (url) {
            fetch(url, fetchOptions || { cache: 'force-cache' })
                .then(j => j.json())
                .then(fetchedJsonLd => {
                setManifest(parseManifest(fetchedJsonLd, { locale }));
            })
                .catch(() => {
                setError('Something went wrong fetching this manifest.');
            });
        }
    }, [fetchOptions, jsonLd, locale, url]);
    if (error) {
        return React__default.createElement("div", null, error);
    }
    if (!manifest) {
        return React__default.createElement(React__default.Fragment, null);
    }
    return (React__default.createElement(InternalManifestProvider, { value: manifest }, children));
};

function isFunction(functionToCheck) {
    return (functionToCheck && {}.toString.call(functionToCheck) === '[object Function]');
}

function functionOrMapChildren(children, withProps) {
    if (children && isFunction(children)) {
        return (children(withProps) || React__default.createElement("div", null, "Could not render children from function"));
    }
    return (React__default.Children.map(children, (child) => {
        return React__default.cloneElement(child, withProps);
    }) || React__default.createElement("div", null, "Could not clone children"));
}

const ManifestInner = ({ children }) => {
    const manifest = useManifest();
    return functionOrMapChildren(children, React.useMemo(() => ({
        manifest,
    }), [manifest]));
};
const Manifest = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (React__default.createElement(ManifestProvider, Object.assign({}, props),
        React__default.createElement(ManifestInner, null, children)));
};

const defaultContext = {
    prefix: '',
    cssClassMap: {},
};
const [useBem, BemContextProvider] = createContext(defaultContext);
const withBemClass = (className) => (Component) => {
    const WithBemClass = props => {
        const bem = useBemClassName(className);
        return React__default.createElement(Component, Object.assign({}, props, { bem: bem }));
    };
    return WithBemClass;
};
const Bem = ({ children, prefix = '', cssClassMap = {}, }) => {
    return (React__default.createElement(BemContextProvider, { value: React.useMemo(() => ({
            prefix,
            cssClassMap,
        }), [prefix, cssClassMap]) }, children));
};
function useBemClassName(className) {
    const bemCtx = useBem();
    return React.useMemo(() => constructBemFromContext(className, Object.assign({}, defaultContext, bemCtx)), [bemCtx, className]);
}
function constructBemFromContext(className, ctx) {
    if (ctx.cssClassMap[className]) {
        return BEM.block(`${ctx.prefix}${ctx.cssClassMap[className]}`);
    }
    return BEM.block(`${ctx.prefix}${className}`);
}

const Annotation = props => {
    const { x, y, width, height, style, onClick, bemModifiers, annotation, annotationContent, } = props;
    const bem = useBemClassName('annotation');
    const modifiers = bemModifiers ? bemModifiers(annotation, props) : null;
    const handleClick = React.useCallback(e => onClick
        ? onClick(annotation, {
            x: x || 0,
            y: y || 0,
            width: width,
            height: height,
        }, e)
        : null, [annotation, height, onClick, width, x, y]);
    return (React__default.createElement("div", { className: modifiers ? bem.modifiers(modifiers) : bem, style: style, onClick: handleClick }, annotationContent ? annotationContent(annotation, bem) : null));
};

const [useCanvas, InternalCanvasProvider] = createContext();
const CanvasProvider = ({ startCanvas = 0, sequence = 0, currentCanvas, children, }) => {
    const [currentCanvasIdx, setCurrentCanvasIdx] = React.useState(0);
    const manifest = useManifest();
    const setCurrentCanvasFromIdOrIndex = React.useCallback((value) => {
        const currentSeq = manifest.getSequenceByIndex(sequence);
        setCurrentCanvasIdx(typeof value === 'string'
            ? currentSeq.getCanvasIndexById(value)
            : value);
    }, [manifest, sequence]);
    React.useEffect(() => {
        if (0 !== startCanvas) {
            setCurrentCanvasFromIdOrIndex(startCanvas);
        }
    }, [setCurrentCanvasFromIdOrIndex, startCanvas]);
    React.useEffect(() => {
        if (typeof currentCanvas !== 'undefined') {
            setCurrentCanvasFromIdOrIndex(currentCanvas);
        }
    }, [currentCanvas, setCurrentCanvasFromIdOrIndex]);
    const sequenceObj = React.useMemo(() => manifest.getSequenceByIndex(sequence), [
        manifest,
        sequence,
    ]);
    const canvas = React.useMemo(() => {
        return sequenceObj.getCanvasByIndex(currentCanvasIdx);
    }, [currentCanvasIdx, sequenceObj]);
    const nextCanvas = React.useCallback(() => {
        if (sequenceObj.getTotalCanvases() > currentCanvasIdx + 1) {
            setCurrentCanvasIdx(currentCanvasIdx + 1);
        }
    }, [currentCanvasIdx, sequenceObj]);
    const prevCanvas = React.useCallback(() => {
        setCurrentCanvasIdx(currentCanvasIdx === 0 ? 0 : currentCanvasIdx - 1);
    }, [currentCanvasIdx]);
    return (React__default.createElement(InternalCanvasProvider, { value: {
            sequence: sequenceObj,
            canvas,
            currentCanvas: currentCanvasIdx,
            height: canvas.getHeight(),
            width: canvas.getWidth(),
            startCanvas,
            nextCanvas,
            prevCanvas,
        } }, children));
};

class CustomAnnotationList extends manifesto_js.AnnotationList {
    constructor(label, jsonld, options) {
        super(label, jsonld, options);
        if (this.getResources().length) {
            this.isLoaded = true;
        }
    }
    getResources() {
        const resources = this.getProperty('resources') || this.getProperty('items') || [];
        return resources.map((resource) => new manifesto_js.Annotation(resource, this.options));
    }
}
function getAnnotationsFromCanvas(canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        const annotationProperty = canvas.getProperty('annotations');
        if (!annotationProperty) {
            return Promise.resolve([]);
        }
        const annotations = Array.isArray(annotationProperty)
            ? annotationProperty
            : [annotationProperty];
        const annotationPromises = annotations.map((annotationList, i) => new CustomAnnotationList(annotationList.label || `Annotation list ${i}`, annotationList, canvas.options));
        return Promise.all(annotationPromises);
    });
}

function useAnnotationLists() {
    const { canvas } = useCanvas();
    const [embeddedAnnotationLists, setEmbeddedAnnotationLists] = React.useState([]);
    const [externalAnnotationLists, setExternalAnnotationLists] = React.useState([]);
    React.useEffect(() => {
        if (canvas) {
            setEmbeddedAnnotationLists([]);
            getAnnotationsFromCanvas(canvas).then(annotations => {
                if (annotations.length === 0) {
                    setExternalAnnotationLists([]);
                    canvas
                        .getOtherContent()
                        .then(content => {
                        setExternalAnnotationLists(content);
                    })
                        .catch(err => {
                        console.log('Could not find annotations.');
                        console.log(err);
                    });
                }
                else {
                    setEmbeddedAnnotationLists(annotations);
                }
            });
        }
    }, [canvas]);
    const fullAnnotationList = React.useMemo(() => [...externalAnnotationLists, ...embeddedAnnotationLists], [embeddedAnnotationLists, externalAnnotationLists]);
    return [
        fullAnnotationList,
        {
            embeddedAnnotationLists,
            externalAnnotationLists,
        },
    ];
}

const [useAnnotationList, InternalAnnotationListProvider] = createContext();
const AnnotationListProvider = ({ annotationList, children }) => {
    return (React__default.createElement(InternalAnnotationListProvider, { value: React.useMemo(() => ({ annotationList }), [annotationList]) }, children));
};

const AnnotationListProvider$1 = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const { canvas } = useCanvas();
    const [annotationLists] = useAnnotationLists();
    if (!canvas || !annotationLists) {
        return null;
    }
    return (React__default.createElement(React__default.Fragment, null, annotationLists.map((annotationList, key) => (React__default.createElement(AnnotationListProvider, { annotationList: annotationList }, functionOrMapChildren(children, Object.assign({ canvas,
        annotationList }, props)))))));
};

function parseSelectorTarget(toParse, scale = 1) {
    if (!toParse) {
        return toParse;
    }
    const W3C_SELECTOR = /[#&?](xywh=)?(pixel:|percent:)?([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?)/;
    const match = W3C_SELECTOR.exec(toParse);
    if (match) {
        return {
            unit: match[2] === 'percent:' ? 'percent' : 'pixel',
            scale,
            expanded: true,
            x: parseFloat(match[3]) * scale,
            y: parseFloat(match[4]) * scale,
            width: parseFloat(match[5]) * scale,
            height: parseFloat(match[6]) * scale,
            toString() {
                return toParse.split('#')[0];
            },
        };
    }
    return toParse;
}

function parseAnnotation(annotation) {
    const on = annotation.getOn() || annotation.getTarget();
    return on ? AnnotationSelector.parse(on) || undefined : undefined;
}
class AnnotationSelector {
    constructor(id, scale, format, language, processingLanguage, textDirection, selector) {
        if (textDirection &&
            textDirection !== AnnotationSelector.DIRECTION_AUTO &&
            textDirection !== AnnotationSelector.DIRECTION_LTR &&
            textDirection !== AnnotationSelector.DIRECTION_RTL) {
            throw new Error('textDirection must be ONE of [ltr, rtl, auto]');
        }
        this.id = id;
        this.source = (id || '').split('#')[0];
        this.format = format;
        this.language = language;
        this.processingLanguage = processingLanguage;
        this.textDirection = textDirection;
        this.selector = AnnotationSelector.parseTarget(id, scale, selector);
    }
    static fromJsonLD(jsonLd) {
        return AnnotationSelector.parse(jsonLd);
    }
    static fromArray(multipleSelectors) {
        return multipleSelectors.map(annotation => AnnotationSelector.parse(annotation));
    }
    static fromTarget(target, selector) {
        const annotationSelector = new AnnotationSelector();
        annotationSelector.source = target;
        annotationSelector.selector = selector;
        return annotationSelector;
    }
    static parse(text, scale = 1) {
        if (!text) {
            return null;
        }
        if (typeof text === 'string') {
            return new AnnotationSelector(text, scale);
        }
        if (text.id) {
            return new AnnotationSelector(text.id, scale, text.format, text.language, text.processingLanguage, text.textDirection);
        }
        if (text.source) {
            return new AnnotationSelector(text.source, scale, text.format, text.language, text.processingLanguage, text.textDirection, text.selector);
        }
        return null;
    }
    static parseTarget(source, scale = 1, selector) {
        let toParse = source;
        if (selector && selector.type === 'FragmentSelector') {
            toParse = `${source}#${selector.value}`;
        }
        if (!toParse) {
            return undefined;
        }
        let target = parseSelectorTarget(toParse, scale);
        if (target !== toParse) {
            return target;
        }
        return source;
    }
    toJSON() {
        if (!this.selector ||
            typeof this.selector === 'string' ||
            this.selector.x === null ||
            isNaN(Math.floor(this.selector.x)) ||
            this.selector.y === null ||
            isNaN(Math.floor(this.selector.y))) {
            return this.source;
        }
        if (this.selector.width === null ||
            typeof this.selector.width === 'undefined' ||
            isNaN(this.selector.width) ||
            this.selector.height === null ||
            typeof this.selector.height === 'undefined' ||
            isNaN(this.selector.height)) {
            return `${this.source}#xywh=${Math.floor(this.selector.x)},${Math.floor(this.selector.y)},0,0`;
        }
        return `${this.source}#xywh=${Math.floor(this.selector.x)},${Math.floor(this.selector.y)},${Math.floor(this.selector.width)},${Math.floor(this.selector.height)}`;
    }
    toString() {
        return this.id;
    }
}
AnnotationSelector.DIRECTION_LTR = 'ltr';
AnnotationSelector.DIRECTION_RTL = 'rtl';
AnnotationSelector.DIRECTION_AUTO = 'auto';

const AnnotationProvider = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const { annotationList } = useAnnotationList();
    const parsedList = React.useMemo(() => annotationList.getResources().map(annotation => ({
        annotationList,
        annotation,
        on: parseAnnotation(annotation),
    })), [annotationList]);
    if (!annotationList || !parsedList) {
        return null;
    }
    return functionOrMapChildren(children, Object.assign(Object.assign({}, props), { annotationList, annotations: parsedList }));
};

const CanvasProviderInner = ({ children, }) => {
    const manifest = useManifest();
    const _a = useCanvas(), { nextCanvas, prevCanvas } = _a, canvasProps = __rest(_a, ["nextCanvas", "prevCanvas"]);
    const dispatch = React.useCallback((action) => {
        switch (action.type) {
            case 'NEXT_CANVAS':
                nextCanvas();
                break;
            case 'PREV_CANVAS':
                prevCanvas();
                break;
        }
    }, [nextCanvas, prevCanvas]);
    return functionOrMapChildren(children, Object.assign({ manifest,
        dispatch }, canvasProps));
};
const CanvasProvider$1 = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (React__default.createElement(CanvasProvider, Object.assign({}, props),
        React__default.createElement(CanvasProviderInner, null, children)));
};
CanvasProvider$1.reducer = () => {
    throw new Error('Use of this internal API is not supported.');
};
CanvasProvider$1.NEXT_CANVAS = 'NEXT_CANVAS';
CanvasProvider$1.PREV_CANVAS = 'PREV_CANVAS';
CanvasProvider$1.nextCanvas = () => {
    return { type: CanvasProvider$1.NEXT_CANVAS };
};
CanvasProvider$1.prevCanvas = () => {
    return { type: CanvasProvider$1.PREV_CANVAS };
};

var AnnotationMotivation;
(function (AnnotationMotivation) {
    AnnotationMotivation["BOOKMARKING"] = "oa:bookmarking";
    AnnotationMotivation["CLASSIFYING"] = "oa:classifying";
    AnnotationMotivation["COMMENTING"] = "oa:commenting";
    AnnotationMotivation["DESCRIBING"] = "oa:describing";
    AnnotationMotivation["EDITING"] = "oa:editing";
    AnnotationMotivation["HIGHLIGHTING"] = "oa:highlighting";
    AnnotationMotivation["IDENTIFYING"] = "oa:identifying";
    AnnotationMotivation["LINKING"] = "oa:linking";
    AnnotationMotivation["MODERATING"] = "oa:moderating";
    AnnotationMotivation["PAINTING"] = "sc:painting";
    AnnotationMotivation["QUESTIONING"] = "oa:questioning";
    AnnotationMotivation["REPLYING"] = "oa:replying";
    AnnotationMotivation["TAGGING"] = "oa:tagging";
    AnnotationMotivation["TRANSCRIBING"] = "oad:transcribing";
})(AnnotationMotivation || (AnnotationMotivation = {}));
var Behavior;
(function (Behavior) {
    Behavior["AUTO_ADVANCE"] = "auto-advance";
    Behavior["CONTINUOUS"] = "continuous";
    Behavior["FACING_PAGES"] = "facing-pages";
    Behavior["HIDDEN"] = "hidden";
    Behavior["INDIVIDUALS"] = "individuals";
    Behavior["MULTI_PART"] = "multi-part";
    Behavior["NO_NAV"] = "no-nav";
    Behavior["NON_PAGED"] = "non-paged";
    Behavior["PAGED"] = "paged";
    Behavior["REPEAT"] = "repeat";
    Behavior["SEQUENCE"] = "sequence";
    Behavior["THUMBNAIL_NAV"] = "thumbnail-nav";
    Behavior["TOGETHER"] = "together";
    Behavior["UNORDERED"] = "unordered";
})(Behavior || (Behavior = {}));
var ExternalResourceType;
(function (ExternalResourceType) {
    ExternalResourceType["CANVAS"] = "canvas";
    ExternalResourceType["CHOICE"] = "choice";
    ExternalResourceType["CONTENT_AS_TEXT"] = "contentastext";
    ExternalResourceType["DATASET"] = "dataset";
    ExternalResourceType["DOCUMENT"] = "document";
    ExternalResourceType["IMAGE"] = "image";
    ExternalResourceType["MODEL"] = "model";
    ExternalResourceType["MOVING_IMAGE"] = "movingimage";
    ExternalResourceType["PDF"] = "pdf";
    ExternalResourceType["PHYSICAL_OBJECT"] = "physicalobject";
    ExternalResourceType["SOUND"] = "sound";
    ExternalResourceType["TEXT"] = "text";
    ExternalResourceType["TEXTUALBODY"] = "textualbody";
    ExternalResourceType["VIDEO"] = "video";
})(ExternalResourceType || (ExternalResourceType = {}));
var IIIFResourceType;
(function (IIIFResourceType) {
    IIIFResourceType["ANNOTATION"] = "annotation";
    IIIFResourceType["CANVAS"] = "canvas";
    IIIFResourceType["COLLECTION"] = "collection";
    IIIFResourceType["MANIFEST"] = "manifest";
    IIIFResourceType["RANGE"] = "range";
    IIIFResourceType["SEQUENCE"] = "sequence";
})(IIIFResourceType || (IIIFResourceType = {}));
var MediaType;
(function (MediaType) {
    MediaType["AUDIO_MP4"] = "audio/mp4";
    MediaType["CORTO"] = "application/corto";
    MediaType["DRACO"] = "application/draco";
    MediaType["EPUB"] = "application/epub+zip";
    MediaType["GLB"] = "model/gltf-binary";
    MediaType["GLTF"] = "model/gltf+json";
    MediaType["JPG"] = "image/jpeg";
    MediaType["M3U8"] = "application/vnd.apple.mpegurl";
    MediaType["MP3"] = "audio/mp3";
    MediaType["MPEG_DASH"] = "application/dash+xml";
    MediaType["OBJ"] = "text/plain";
    MediaType["OPF"] = "application/oebps-package+xml";
    MediaType["PDF"] = "application/pdf";
    MediaType["PLY"] = "application/ply";
    MediaType["THREEJS"] = "application/vnd.threejs+json";
    MediaType["USDZ"] = "model/vnd.usd+zip";
    MediaType["VIDEO_MP4"] = "video/mp4";
    MediaType["WEBM"] = "video/webm";
})(MediaType || (MediaType = {}));
var RenderingFormat;
(function (RenderingFormat) {
    RenderingFormat["DOC"] = "application/msword";
    RenderingFormat["DOCX"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    RenderingFormat["PDF"] = "application/pdf";
})(RenderingFormat || (RenderingFormat = {}));
var ServiceProfile;
(function (ServiceProfile) {
    // image api
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level0";
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level1";
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level2";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level0";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level1";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level2";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2";
    ServiceProfile["IMAGE_1_LEVEL_0"] = "http://iiif.io/api/image/1/level0.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_0"] = "http://iiif.io/api/image/1/profiles/level0.json";
    ServiceProfile["IMAGE_1_LEVEL_1"] = "http://iiif.io/api/image/1/level1.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_1"] = "http://iiif.io/api/image/1/profiles/level1.json";
    ServiceProfile["IMAGE_1_LEVEL_2"] = "http://iiif.io/api/image/1/level2.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_2"] = "http://iiif.io/api/image/1/profiles/level2.json";
    ServiceProfile["IMAGE_2_LEVEL_0"] = "http://iiif.io/api/image/2/level0.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_0"] = "http://iiif.io/api/image/2/profiles/level0.json";
    ServiceProfile["IMAGE_2_LEVEL_1"] = "http://iiif.io/api/image/2/level1.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_1"] = "http://iiif.io/api/image/2/profiles/level1.json";
    ServiceProfile["IMAGE_2_LEVEL_2"] = "http://iiif.io/api/image/2/level2.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_2"] = "http://iiif.io/api/image/2/profiles/level2.json";
    // auth api
    ServiceProfile["AUTH_0_CLICK_THROUGH"] = "http://iiif.io/api/auth/0/login/clickthrough";
    ServiceProfile["AUTH_0_LOGIN"] = "http://iiif.io/api/auth/0/login";
    ServiceProfile["AUTH_0_LOGOUT"] = "http://iiif.io/api/auth/0/logout";
    ServiceProfile["AUTH_0_RESTRICTED"] = "http://iiif.io/api/auth/0/login/restricted";
    ServiceProfile["AUTH_0_TOKEN"] = "http://iiif.io/api/auth/0/token";
    ServiceProfile["AUTH_1_CLICK_THROUGH"] = "http://iiif.io/api/auth/1/clickthrough";
    ServiceProfile["AUTH_1_EXTERNAL"] = "http://iiif.io/api/auth/1/external";
    ServiceProfile["AUTH_1_KIOSK"] = "http://iiif.io/api/auth/1/kiosk";
    ServiceProfile["AUTH_1_LOGIN"] = "http://iiif.io/api/auth/1/login";
    ServiceProfile["AUTH_1_LOGOUT"] = "http://iiif.io/api/auth/1/logout";
    ServiceProfile["AUTH_1_PROBE"] = "http://iiif.io/api/auth/1/probe";
    ServiceProfile["AUTH_1_TOKEN"] = "http://iiif.io/api/auth/1/token";
    // search api
    ServiceProfile["SEARCH_0"] = "http://iiif.io/api/search/0/search";
    ServiceProfile["SEARCH_0_AUTO_COMPLETE"] = "http://iiif.io/api/search/0/autocomplete";
    ServiceProfile["SEARCH_1"] = "http://iiif.io/api/search/1/search";
    ServiceProfile["SEARCH_1_AUTO_COMPLETE"] = "http://iiif.io/api/search/1/autocomplete";
    // extensions
    ServiceProfile["TRACKING_EXTENSIONS"] = "http://universalviewer.io/tracking-extensions-profile";
    ServiceProfile["UI_EXTENSIONS"] = "http://universalviewer.io/ui-extensions-profile";
    ServiceProfile["PRINT_EXTENSIONS"] = "http://universalviewer.io/print-extensions-profile";
    ServiceProfile["SHARE_EXTENSIONS"] = "http://universalviewer.io/share-extensions-profile";
    // other
    ServiceProfile["OTHER_MANIFESTATIONS"] = "http://iiif.io/api/otherManifestations.json";
    ServiceProfile["IXIF"] = "http://wellcomelibrary.org/ld/ixif/0/alpha.json";
})(ServiceProfile || (ServiceProfile = {}));
var ViewingDirection;
(function (ViewingDirection) {
    ViewingDirection["BOTTOM_TO_TOP"] = "bottom-to-top";
    ViewingDirection["LEFT_TO_RIGHT"] = "left-to-right";
    ViewingDirection["RIGHT_TO_LEFT"] = "right-to-left";
    ViewingDirection["TOP_TO_BOTTOM"] = "top-to-bottom";
})(ViewingDirection || (ViewingDirection = {}));
var ViewingHint;
(function (ViewingHint) {
    ViewingHint["CONTINUOUS"] = "continuous";
    ViewingHint["INDIVIDUALS"] = "individuals";
    ViewingHint["NON_PAGED"] = "non-paged";
    ViewingHint["PAGED"] = "paged";
    ViewingHint["TOP"] = "top";
})(ViewingHint || (ViewingHint = {}));

function getDataUriFromImages(images) {
    let infoUri = null;
    const firstImage = images[0];
    const resource = firstImage.getResource();
    const services = resource.getServices();
    if (services.length) {
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            let id = service.id;
            if (!id.endsWith('/')) {
                id += '/';
            }
            if (manifesto_js.Utils.isImageProfile(service.getProfile())) {
                infoUri = id + 'info.json';
            }
        }
        return infoUri;
    }
    return resource.id;
}

function getP3ImagesFromCanvas(canvas) {
    return canvas.getContent().filter((annotation) => {
        const bodies = annotation.getBody();
        if (!bodies.length) {
            return false;
        }
        return bodies.reduce((hasImage, body) => {
            return (hasImage ||
                body.getIIIFResourceType().toString() ===
                    ExternalResourceType.IMAGE.toString());
        }, false);
    });
}

function getImageServiceFromAnnotation(annotation) {
    return annotation
        .getBody()
        .reduce((finalImageService, body) => {
        return (finalImageService ||
            body
                .getServices()
                .reduce((imageService, service) => {
                return (imageService ||
                    (manifesto_js.Utils.isImageProfile(service.getProfile()) ||
                        service.getProfile() === 'level1' ||
                        service.getProfile() === 'level2'
                        ? service
                        : null));
            }, finalImageService));
    }, null);
}

function getDataUriFromCanvas(canvas) {
    const p3Images = getP3ImagesFromCanvas(canvas);
    if (p3Images.length && p3Images[0]) {
        const firstP3Image = p3Images[0];
        const service = getImageServiceFromAnnotation(firstP3Image);
        if (service) {
            return service.getInfoUri();
        }
    }
    const images = canvas.getImages();
    if (images && images.length) {
        return getDataUriFromImages(images);
    }
    const service = canvas.getService(ServiceProfile.IXIF);
    if (service) {
        return service.getInfoUri();
    }
    return null;
}

const SingleTileSource = allProps => {
    const { preLoad, fallbackWidth, children } = allProps, props = __rest(allProps, ["preLoad", "fallbackWidth", "children"]);
    const { canvas } = useCanvas();
    const [imageUri, setImageUri] = React.useState();
    const [tileSources, setTileSources] = React.useState();
    const requestedId = React.useRef();
    React.useEffect(() => {
        setImageUri(getDataUriFromCanvas(canvas));
        setTileSources(undefined);
    }, [canvas]);
    React.useEffect(() => {
        if (imageUri && !tileSources) {
            if (!imageUri.endsWith('/info.json')) {
                setTileSources([
                    {
                        type: 'image',
                        url: imageUri,
                    },
                ]);
                return;
            }
            requestedId.current = imageUri;
            fetch(imageUri)
                .then(resp => resp.json())
                .then(tileSource => {
                if (requestedId.current === imageUri) {
                    setTileSources([tileSource]);
                }
            });
            return;
        }
    }, [imageUri, tileSources]);
    if (!tileSources || tileSources.length === 0) {
        return React__default.createElement(React__default.Fragment, null);
    }
    if (children) {
        return functionOrMapChildren(children, Object.assign({ canvas,
            imageUri,
            tileSources }, props));
    }
    if (preLoad) {
        return preLoad(allProps);
    }
    const tileSource = tileSources ? tileSources[0] : null;
    const fallbackImageUrl = tileSource && tileSource.type === 'image'
        ? tileSource.url
        : canvas.getCanonicalImageUri(fallbackWidth);
    return (React__default.createElement("div", null,
        React__default.createElement("img", { width: fallbackWidth, src: fallbackImageUrl })));
};

const CanvasNavigation = () => {
    const { nextCanvas, prevCanvas } = useCanvas();
    const bem = useBemClassName('canvas-navigation');
    return (React__default.createElement("div", { className: bem },
        React__default.createElement("button", { className: bem.element('previous'), onClick: nextCanvas }, "Prev"),
        React__default.createElement("button", { className: bem.element('next'), onClick: prevCanvas }, "Next")));
};

function processChildStyle(reactElement, { position, ratio }) {
    const _a = reactElement.props.style || {}, { maxHeight } = _a, style = __rest(_a, ["maxHeight"]);
    const computedMaxHeight = maxHeight ? 'auto' : maxHeight * ratio;
    if (reactElement.props.growthStyle === 'fixed') {
        const zam = position ? position.zoom * (1 / ratio) : 1;
        const fixedMaxHeight = maxHeight && zam ? maxHeight / (1 / zam) : 'auto';
        return Object.assign(Object.assign({}, style), { position: 'absolute', top: reactElement.props.y * ratio, left: reactElement.props.x * ratio, height: reactElement.props.height * ratio * zam, width: reactElement.props.width * ratio * zam, maxHeight: fixedMaxHeight, transform: 'scale(' + 1 / zam + ')', transformOrigin: 'top left' });
    }
    if (reactElement.props.growthStyle === 'absolute') ;
    return Object.assign(Object.assign({}, style), { position: 'absolute', top: reactElement.props.y * ratio, left: reactElement.props.x * ratio, height: reactElement.props.height * ratio, width: reactElement.props.width * ratio, maxHeight: computedMaxHeight });
}
const CanvasRepresentation = (_a) => {
    var { ratio = 1, maxWidth = 500, width = 0, height = 0, style, children } = _a, props = __rest(_a, ["ratio", "maxWidth", "width", "height", "style", "children"]);
    const { canvas } = useCanvas();
    const _b = style || {}, { maxHeight } = _b, extraStyle = __rest(_b, ["maxHeight"]);
    return (React__default.createElement("div", { style: Object.assign({ position: 'relative', height: height * ratio, width: width * ratio, pointerEvents: 'none', maxHeight: maxHeight ? maxHeight / ratio : undefined }, extraStyle) }, React__default.Children.map(children, child => {
        if (child) {
            const propsForEl = child && child.type && child.type === 'div'
                ? {}
                : Object.assign({ canvas }, props);
            return React__default.cloneElement(child, Object.assign({ style: processChildStyle(child, {
                    position: props.position,
                    ratio,
                }) }, propsForEl));
        }
        return React__default.createElement(React__default.Fragment, null);
    })));
};

function getCanvasId(item) {
    if (typeof item === 'string') {
        return item;
    }
    if (item.type === 'Canvas') {
        return item.id;
    }
    if (item.type === 'SpecificResource') {
        return typeof item.source === 'string' ? item.source : item.source.id;
    }
    return null;
}
function getSelector(item, canvasId) {
    const selector = parseSelectorTarget(canvasId);
    if (selector && selector !== canvasId) {
        return selector;
    }
    if (item.selector) {
        const selectorValue = item.selector.value || item.selector;
        const itemSelector = parseSelectorTarget(`#${selectorValue}`);
        if (itemSelector !== selectorValue) {
            return itemSelector;
        }
    }
    return null;
}
function extractCanvasAndRegionsFromRange(range) {
    const manifestoCanvasIds = range.getCanvasIds();
    const rangeItemsCount = range.__jsonld.items
        ? range.__jsonld.items.length
        : manifestoCanvasIds.length;
    if (manifestoCanvasIds.length === rangeItemsCount) {
        return {
            canvases: manifestoCanvasIds,
            regions: [],
        };
    }
    return range.__jsonld.items.reduce((acc, item) => {
        const canvasId = getCanvasId(item);
        if (canvasId) {
            acc.canvases.push(canvasId);
            acc.regions.push(getSelector(item, canvasId));
        }
        return acc;
    }, {
        canvases: [],
        regions: [],
    });
}

class RangeNavigationProvider extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            currentIndex: 0,
            currentRangeObject: undefined,
            currentRange: undefined,
            canvasList: [],
            regionList: [],
        };
        this.nextRange = () => {
            const { currentIndex, canvasList } = this.state;
            if (currentIndex >= canvasList.length - 1) {
                return;
            }
            this.goToRange(currentIndex + 1);
        };
        this.previousRange = () => {
            const { currentIndex } = this.state;
            if (currentIndex === 0) {
                return;
            }
            this.goToRange(currentIndex - 1);
        };
        this.goToRange = (newIndex) => {
            const { controlled } = this.props;
            const { canvasList } = this.state;
            if (!controlled) {
                this.setState({
                    currentIndex: newIndex,
                });
            }
            if (this.props.onNavigate) {
                this.props.onNavigate(newIndex, canvasList[newIndex]);
            }
        };
        this.getCanvasAtIndex = (currentIndex) => {
            const { manifest } = this.props;
            const { canvasList } = this.state;
            try {
                return manifest && canvasList.length !== 0
                    ? manifest.getSequenceByIndex(0).getCanvasById(canvasList[currentIndex])
                    : null;
            }
            catch (err) {
                return null;
            }
        };
        this.getNextRange = (currentIndex) => () => {
            const { canvasList } = this.state;
            if (currentIndex >= canvasList.length - 1) {
                return;
            }
            return this.getCanvasAtIndex(currentIndex + 1);
        };
        this.getPreviousRange = (currentIndex) => () => {
            if (currentIndex === 0) {
                return;
            }
            return this.getCanvasAtIndex(currentIndex - 1);
        };
    }
    componentWillMount() {
        const matchingRange = this.getMatchingRange(this.props);
        if (matchingRange) {
            return this.setState({
                currentRangeObject: matchingRange.range,
                currentRange: matchingRange.id,
                canvasList: matchingRange.canvasList,
                regionList: matchingRange.regionList || [],
            });
        }
    }
    getMatchingRange({ manifest, rangeId, rangeViewingHint }) {
        const allRanges = manifest ? manifest.getAllRanges() : [];
        const matchingRange = allRanges.reduce((match, next) => {
            if (match)
                return match;
            if (rangeId && next.id === rangeId) {
                return next;
            }
            const nextViewingHint = next.getViewingHint();
            if (rangeViewingHint &&
                nextViewingHint &&
                nextViewingHint.toString() === rangeViewingHint) {
                return next;
            }
            const behavior = next.getBehavior();
            if (behavior && behavior.toString() === 'sequence') {
                return next;
            }
            return null;
        }, null);
        if (matchingRange) {
            const { canvases, regions } = extractCanvasAndRegionsFromRange(matchingRange);
            return {
                range: matchingRange,
                id: matchingRange.id,
                canvasList: canvases,
                regionList: regions,
            };
        }
        if (!manifest) {
            throw new Error();
        }
        return {
            range: undefined,
            id: manifest.id,
            regionList: [],
            canvasList: manifest
                .getSequenceByIndex(0)
                .getCanvases()
                .map((canvas) => canvas.id),
        };
    }
    componentWillReceiveProps(newProps, newContext) {
        if (newProps.currentIndex !== this.props.currentIndex &&
            newProps.currentIndex !== this.state.currentIndex) {
            this.setState({ currentIndex: newProps.currentIndex || 0 });
        }
        if (newProps.rangeId !== this.props.rangeId ||
            newProps.rangeViewingHint !== this.props.rangeViewingHint ||
            newProps.manifest !== this.props.manifest) {
            const matchingRange = this.getMatchingRange(this.props);
            this.setState({
                currentRangeObject: matchingRange.range,
                currentRange: matchingRange.id,
                canvasList: matchingRange.canvasList,
                regionList: matchingRange.regionList || [],
            });
        }
    }
    render() {
        const _a = this.props, { children } = _a, props = __rest(_a, ["children"]);
        const { currentIndex, currentRange, canvasList, regionList, currentRangeObject, } = this.state;
        if (!props.manifest) {
            return null;
        }
        const canvas = canvasList.length !== 0
            ? props.manifest
                .getSequenceByIndex(0)
                .getCanvasById(canvasList[currentIndex])
            : null;
        const region = regionList.length !== 0 ? regionList[currentIndex] : null;
        return (React__default.createElement(CanvasProvider$1, { currentCanvas: canvas ? canvas.id : undefined }, functionOrMapChildren(children, Object.assign(Object.assign({}, props), { nextRange: this.nextRange, previousRange: this.previousRange, getNextRange: this.getNextRange(currentIndex), getPreviousRange: this.getPreviousRange(currentIndex), goToRange: this.goToRange, currentIndex, rangeId: currentRange, range: currentRangeObject, canvasList,
            region, currentCanvasId: canvas ? canvas.id : null, canvas }))));
    }
}
RangeNavigationProvider.defaultProps = {
    fallbackToTop: true,
    fallbackToSequence: true,
    controlled: false,
};

const AnnotationRepresentation = (_a) => {
    var { annotations = [], onClickAnnotation, annotationStyle, growthStyle, bemModifiers, annotationContent } = _a, props = __rest(_a, ["annotations", "onClickAnnotation", "annotationStyle", "growthStyle", "bemModifiers", "annotationContent"]);
    return (React__default.createElement(CanvasRepresentation, Object.assign({}, props), annotations.map(({ annotation, on }, key) => {
        return typeof on.selector === 'string' ? null : (React__default.createElement(Annotation, { key: key, x: on.selector && on.selector.x ? on.selector.x : undefined, y: on.selector && on.selector.y ? on.selector.y : undefined, width: on.selector && on.selector.width ? on.selector.width : undefined, height: on.selector && on.selector.height ? on.selector.height : undefined, annotation: annotation, style: annotationStyle, onClick: onClickAnnotation, growthStyle: growthStyle, bemModifiers: bemModifiers, annotationContent: annotationContent }));
    })));
};

const AnnotationCanvasRepresentation = (_a) => {
    var { annotationStyle, onClickAnnotation, growthStyle, bemModifiers } = _a, props = __rest(_a, ["annotationStyle", "onClickAnnotation", "growthStyle", "bemModifiers"]);
    return (React__default.createElement(AnnotationListProvider$1, Object.assign({}, props),
        React__default.createElement(AnnotationProvider, null,
            React__default.createElement(AnnotationRepresentation, { onClickAnnotation: onClickAnnotation, annotationStyle: annotationStyle, growthStyle: growthStyle, bemModifiers: bemModifiers }))));
};

class AnnotationDetail extends React.Component {
    render() {
        const { annotation, onClose, closeText, bem } = this.props;
        const resource = annotation.getResource();
        const bodies = annotation.getBody();
        if (bodies.length) {
            return (React__default.createElement("div", { className: bem }, bodies.map((body, key) => {
                return (React__default.createElement("div", { key: key },
                    body.__jsonld.label ? (React__default.createElement("h1", { className: bem.element('label') }, body.__jsonld.label)) : null,
                    React__default.createElement("div", { className: bem.element('value'), key: key, dangerouslySetInnerHTML: { __html: body.__jsonld.value } }),
                    onClose ? (React__default.createElement("button", { className: bem.element('close'), onClick: onClose }, closeText)) : null));
            })));
        }
        if (resource && resource.getProperty('within')) {
            const toDisplay = resource.getProperty('within');
            return (React__default.createElement("div", { className: bem },
                React__default.createElement("h1", { className: bem.element('label') }, toDisplay.label),
                React__default.createElement("p", { className: bem.element('description') }, toDisplay.description),
                onClose ? (React__default.createElement("button", { className: bem.element('close'), onClick: onClose }, closeText)) : null));
        }
        return (React__default.createElement("div", { className: bem },
            React__default.createElement("h1", { className: bem.element('label') }, annotation.getLabel()),
            React__default.createElement("p", { className: bem.element('description') }, annotation.getProperty('description')),
            onClose ? (React__default.createElement("button", { className: bem.element('close'), onClick: onClose }, closeText)) : null));
    }
}
AnnotationDetail.defaultProps = {
    closeText: 'close',
};
var AnnotationDetail$1 = withBemClass('annotation-detail')(AnnotationDetail);

const EditableAnnotation = require('@canvas-panel/core/es/components/EditableAnnotation/EditableAnnotation')
    .default;
const Fullscreen = require('@canvas-panel/core/es/components/Fullscreen/Fullscreen')
    .default;
const ObservableElement = require('@canvas-panel/core/es/components/ObservableElement/ObservableElement')
    .default;
const LocaleString = require('@canvas-panel/core/es/manifesto/LocaleString/LocaleString')
    .default;
const FullPageViewport = require('@canvas-panel/core/es/viewers/FullPageViewport/FullPageViewport')
    .default;
const OpenSeadragonViewer = require('@canvas-panel/core/es/viewers/OpenSeadragonViewer/OpenSeadragonViewer')
    .default;
const OpenSeadragonViewport = require('@canvas-panel/core/es/viewers/OpenSeadragonViewport/OpenSeadragonViewport')
    .default;
const SizedViewport = require('@canvas-panel/core/es/viewers/SizedViewport/SizedViewport')
    .default;
const StaticImageViewport = require('@canvas-panel/core/es/viewers/StaticImageViewport/StaticImageViewport')
    .default;
const Viewport = require('@canvas-panel/core/es/viewers/Viewport/Viewport')
    .default;
const htmlElementObserver = require('@canvas-panel/core/es/utility/htmlElementObserver')
    .default;
const Responsive = require('@canvas-panel/core/es/utility/Responsive').default;

exports.Annotation = Annotation;
exports.AnnotationCanvasRepresentation = AnnotationCanvasRepresentation;
exports.AnnotationDetail = AnnotationDetail$1;
exports.AnnotationListProvider = AnnotationListProvider$1;
exports.AnnotationProvider = AnnotationProvider;
exports.AnnotationRepresentation = AnnotationRepresentation;
exports.AnnotationSelector = AnnotationSelector;
exports.Bem = Bem;
exports.CanvasNavigation = CanvasNavigation;
exports.CanvasProvider = CanvasProvider$1;
exports.CanvasRepresentation = CanvasRepresentation;
exports.EditableAnnotation = EditableAnnotation;
exports.FullPageViewport = FullPageViewport;
exports.Fullscreen = Fullscreen;
exports.LocaleString = LocaleString;
exports.Manifest = Manifest;
exports.ObservableElement = ObservableElement;
exports.OpenSeadragonViewer = OpenSeadragonViewer;
exports.OpenSeadragonViewport = OpenSeadragonViewport;
exports.RangeNavigationProvider = RangeNavigationProvider;
exports.Responsive = Responsive;
exports.SingleTileSource = SingleTileSource;
exports.SizedViewport = SizedViewport;
exports.StaticImageViewport = StaticImageViewport;
exports.Viewport = Viewport;
exports.functionOrMapChildren = functionOrMapChildren;
exports.htmlElementObserver = htmlElementObserver;
exports.parseSelectorTarget = parseSelectorTarget;
exports.useAnnotationLists = useAnnotationLists;
exports.useBemClassName = useBemClassName;
exports.useCanvas = useCanvas;
exports.useManifest = useManifest;
exports.withBemClass = withBemClass;
//# sourceMappingURL=index.js.map
