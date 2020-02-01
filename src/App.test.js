import App from './App';
import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter : new Adapter()});
const wrapper = mount(<App/>);
const constant = {twoSeconds : 2000};
it('renders search field', () => {
   let findButton = wrapper.find('#findButton').at(0);
   let subredditInputField = wrapper.find('#subredditInputField').at(0);
   // button starts as disabled and semi-transparent
   expect(findButton.text()).toBe('Find');
   expect(findButton.prop('style').opacity).toBe(0.3);
   expect(findButton.prop('disabled')).toBe(true);
   subredditInputField.simulate('change', {target : {name : 'subredditInputField', value : 'foo'}});
   // button is enabled and opaque
   findButton = wrapper.find('#findButton').at(0);
   expect(findButton.prop('style').opacity).toBe(1);
   expect(findButton.prop('disabled')).toBe(false);
   subredditInputField.simulate('change', {target : {name : 'subredditInputField', value : ''}});
   // button returns to being disabled and semi-transparent
   findButton = wrapper.find('#findButton').at(0);
   expect(findButton.prop('style').opacity).toBe(0.3);
   expect(findButton.prop('disabled')).toBe(true);
   subredditInputField.simulate('change', {target : {name : 'subredditInputField', value : 'qwoeiasdf-NonExistentSubreddit-qoweriqwp'}});
   findButton.simulate('click');
   // failed search alert is diplayed
   setTimeout(() => {
      let failedSearchDiv = wrapper.find('#failedSearchDiv').at(0);
      expect(failedSearchDiv.exists()).toBe(true);
      subredditInputField.simulate('change', {target : {name : 'subredditInputField', value : 'excilior'}});
      findButton.simulate('click');
      // failed search alert is removed
      setTimeout(() => {
         failedSearchDiv = wrapper.find('#failedSearchDiv').at(0);
         expect(failedSearchDiv.exists()).toBe(false);
      }, constant.twoSeconds);
   }, constant.twoSeconds);
});