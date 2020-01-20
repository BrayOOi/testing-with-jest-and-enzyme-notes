const googleSearch = require("./script");


dbMock = [
    "dog.com",
    "cheesepuff.com",
    "disney.com",
    "dogpictures.com"
];

it("this is a test", () => {
    expect(googleSearch("testtest", dbMock)).toEqual([]); // true
    expect(googleSearch("dog", dbMock)).toEqual(["dog.com", "dogpictures.com"]); // true
});

-----------------------------------------------------------------------------------------------

it("work with undefined and null input", () => {
    expect(googleSearch(null, dbMock)).toEqual([]); // true
    expect(googleSearch(undefined, dbMock)).toEqual([]); // true
});

it("does not return more than 3 matches", () => {
    expect(googleSearch(".com", dbMock).length).toEqual(3); // true
});

// group relevant tests together 
describe("googleSearch", () => {
    // it(............);
    // it(............);
});

-----------------------------------------------------------------------------------------------

Async script
------------

const fetch = require("node-fetch");

// Promise based
const getPeoplePromise = fetch => {
    return fetch("https://swapi.com/api/people")
        .then(response => response.json())
        .then(data => {
            return {
                count: data.count,
                results: data.results
            }
        })
};

// Async-await based
const getPeople = async (fetch) => {
    const getRequest = await fetch("https://swapi.com/api/people");
    const data = await getRequest.json();
    return {
        count: data.count,
        results: data.results
    }
};

module.export({
    getPeoplePromise,
    getPeople
})

-----------------------------------------------------------------------------------------------

Async script test
-----------------
const fetch = require("node-fetch");
const swapi = require("./script2");

it("calls swapi to get people", () => {
    expect.assertions(1); // pass if number of assertions tested equals number of assetions available
    // false
    swapi.getPeople(fetch).then(data => {
        expect(data.count).toEqual(87)
    })
});

it("calls swapi to get people", () => {
    swapi.getPeoplePromise(fetch).then(data => {
        expect(data.count).toEqual(87)
    })
});

it("calls swapi to get people", () => {
    expect.assertions(1); // pass if number of assertions tested equals number of assetions available
    // false
    swapi.getPeople(fetch).then(data => {
        expect(data.count).toEqual(87)
    })
});
// the test completed before the promise resolved or rejected
// and the promise is returned with a pending state
// and therefore failed expect.assetions(1);

// in order to overcome this function "done" can be passed in 

it("calls swapi to get people", done => {
    expect.assertions(1); // true
    swapi.getPeople(fetch).then(data => {
        expect(data.count).toEqual(87);
        done();
    })
});

// test will only complete after done is called
// another way is to simply return the promise

it("calls swapi to get people", () => {
    expect.assertions(1); // true
    return swapi.getPeople(fetch).then(data => {
        expect(data.count).toEqual(87);
    })
});

-----------------------------------------------------------------------------------------------

Mocks and Spies
---------------

it("getPeople returns count and results", () => {
    const mockFetch = jest.fn()
        .mockReturnValue(Promise.resolve({
            json: () => Promise.resolve({
                count: 87,
                results: [0,1,2,3,4,5]
            });
        }));
    return swapi.getPeoplePromise(mockFetch).then(data => {
        expect(mockFetch.mock.calls.length).toBe(1); // asserts the number of times the mock function being called inside the test
    })
});

// mockFetch is added so that every time the tests run, the tests will not make API calls unnecessarily

-----------------------------------------------------------------------------------------------

React Testing
================================================================================================

src/setupTests.js // place to configure Enzyme
-------------

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

configure({ adapter: new Adapter() });


Card.test.js // place to write tests for respective components
------------ 

import { shallow, mount, render } from "enzyme";
import React from "react";
import Card from "./Card";

console.log(shallow(<Card />));
// shallow render the targeted component only, not included nested components

it("expect to render Card component", () => {
    expect(shallow(<Card />).length).toEqual(1); // true
});

-----------------------------------------------------------------------------------------------

Snapshot Testing
----------------

// Enzyme takes a snapshot of the rendered component, 
// and compare the snapshot against a component everytime the component changes
// and passes snapshot if the component matches the snapshot

it("expect to render Card component", () => {
    expect(shallow(<Card />)).toMatchSnapshot(); // true
});

// a Snapshot will be taken for the 1st time, and can be updated to accomodate changes


-----------------------------------------------------------------------------------------------

Testing Stateful Components
---------------------------

CounterButton.test.js
---------------------

import { shallow, mount, render } from "enzyme";
import React from "react";
import CounterButton from "./CounterButton";

it("expect to render CounterButton component", () => {
    const mockColor = "red";
    expect(shallow(<CounterButton color={mockColor} />)).toMatchSnapshot(); // true
});

it("correctly increments the counter", () => {
    const mockColor = "red";
    const wrapper = shallow(<CounterButton color={mockColor} />);
    
    wrapper.find("[id='ccounter']").simulate("click"); // fire a click event
    expect(wrapper.state()).toEqual({ count: 1 });
    expect(wrapper.props().color).toEqual("red");
});

-----------------------------------------------------------------------------------------------

Testing Connected Components (connect()(Component))
------------------

App.test.js
-----------

import { shallow } from "enzyme";
import React from "react";
import App from "./App";

it("expect to render App component", () => {
    const mockStore = {
        robots: [],
        searchField: ""
    };
    expect(shallow(<App store={mockStore} />)).toMatchSnapshot(); // false
});

// because technically Connect HOC is being tested, along with redux and other state functionalities



import { shallow } from "enzyme";
import React from "react";
import MainPage from "./MainPage";

let wrapper;

beforeEach(() => { //before any tests run
    const mockProps = {
        onRequestRobots: jest.fn(),
        robots: [],
        searchField: "",
        isPending: false
    };
    
    wrapper = shallow(<MainPage {...mockProps} />)
});

it("renders MainPage without crashing", () => {
    expect(wrapper).toMatchSnapshot(); // true
});

it("filters robots correctly", () => {
    expect(wrapper.instance().filteredRobots([])).toEqual([]); // true
    // instance() grants access to inner scope of the functions and its variable and methods
});


-----------------------------------------------------------------------------------------------
    
Testing Reducers
----------------
        
reducers.test.js
----------------
        
import {
    CHANGE_SEARCHFIELD,
    REQUEST_ROBOTS_PENDING,
    REQUEST_ROBOTS_SUCCESS,
    REQUEST_ROBOTS_FAILED
} from "./constants";
        
import * as reducers from "./reducers.js";
        

describe("searchRobots", () => {
    const initialStateSearch = {
        searchField: ""
    };
    
    it("should return the initial state", () => {
        expect(reducers.searchRobots(undefined, {})).toEqual({ searchField: "" }); // true
    });
    
    it("should handle CHANGE_SEARCHFIELD", () => {
        expect(reducers.searchRobots(undefined, {
            type: CHANGE_SEARCHFIELD,
            payload: "abc"
        })).toEqual({ searchField: "abc" });
    });
});

describe("requestRobots", () => {
    const initialStateRobots = {
        robots: [],
        isPending: false
    };
    
    it("should return the initial state", () => {
        expect(reducers.requestRobots(undefined, {})).toEqual(initialStateRobots); // true
    }); 
    
    it("should handle REQUEST_ROBOTS_PENDING action", () => {
        expect(reducers.requestRobots(initialStateRobots, {
            type: REQUEST_ROBOTS_PENDING
        })).toEqual({
            robots: [],
            isPending: true
        }); // true
    });
    
    it("should handle REQUEST_ROBOTS_SUCCESS action", () => {
        expect(reducers.requestRobots(initialStateRobots, {
            type: REQUEST_ROBOTS_SUCCESS,
            payload: [{
                id: "123",
                name: "test",
                email: "test@gmail.com"
            }]
        })).toEqual({
            robots: [{
                id: "123",
                name: "test",
                email: "test@gmail.com"
            }],
            isPending: false
        }); // true
    });
    
    it("should handle REQUEST_ROBOTS_FAILED action", () => {
        expect(reducers.requestRobots(initialStateRobots, {
            type: REQUEST_ROBOTS_FAILED,
            payload: "Error"
        })).toEqual({
            error: "Error",
            robots: [],
            isPending: false
        }); // true
    });
});

-----------------------------------------------------------------------------------------------

Testing Actions
---------------

actions.test.js
---------------
        
npm install --save-dev redux-mock-store
//as asynchorous actions requires Redux-Thunk's dispatch and the redux-mock-store provides a mock env for thunkMiddleware
        
import * as actions from "./actions";
import {
    CHANGE_SEARCHFIELD,
    REQUEST_ROBOTS_PENDING,
    REQUEST_ROBOTS_SUCCESS,
    REQUEST_ROBOTS_FAILED
} from "./constants";

import configureMockStore from "redux-mock-store";
import thunkMiddleware from "redux-thunk";
        
const mockStore = configureMockStore([thunkMiddleware]); //recommended to place this in a setupTest.js file
        
it("should create an action to search robots", () => {
    const text = "woo";
    const expectedAction = {
        type: CHANGE_SEARCHFIELD,
        payload: text
    };
    
    expect(actions.setSearchField(text)).toEqual(expectedAction); // true
});

it("handles requesting robots API", dispatch => {
    const store = mockStore();
    store.dispatch(actions.requestRobots());
    const action = store.getActions();
    const expectedAction = {
        type: REQUEST_ROBOTS_PENDING
    };
    
    expect(action[0]).toEqual(expectedAction); // true
});










        








