## Introduction

The echarts-widget is a WireCloud widget that provides an easy way to to create interactive charts/graphs using the [ECharts Library](https://echarts.apache.org/en/index.html).

## Settings

There are no settings defined in this widget.

## Wiring

### Input Endpoints

- **EChart options**: Load new ECharts options JSON.

This endpoint expects to receive an [ECharts option JSON](https://echarts.apache.org/en/api.html#echartsInstance.setOption)

### Output Endpoints

There are no output endpoints defined in this widget.

## Usage

Send to **EChart options** endpoint an [ECharts option JSON](https://echarts.apache.org/en/option.html#title), for example, a simple linear chart:
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

<a href="url"><img src="https://github.com/Wirecloud/echarts-widget/blob/develop/src/images/exampleLineChart.png" align="center" width="360px" ></a>

See more ECharts examples in [ECharts Examples Site](https://echarts.apache.org/examples/en/index.html).