# ECharts Widget


[![Build Status](https://travis-ci.org/Wirecloud/echarts-widget.svg?branch=develop)](https://travis-ci.org/Wirecloud/echarts-widget)
[![Coverage Status](https://coveralls.io/repos/github/Wirecloud/echarts-widget/badge.svg?branch=develop)](https://coveralls.io/github/Wirecloud/echarts-widget?branch=develop)

The echarts-widget is a WireCloud widget that provides an easy way to to create interactive charts/graphs using the [ECharts Library](https://ecomfe.github.io/echarts-doc/public/en/index.html).

## How it's works?
Send the [ECharts option JSON](https://ecomfe.github.io/echarts-doc/public/en/option.html#title) to the `echarts_options` input endpoint.

ECharts options JSON example for a simple linear chart:
```
{
    "xAxis": {
        "type": "category",
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
        "type": "value"
    },
    "series": [{
        "data": [820, 932, 901, 934, 1290, 1330, 1320],
        "type": "line"
    }]
}
```

<a href="url"><img src="https://github.com/Wirecloud/echarts-widget/blob/develop/src/images/exampleLineChart.png" align="center" width="40%" ></a>

See more examples in [ECharts Examples Site](https://ecomfe.github.io/echarts-examples/public/index.html).

Build
-----

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

Install other npm dependencies by running:

```bash
npm install
```

In order to build this operator you need to download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

## Documentation

Documentation about how to use this widget is available on the
[User Guide](src/doc/userguide.md). Anyway, you can find general information
about how to use widgets on the
[WireCloud's User Guide](https://wirecloud.readthedocs.io/en/stable/user_guide/)
available on Read the Docs.

## Copyright and License

Copyright (c) 2019 Future Internet Consulting and Development Solutions (FICODES)

