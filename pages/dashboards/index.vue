<template>
  <div class="row justify-content-center p-1">
    <div class="col-12 col-md-6 col-lg-4">
      <CardsNews>
        <template #card-header> Dengue </template>
        <template #card-title>
          <h2>Observatório de Dengue</h2>
        </template>
        <div class="col single-post no-gutters">
          <div class="image-wrapper card-img-top pr-3">
            <figure class="figure">
              <img
                :src="aedesAegypti"
                alt="aedes_egypti"
                class="img-thumbnail rounded"
              />
              <figcaption class="figure-caption text-right">
                <NuxtLink
                  :to="`/dashboards/map/datasus/dengueon/${initial}`"
                  class="btn btn-success btn-block"
                >
                  Ir para Observatório...
                </NuxtLink>
              </figcaption>
            </figure>
          </div>
          <div class="single-post-content-wrapper p-3">
            <p>
              A dengue é uma doença viral transmitida principalmente pela picada
              do mosquito Aedes aegypti. Os sintomas incluem febre alta, dor de
              cabeça, dores musculares e articulares, náuseas, vômitos e
              erupções cutâneas. Em casos graves, a dengue pode causar
              hemorragia e choque, e pode ser fatal. Não há tratamento
              específico para a dengue, mas os sintomas podem ser aliviados com
              medicamentos para a dor e para reduzir a febre. A melhor maneira
              de prevenir a dengue é evitar picadas de mosquito, eliminando
              criadouros de mosquitos em torno de residências e locais públicos
              e usando repelentes de insetos.
            </p>
            <p>
              A dengue é uma doença comum em muitas partes do mundo, incluindo
              regiões tropicais e subtropicais da África, Ásia e América Latina.
              Infecções por dengue têm aumentado em todo o mundo nas últimas
              décadas, tornando-se um problema de saúde pública global.
            </p>
          </div>
        </div>
        <template #card-footer> </template>
      </CardsNews>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <CardsNews>
        <template #card-header> Febre chikungunya </template>
        <template #card-title>
          <h2>Observatório de Febre chikungunya</h2>
        </template>
        <div class="col single-post no-gutters">
          <div class="image-wrapper card-img-top pr-3">
            <figure class="figure">
              <img
                :src="aedes"
                alt="aedes_egypti"
                class="img-thumbnail rounded"
              />
              <figcaption class="figure-caption text-right">
                <NuxtLink
                  :to="`/dashboards/map/datasus/chikon/${initial}`"
                  class="btn btn-danger btn-block"
                >
                  Ir para Observatório...
                </NuxtLink>
              </figcaption>
            </figure>
          </div>
          <div class="single-post-content-wrapper p-3">
            <p>
              A febre chikungunya é uma doença viral transmitida principalmente
              pela picada do mosquito Aedes aegypti ou Aedes albopictus. Os
              sintomas incluem febre alta, dor de cabeça, dor nas articulações e
              nos músculos, fadiga, náuseas e erupções cutâneas. A dor nas
              articulações pode ser grave e durar por semanas ou meses, e em
              alguns casos pode ser incapacitante. Não há tratamento específico
              para a febre chikungunya, mas os sintomas podem ser aliviados com
              medicamentos para a dor e para reduzir a febre. A melhor maneira
              de prevenir a doença é evitar picadas de mosquito, eliminando
              criadouros de mosquitos em torno de residências e locais públicos
              e usando repelentes de insetos.
            </p>
            <p>
              A febre chikungunya é encontrada principalmente em regiões
              tropicais e subtropicais da África, Ásia e das Américas. A doença
              pode se espalhar rapidamente em áreas onde os mosquitos
              transmissores são abundantes, e surtos da doença têm sido
              relatados em muitos países ao redor do mundo.
            </p>
          </div>
        </div>
        <template #card-footer> </template>
      </CardsNews>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <CardsNews>
        <template #card-header> Zika </template>
        <template #card-title>
          <h2>Observatório de Zika</h2>
        </template>
        <div class="col single-post no-gutters">
          <div class="image-wrapper card-img-top pr-3">
            <figure class="figure">
              <img
                :src="aedes2"
                alt="aedes_egypti"
                class="img-thumbnail rounded"
              />
              <figcaption class="figure-caption text-right">
                <NuxtLink
                  :to="`/dashboards/map/datasus/zikanet/${initial}`"
                  class="btn btn-info btn-block"
                >
                  Ir para Observatório...
                </NuxtLink>
              </figcaption>
            </figure>
          </div>
          <div class="single-post-content-wrapper p-3">
            <p>
              A doença Zika é uma doença viral transmitida principalmente pela
              picada do mosquito Aedes aegypti ou Aedes albopictus. Os sintomas
              incluem febre baixa, erupções cutâneas, dor de cabeça, dor nas
              articulações e nos músculos, conjuntivite e fadiga. A maioria das
              pessoas com Zika não apresenta sintomas ou tem sintomas leves, e a
              doença geralmente desaparece dentro de uma semana. No entanto, a
              infecção pelo vírus Zika durante a gravidez pode causar
              complicações graves, incluindo a síndrome de Guillain-Barré e
              microcefalia em recém-nascidos. A melhor maneira de prevenir a
              Zika é evitar picadas de mosquito, eliminando criadouros de
              mosquitos em torno de residências e locais públicos e usando
              repelentes de insetos.
            </p>
            <p>
              A Zika é encontrada principalmente em regiões tropicais e
              subtropicais da África, Ásia e Américas. Embora tenha sido
              relatada pela primeira vez na década de 1950, a doença ganhou
              destaque internacional em 2015 durante um surto na América Latina
              e no Caribe. Desde então, a Zika tornou-se uma preocupação de
              saúde pública global.
            </p>
          </div>
        </div>
        <template #card-footer> </template>
      </CardsNews>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardsPage',
  layout: 'site',
  auth: false,
  data() {
    return {
      initial: 'the',
      aedesAegypti: require('~/assets/img/aedes_aegypti.png'),
      aedes: require('~/assets/img/aedes.png'),
      aedes2: require('~/assets/img/aedes2.png'),
    };
  },
  created() {
    this.welcomeMessage();
  },
  mounted() {},
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Dashboard');
    },
  },
};
</script>
