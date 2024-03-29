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
      class="popup-balloon"
      :show.sync="showPopover"
    >
      <address>
        <strong>{{ featureInfo.values_.name }}</strong> <br />
        <div v-show="featureInfo.values_.address">
          {{ featureInfo.values_.address }}, {{ featureInfo.values_.number }}
          <br />

          Bairro: {{ featureInfo.values_.neighborhood_alias.name }}
          <a
            class="btn-sm btn-success mt-1"
            target="_blank"
            :href="`https://www.google.com/maps/dir/${coordsOrigin[1]},${
              coordsOrigin[0]
            }/${featureInfo.coordsDestination.getCoordinates()[1]},${
              featureInfo.coordsDestination.getCoordinates()[0]
            }/@${featureInfo.coordsDestination.getCoordinates()[1]},${
              featureInfo.coordsDestination.getCoordinates()[0]
            },13z`"
          >
            <b-icon-signpost-split></b-icon-signpost-split>
            ir</a
          >
        </div>
      </address>
    </b-popover>
  </div>
</template>

<script>
import 'ol/ol.css';
import Vue from 'vue';
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
import Icon from 'ol/style/Icon';
import GeoJSON from 'ol/format/GeoJSON';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Select } from 'ol/interaction';
import { getCenter } from 'ol/extent';

export default {
  name: 'OlMapViewLegendPoints',
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
    palette: {
      type: Array,
      default() {
        return Vue.palette.brewer1;
      },
    },
  },
  data() {
    return {
      mePoint: new GeomPoint([-4765711.89, -567780.5]),
      coordsOrigin: [0, 0],
      vector: null,
      source: null,
      vectorPoint: null,
      sourcePoint: null,
      raster: null,
      map: null,
      features: [],
      featurePoints: [],
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
          neighborhood_alias: {
            name: '',
          },
        },
        coordsDestination: new GeomPoint([0, 0]),
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
            width: 4,
          }),
        }),
        image: new Icon({
          src: require('@/assets/img/marker/pets-5.png'),
          anchor: [0.5, 64],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          // imgSize: [10, 10],
          // size: [60, 60],
        }),
      }),
      legend: null,
      legendControl: null,
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
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.mePoint = new GeomPoint([
              pos.coords.longitude,
              pos.coords.latitude,
            ]);
            this.mePoint.transform('EPSG:4326', 'EPSG:3857');
          },
          (error) => {
            console.log(error);
          },
          options
        );
      } else {
        console.log('Geolocation is not supported');
      }

      const style = this.styleDefault;

      this.source = new VectorSource({
        features: this.features,
        style: this.styleDefault,
      });

      // const style = new Style
      this.vector = new VectorLayer({
        source: this.source,
        style(feature) {
          return style;
        },
        wrapX: false,
      });

      this.sourcePoint = new VectorSource({
        features: this.featurePoints,
        style: this.styleDefault,
      });

      this.vectorPoint = new VectorLayer({
        source: this.sourcePoint,
        style(feature) {
          return style;
        },
        wrapX: false,
      });

      this.raster = new TileLayer({
        source: new OSM(),
      });

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.raster, this.vector, this.vectorPoint],
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
      this.sourcePoint.clear();

      this.map.render();
      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: 'points',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::3857' },
        },
        features: mapFeatures,
      };

      this.features = new GeoJSON().readFeatures(geoJsonfeatures);

      for (const feature of this.features) {
        if (
          feature.getProperties().points !== undefined &&
          feature.getProperties().points.length > 0
        ) {
          for (const point of feature.getProperties().points) {
            const featurePoint = new GeoJSON().readFeature(point);
            featurePoint.getGeometry().transform('EPSG:4326', 'EPSG:3857');
            featurePoint.setStyle(feature.getStyle());

            this.sourcePoint.addFeature(featurePoint);
          }
        }
      }

      this.map.getView().setCenter(this.mePoint.getCoordinates());
      this.map
        .getView()
        .animate({ zoom: this.map.getView().getZoom() + this.zoomOut });

      const meStyle = new Style({
        image: new Icon({
          src: require('@/assets/img/marker/marker.png'),
          anchor: [0.5, 64],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          // imgSize: [10, 10],
          // size: [60, 60],
        }),
      });
      const origin = new GeomPoint(this.mePoint.getCoordinates());
      origin.transform('EPSG:3857', 'EPSG:4326');
      this.coordsOrigin = origin.getCoordinates();
      const meFeature = new Feature({
        geometry: new GeomPoint(this.mePoint.getCoordinates()),
        name: 'Eu',
        neighborhood_alias: {
          name: '',
        },
      });

      meFeature.setStyle(meStyle);

      this.sourcePoint.addFeature(meFeature);
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
            this.$emit(
              'delete',
              new GeoJSON().writeFeatures([feature])
            );

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
          // style: this.styleDefault,
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
            this.featureInfo.coordsDestination = new GeomPoint(
              coordinates
            );
            this.featureInfo.coordsDestination.transform(
              'EPSG:3857',
              'EPSG:4326'
            );
          } else {
            this.featureInfo = {
              values_: {
                name: '',
                neighborhood_alias: {
                  name: '',
                },
              },
              coordsDestination: new GeomPoint([0, 0]),
            };
          }
        });
        this.map.addInteraction(this.selectedInfo);
      } else {
        this.map.removeInteraction(this.selectedInfo);
      }
    },
    changeFeatureName() {
      this.$emit(
        'modify',
        new GeoJSON().writeFeatures([this.featureInfo])
      );
    },
  },
};
</script>

<style>
.map {
  width: 100%;
}

.ol-control.ol-legend {
  background-color: rgba(255, 255, 255, 0.8);
}

.popover {
  border-radius: 25px;
}
</style>
