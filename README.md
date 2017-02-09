ARP - Adult Robbery Patterns Simulator
======================================

This is a web-based simulator of ARP.

Try it yourself at: https://jieidson.github.io/arp/

Technologies
------------

This project uses the following technologies:
* [Angular](https://angular.io/) - Framework used for GUI.
* [Angular CLI](https://cli.angular.io/) - Build tooling.
* [Karma](https://karma-runner.github.io/) - Unit-test framework.
* [Protractor](http://www.protractortest.org/) - End-to-end test framework.

Development
-----------

The following is only necessary if you wish to set up a development environment
to work on the ARP simulator code.

* Install [Node.js](https://nodejs.org/).
* In this project's root directory install dependencies with:

        npm install

* Run a development server (http://localhost:4200/):

        npm start

* Generate a production build:

        npm run build:prod

* To run unit tests:

        # This will open a Chrome window for tests, and watch for changes.
        npm run test

        # Run tests once and then exit
        npm run test -- --watch=false

        # Run tests through PhantomJS
        npm run test -- --watch=false --browsers PhantomJS

* To run end-to-end tests:

        # First, start a development server:
        npm start

        # Then, in another terminal:
        npm run e2e

* To run lint checks:

        npm run lint

* To scaffold new classes:

        # Can also generate directive/pipe/service/class/module
        npm generate component component-name

* To deploy to GitHub pages:

        npm run ng -- github-pages:deploy
