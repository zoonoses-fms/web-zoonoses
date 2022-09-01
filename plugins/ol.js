import Vue from 'vue';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.min.css';
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
import Circle from 'ol/style/Circle';
import RegularShape from 'ol/style/RegularShape';
import MVT from 'ol/format/MVT';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
// import { getVectorContext } from 'ol/render';
import { easeOut } from 'ol/easing';
// import Observable from 'ol/Observable';
// import Interaction from 'ol/interaction';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Draw, Modify, Snap, Select } from 'ol/interaction';
import { getCenter } from 'ol/extent';

import Point from 'ol/geom/Point';
import 'ol-ext/featureanimation/FeatureAnimation';
import 'ol-ext/render/Pulse';
import 'ol-ext/render/AnimExtent';

import Zoom from 'ol-ext/featureanimation/Zoom';
import None from 'ol-ext/featureanimation/None';
import LegendControl from 'ol-ext/control/Legend';
import Legend from 'ol-ext/legend/Legend';
import LegendItem from 'ol-ext/legend/Item';
// import Null from 'ol-ext/featureanimation/Null';

Vue.ol = {
  Map,
  View,
  Overlay,
  easing: {
    easeOut,
  },
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
    Circle,
    RegularShape
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
  featureAnimation: {
    Zoom,
    None,
   //  Null,
  },
  extent: {
    getCenter,
  },
  geom: {
    Point,
  },
  legend: {
    Legend,
    LegendItem,
    LegendControl
  }
};
