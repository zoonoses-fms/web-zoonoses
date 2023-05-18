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
      title="Informações"
      :show.sync="showPopover"
    >
      <div class="form-group">
        <label>Name:</label>
        <input
          v-model="featureInfo.values_.name"
          type="text"
          class="form-control"
          placeholder="name"
        />
      </div>
      <div v-if="featureInfo.values_.properties !== undefined" class="form-group">
        <label>Imóveis:</label>
        <input
          v-model="featureInfo.values_.properties"
          type="number"
          class="form-control"
          placeholder="Número de Imóveis"
        />
      </div>
      <button
        type="button"
        class="btn btn-primary"
        @click="changeFeatureName()"
      >
        Editar
      </button>
    </b-popover>
  </div>
</template>

<script>
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.min.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Select, Modify, Draw, Snap } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';

export default {
  name: 'OlMap',
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
    editable: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Boolean,
      default: false,
    },
    add: {
      type: Boolean,
      default: false,
    },
    addFeatures: {
      type: Array,
      default() {
        return [];
      },
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
          color: 'rgba(229, 146, 56, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(229, 146, 56, 0.9)',
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
      }),
      styleOver: new Style({
        fill: new Fill({
          color: 'rgba(229, 146, 56, 0.6)',
        }),
        stroke: new Stroke({
          color: 'rgba(229, 146, 56, 0.9)',
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
      styleAdd: new Style({
        fill: new Fill({
          color: 'rgba(220, 53, 69, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(220, 53, 69, 0.9)',
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
    editable(value) {
      this.setEditable(value);
    },
    info(value) {
      this.setInfo(value);
    },
    add(value) {
      this.setAdd(value);
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

      if (this.editable) {
        this.setEditable(this.editable);
      }

      if (this.info) {
        this.setInfo(this.info);
      }

      if (this.add) {
        this.setAdd(this.add);
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
          style.getText().setText(feature.get('name').toString());
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

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.raster, this.vector, this.vectorAdd],
        view: new View({
          projection: 'EPSG:3857',
          center: [-4765711.89, -567780.5],
          zoom: 12,
        }),
      });
      new ResizeObserver(this.resize).observe(this.$refs.container);

      let selected = null;
      this.map.on('pointermove', (e) => {
        if (!this.editable && !this.info && !this.add) {
          if (selected !== null) {
            selected.setStyle(undefined);
            selected = null;
          }

          this.map.forEachFeatureAtPixel(e.pixel, function (f) {
            selected = f;
            return true;
          });

          if (selected) {
            selected.setStyle(this.styleOver);
            selected
              .getStyle()
              .getText()
              .setText(selected.get('name').toString());
          }
        }
      });

      this.source.on('addfeature', () => {
        if (!this.add) {
          this.$emit('featuresload', false);
          this.map.getView().fit(this.features[0].getGeometry());
          this.map
            .getView()
            .animate({ zoom: this.map.getView().getZoom() - this.zoomOut });
        }
      });
    },
    resize() {
      setTimeout(() => {
        this.map.updateSize();
      }, 500);
    },
    updateFeatures(mapFeatures) {
      /*       this.features = [];
      for (const feature of mapFeatures) {
        this.features.push(
          new GeoJSON().readFeature(feature, {
            // featureProjection: 'EPSG:3857',
          })
        );
      } */
      this.source.clear();

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

      this.source.addFeatures(this.features);
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
    setEditable(value) {
      if (value) {
        this.$refs.map.addEventListener('mouseover', this.handleMouseoverEdit, false);
        this.$refs.map.addEventListener('mouseout', this.handleMouseoutEdit, false);

        this.selectedEditable = new Select({
          wrapX: false,
          style: new Style({
            fill: new Fill({
              color: 'rgba(56, 146, 56, 0.4)',
            }),
            stroke: new Stroke({
              color: 'rgba(56, 146, 56, 0.8)',
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
          }),
        });
        this.modify = new Modify({
          features: this.selectedEditable.getFeatures(),
        });
        this.map.addInteraction(this.selectedEditable);
        this.map.addInteraction(this.modify);
        this.modify.on('modifyend', (e) => {
          this.$emit(
            'modify',
            new GeoJSON().writeFeatures(
              e.features.getArray()
              // this.selected.getFeatures().getArray()
            )
          );
        });
      } else {
        this.map.removeInteraction(this.selectedEditable);
        this.map.removeInteraction(this.modify);
        this.$refs.map.removeEventListener('mouseover', this.handleMouseoverEdit, false);
        this.$refs.map.removeEventListener('mouseout', this.handleMouseoutEdit, false);
      }
    },
    setInfo(value) {
      if (value) {
        this.selectedInfo = new Select({
          wrapX: false,
          style: new Style({
            fill: new Fill({
              color: 'rgba(23, 162, 184, 0.4)',
            }),
            stroke: new Stroke({
              color: 'rgba(23, 162, 184, 0.8)',
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
          }),
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
    setAdd(value) {
      if (value) {
        document.addEventListener('keydown', this.handleKeypessDraw, false);

        this.draw = new Draw({
          source: this.sourceAdd,
          type: 'Polygon',
          style: this.styleAdd,
        });
        this.snap = new Snap({ source: this.sourceAdd });
        this.map.addInteraction(this.draw);
        this.map.addInteraction(this.snap);

        this.draw.on('drawstart', (e) => {
          e.feature.set('index', this.addFeatures.length);
          e.feature.set('name', '');
        });

        this.draw.on('drawend', (e) => {
          this.$emit(
            'add',
            new GeoJSON().writeFeatures([e.feature])
          );
        });
      } else {
        this.map.removeInteraction(this.selected);
        this.map.removeInteraction(this.snap);
        this.map.removeInteraction(this.draw);
        document.removeEventListener('keydown', this.handleKeypessDraw, false);
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
</style>
