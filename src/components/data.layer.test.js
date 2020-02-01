import Adapter from 'enzyme-adapter-react-16';
import DataLayer from './data.layer';
import React from 'react';
import {configure, shallow} from 'enzyme';

configure({adapter : new Adapter()});
const wrapper = shallow(<DataLayer/>);
const instance = wrapper.instance();
let result;
const originalPosts = [
   {data : {id : 'one', stickied : true, title : 'Title 1'}},
   {data : {id : 'two', stickied : true, title : 'Title 2'}},
   {data : {id : 'four', stickied : false, title : 'Title 4'}},
   {data : {id : 'three', stickied : false, title : 'Title 3'}},
];
const withNewPostsAdded = [
   {data : {id : 'one', stickied : true, title : 'Title 1'}},
   {data : {id : 'two', stickied : true, title : 'Title 2'}},
   {data : {id : 'six', stickied : false, title : 'Title 6'}},
   {data : {id : 'five', stickied : false, title : 'Title 5'}},
   {data : {id : 'four', stickied : false, title : 'Title 4'}},
   {data : {id : 'three', stickied : false, title : 'Title 3'}},
];
const withPostsDeleted = [
   {data : {id : 'one', stickied : true, title : 'Title 1'}},
   {data : {id : 'six', stickied : false, title : 'Title 6'}},
   {data : {id : 'five', stickied : false, title : 'Title 5'}},
   {data : {id : 'three', stickied : false, title : 'Title 3'}},
];
const withPostsChanged = [
   {data : {id : 'one', stickied : true, title : 'Title 1'}},
   {data : {id : 'two', stickied : true, title : 'Star Wars'}},
   {data : {id : 'six', stickied : false, title : 'Title 6'}},
   {data : {id : 'five', stickied : false, title : 'Title 5'}},
   {data : {id : 'four', stickied : false, title : 'Harry Potter'}},
   {data : {id : 'three', stickied : false, title : 'Title 3'}},
];
test('addNewPosts()', () => {
   result = instance.addNewPosts(originalPosts, withNewPostsAdded);
   expect(JSON.stringify(result) === JSON.stringify(withNewPostsAdded)).toEqual(true);
   result = instance.addNewPosts([], withNewPostsAdded);
   expect(JSON.stringify(result) === JSON.stringify(withNewPostsAdded)).toEqual(true);
   result = instance.addNewPosts(originalPosts, []);
   expect(JSON.stringify(result) === JSON.stringify(originalPosts)).toEqual(true);
});
test('removeDeletedPosts()', () => {
   result = instance.removeDeletedPosts(withNewPostsAdded, withPostsDeleted);
   expect(JSON.stringify(result) === JSON.stringify(withPostsDeleted)).toEqual(true);
   result = instance.removeDeletedPosts([], withNewPostsAdded);
   expect(JSON.stringify(result) === JSON.stringify([])).toEqual(true);
   result = instance.removeDeletedPosts(withNewPostsAdded, []);
   expect(JSON.stringify(result) === JSON.stringify([])).toEqual(true);
});
test('updateExistingPosts()', () => {
   result = instance.updateExistingPosts(withNewPostsAdded, withPostsChanged);
   expect(JSON.stringify(result) === JSON.stringify(withPostsChanged)).toEqual(true);
   result = instance.updateExistingPosts([], withPostsChanged);
   expect(JSON.stringify(result) === JSON.stringify([])).toEqual(true);
   result = instance.updateExistingPosts(withNewPostsAdded, []);
   expect(JSON.stringify(result) === JSON.stringify(withNewPostsAdded)).toEqual(true);
});