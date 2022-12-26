<template>
  <div ref="container">
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
      {{ featureInfo.values_.name }}
    </b-popover>
  </div>
</template>

<script>
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.min.css';
import hexToRgba from 'hex-to-rgba';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import GeomPoint from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Select } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';
import { easeOut } from 'ol/easing';
import OSM from 'ol/source/OSM';

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
      durationAnimate: 3000,
      repeatAnimate: 1000,
      vectorAnimate: null,
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
      const style = this.styleDefault;

      this.source = new VectorSource({
        features: this.features,
        style: this.styleDefault,
      });

      // const style = new Style
      this.vector = new VectorLayer({
        source: this.source,
        style(feature) {
          /*
          if (feature.get('name') !== undefined) {
            style.getText().setText(feature.get('name').toString());
          }
          */
          return style;
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

      this.vectorAnimate = new VectorLayer({
        source: new VectorSource({ style: this.styleRadar }),
        wrapX: false,
      });

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.raster, this.vector, this.vectorAdd, this.vectorAnimate],
        view: new View({
          projection: 'EPSG:3857',
          center: [-4765711.89, -567780.5],
          zoom: 12,
        }),
      });
      new ResizeObserver(this.resize).observe(this.$refs.container);

      this.source.on('addfeature', () => {
        if (!this.add) {
          this.$emit('featuresload', false);
          this.map.getView().fit(this.features[0].getGeometry());
          this.map
            .getView()
            .animate({ zoom: this.map.getView().getZoom() - this.zoomOut });
        }
      });
      this.setInfo(true);
    },
    resize() {
      setTimeout(() => {
        this.map.updateSize();
      }, 500);
    },
    updateFeatures(mapFeatures) {
      this.source.clear();
      this.map.removeLayer(this.vectorAnimate);
      this.vectorAnimate = new VectorLayer({
        source: new VectorSource({ style: this.styleRadar }),
        wrapX: false,
      });
      this.map.addLayer(this.vectorAnimate);
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

      for (const feature of this.features) {
        feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
      }

      this.source.addFeatures(this.features);

      this.features.forEach(async (feature) => {
        await this.setPulses(feature);
      });

      /*
      for (const feature of this.features) {
        for (let i = 1; i <= 7; i++) {
          setTimeout(() => {
            this.pulse(feature, this.durationAnimate * i+1);
          }, i * 1000);
        }
      }
      */
    },
    handleKeypessDraw(e) {
      if (e.key === 'Backspace') {
        this.draw.removeLastPoint();
      }

      if (e.key === 'Escape') {
        this.draw.abortDrawing();
      }
    },
    handleMouseoverEdit(e) {
      document.addEventListener('keydown', this.handleKeypessEdit, false);
    },
    handleMouseoutEdit(e) {
      document.removeEventListener('keydown', this.handleKeypessEdit, false);
    },
    handleKeypessEdit(e) {
      if (e.key === 'Backspace') {
        if (this.selectedEditable.getFeatures().getLength() > 0) {
          const features = this.selectedEditable.getFeatures().getArray();
          let layer = null;
          for (const feature of features) {
            this.$emit('delete', new GeoJSON().writeFeatures([feature]));

            layer = this.selectedEditable.getLayer(feature);
            layer.getSource().removeFeature(feature);
          }
        }
      }
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
    setPulses(f) {
      for (let i = 1; i <= 7; i++) {
        this.setPulse(f, this.durationAnimate * i + 1);
      }
      return true;
    },
    setPulse(f, duration) {
      const feature = new Feature(
        new GeomPoint(f.getGeometry().getCoordinates())
      );
      feature.setStyle(this.styleRadar);
      this.vectorAnimate.getSource().addFeature(feature);
      if (process.client) {
        const Zoom = require('ol-ext/featureanimation/Zoom').default;
        this.vectorAnimate.animateFeature(
          feature,
          new Zoom({
            fade: easeOut,
            duration,
            repeat: this.repeatAnimate,
            easing: easeOut,
          })
        );
      }
    },
  },
};
</script>

<style>
.map {
  width: 100%;
}
</style>
