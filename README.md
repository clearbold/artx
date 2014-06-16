artx
====

Installing grunt and its dependencies for the project
-----------------------------------------------------

1. Open Terminal or your command line of choice.
2. Change to the project's root directory.
3. Install project dependencies with `npm install`.
4. Run Grunt with `grunt`.

Grunt is set up so that it's the primary task runner, and it will trigger the Jekyll builds as needed.  No need to run any Jekyll commands, just run `grunt`.

Stylesheets
-----------

Stylesheets are located in the _source/ui/sass directory.  We are using the SASS pre-processing language to generate our CSS stylesheets using grunt on the fly.