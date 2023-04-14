<template>
  <div ref="container">
    <BOverlay :show="show">
      <label ref="vol" class="p-1 rounded-pill bg-gradient-light text-dark">
        Distância
        <input
          id="vol"
          v-model="rangeDistance"
          type="range"
          name="vol"
          min="0"
          max="100"
      /></label>

      <div ref="map" class="map" :style="mapStyle" @resize="resize"></div>
      <div v-show="showPopover" id="popup" style="width: 5px; height: 5px">
        <span></span>
      </div>
      <b-popover
        ref="popover"
        target="popup"
        placement="top"
        :show.sync="showPopover"
      >
        {{ featureInfo.values_.count }}
      </b-popover>
    </BOverlay>
  </div>
</template>

<script>
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.min.css';
import hexToRgba from 'hex-to-rgba';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
// import GeomPoint from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
// import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Select } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';
// import { easeOut } from 'ol/easing';
import OSM from 'ol/source/OSM';
import Control from 'ol/control/Control.js';
import FullScreen from 'ol/control/FullScreen';

//
// Define rotate to north control.
//

export default {
  name: 'OlMapViewPoints',
  props: {
    height: {
      type: String,
      default: '80',
    },
    datasets: {
      type: Array,
      required: true,
    },
    zoomOut: {
      type: Number,
      default: 0,
    },
    info: {
      type: Boolean,
      default: false,
    },
    addFeatures: {
      type: Array,
      default() {
        return [];
      },
    },
    colorDefault: {
      type: String,
      default: '#e59238',
    },
    colorRadar: {
      type: String,
      default: '#dc3545',
    },
  },
  data() {
    return {
      rangeDistance: 60,
      distance: 60,
      registers: [],
      mapFeatures: [],
      urlGeocodes: 'dataset/geocodes/',
      sources: [],
      clusters: [],
      vectors: [],
      raster: null,
      map: null,
      features: [],
      offsetWidth: null,
      modify: null,
      selectedEditable: null,
      selectedInfo: null,
      draw: null,
      snap: null,
      showPopover: false,
      featureInfo: {
        values_: {
          name: '',
        },
      },
      styleDefault: new Style({
        fill: new Fill({
          color: hexToRgba(this.colorDefault, 0.2),
        }),
        stroke: new Stroke({
          color: hexToRgba(this.colorDefault, 0.9),
          width: 2,
        }),
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: '#000',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3,
          }),
        }),
        image: new Circle({
          fill: new Fill({
            color: hexToRgba(this.colorDefault, 0.9),
          }),
          stroke: new Stroke({
            color: hexToRgba(this.colorDefault, 0.9),
            width: 2,
          }),
          radius: 4,
          points: 4,
        }),
      }),
      styleOver: new Style({
        fill: new Fill({
          color: hexToRgba(this.colorDefault, 0.9),
        }),
        stroke: new Stroke({
          color: hexToRgba(this.colorDefault, 0.9),
          width: 2,
        }),
        text: new Text({
          font: '14px Calibri,sans-serif',
          fill: new Fill({
            color: '#000',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3,
          }),
        }),
      }),
      styleRadar: new Style({
        image: new Circle({
          stroke: new Stroke({
            color: hexToRgba(this.colorRadar, 1),
            width: 2,
          }),
          radius: 30,
          points: 1,
        }),
      }),
      legendControl: null,
      legend: null,
      casesFill: new Fill({
        color: 'rgba(255, 153, 0, 0.8)',
      }),
      casesStroke: new Stroke({
        color: 'rgba(255, 204, 0, 0.2)',
        width: 1,
      }),
      textFill: new Fill({
        color: '#fff',
      }),
      textStroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.6)',
        width: 3,
      }),
      invisibleFill: new Fill({
        color: 'rgba(255, 255, 255, 0.01)',
      }),
      maxFeatureCount: null,
      currentResolution: null,
      show: false,
    };
  },
  computed: {
    mapStyle() {
      return {
        height: `${this.height}vh`,
      };
    },
  },
  watch: {
    datasets(val) {
      this.updateMap(val);
    },
    mapFeatures(mapFeatures) {
      this.updateFeatures(mapFeatures);
    },

    info(value) {
      this.setInfo(value);
    },
    rangeDistance(value) {
      this.distance = Number(value);
      this.updateMap(this.datasets);
    },
    deep: true,
  },
  updated() {},
  async mounted() {
    await this.initiateMap();

    this.$nextTick(function () {
      if (this.info) {
        this.setInfo(this.info);
      }

      if (this.datasets.length > 0) {
        this.updateMap(this.datasets);
      }
    });
  },
  methods: {
    initiateMap() {
      this.raster = new TileLayer({
        source: new OSM(),
      });
      const vol = new Control({ element: this.$refs.vol });
      const fullScreen = new FullScreen();

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.raster],
        view: new View({
          projection: 'EPSG:3857',
          center: [-4765711.89, -567780.5],
          zoom: 12,
        }),
      });
      this.map.addControl(vol);
      this.map.addControl(fullScreen);
      new ResizeObserver(this.resize).observe(this.$refs.container);
    },
    resize() {
      setTimeout(() => {
        this.map.updateSize();
      }, 500);
    },
    updateFeatures(features, source) {
      source.clear();
      this.map.render();
      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: 'pointers',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::3857' },
        },
        features,
      };

      source.addFeatures(new GeoJSON().readFeatures(geoJsonfeatures));
    },
    setInfo(value) {
      if (value) {
        this.selectedInfo = new Select({
          wrapX: false,
          style: this.styleDefault,
        });

        const overlayPopup = new Overlay({
          element: document.getElementById('popup'),
        });
        this.map.addOverlay(overlayPopup);

        this.selectedInfo.on('select', (e) => {
          this.showPopover = false;
          if (e.selected.length > 0) {
            const coordinates = e.selected[0].getGeometry().getExtent();
            overlayPopup.setPosition(getCenter(coordinates));
            this.showPopover = true;
            this.featureInfo = e.selected[0];
          } else {
            this.featureInfo = {
              values_: {
                name: '',
              },
            };
          }
        });
        this.map.addInteraction(this.selectedInfo);
      } else {
        this.map.removeInteraction(this.selectedInfo);
      }
    },
    changeFeatureName() {
      this.$emit('modify', new GeoJSON().writeFeatures([this.featureInfo]));
    },
    styleFunction(feature, resolution) {
      let style;

      const magnitude = feature
        .get('features')
        .reduce((accumulator, object) => {
          return accumulator + object.get('count');
        }, 0);
      const sourceId = feature.get('features')[0].get('source_id');
      const dataset = this.datasets.find((d) => d.id === sourceId);

      const styleItem = dataset.styles.find((s) => s.radius === radius);

      // const radius = (magnitude / ((resolution / 100) * 0.75) )* 0.045 + 5;
      const radius = magnitude / 50 + resolution / 10 + 5;
      if (styleItem === undefined) {
        style = new Style({
          image: new Circle({
            radius,
            fill: new Fill({
              color: hexToRgba(dataset.color, 0.45),
            }),
            stroke: new Stroke({
              color: hexToRgba(dataset.color, 1),
            }),
          }),
          text: new Text({
            text: magnitude.toString(),
            fill: this.textFill,
            stroke: this.textStroke,
          }),
        });
        dataset.styles.push({ magnitude, style, radius });
      } else {
        style = styleItem.style;
      }

      return style;
    },
    async getRegisters(dataset) {
      const response = await this.$axios.get(
        `${this.urlGeocodes}${dataset.id}`
      );

      const registers = response.data;
      const geocodes = [];
      registers.splice(0, 1);
      for (const [index, item] of registers.entries()) {
        if (item.geometry != null) {
          geocodes.push({
            type: 'Feature',
            id: index,
            geometry: JSON.parse(item.geometry),
            properties: {
              source_id: dataset.id,
              count: item.count,
            },
          });
        }
      }
      return await geocodes;
    },

    async updateMap(datasets) {
      this.show = true;
      this.clearLayer();

      for (const dataset of datasets) {
        dataset.styles = [];
        const registers = await this.getRegisters(dataset);
        const layer = await this.createLayer(dataset, registers);
        this.map.addLayer(layer);
      }

      this.map.render();
      this.show = false;
    },
    clearLayer() {
      this.vectors.forEach((layer, index) => {
        this.map.removeLayer(layer);
      });

      this.sources = [];
      this.clusters = [];
      this.vectors = [];
    },
    createLayer(dataset, registers) {
      const source = new VectorSource();
      this.updateFeatures(registers, source);

      source.setProperties({ id: dataset.id });
      source.setProperties({ year: dataset.year });

      const cluster = new Cluster({
        distance: Number(this.distance),
        source,
      });
      cluster.setProperties({ id: dataset.id });
      cluster.setProperties({ year: dataset.year });

      // const style = new Style
      const vector = new VectorLayer({
        source: cluster,
        style: this.styleFunction,
      });

      vector.setProperties({ id: dataset.id });
      vector.setProperties({ year: dataset.year });

      this.sources.push(source);
      this.clusters.push(cluster);
      this.vectors.push(vector);

      return vector;
    },
  },
};
</script>

<style>
.map {
  width: 100%;
}

#gr {
  padding: 0 5px;
}

.rotate-north {
  bottom: 65px;
  left: 0.5em;
}

.ol-touch .rotate-north {
  top: 80px;
}
</style>
