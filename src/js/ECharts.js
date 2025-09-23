/**
 *
 * Copyright (C) 2019 Future Internet Consulting and Development Solutions S.L. All Rights Reserved.
 *
 */
/* globals echarts, ResizeObserver, Wirecloud */

(function () {

    "use strict";

    // =========================================================================
    // CLASS DEFINITION
    // =========================================================================

    class Widget {
        constructor(MashupPlatform, shadowDOM, _) {
            this.MashupPlatform = MashupPlatform;
            this.shadowDOM = shadowDOM;

            // Not used, but needed to avoid errors
            this.MashupPlatform.prefs.registerCallback(function (_) {});

            this.eCharts();
        }

        eCharts() {
            var container = this.shadowDOM.getElementById('echartContainer');
            this.echart = echarts.init(container);
            // New ECharts options handler
            this.MashupPlatform.wiring.registerCallback("echarts_options", this.loadChart.bind(this));

            // Resize handler
            if ('ResizeObserver' in window) {
                this.resizeObserver = new ResizeObserver(() => {
                    if (this.echart != null) {
                        this.echart.resize();
                    }
                });

                this.resizeObserver.observe(container);
            } else {
                this.MashupPlatform.widget.context.registerCallback(function (newValues) {
                    if ("heightInPixels" in newValues || "widthInPixels" in newValues) {
                        this.echart.resize();
                    }
                }.bind(this));
            }

            this.echart.on('mouseover', (event) => {
                this.MashupPlatform.wiring.pushEvent('hover', this.createSingleDataEvent('hover', event));
            });

            this.echart.on('click', (event) => {
                this.MashupPlatform.wiring.pushEvent('click', this.createSingleDataEvent('click', event));
            });

            this.echart.on('dblclick', (event) => {
                this.MashupPlatform.wiring.pushEvent('dblclick', this.createSingleDataEvent('dblclick', event));
            });

            this.echart.on('highlight', (event) => {
                const dataObjs = [];
                event.batch.forEach((item) => {
                    let seriesIndex = item.seriesIndex;
                    if (seriesIndex == null && item.seriesId != null) {
                        // Get the series index from the seriesId
                        const seriesId = item.seriesId;
                        const series = this.echart.getOption().series;

                        // Try to find the series index by the seriesId
                        seriesIndex = series.findIndex((s) => s.id === seriesId);
                        if (seriesIndex === -1) {
                            // The id is based off the series name, which is NULL byte + name + NULL byte + index
                            const seriesName = seriesId.split('\0')[1];
                            seriesIndex = series.findIndex((s) => s.name === seriesName);
                        }
                    }

                    if (seriesIndex === -1) {
                        // We log an error
                        this.MashupPlatform.widget.log("Error in the highlight event. Series not found", this.MashupPlatform.log.ERROR);
                        return;
                    }

                    let dataIndex = item.dataIndex;
                    if (dataIndex == null && item.dataIndexInside == null) {
                        // We log an error
                        this.MashupPlatform.widget.log("Error in the highlight event. Data index not found", this.MashupPlatform.log.ERROR);
                    } else if (dataIndex == null) {
                        if (item.dataIndexInside) {
                            item.dataIndexInside.forEach((index) => {
                                dataObjs.push(this.createDataObj(seriesIndex, index));
                            });
                        }
                    } else {
                        dataObjs.push(this.createDataObj(seriesIndex, dataIndex));
                    }
                });
                const eventData = {
                    event: 'highlight',
                    batch: dataObjs
                }

                this.MashupPlatform.wiring.pushEvent('highlight', eventData);
            });
        }

        loadChart(data) {
            if (data == null) {
                // Load Empty chart
                this.echart.clear();
                this.echart.showLoading();

                var msgOption = {
                    title: {
                        show: true,
                        textStyle: {
                            color: 'grey',
                            fontSize: 20
                        },
                        text: "No Data",
                        left: 'center',
                        top: 'center'
                    },
                    xAxis: {
                        show: false
                    },
                    yAxis: {
                        show: false
                    },
                    series: []
                };

                this.echart.setOption(msgOption);
                this.echart.hideLoading();
                return;
            }

            // Load new chart
            this.echart.clear();
            this.echart.showLoading();

            if (data && typeof data === "string") {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    this.MashupPlatform.widget.log("Error parsing the ECharts options: " + e, this.MashupPlatform.log.WARN);
                }
            }

            if (data && typeof data === "object") {
                // A way of passing the chart object to the sender for it to make any use of it
                if ('onChart' in data) {
                    data.onChart(this.echart);
                }

                try {
                    this.echart.setOption(data, !this.MashupPlatform.prefs.get("merge"));
                } catch (e) {
                    this.MashupPlatform.widget.log("Error loading the new options in ECharts: " + e, this.MashupPlatform.log.ERROR);
                }
            } else {
                this.MashupPlatform.widget.log("Invalid ECharts options. Should be a JSON object", this.MashupPlatform.log.ERROR);
            }
            this.echart.hideLoading();
        }

        createDataObj(seriesIndex, dataIndex) {
            const data = this.echart.getOption().series[seriesIndex].data[dataIndex];
            return {
                seriesIndex: seriesIndex,
                dataIndex: dataIndex,
                data: data
            };
        }

        createSingleDataEvent(name, event) {
            const dataObj = this.createDataObj(event.seriesIndex, event.dataIndex);
            const eventData = {
                event: name,
                batch: [dataObj]
            }
            return eventData;
        }
    }

    if (!window.Wirecloud || !window.Wirecloud.registerWidgetClass) {
        // For testing purposes (and old Wirecloud versions)
        window.FICODES_ECharts = Widget;
    } else {
        Wirecloud.registerWidgetClass(document.currentScript, Widget);
    }

})();
