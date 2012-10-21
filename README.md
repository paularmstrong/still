Still
=====

_Still_ is a utility to help you manage your small site.

Because you know HTML, Git is your content management system. All that you really need is something to manage your templates. That's what _Still_ is for.

Usage
-----

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
