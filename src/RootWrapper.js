import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

const mapStateToProps = state => {
    return {
        name: state.name,
        counter: state.counter,
    };
};

const RootWrapper = props => {
    const { children } = props;
    const dispatch = useDispatch();
    const { name, counter } = useSelector(mapStateToProps, shallowEqual);

    // Using this one instead works.
    // const { name, counter } = useSelector(state => {
    //     return {
    //         name: state.name,
    //         counter: state.counter,
    //     };
    // }, shallowEqual);

    return (
        <div className="root-wrapper">
            <h1>Root component</h1>
            <div>{children({ name, counter, dispatch })}</div>
        </div>
    );
};

RootWrapper.propTypes = {
    children: PropTypes.func.isRequired,
};

export default RootWrapper;
