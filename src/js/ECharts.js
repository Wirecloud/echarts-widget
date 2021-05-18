/**
 *
 * Copyright (C) 2019 Future Internet Consulting and Development Solutions S.L. All Rights Reserved.
 *
 */

/* exported ECharts */
/* globals echarts, XLSX */


var ECharts = (function () {

    "use strict";

    // =========================================================================
    // CLASS DEFINITION
    // =========================================================================

    var echart;


    var eCharts = function eCharts() {

        var container = document.getElementById('echartContainer');
        echart = echarts.init(container);
        // New ECharts options handler
        MashupPlatform.wiring.registerCallback("echarts_options", loadChart);

        // Resize handler
        window.addEventListener("resize",() => {
            if (echart != null) {
                echart.resize();
            }
        });

        /* test-code */
        window.loadChart = loadChart;
        /* end-test-code */
    };

    var loadChart = function loadChart(data) {
        if (data == null) {
            // Load Empty chart
            echart.clear();
            echart.showLoading();

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

            echart.setOption(msgOption);
            echart.hideLoading();
            return;
        }

        // Load new chart
        echart.clear();
        echart.showLoading();

        if (typeof data === "object") {
            if (data.toolbox != null && data.toolbox.feature != null && data.toolbox.feature.saveAsExcel != null) {
                data.toolbox.feature.mySaveAsExcel = data.toolbox.feature.saveAsExcel;
                data.toolbox.feature.mySaveAsExcel.title = "Excel";
                data.toolbox.feature.mySaveAsExcel.icon = "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891";
                data.toolbox.feature.mySaveAsExcel.onclick = () => {
                    let wb = XLSX.utils.book_new();
                    let aoa = data.xAxis[0].data.map((x, index) => {
                        let row = [x + 'Z'];
                        data.series.forEach((serie) => {
                            row.push(serie.data[index] * 100);
                        });
                        return row;
                    });
                    aoa.splice(0, 0, ["dateObserved", "fillLevel"]);
                    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'data')
                    XLSX.writeFile(wb, 'data.xlsx');
                };
                delete data.toolbox.feature.saveAsExcel;
            }
            try {
                echart.setOption(data, true);
            } catch (e) {
                MashupPlatform.widget.log("Error loading the new options in ECharts: " + e, MashupPlatform.log.ERROR);
            }
        } else {
            MashupPlatform.widget.log("Invalid ECharts options. Should be a JSON object", MashupPlatform.log.ERROR);
        }
        echart.hideLoading();
    };

    return eCharts;
})();
