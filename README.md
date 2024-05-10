# Builder.io helpers

## Install

```bash
npm i -D @oak-digital/builder-helpers
# or
pnpm add -D @oak-digital/builder-helpers
# or
yarn add -D @oak-digital/builder-helpers
```

## Infer props for a react component

With this library it is possible to infer the props for a react component from the component registration object to builder.
This means that you do not need to define the props for the react component as they can be inferred with a helper type.

You can use the helper type `RegisterObjectToProps` to get a type for the props of the react component based on the registration object for builder.

```ts
import { RegisterObjectToProps } from '@oak-digital/builder-helpers';
import { Component } from '@builder.io/sdk';
const registerObject = {
    inputs: [
        {
            name: 'text',
            type: 'string',
        },
    ];
} as const satisfies Component
type Props = RegisterObjectToProps<typeof registerObject>;
```

And then use `Props` as the props type for the component.

See the example below for how to make an existing component use this type helper.

<details>
    <summary>
        Here is an example with before and after:
    </summary>

**Before:**

```ts
// counter.tsx
type Props = {
    text: string;
};

const Counter = (props: Props) => {
    const [count, setCount] = React.useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            {props.text}: {count}
        </button>
    )
};
export default Counter;
```

```ts
// builder-registry.ts
import Counter from './counter';
Builder.registerComponent(Counter, {
    name: 'Counter',
    inputs: [
        {
            name: 'text',
            type: 'string',
        },
    ];
});
```

**After:**

Since the props that the component needs is tightly coupled to the data from builder, we will be defining the builder registration object in the react component file.

```ts
// counter.tsx
import { Component } from '@builder.io/sdk';
import { RegisterObjectToProps } from '@oak-digital/builder-helpers';

export const counterRegisterObject = {
    name: 'Counter',
    inputs: [
        {
            name: 'text',
            type: 'string',
        },
    ];
} as const satisfies Component;

type Props = RegisterObjectToProps<typeof counterRegisterObject>;

const Counter = (props: Props) => {
    const [count, setCount] = React.useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            {props.text}: {count}
        </button>
    )
};
export default Counter;
```

**NOTE** `as const` is required to make the type inference working correctly.<br />
**NOTE** `satisfies Component` gives you intelisense when writing the register object

```ts
// builder-registry.ts
import Counter, { counterRegisterObject } from './counter';
Builder.registerComponent(Counter, counterRegisterObject);
```
</details>

