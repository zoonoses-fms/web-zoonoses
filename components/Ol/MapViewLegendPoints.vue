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
import Vue from 'vue';
import hexToRgba from 'hex-to-rgba';

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
        },
      },
      styleDefault: new Vue.ol.style.Style({
        fill: new Vue.ol.style.Fill({
          color: hexToRgba(this.colorDefault, 0.2),
        }),
        stroke: new Vue.ol.style.Stroke({
          color: hexToRgba(this.colorDefault, 0.9),
          width: 2,
        }),
        text: new Vue.ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new Vue.ol.style.Fill({
            color: '#000',
          }),
          stroke: new Vue.ol.style.Stroke({
            color: '#fff',
            width: 4,
          }),
        }),
        image: new Vue.ol.style.Circle({
          fill: new Vue.ol.style.Fill({
            color: hexToRgba(this.colorDefault, 0.9),
          }),
          stroke: new Vue.ol.style.Stroke({
            color: hexToRgba(this.colorDefault, 0.9),
            width: 2,
          }),
          radius: 6,
          points: 4,
        }),
      }),
      styleOver: new Vue.ol.style.Style({
        fill: new Vue.ol.style.Fill({
          color: hexToRgba(this.colorDefault, 1),
        }),
        stroke: new Vue.ol.style.Stroke({
          color: hexToRgba(this.colorDefault, 0.9),
          width: 2,
        }),
        text: new Vue.ol.style.Text({
          font: '14px Calibri,sans-serif',
          fill: new Vue.ol.style.Fill({
            color: '#000',
          }),
          stroke: new Vue.ol.style.Stroke({
            color: '#fff',
            width: 3,
          }),
        }),
      }),
      styleRadar: new Vue.ol.style.Style({
        image: new Vue.ol.style.Circle({
          stroke: new Vue.ol.style.Stroke({
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
      const Map = Vue.ol.Map;
      const View = Vue.ol.View;
      const TileLayer = Vue.ol.layer.Tile;
      const VectorLayer = Vue.ol.layer.Vector;
      const VectorSource = Vue.ol.source.Vector;
      const OSM = Vue.ol.source.OSM;
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

      this.vectorAnimate = new VectorLayer({
        source: new VectorSource({ style: this.styleRadar }),
        wrapX: false,
      });

      this.map = new Map({
        target: this.$refs.map,
        layers: [
          this.raster,
          this.vector,
          this.vectorPoint,
          this.vectorAnimate,
        ],
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
    setLegend(mapFeatures) {
      if (this.legend == null) {
        this.legend = new Vue.ol.legend.Legend({
          title: 'Pontos de Apoios',
          margin: 5,
        });
      }

      if (this.legendControl != null) {
        this.map.removeControl(this.legendControl);
      }

      this.legendControl = new Vue.ol.legend.LegendControl({
        legend: this.legend,
        collapsed: false,
        className: 'ol-legend',
      });
      this.map.addControl(this.legendControl);

      // const form = { Trianle: 3, Square: 4, Pentagon: 5, Hexagon: 6 };
      for (const [i, feature] of mapFeatures.entries()) {
        this.legend.addItem({
          title: feature.properties.name,
          typeGeom: 'Point',
          style: new Vue.ol.style.Style({
            image: new Vue.ol.style.RegularShape({
              points: i + 3,
              radius: 10,
              stroke: new Vue.ol.style.Stroke({
                color: hexToRgba(this.palette[i], 0.9),
                width: 1,
              }),
              angle: Math.PI / 1,
              fill: new Vue.ol.style.Fill({
                color: hexToRgba(this.palette[i], 0.9),
              }),
            }),
          }),
        });
      }
    },
    updateFeatures(mapFeatures) {
      this.setLegend(mapFeatures);
      this.source.clear();
      this.sourcePoint.clear();
      this.map.removeLayer(this.vectorAnimate);
      this.vectorAnimate = new Vue.ol.layer.Vector({
        source: new Vue.ol.source.Vector({ style: this.styleRadar }),
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

      this.features = new Vue.ol.format.GeoJSON().readFeatures(geoJsonfeatures);

      for (const [i, feature] of this.features.entries()) {
        feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
        feature.setStyle(
          new Vue.ol.style.Style({
            image: new Vue.ol.style.RegularShape({
              points: i + 3,
              radius: 8,
              stroke: new Vue.ol.style.Stroke({
                color: hexToRgba(this.palette[i], 0.9),
                width: 1,
              }),
              angle: Math.PI / 1,
              fill: new Vue.ol.style.Fill({
                color: hexToRgba(this.palette[i], 0.9),
              }),
            }),
          })
        );
        this.setPulses(feature);

        if (
          feature.getProperties().points !== undefined &&
          feature.getProperties().points.length > 0
        ) {
          for (const point of feature.getProperties().points) {
            const featurePoint = new Vue.ol.format.GeoJSON().readFeature(point);
            featurePoint.getGeometry().transform('EPSG:4326', 'EPSG:3857');
            featurePoint.setStyle(feature.getStyle());

            this.sourcePoint.addFeature(featurePoint);
          }
        }
      }

      this.source.addFeatures(this.features);

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
            this.$emit(
              'delete',
              new Vue.ol.format.GeoJSON().writeFeatures([feature])
            );

            layer = this.selectedEditable.getLayer(feature);
            layer.getSource().removeFeature(feature);
          }
        }
      }
    },
    setInfo(value) {
      if (value) {
        this.selectedInfo = new Vue.ol.interaction.Select({
          wrapX: false,
          style: this.styleDefault,
        });

        const overlayPopup = new Vue.ol.Overlay({
          element: document.getElementById('popup'),
        });
        this.map.addOverlay(overlayPopup);

        this.selectedInfo.on('select', (e) => {
          this.showPopover = false;
          if (e.selected.length > 0) {
            const coordinates = e.selected[0].getGeometry().getExtent();
            overlayPopup.setPosition(Vue.ol.extent.getCenter(coordinates));
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
      this.$emit(
        'modify',
        new Vue.ol.format.GeoJSON().writeFeatures([this.featureInfo])
      );
    },
    setPulses(f) {
      const style = new Vue.ol.style.Style({
        image: new Vue.ol.style.RegularShape({
          radius: 60,
          points: f.getStyle().getImage().getPoints(),
          stroke: f.getStyle().getImage().getStroke(),
          angle: f.getStyle().getImage().getAngle()
        }),
      });

      for (let i = 1; i <= 7; i++) {
        this.setPulse(f, this.durationAnimate * i + 1, style);
      }
      return true;
    },
    setPulse(f, duration, style) {
      const feature = new Vue.ol.Feature(
        new Vue.ol.geom.Point(f.getGeometry().getCoordinates())
      );
      feature.setStyle(style);
      this.vectorAnimate.getSource().addFeature(feature);
      this.vectorAnimate.animateFeature(
        feature,
        new Vue.ol.featureAnimation.Zoom({
          fade: Vue.ol.easing.easeOut,
          duration,
          repeat: this.repeatAnimate,
          easing: Vue.ol.easing.easeOut,
        })
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
</style>
