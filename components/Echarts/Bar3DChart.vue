<template>
  <div>
    <b-overlay :show="show" rounded="sm">
      <div ref="chart" style="height: 400px; width: 100%"></div>
    </b-overlay>
  </div>
</template>

<script>
import { use, init } from 'echarts/core';
import { TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Bar3DChart } from 'echarts-gl/charts';
import { Grid3DComponent } from 'echarts-gl/components';

use([
  TooltipComponent,
  VisualMapComponent,
  Grid3DComponent,
  Bar3DChart,
  CanvasRenderer,
]);

export default {
  name: 'Bar3DChart',
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: 'Mais',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: null,
    },
    datasets: {
      type: Array,
      required: true,
    },
    locationName: {
      type: String,
      default: '',
    },
    palette: {
      type: String,
      default: 'field',
    },
  },
  data() {
    return {
      show: false,
      series: [],
      myChart: null,
      visualMapMax: 0,
      options: {
        tooltip: {},
        visualMap: {
          max: 200,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026',
            ],
          },
        },
        xAxis3D: {
          type: 'category',
        },
        yAxis3D: {
          type: 'category',
        },
        zAxis3D: {
          type: 'value',
        },
        grid3D: {
          boxWidth: 40,
          boxHeight: 100,
          boxDepth: 200,
          light: {
            main: {
              intensity: 1.2,
            },
            ambient: {
              intensity: 0.3,
            },
          },
        },
        series: [],
      },
    };
  },
  watch: {
    deep: true,
    immediate: true,
    datasets() {
      this.getSerie(this.url, this.params);
    },
    series() {
      this.updateEchart();
    },
  },
  created() {},
  mounted() {
    const chartDom = this.$refs.chart;
    this.myChart = init(chartDom);
    if (this.datasets.length > 0) {
      this.getSerie(this.url, this.params);
    }
  },
  updated() {},
  methods: {
    async getSerie(url, params) {
      this.show = true;
      this.visualMapMax = 0;
      const series = [];
      let result;
      for (const dataset of this.datasets) {
        result = await this.$axios.get(`${url}/${dataset.id}/`, {
          params,
        });

        for (const data of result.data.data) {
          if (data.count > this.visualMapMax) {
            this.visualMapMax = data.count;
          }

          series.push([
            dataset.year,
            parseInt(data.sem_not.slice(-2)),
            data.count,
          ]);
        }
      }
      this.series = [...series];
    },
    updateEchart() {
      this.options = {
        ...this.options,
        ...{
          series: [
            {
              type: 'bar3D',
              name: 'Dengue',
              data: this.series,
              shading: 'color',
              label: {
                show: false,
                fontSize: 16,
                borderWidth: 1,
              },
              itemStyle: {
                opacity: 0.7,
              },
              emphasis: {
                label: {
                  fontSize: 20,
                  color: '#900',
                },
                itemStyle: {
                  color: '#900',
                },
              },
              tooltip: {
                formatter: (value) => {
                  return `
              <div>${value.seriesName}</div>
                <div>${value.marker}</div>
                <div>Ano: ${value.data[0]}</div>
                <div>Semana: ${value.data[1]}</div>
                <div>Casos: ${value.data[2]}</div>
                `;
                },
              },
            },
          ],
        },
      };
      this.options.series.name = 'Dengue';
      this.options.series.data = this.series;
      this.options.visualMap.max = this.visualMapMax;
      if (this.myChart == null) {
        // const chartDom = this.$refs.chart;
        // this.myChart = init(chartDom);
      }
      this.myChart.setOption(this.options);
      this.show = false;
    },
  },
};
</script>
