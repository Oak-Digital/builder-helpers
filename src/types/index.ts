import { Keys } from "ts-toolbelt/out/Any/Keys.js";
import { Merge } from "ts-toolbelt/out/Union/Merge.js";

type BuilderInputPrimitiveTypeMap = {
    boolean: boolean;
    number: number;
    text: string;
    string: string;
    email: string;
    file: string;
    longText: string;
    richText: string;
    color: string;
    Tags: string[];
};
// Any text based field types can be enumable types https://www.builder.io/c/docs/custom-components-input-types
type EnumableTypes = 'text' | 'string' | 'email';
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type BuilderInputPrimitiveType = Prettify<Keys<BuilderInputPrimitiveTypeMap>>;
type BaseInputObject = {
    readonly name: string;
    readonly required?: boolean;
    // readonly defaultValue?: unknown;
    readonly [key: string]: unknown;
};
type UnknownInputObject = BaseInputObject & {
    readonly type: string;
}
type PrimitiveInputObject = BaseInputObject & {
    readonly type: BuilderInputPrimitiveType;
};
type EnumInputObject = BaseInputObject & {
    readonly type: EnumableTypes;
    readonly enum: readonly string[];
};
type ListInputObject = BaseInputObject & {
    readonly type: 'list';
    readonly subFields: readonly InputObject[];
};
type ObjectInputObject = BaseInputObject & {
    readonly type: 'object';
    readonly subFields: readonly InputObject[];
};

/**
 * This types tries to determine if the input is required or has a default value
 * If it has a default value or is required, the prop should also be required, meaning there will not be a fallback
 * If it is not required and does not have a default, the fallback is undefined
 */
type InputObjectFallback<T extends InputObject> =
    T['defaultValue'] extends undefined ?
    T['required'] extends true ?
    never :
    undefined :
    T['defaultValue'] extends unknown ?
    never :
    T['defaultValue'];

type InputObject = PrimitiveInputObject | UnknownInputObject | EnumInputObject | ListInputObject;

type InferEnumType<T extends EnumInputObject> = T['enum'][number];
type InferListType<T extends ListInputObject> = InputObjectArrayToProps<T['subFields']>[];
type InferObjectType<T extends ObjectInputObject> = InputObjectArrayToProps<T['subFields']>;
type InferInputBaseType<T extends InputObject> =
    T extends EnumInputObject ? InferEnumType<T> :
    T extends ListInputObject ? InferListType<T> :
    T extends ObjectInputObject ? InferObjectType<T> :
    T extends PrimitiveInputObject ? BuilderInputPrimitiveTypeMap[T['type']] :
    unknown;
type InferInputType<T extends InputObject> = InferInputBaseType<T> | InputObjectFallback<T>;
type InputObjectToProp<T extends InputObject> = {
    readonly [K in T['name']]: InferInputType<T>;
};

type InputObjectArrayToPropsArray<T extends readonly InputObject[]> = {
    readonly [K in keyof T]: InputObjectToProp<T[K]>;
}

type InputObjectArrayToProps<T extends readonly InputObject[]> = Merge<InputObjectArrayToPropsArray<T>[number]> & {
    attributes: {
        'builder-id': string;
        [key: string]: any;
    };
};
export type RegisterObjectToProps<T extends { inputs: readonly InputObject[] }> = InputObjectArrayToProps<T['inputs']>;

