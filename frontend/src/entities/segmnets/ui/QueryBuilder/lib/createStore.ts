export function createStore(
    reducer: (state?: object, actions?: object) => object,
    initialState?: object,
) {
    let state = {...reducer(), ...initialState};

    const listeners: (() => void)[] = [];

    function getState() {
        return state;
    }

    function subscribe(listener: () => void) {
        if (!listeners.includes(listener)) listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);

            if (index !== -1) {
                listeners.splice(index, 1);
            }
        };
    }

    function dispatch(action: object) {
        try {
            state = reducer(state, action);
        } catch (error) {
            console.error(error);
        }

        for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
        }
    }

    return {getState, dispatch, subscribe};
}
