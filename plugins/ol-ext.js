import Vue from 'vue';
import PrintDialog from 'ol-ext/control/PrintDialog';
import Print from 'ol-ext/control/Print';
import LegendControl from 'ol-ext/control/Legend';
import Legend from 'ol-ext/legend/Legend';
import LegendItem from 'ol-ext/legend/Item';
import FeatureAnimation from 'ol-ext/featureanimation/FeatureAnimation';
import Zoom from 'ol-ext/featureanimation/Zoom';
import 'ol-ext/dist/ol-ext.min.css';
// needs css-loader

PrintDialog.prototype._labels.ptBR = {
  title: 'Imprimir',
  orientation: 'Orientação',
  portrait: 'Retrato',
  landscape: 'Paisagem',
  size: 'Tamanho da página',
  custom: 'Tamanho da tela',
  margin: 'Margem',
  scale: 'Escala',
  legend: 'Legenda',
  north: 'Seta norte',
  mapTitle: 'Título do mapa',
  saveas: 'Salvar como...',
  saveLegend: 'Salvar legenda...',
  copied: '✔ Copiado para a área de transferência',
  errorMsg: 'Não é possível salvar a tela do mapa...',
  printBt: 'Imprimir...',
  cancel: 'Cancelar',
};

Vue.olExt = {
  PrintDialog,
  Print,
  LegendControl,
  Legend,
  LegendItem,
  FeatureAnimation,
  featureAnimation: {
    Zoom
  }
};
