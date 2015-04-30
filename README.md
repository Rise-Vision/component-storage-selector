# Storage Selector [![Circle CI](https://circleci.com/gh/Rise-Vision/component-storage-selector/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/component-storage-selector/tree/master)

## Introduction

The Storage Selector component is an Angular directive which provides the Storage Icon button to launch a modal containing Storage selection.

For usage documentation and a visual example, visit the style guide for the Storage Selector component [here](http://rise-vision.github.io/style-guide/#/components/storage-selector).

Storage Selector works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Built With
- [AngularJS](https://angularjs.org/)
- [Angular UI Bootstrap](https://angular-ui.github.io/bootstrap/)
- [npm](https://www.npmjs.org)
- [Bower](http://bower.io/)
- [Gulp](http://gulpjs.com/)
- [Karma](http://karma-runner.github.io/0.12/index.html) and [Mocha](http://mochajs.org/) for testing

## Development

### Dependencies
* [Git](http://git-scm.com/) - Git is a free and open source distributed version control system that is used to manage our source code on Github.
* [npm](https://www.npmjs.org/) & [Node.js](http://nodejs.org/) - npm is the default package manager for Node.js. npm runs through the command line and manages dependencies for an application. These dependencies are listed in the _package.json_ file.
* [Bower](http://bower.io/) - Bower is a package manager for Javascript libraries and frameworks. All third-party Javascript dependencies are listed in the _bower.json_ file.
* [Gulp](http://gulpjs.com/) - Gulp is a Javascript task runner. It lints, runs unit and E2E (end-to-end) tests, minimizes files, etc. Gulp tasks are defined in _gulpfile.js_.

### Local Development Environment Setup and Installation
To make changes to the component, you'll first need to install the dependencies:

- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js and npm](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
- [Bower](http://bower.io/#install-bower) - To install Bower, run the following command in Terminal: `npm install -g bower`. Should you encounter any errors, try running the following command instead: `sudo npm install -g bower`.
- [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) - To install Gulp, run the following command in Terminal: `npm install -g gulp`. Should you encounter any errors, try running the following command instead: `sudo npm install -g gulp`.

The component can now be installed by executing the following commands in Terminal:
```
git clone https://github.com/Rise-Vision/component-storage-selector.git
cd component-storage-selector
npm install
bower install
gulp build
```

The source code for the component can be found in the `src` folder. This is where you will want to make your custom changes.

### Run Local

To preview the Storage Selector component in a browser, you can do so by using a Gulp task that is also internally used by the gulp test task (see Testing section below). Execute the following command in Terminal:
```
gulp e2e:server
```

This now runs a local server at http://localhost:8099 which allows you to view the location of the E2E test HTML file at http://localhost:8099/test/e2e/storage-selector-scenarios.html

### Testing
Execute the following command in Terminal to run both end-to-end and unit tests:
```
gulp test
```


## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
