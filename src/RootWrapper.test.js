import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore as reduxCreateStore } from 'redux';
import { render, fireEvent, act } from '@testing-library/react';
import { nameReducer, counterReducer } from './reducers';
import RootWrapper from './RootWrapper';

const createStore = initialState => {
    return reduxCreateStore(combineReducers({
        name: nameReducer,
        counter: counterReducer,
    }), initialState);
};

const renderWithRedux = (element, initialData) => {
    const store = createStore(initialData);
    const ReduxWrapper = props => <Provider store={store}>{props.children}</Provider>;
    const renderData = render(element, {
            wrapper: ReduxWrapper,
        },
    );

    return {
        store,
        ...renderData,
    };
};

afterEach(() => {
    jest.clearAllMocks();
});

describe('child content and store subscription', () => {
    test('renders row, history and future', () => {
        const { getByTestId } = renderWithRedux((
            <RootWrapper>
                {({ name, counter }) => {
                    return (
                        <div>
                            <div>String value: <span data-testid="name">{name}</span></div>
                            <div>Number value: <span data-testid="counter">{counter}</span></div>
                        </div>
                    );
                }}
            </RootWrapper>
        ), { name: 'Arnold', counter: 0 });

        expect(getByTestId('name')).toHaveTextContent('Arnold');
        expect(getByTestId('counter')).toHaveTextContent('0');
    });

    test('rerenders when store changes, e.g. due do dispatch in componentDidUpdate', () => {
        class TestComp extends React.PureComponent {
            componentDidUpdate(prevProps) {
                if (prevProps.name !== this.props.name) {
                    this.props.dispatch({ type: 'SET_COUNTER', payload: this.props.counter + 1 });
                }
            }

            onNameChange = e => {
                this.props.dispatch({ type: 'SET_NAME', payload: e.target.value });
            };

            render() {
                const { name, counter } = this.props;

                return (
                    <div>
                        <div data-testid="name-input">
                            <input type="text" value={name} onChange={this.onNameChange}/>
                        </div>

                        <div>Counter: <span data-testid="counter-span">{counter}</span></div>
                    </div>
                );
            }
        }

        const { getByTestId, store } = renderWithRedux((
            <RootWrapper>
                {data => <TestComp {...data} />}
            </RootWrapper>
        ), { name: '', counter: 0 });

        const input = getByTestId('name-input').querySelector('input');
        const counterSpan = getByTestId('counter-span');

        // Assert that initial rendered content matches store.
        expect(store.getState().name).toBe('');
        expect(store.getState().counter).toBe(0);
        expect(input).toHaveValue('');
        expect(counterSpan).toHaveTextContent('0');

        // 1. Change name which triggers rerender,
        // 2. dispatch in componentDidUpdate changes counter which should trigger yet another render.
        fireEvent.change(input, { target: { value: 'Another name' } });

        expect(store.getState().name).toBe('Another name');
        expect(store.getState().counter).toBe(1); // The updated counter value is reflected in the store
        expect(input).toHaveValue('Another name');
        expect(counterSpan).toHaveTextContent('1'); // ...but not in the DOM.
    });
});
