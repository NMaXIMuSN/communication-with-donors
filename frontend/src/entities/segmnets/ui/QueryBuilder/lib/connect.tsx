import React from 'react';

export const connect =
    <T, P, D>(
        mapStateToProps: (state: D) => object,
        mapDispatchToProps: object | null,
        Context: React.Context<T>,
    ) =>
    (WrappedComponent: React.ComponentType<P>): React.ComponentType<P> => {
        class Connect extends React.Component<P> {
            static contextType = Context;
            private unsubscribe!: () => void;

            componentDidMount() {
                const {subscribe} = this.context as {
                    subscribe: (listener: () => void) => () => void;
                };
                this.unsubscribe = subscribe(this.handleChange);
            }

            componentDidUpdate() {
                this.subscribeToContext();
            }

            componentWillUnmount() {
                this.unsubscribe();
            }

            subscribeToContext() {
                const {subscribe} = this.context as {
                    subscribe: (listener: () => void) => () => void;
                };
                this.unsubscribe = subscribe(this.handleChange);
            }

            handleChange = () => {
                this.forceUpdate();
            };

            render() {
                const {getState, dispatch} = this.context as {
                    getState: () => T;
                    dispatch: (action: object) => void;
                };

                const stateProps = mapStateToProps
                    ? mapStateToProps({...getState(), dispatch} as D)
                    : {};

                const dispatchProps: {[key: string]: (...args: any[]) => void} = {};
                if (mapDispatchToProps) {
                    Object.entries(mapDispatchToProps).forEach(
                        ([key, func]: [string, Function]) => {
                            dispatchProps[key] = (...props: any[]) => dispatch(func(...props));
                        },
                    );
                }

                return <WrappedComponent {...stateProps} {...dispatchProps} {...this.props} />;
            }
        }

        return Connect;
    };
