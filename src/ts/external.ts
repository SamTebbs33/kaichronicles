// External declarations
// numberPicker.ts
interface JQuery {
    getNumber(): number;
    setNumber(value: number): void;
    getTitle(): string;
    bindNumberEvents(): void;
    fireValueChanged(): void;
    getMinValue(): number;
    getMaxValue(): number;
    isValid(): boolean;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    initializeValue(): void;
}

// xmllint.js
declare function validateXML(parms: any): string;

// commons.ts:
interface Array<T> {
    removeValue( value: T ): boolean;

    /**
     * Returns a deep clone of this array.
     * This will call to clone() / deepClone() of each array element, if it has. Otherwise the element will be directly copied.
     */
    deepClone(): T[];
}

// commons.ts:
interface String {
    replaceAll(find: string, replace: string): string;
    isValidFileName(): boolean;
    escapeRegExp(): string;
    unescapeHtml(): string;
    getUrlParameter(sParam: string): string;
}
