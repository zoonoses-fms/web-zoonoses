<template>
  <div class="card text-center shadow m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="heatmap"
          height="220"
          :options="options"
          :series="series"
        ></ApexChart>
      </div>
    </div>
  </div>
</template>

<script>
import charts from "@/mixins/charts";

export default {
  name: "PainelLineChart",
  mixins: [charts],
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    button: {
      type: String,
      default: "Mais",
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
      default: "",
    },
  },
  data() {
    return {
      series: [],

      options: {
        chart: {
          height: 320,
          type: "heatmap",
          toolbar: {
            show: true,

            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: [],
            },
          },
        },
        plotOptions: {
          heatmap: {
            radius: 1,
            enableShades: true,
            shadeIntensity: 0.7,
            useFillColorAsStroke: false,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 50,
                  name: "Baixa",
                  color: "#00A100",
                },
                {
                  from: 51,
                  to: 100,
                  name: "Média",
                  color: "#128FD9",
                },
                {
                  from: 101,
                  to: 500,
                  name: "Alta",
                  color: "#FFB200",
                },
                {
                  from: 501,
                  to: 2000,
                  name: "Extrema",
                  color: "#FF0000",
                },
              ],
            },
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
        },
        title: {
          text: `${this.title} ${this.locationName}`,
          align: "left",
          floating: true,
        },
        xaxis: {
          type: "numeric",
          min: 1,
          max: 53,
          decimalsInFloat: 0,
        },
      },
    };
  },
  watch: {
    deep: true,
    immediate: true,
    datasets() {
      this.getSerie(this.url, this.params);
    },
    url(val) {
      // this.getSerie(val, this.params);
    },
    "$store.state.modeChart"() {
      this.$refs.chart.chart.updateOptions({
        theme: {
          mode: this.$store.state.modeChart,
        },
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
  mounted() {
    // this.getSerie(this.url, this.params);
  },
  methods: {
    async getSerie(url, params) {
      // const colors = [];
      const series = [];

      let result;
      for (const dataset of this.datasets) {
        result = await this.$axios.get(`${url}/${dataset.id}/`, {
          params,
        });

        // colors.push(dataset.color);
        const data = [];
        result.data.data.forEach((itemData) => {
          data.push(itemData.count);
        });
        series.push({
          name: `${dataset.year}: ${this.locationName}`,
          data,
        });
      }

      this.update({
        series,
        // colors,
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
};
</script>
