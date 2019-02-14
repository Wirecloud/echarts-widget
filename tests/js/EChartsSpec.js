/* globals MashupPlatform, MockMP, ECharts, loadChart */

(function () {

    "use strict";

    const HTML_FIXTURE_CODE = `
        <div id="echartContainer" style="height:100%"></div>
    `;

    var lineExample = {
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
    };

    var sunburstChart = {
        "series": {
            "type": "sunburst",
            "data": [
                {
                    "name": "Grandpa",
                    "children": [
                        {
                            "name": "Uncle Leo",
                            "value": 15,
                            "children": [
                                {
                                    "name": "Cousin Jack",
                                    "value": 2
                                },
                                {
                                    "name": "Cousin Mary",
                                    "value": 5,
                                    "children": [
                                        {
                                            "name": "Jackson",
                                            "value": 2
                                        }
                                    ]
                                },
                                {
                                    "name": "Cousin Ben",
                                    "value": 4
                                }
                            ]
                        },
                        {
                            "name": "Father",
                            "value": 10,
                            "children": [
                                {
                                    "name": "Me",
                                    "value": 5
                                },
                                {
                                    "name": "Brother Peter",
                                    "value": 1
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Nancy",
                    "children": [
                        {
                            "name": "Uncle Nike",
                            "children": [
                                {
                                    "name": "Cousin Betty",
                                    "value": 1
                                },
                                {
                                    "name": "Cousin Jenny",
                                    "value": 2
                                }
                            ]
                        }
                    ]
                }
            ],
            "radius": [
                0,
                "90%"
            ],
            "label": {
                "rotate": "radial"
            }
        }
    }
    var expectedNullOptions = {
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

    const clearDocument = function clearDocument() {
        var elements = document.querySelectorAll('body > *:not(.jasmine_html-reporter)');

        for (var i = 0; i < elements.length; i++) {
            elements[i].parentElement.removeChild(elements[i]);
        }
    };

    var echartsSetOptionSpy = jasmine.createSpy("setOption");
    var echartsClearSpy = jasmine.createSpy("clear");
    var echartsHideLoadingSpy = jasmine.createSpy("hideLoading");
    var echartsShowLoadingSpy = jasmine.createSpy("showLoading");
    var resizeSpy = jasmine.createSpy('resize');
    describe("ECharts", function () {

        var widget;

        beforeAll(() => {
            window.MashupPlatform = new MockMP({
                type: 'widget',
                prefs: {
                },
                inputs: ["echarts_options"],
                outputs: [],
            });
        });

        beforeEach(() => {
            clearDocument();
            document.body.innerHTML += HTML_FIXTURE_CODE;
            MashupPlatform.reset();
            echartsSetOptionSpy.calls.reset();
            echartsClearSpy.calls.reset();
            echartsHideLoadingSpy.calls.reset();
            echartsShowLoadingSpy.calls.reset();
            const return_this = function () {return this;};

            window.echarts = {
                init: return_this,
                setOption: echartsSetOptionSpy,
                clear: echartsClearSpy,
                hideLoading: echartsHideLoadingSpy,
                showLoading: echartsShowLoadingSpy,
                resize: resizeSpy
            };

            widget = new ECharts();
        });

        afterEach(() => {
        });

        describe("echarts_options endpoint", () => {

            it("should handle null options", () => {
                loadChart(null);
                expect(echartsClearSpy).toHaveBeenCalledTimes(1);
                expect(echartsShowLoadingSpy).toHaveBeenCalledTimes(1);
                expect(echartsSetOptionSpy).toHaveBeenCalledWith(expectedNullOptions);
                expect(echartsHideLoadingSpy).toHaveBeenCalledTimes(1);
                expect(MashupPlatform.widget.log).not.toHaveBeenCalled();
            });

            it("should handle basic Line chart", () => {
                loadChart(lineExample);
                expect(echartsShowLoadingSpy).toHaveBeenCalledTimes(1);
                expect(echartsSetOptionSpy).toHaveBeenCalledWith(lineExample, true);
                expect(echartsHideLoadingSpy).toHaveBeenCalledTimes(1);
            });

            it("should handle basic Line chart and then sunburstChart", () => {
                loadChart(lineExample);
                loadChart(sunburstChart);
                expect(echartsShowLoadingSpy).toHaveBeenCalledTimes(2);
                expect(echartsClearSpy).toHaveBeenCalledTimes(2);
                expect(echartsSetOptionSpy).toHaveBeenCalledWith(lineExample, true);
                expect(echartsSetOptionSpy).toHaveBeenCalledWith(sunburstChart, true);
                expect(echartsHideLoadingSpy).toHaveBeenCalledTimes(2);
            });

            it("should handle errors setting options", () => {
                var expectedError = new Error("Parsing is not possible");
                var errorSpyBad = jasmine.createSpy().and.throwError(expectedError);
                window.echarts.setOption = errorSpyBad;
                loadChart(lineExample);
                expect(echartsShowLoadingSpy).toHaveBeenCalledTimes(1);
                expect(echartsClearSpy).toHaveBeenCalledTimes(1);
                expect(echartsHideLoadingSpy).toHaveBeenCalledTimes(1);

                expect(MashupPlatform.widget.log).toHaveBeenCalledWith("Error loading the new options in ECharts: " +
                    expectedError, MashupPlatform.log.ERROR);
            });

            it("should handle invalid options", () => {
                loadChart("invalid options");
                expect(echartsShowLoadingSpy).toHaveBeenCalledTimes(1);
                expect(echartsClearSpy).toHaveBeenCalledTimes(1);
                expect(echartsHideLoadingSpy).toHaveBeenCalledTimes(1);

                expect(MashupPlatform.widget.log)
                    .toHaveBeenCalledWith("Invalid ECharts options. Should be a JSON object", MashupPlatform.log.ERROR);
            });
        });

    });

})();
