import Vue from 'vue';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZSource from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import MVT from 'ol/format/MVT';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
// import Interaction from 'ol/interaction';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Draw, Modify, Snap, Select } from 'ol/interaction';
import { getCenter } from 'ol/extent';

Vue.ol = {
  Map,
  View,
  Overlay,
  layer: {
    Tile: TileLayer,
    Vector: VectorLayer,
    VectorTile: VectorTileLayer,
  },
  source: {
    Vector: VectorSource,
    VectorTile: VectorTileSource,
    XYZ: XYZSource,
    OSM,
  },
  style: {
    Style,
    Text,
    Fill,
    Stroke,
  },
  format: {
    MVT,
    GeoJSON,
  },
  interaction: {
    Draw,
    Modify,
    Snap,
    Select,
  },
  Feature,
  extent: {
    getCenter
  }
};
