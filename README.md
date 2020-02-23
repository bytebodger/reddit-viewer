# Reddit-Lite

This is a demo application that uses React to allow for basic browsing of subreddits.


# Getting Started

Once you've downloaded the source code, you'll need to run

    npm install
Because none of the node modules are included in this repository.

## Features

As per the provided specs, the app does the following:

 - Allows the user to search for a subreddit.
	 - The "FIND" button is washed out and disabled until something is entered into the search field.
	 - If the subreddit cannot be found, an alert is displayed at the top of the page.
 - Assuming that the subreddit is found, the results are displayed in a paginated `ReactTable`, 25 entries per page.
 - Each entry consists of a thumbnail (if one exists for that post), a title, the name of the Reddit user, the creation date/time, and the number of comments.
	 - The title is linked to the thread on subreddit (or, in the case of subreddit links, the title goes directly to the link).
	 - The number of comments links back to the comments section for that post on Reddit.
 - Once a successful search has been returned, a repeating one-minute timer begins.  For every minute thereafter, the current subreddit is re-polled and any new/updated values are dynamically inserted into the paginated table.
 - Since subreddits can potentially be huge, the Reddit API limits individual calls to 100 records.  To work around this limitation, a lazy-load is featured when navigating through the paginated results.  Whenever the user gets to the next-to-last page of the results, the app makes another call to Reddit to get the *next* 100 results.
	 - This can be seen in the app by querying any sufficiently-large subreddit.  No matter how large the subreddit is, there will never be more than 100 returns in the original data load (plus however many posts are deemed as "sticky").  This means that there is never (initially) more than 5 pages of posts.  However, when the user moves to the *3rd* page, the system will make a new call for the next 100 posts, and the user will be able to see the number of available pages updated.





## State Management
There is no third-party statement management tool used.  The state values needed to run the app are very slight and this did not justify the overhead (both in download packages, and in coding constructs) needed to implement 3rd-party state management tools.  This is especially true of Redux - which is a powerful tool, but for this application, it would be like building a sand castle with a bulldozer.

Shared state is accomplished via React's native Context API.


## Layered Architecture
Whenever I'm doing green-fields development, I tend to use an approach with multiple, nested layers.  The layers tend to act like a data cache (because a layer that's higher in the structure may be storing some values which will, eventually, get used in lower levels of the structure).  This is also an effective way to build single-page apps, because all of the data/logic resides in the multiple layers.  Thus, there is no need to ever "refresh" the apps web page.

In this app, the layers are as such:

    <App/> --> <DataLayer/> --> <DisplayLayer/>
The `<DisplayLayer/>`, in turn, renders `<FindSubredditForm/>` and `<PostsTable/>`.

## Type Checking(ish)
Since this app is done in "regular" React/JavaScript, with no TypeScript or Flow, I've still implemented my default solution for type checking on methods.  Because you can never theoretically know exactly how other future developers will choose to invoke your methods, I feel it's good practice to always check the *types* of values that have been passed into a method.

For this reason, I have a utility library that I frequently use.  It's in `utilities/is.js`.  It contains a series of simple Boolean checks to determine whether a value is of a given type.  These are then used as such:

    import is from '../utilities/is';
    import React from 'react';

    export default class Foo extends React.Component {
       iterateOverThisArray(appendMessageToOutput = '', array = []) {
          if (!is.anArray(array) || !is.aPopulatedString(appendMessageToOutput)) return;
          array.forEach(element => `${element} ${appendMessageToOutput}`);
       }

       render() {
          return null;
       }
    }

## Loading Additional Posts
The Reddit API is limited to 100 posts at a time.  But of course, many subreddits have far more results than that.  You can get all of the "rest" of the posts by doing subsequent API calls - but we don't want to needlessly slam their API.  Nor do we want to retrieve a ton of data that the user may never care about.  So I chose a lazy-load solution, based on which page of the results that you're currently viewing.

The table only shows 25 posts at a time.  This means that, on a mature subreddit, there are 4 pages of initial results (5 pages, if the subreddit contains at least one "sticky" post).  So every time the user goes forward through the results, we check to see if a new call must be made for additional posts.  As you page through the results and you get close to the "end", you'll see the number of pages increase after the *next* 100 returns are retrieved and added to the list.

The only "downside" to this approach, is that it initially gives the user a false sense of the total posts available to be read.  In my current implementation, the user could be querying a Subreddit with millions of posts, but it will still (initially) say that there are only 4-5 pages of results.  It's only after the user starts paging toward the end that they start to realize there are more posts out there to be retrieved/read.

This can be fixed with more time.  I'm assuming that, somewhere in the Reddit API, I can get a field that tells the **total** number of posts in the subreddit.  Once I have that number, I can manually change the value on the bottom that says "Page 1 of X".  Of course, if the table shows that this is "Page 1 of 23,498", and the user manually changes the page to 23,192, we won't immediately have that data on hand.  This means that additional logic would need to be added that says, "If the user has navigated to a page that's not currently populated with posts, launch a new `fetch()` and go get the missing data."

## Updating In-Place
Once a successful search is returned, a timer is launched that will look for new/updated values once per minute.  A great deal of thought/effort was put into this to ensure that we are minimizing any unnecessary renders.  The *easy* (lazy) approach would have been to just say, "Get the latest version of the posts that the user is currently viewing - and then just replace all the old ones with the new ones."  The problem is that, especially on smaller/quieter subreddits, there's a good chance that, on a minute-to-minute basis, most/all of those posts haven't changed in any way.  So it creates an unnecessary load if we always replace the old posts with the "new" posts, given that those "new" posts may be identical, in every way, to the old ones.  So I took these steps to avoid unnecessary re-renders:

 1. The system only queries the posts that are currently being viewed.  In other words, if the user is looking at Page 8 of the results, then the system only checks the 25 posts that are on Page 8.  This has the added benefit of keeping things from "jumping around" if live subreddit users have submitted a new post.
 2. The update check, running once a minute, does not run unless the last subreddit search was successful.  So we're not needlessly launching API calls from the browser.
 3. When the "updated" posts are received from the API, we first check to see if any of the existing posts have been changed (e.g., a new comment has been added to the post).  Then we check to see if there are entirely brand new posts.  And finally we check to see if any of the posts that the user is viewing have, in the last minute, been *deleted*.  If none of the posts have been edited/updated, and there are no new posts to add, and there are no posts that have been deleted, then we don't even attempt to do a re-render.  There's no need to.  The data set has not been changed.

## Testing
I don't know if this demo has *as many* tests as you'd like to see.  I could certainly think of a great many tests to add to the codebase.  But (and I'm going to be frank here) at some point, I stop and ask myself, "Just how many *more* hours am I going to pile onto this project for a job offer that you may never receive - or may not accept?"

But here's what I do want you to consider:  In those places where I have *pure* functions, I've written unit tests.  These can be seen in `/components/data.layer.test.js` and `/utilities/is.test.js`.

Some people advocate for slapping unit tests *on every single function/method in the app* - even those that are highly integrated with other components, or with user-generated events, or with state management.  I believe that this is a wrong-headed approach.  They end up jumping through so many hoops trying to create a scenario where that function/method can operate (and be tested) completely on its own, that they end up testing "air" - because the passing (or failing) of the test has no bearing on whether the app is broken or functioning properly.

For the majority of rendered React functions/methods, I believe strongly in integration testing.  You can see this in `/App.test.js`.  Here, we're starting the process of automating a user's path through the application.  In those cases where a function is not "pure" (and most React functions are not pure), the integration testing like I've shown in `/App.test.js` is far more meaningful.
