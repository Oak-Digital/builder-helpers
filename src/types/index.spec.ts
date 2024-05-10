import { GetDefaultValue, InputObject, InputObjectFallback, InputObjectToProp } from "./index.js";

test('fallback should be undefined when no required or default is set', () => {
    const input = {
        name: 'test',
        type: 'text',
    } as const satisfies InputObject;

    type Prop = InputObjectToProp<typeof input>;

    expectTypeOf({
        test: 'test',
    }).toMatchTypeOf<Prop>();
    expectTypeOf({
        test: undefined,
    }).toMatchTypeOf<Prop>();
});

test('fallback should be never when required is set', () => {
    const input = {
        name: 'test',
        type: 'text',
        required: true,
    } as const satisfies InputObject;

    type Prop = InputObjectToProp<typeof input>;

    expectTypeOf({
        test: 'test',
    }).toMatchTypeOf<Prop>();
    expectTypeOf({
        test: undefined,
    }).not.toMatchTypeOf<Prop>();
});

test('InputObjectFallback should not be undefined when default is set', () => {
    const input = {
        name: 'test',
        type: 'text',
        defaultValue: 'default',
    } as const satisfies InputObject;

    type Fallback = InputObjectFallback<typeof input>;

    expectTypeOf<Fallback>().not.toMatchTypeOf<undefined>();
});

test('fallback should not add undefined when default is set', () => {
    const input = {
        name: 'test',
        type: 'text',
        defaultValue: 'default',
    } as const satisfies InputObject;

    type Prop = InputObjectToProp<typeof input>;

    expectTypeOf<{
        test: 'default';
    }>().toMatchTypeOf<Prop>();
    expectTypeOf<{
        test: undefined;
    }>().not.toMatchTypeOf<Prop>();
});
