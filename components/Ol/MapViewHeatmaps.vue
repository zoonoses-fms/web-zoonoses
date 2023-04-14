<template>
  <div ref="container">
    <BOverlay :show="show">
      <label ref="vol" class="p-1 rounded-pill bg-gradient-light text-dark">
        Sensibilidade
        <input
          id="vol"
          v-model="sensitivity"
          type="range"
          name="vol"
          min="0"
          max="1"
          step=".05"
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
      <div id="gr" ref="gr" class="ol-legend ol-unselectable ol-control">
        <div class="d-flex justify-content-between">
          <small>Baixo</small>
          <small>Alto</small>
        </div>
        <canvas id="legend-gradient" width="150" height="20"></canvas>
      </div>
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
import HeatmapLayer from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import RegularShape from 'ol/style/RegularShape';
// import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Select } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';
// import { easeOut } from 'ol/easing';
import OSM from 'ol/source/OSM';
import Control from 'ol/control/Control';
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
    mapFeatures: {
      type: Array,
      default() {
        return [];
      },
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
      source: null,
      vectorAdd: null,
      sourceAdd: null,
      vector: null,
      raster: null,
      map: null,
      features: [],
      featuresEdited: [],
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
      sensitivity: 0.5,
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
    mapFeatures(mapFeatures) {
      this.updateFeatures(mapFeatures);
    },

    info(value) {
      this.setInfo(value);
    },
    sensitivity(value) {
      this.show = true;
      this.sensitivity = Number(value);

      this.updateFeatures(this.mapFeatures);
    },
    deep: true,
  },
  updated() {},
  async mounted() {
    await this.initiateMap();

    this.$nextTick(function () {
      if (this.mapFeatures.length > 0 && this.features.length === 0) {
        this.updateFeatures(this.mapFeatures);
      }

      if (this.info) {
        this.setInfo(this.info);
      }
    });
  },
  methods: {
    initiateMap() {
      this.source = new VectorSource({
        features: this.features,
        style: this.styleDefault,
      });

      // const style = new Style
      this.vector = new HeatmapLayer({
        source: this.source,
        weight: (feature) => {
          const count = feature.get('count');
          const magnitude = this.sensitivity * parseFloat(count);
          return magnitude;
        },
        wrapX: false,
      });

      this.sourceAdd = new VectorSource({
        style: this.styleAdd,
        wrapX: false,
      });

      this.vectorAdd = new VectorLayer({
        source: this.sourceAdd,
        style: this.styleAdd,
      });

      this.raster = new TileLayer({
        source: new OSM(),
      });

      const vol = new Control({ element: this.$refs.vol });
      const fullScreen = new FullScreen();

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.raster, this.vector, this.vectorAdd],
        view: new View({
          projection: 'EPSG:3857',
          center: [-4765711.89, -567780.5],
          zoom: 12,
        }),
      });
      this.map.addControl(vol);
      this.map.addControl(fullScreen);
      new ResizeObserver(this.resize).observe(this.$refs.container);
      /*
      this.source.on('addfeature', () => {
        if (!this.add) {
          this.$emit('featuresload', false);
          this.map.getView().fit(this.features[0].getGeometry());
          this.map
            .getView()
            .animate({ zoom: this.map.getView().getZoom() - this.zoomOut });
        }
      });
       */
      this.setInfo(true);
      this.setLegend();

      // document.getElementById('gr').appendChild(this.vector.gradient_);
      // Desenha o gradiente de cores na legenda
      /*       var canvas = document.getElementById('legend-gradient');
      var context = canvas.getContext('2d');
      var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#FF0000');
      gradient.addColorStop(0.25, '#FFA500');
      gradient.addColorStop(0.5, '#FFFF00');
      gradient.addColorStop(0.75, '#00FF00');
      gradient.addColorStop(1, '#0000FF');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height); */
    },
    resize() {
      setTimeout(() => {
        this.map.updateSize();
      }, 500);
    },
    updateFeatures(mapFeatures) {
      this.show = true;
      this.source.clear();
      this.map.render();
      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: 'the_blocks',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::3857' },
        },
        features: mapFeatures,
      };

      this.features = new GeoJSON().readFeatures(geoJsonfeatures);

      /*
      for (const feature of this.features) {
        feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
      }
      */

      this.source.addFeatures(this.features);
      this.show = false;
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
    setLegend() {
      if (process.client) {
        const LegendControl = require('ol-ext/control/Legend').default;

        const Legend = require('ol-ext/legend/Legend').default;

        if (this.legend == null) {
          this.legend = new Legend({
            title: 'Pontos de Apoios',
            margin: 5,
          });
        }

        if (this.legendControl != null) {
          this.map.removeControl(this.legendControl);
        }

        this.legendControl = new LegendControl({
          legend: this.legend,
          collapsed: false,
          className: 'ol-legend',
        });

        const canvas = document.getElementById('legend-gradient');
        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.5, '#00FF00');
        gradient.addColorStop(1, '#FF0000');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const gr = new Control({ element: this.$refs.gr });
        this.map.addControl(gr);
      }

      // const form = { Trianle: 3, Square: 4, Pentagon: 5, Hexagon: 6 };
      this.legend.addItem({
        title: 'Min',
        typeGeom: 'Point',
        style: new Style({
          image: new RegularShape({
            radius: 10 / Math.SQRT2,
            radius2: 10,
            points: 4,
            angle: 0,
            scale: [1, 0.5],
            stroke: new Stroke({
              color: hexToRgba('#e59238', 0.9),
              width: 1,
            }),
            fill: new Fill({
              color: hexToRgba('#E53838', 0.9),
            }),
          }),
        }),
      });
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
