/**
 * 可视化
 * @Author zry
 * @Date 2017-04-26
 * [heatmap](https://github.com/Leaflet/Leaflet.heat)
 * Basic Usage
    ```
    var heat = L.heatLayer([
        [50.5, 30.5, 0.2], // lat, lng, intensity
        [50.6, 30.4, 0.5],
        ...
    ], {radius: 25}).addTo(map)
    ```

 * 
 */
import './viz.scss';
import $ from 'jquery';
import util from '../common/util.js';

import { map } from './basemap.js';
import '../common/leaflet-plugin/HeatLayer.js'; //Leaflet.heat
import echartsIcon from '../common/plugin/echartsIcon.js'; //echartsLegend
import echartsLegend from '../common/plugin/echartsLegend.js'; //echartsLegend

import echarts from 'echarts';
// import echarts from '../common/leaflet-plugin/lib/echarts.source.js';
import { ecOption } from './vizConfig-qianxi.js';
import { scatterOption } from './vizConfig-scatter.js';
// import "/app/common/leaflet-plugin/leaflet-echarts3.js";

import { Dvf } from './dvf.js';

class Viz {
    init() {
        this._vizEvent()
    }
    _vizEvent() {
        $('#mapbar').on('click', '#heatbar', (event) => {
            this.heatLayer();
        });
        $('#mapbar').on('click', '#echarts1', (event) => {
            if (!this.echarts) {
                util.getScript("/app/common/leaflet-plugin/leaflet-echarts3.js").then(() => { //version 2.x
                    console.log(window.echarts);
                    this.echartsLayer(window.echarts, "scatter");
                });
            } else {
                this.echartsLayer(this.echarts, "scatter");
            }
        });
        $('#mapbar').on('click', '#echarts2', (event) => {
            if (!this.echarts) {
                util.getScript("/app/common/leaflet-plugin/leaflet-echarts3.js").then(() => { //version 2.x
                    this.echartsLayer(window.echarts, "qianxi");
                });
            } else {
                this.echartsLayer(this.echarts, "qianxi");
            }
        });
        //http://leafletjs.com/reference-1.0.3.html#divicon
        $('#mapbar').on('click', '#divicon', (event) => {
            this.divIconEchartsDemo();
        });
        $('#mapbar').on('click', '#dvf1', (event) => {
            var dvf = new Dvf();
            dvf.earthquakesSample();
        });
        $('#mapbar').on('click', '#dvf2', (event) => {
            var dvf = new Dvf();
            dvf.sample2();
        });
    }

    divIconEchartsDemo() {
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },

                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            //经纬度不能相同
            let latlngs = [
                [30, 104],
                [31, 110],
                [34, 120]
            ];
            option.datas = [
                [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' },
                    { value: 1548, name: '搜索引擎' }
                ],
                [
                    { value: 345, name: '直接访问' },
                    { value: 410, name: '邮件营销' },
                    { value: 244, name: '联盟广告' },
                    { value: 145, name: '视频广告' },
                    { value: 548, name: '搜索引擎' }
                ],
                [
                    { value: 445, name: '直接访问' },
                    { value: 410, name: '邮件营销' },
                    { value: 244, name: '联盟广告' },
                    { value: 145, name: '视频广告' },
                    { value: 148, name: '搜索引擎' }
                ],
            ];
            echartsIcon(map, latlngs, option);
            //图例
            let legendOption = {
                orient: 'vertical',
                left: 'left',
                width: "90px",
                height: "140px",
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            };
            echartsLegend(map, legendOption);
        }
        /**
         * [echartsLayer leaflet+echarts]
         * @param  {[Object]} echarts [echarts对象]
         * @param  {[String]} type    [类型 如qianxi，迁徙图和散点图scatter]
         */
    echartsLayer(echarts, type) {
        this.echarts = echarts;
        let overlay = new L.echartsLayer3(map, echarts);
        let chartsContainer = overlay.getEchartsContainer();
        let myChart = overlay.initECharts(chartsContainer);
        window.onresize = myChart.onresize;

        console.log("chartsContainer:", chartsContainer);
        if (type == "qianxi") {
            overlay.setOption(ecOption);
        } else if (type == "scatter") {
            overlay.setOption(scatterOption);
        }

    }
    /*热力图*/
    heatLayer() {
        let url = "http://leaflet.github.io/Leaflet.markercluster/example/realworld.10000.js";
        util.getScript(url).then(() => {
            map.flyTo([-37.87, 175.475], 12);

            addressPoints = addressPoints.map((p) => {
                return [p[0], p[1]];
            });

            let heat = L.heatLayer(addressPoints).addTo(map);
        })

    }
}

export { Viz };
