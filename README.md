# react-redux's useSelector not updating on store change

## Reproduce

  - `yarn install`
  - `yarn start`
  - Go to `localhost:9000/demo.html`
  - On every change in the input the counter is supposed to increment, but the DOM is lagging one tick behind.
  Onthe first change the count is still 0, on the second change it's 1 and so on. (Open the redux devtools to see that the store is correct.)
  
Or
  - `yarn install`
  - `yarn test`
  
## Description
There are two reducers: name and counter.

The test component has an input field for the name. It also has an old `componentDidUpdate` and if the names differ, then it udpates a counter.

Problem: the counter is updated in the store but not reflected in the DOM depending on the selector used (see `src/RootWrapper.js`)

There is also a failing test for the problem: `yarn test` 

## Solution

Change so that useSelector gets a new function every render.

Change this:
```
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
    [...]
```

To this:
```
const RootWrapper = props => {
    const { children } = props;
    const dispatch = useDispatch();
    const { name, counter } = useSelector(state => {
        return {
            name: state.name,
            counter: state.counter,
        };
    }, shallowEqual);
```