Still [![Build Status](https://secure.travis-ci.org/paularmstrong/still.png)](http://travis-ci.org/paularmstrong/still)
=====

_Still_ is a utility to help you manage your small site.

Because you know HTML, Git is your content management system. All that you really need is something to manage your templates. That's what _Still_ is for.

Installation
------------

    npm install -g still

Still is a command-line utility. It's preferred that you install it globally, though it will still work anywhere you like.

Supported Template Engines
--------------------------

_Still_ supports any template engine that [consolidate.js](https://github.com/visionmedia/consolidate.js/blob/master/Readme.md) supports. However, since you likely only use one or two of them, none of them are included by default.

Install your desired template engine at the same location (globally or locally) that you installed _Still_

    npm install -g swig

Getting Started
---------------

_Still_ comes with two utilities: `still` and `still-server`. When you're in development mode, making changes, and testing: use `still-server`. When you're ready to push your site live, build it to static files using `still`.

_Still_ operates by recursively walking over your template directory, finding every `.html` file, and building it with optional related `.json` files that you provide, if any.

### Data

For every `*.html` file found, _Still_ will look to see if there is a `.json` file of the same name in the same directory. If the file exists, it will be used as _local data_ context for the rendered template.

At the same time, _Still_ will also look for a `.json` file for the entire directory. If that file exists, your _local data_ will be applied over this, and the resulting data object used for the rendered template.

### Example Hierarchy

    site
    ├── index.html
    ├── about.json
    ├── about
    |   ├── index.html
    |   ├── index.json
    |   └── contact.html
    └── terms.html

In the above example:

* Notice that all `.json` files are optional.
* `site/index.html` will be rendered with no data.
* `site/about/index.html` will be rendered with `site/about/index.json` applied atop `site/about.json`.
* `site/about/contact.html` will be rendered with `site/about.json`.

##### Output Hierarchy

_Still_ will slightly modify the hierarchy of your files in order to provide "clean URLs" for you. This means that you should always reference all pages without `.html` extensions and assume a trailing `/` instead.

Building the above example will output the following:

    site
    ├── index.html
    ├── about
    |   ├── index.html
    |   └── contact
    |       └── index.html
    └── terms
        └── index.html

This means that a URL to the `contact` page should be `/about/contact/`.

##### Error Pages

The still server expects that your error documents be located at `/error/{status_code}.html` or `/error/{status_code}/index.html`

For example:

    site
    ├── error
        ├── 404.html
        └── 500
            └── index.html

`still`: Building Your Site
---------------------------

    still [path] -o [output path] [options]

### Options:

* `-o`, `--out`
    * Output directory
    * [required]
* `-e`, `--engine`
    * Template engine
    * [default: "swig"]
* `-i`, `--ignore`
    * Ignore path or regular expression
* `-l`, `--link`
    * Create symbolic links to non-template files instead of copying them
* `--encoding`
    * File encoding (input and output)
    * [default: "utf-8"]
* `--verbose`
    * Verbosity mode:
        * 0 = silent
        * 1 = default
        * 2 = warnings
        * 3 = debug
    * [default: 1]

`still-server`: Development and Testing
---------------------------------------

    still-server [path] [options]

#### Options:

* `-e`, `--engine`
    * Template engine
    * [default: "swig"]
* `-p`, `--port`
    * Server port
    * [default: 3000]
* `-o`, `--open`
    * Open your site in a web browser
* `--err`
    * Relative path to error 404 page
    * [default: 'error/404.html']
* `--encoding`
    * File encoding (input and output)
    * [default: "utf-8"]
* `--verbose`
    * Verbosity mode:
        * 0 = silent
        * 1 = default
        * 2 = warnings
        * 3 = debug
    * [default: 1]

License
-------

(The MIT License)

Copyright (c) 2012 Paul Armstrong <paul@paularmstrongdesigns.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
