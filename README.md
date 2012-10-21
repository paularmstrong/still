Still
=====

_Still_ is a utility to help you manage your small site.

Because you know HTML, Git is your content management system. All that you really need is something to manage your templates. That's what _Still_ is for.

Usage
-----

### Getting Started

#### Data

For every `*.html` file found, _Still_ will look to see if there is a `.json` file of the same name in the same directory. If there is, that file will be used as the data context for the rendered template.

### Building Your Site

    still [path] -o [output path] [options]

#### Options:

* `-o`, `--out`
    * Output directory
    * [required]
* `-e`, `--engine`
    * Template engine
    * [default: "swig"]
* `-i`, `--ignore`
    * Ignore path
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

### Development and Testing

    still-server [path] [options]

#### Options:

* `-e`, `--engine`
    * Template engine
    * [default: "swig"]
* `-p`, `--port`
    * Server port
    * [default: 3000]
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
