# ECharts Widget

[![](https://nexus.lab.fiware.org/repository/raw/public/badges/chapters/visualization.svg)](https://www.fiware.org/developers/catalogue/)
![](https://img.shields.io/github/license/Wirecloud/echarts-widget.svg)

[![Build Status](https://travis-ci.org/Wirecloud/echarts-widget.svg?branch=develop)](https://travis-ci.org/Wirecloud/echarts-widget)
[![Coverage Status](https://coveralls.io/repos/github/Wirecloud/echarts-widget/badge.svg?branch=develop)](https://coveralls.io/github/Wirecloud/echarts-widget?branch=develop)

The echarts-widget is a [WireCloud widget](http://wirecloud.readthedocs.org/en/latest/) that provides an easy way to to
create interactive charts/graphs using the [ECharts Library](https://ecomfe.github.io/echarts-doc/public/en/index.html).

## Build

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io) in your system. For example, you can
install it on Ubuntu and Debian running the following commands:

```console
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

Install other npm dependencies by running:

```console
npm install
```

In order to build this operator you need to download grunt:

```console
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```console
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

## Documentation

Documentation about how to use this widget is available on the [User Guide](src/doc/userguide.md). Anyway, you can find
general information about how to use widgets on the
[WireCloud's User Guide](https://wirecloud.readthedocs.io/en/stable/user_guide/) available on Read the Docs.

## Copyright and License

-   Copyright (c) 2019 Future Internet Consulting and Development Solutions (FICODES)

-   Apache License 2.0
