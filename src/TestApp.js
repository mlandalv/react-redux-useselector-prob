import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import RootWrapper from './RootWrapper';
import { nameReducer, counterReducer } from './reducers';

let composeEnhancers = compose;
if (process.env.NODE_ENV !== 'production') {
    composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

class DemoComp extends React.PureComponent {
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

DemoComp.propTypes = {
    name: PropTypes.string.isRequired,
    counter: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const store = createStore(combineReducers({
    name: nameReducer,
    counter: counterReducer,
}), {
    name: 'Initial name',
    counter: 0,
}, composeEnhancers());

ReactDOM.render(<Provider store={store}>
    <RootWrapper>
        {data => <DemoComp {...data} />}
    </RootWrapper>
</Provider>, document.getElementById('App'));
