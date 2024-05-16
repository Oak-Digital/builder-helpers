import {
    GetDefaultValue,
    InputObject,
    InputObjectFallback,
    InputObjectToProp,
} from './index.js';

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

test('enum can be string', () => {
    const input = {
        name: 'test',
        type: 'enum',
        enum: ['a', 'b'],
    } as const satisfies InputObject;

    type Prop = InputObjectToProp<typeof input>;

    expectTypeOf<{
        test: 'a' | 'b';
    }>().toMatchTypeOf<Prop>();
});

test('enum can be number', () => {
    const input = {
        name: 'test',
        type: 'enum',
        enum: [1, 2],
    } as const satisfies InputObject;

    type Prop = InputObjectToProp<typeof input>;

    expectTypeOf<{
        test: 1 | 2;
    }>().toMatchTypeOf<Prop>();
});
