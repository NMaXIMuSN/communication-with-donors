// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PickKnownFieldProps<T extends {[K in 'input' | 'meta']: any}> = Pick<
    T,
    'input' | 'meta'
>;
