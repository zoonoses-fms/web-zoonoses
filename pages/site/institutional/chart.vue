<template>
  <div>
    <div class="row">
      <div class="col-12" :class="selectedNode != null ? 'col-lg-7' : ''">
        <div class="card text-center">
          <div class="card-header">Organograma</div>
          <div class="card-body">
            <client-only>
              <Vue2OrgTree
                :data="treeData"
                :horizontal="layoutType == 'horizontal'"
                :collapsable="collapsable"
                label-class-name="pointer"
                selected-class-name="bg-gradient-primary"
                selected-key="selectedKey"
                @on-expand="onExpand"
                @on-node-click="onNodeClick"
              ></Vue2OrgTree>
            </client-only>
          </div>
          <div class="card-footer text-muted"></div>
        </div>
      </div>
      <div v-if="selectedNode != null" class="col-12 col-lg-5">
        <div class="card text-center">
          <div class="card-header">{{ selectedNode.label }}</div>
          <div class="card-body card-scroll text-left">
            <p v-if="selectedNode.text != undefined" class="card-text">
              {{ selectedNode.text }}
            </p>
            <ol v-if="selectedNode.assignments != undefined">
              <li
                v-for="(item, index) in selectedNode.assignments"
                :key="index"
              >
                <div v-if="item.assignments != undefined">
                  <strong>{{ item.text }}</strong>
                  <ul>
                    <li v-for="(subItem, i) in item.assignments" :key="i">
                      <small>{{ subItem }}</small>
                    </li>
                  </ul>
                </div>

                <div v-else>
                  {{ item }}
                </div>
              </li>
            </ol>
          </div>
          <div class="card-footer text-muted"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
import Vue2OrgTree from 'vue2-org-tree';
import 'vue2-org-tree/dist/style.css';
// Vue.use(Vue2OrgTree);

export default {
  name: 'ChartPage',
  components: {
    Vue2OrgTree,
  },
  layout: 'site',
  auth: false,
  data() {
    return {
      treeData: {
        id: 1,
        label: 'DVS - Diretoria de Vigilância em Saúde',
        expand: true,
        children: [
          {
            id: 2,
            label: 'GEZOON - Gereência de Zoonoses',
            text: 'Tem como atribuição a vigilância, prevenção e controle de zoonoses e de acidentes causados por animais peçonhentos e venenosos, de relevância para a saúde pública.',
            expand: true,
            children: [
              {
                id: 3,
                label: 'Secretária',
                text: 'Atribuições:',
                assignments: [
                  'Digitação de documentos, bem como: ofício e memorando',
                  'Cadastrar e enviar documentos no protocolo web',
                  'Atender telefone',
                  'Acompanhar processos',
                  'Organizar arquivo e controlar documentos',
                  'Receber e distribuir documentos',
                  'Auxiliar no protocolo',
                ],
                expand: false,
              },
              {
                id: 4,
                label: 'Setor Pessoal',
                text: 'Atribuições:',
                assignments: [
                  'Receber e devolver carteiras de trabalho dos Agentes de Endemias.',
                  'Arquivar documentação.',
                  'Abrir processos no SEI/PMT referente as questões dos funcionários.',
                  'Receber atestados médicos',
                  'Expedir memorandos e ofícios inerentes ao setor de pessoal/GEZOON; bem como as comunicações internas.',
                  'Digitar prestação de contas',
                  'Digitar as informações de plantão, auxílio alimentação e ocorrência dos servidores estatutários, agentes de endemias e seguranças da GEZOON/FMS',
                ],
                expand: false,
              },
              {
                id: 5,
                label: 'Recebimento de Taxas',
                text: 'Atribuições:',
                assignments: [
                  'Atender ao público no setor de arrecadação e emitir boletos para cobrança de taxas e multas de animais recolhidos.',
                  'Liberar os animais apreendidos.',
                  'Emitir relatórios do setor.',
                ],
                expand: false,
              },
              {
                id: 6,
                label: 'NCRV - Núcleo de Controle de Roedores e Vetores.',
                expand: false,
                assignments: [
                  {
                    text: 'Ações de vigilância da fauna sinantrópica (acidentes causados por animais peçonhentos ou venenosos).',
                    assignments: [
                      'Realizar 04 levantamentos de índice rápido para aedes aegypti.',
                      'Instalação das Ovitrampas (armadilhas para coleta de ovos de Aedes sp) nas áreas de vigilância, monitoramento e controle (Pontos Estratégicos), em ciclos semanais calculando os IPO (índice de positividade de ovos) e IDO (índice de densidade de ovos).',
                      'Aplicação espacial de adulticida por meio das máquinas de UBV, costal e pesado para bloqueio nas áreas de transmissão intensa de dengue, zica e chicungunya.',
                      'Monitoramento vetorial para o programa do encoleiramento das áreas de intervenção e controle, como também nos locais de incidência de casos humanos de leishmaniose visceral.',
                      'Realizar atividades de investigação entomológica e ambiental nos locais de incidências de casos humanos para leishmaniose visceral.',
                      'Monitoramento vetorial e realização das ações de vigilâncias das arboviroses neuro-invasivas.',
                      'Realizar coleta de pneus nas pequenas borracharias e oficinas cadastradas no SISPNCD e logradouros públicos.',
                      'Identificação de espécies de interesse à saúde pública.',
                      'Ações educativas destinadas à população e profissionais de saúde quanto ao  manejo, prevenção e controle de animais peçonhentos ou venenosos.',
                      'Apoio técnico nas situações relacionados aos animais peçonhentos ou venenosos (escorpiões, lagartas, aranhas, percevejos, entre outros).',
                      'Realizar inspeção de imóveis (residências, estabelecimentos comerciais, unidades de saúde, hospitais e escolas etc.) mediante demanda a busca ativa, para verificar a presença de flebótomos, Aedes Aegypti, pombos, roedores e animais peçonhentos.',
                      'Notificar os proprietários de imóveis que forem encontradas condições propícias para a proliferação dos animais mencionados.',
                      'Elaborar relatórios das inspeções realizadas.',
                      'Aspirar de forma mecanizada os imóveis, residências, comércios, terrenos baldios e   outros, visando eliminar possíveis vetores transmissores da dengue.',
                      'Orientar moradores para eliminação e/ou proteção de possíveis criadouros e sobre as arboviroses: sintomas, riscos e prevenção contra os agentes transmissores.',
                      'Vistoriar e tratar os imóveis cadastrados que necessitem do uso de larvicida.',
                    ],
                  },
                  {
                    text: 'Laboratório de Entomologia.',
                    assignments: [
                      'Identificar insetos transmissores de doenças ao homem, especialmente os  transmissores de dengue e calazar.',
                    ],
                  },
                ],
              },
              {
                id: 7,
                label:
                  'NCRLOZ - Núcleo de Controle da Raiva, Leishmaniose e Outras Zoonoses.',
                expand: false,
                assignments: [
                  {
                    text: 'Ações de vigilância da raiva',
                    assignments: [
                      'Coleta, recebimento e processamento de material biológico de animais suspeitos para exame de raiva animal (cães, gatos, morcegos e outros animais silvestres).',
                      'Vacinação antirrábica canina e felina em posto fixo   e em campanha.',
                      'Remoção de morcego encontrados em situação não habitual da espécie, como caídos, dentro de estabelecimentos e ao alcance de pessoas ou animais.',
                      'Busca ativa e observação de animais agressivos ou outros sinais sugestivos de raiva, que não possuam um tutor ou responsável pelos mesmos, num período de 10 dias.',
                      'Ações educativas',
                    ],
                  },
                  {
                    text: 'Ações de vigilância da leishmaniose visceral canina',
                    assignments: [
                      'Investigação dos casos humanos notificados.',
                      'Busca ativa de cães sintomáticos para exame parasitológico e confirmação da identificação da Leishmania visceral.',
                      'Monitoramento sorológico de cães, para detecção da circulação do parasita.',
                      'Coleta, recebimento e preparo de amostras para exame sorológicos teste elisa- imunoenzimático   e DPPD.',
                      'Investigar denúncias em casos suspeitos de Leismaniose.',
                      'Mapear os casos de Leishmaniose visceral humana e canina no município de Teresina.',
                      'Realizar coleta de sangue dos cães no posto fixo da GEZOON.',
                      'Realizar encoleramento de cães objetivando reduzir a prevalência dos casos de leishmaniose canina.',
                      'Preparar e aplicar inseticida para combate ao calazar.',
                      'Fiscalizar a criação irregular de animais no município de Teresina.',
                    ],
                  },
                  {
                    text: 'Biotério',
                    assignments: [
                      'Manutenção e criação de camundongos.',
                      'Acompanhamento do ciclo reprodutivo.',
                      'Realizar acasalamento, desmame e descarte dos mesmos.',
                    ],
                  },
                  {
                    text: 'Sala de Esterelização',
                    assignments: [
                      'Lavar e esterilizar o material de laboratório e cirúrgico.',
                    ],
                  },
                ],
              },
              {
                id: 8,
                label: 'NC - Núcleo de Correição',
                expand: false,
                assignments: [
                  'Retirada de cadáveres de animais das via públicas (ruas, avenidas, calçadas).',
                  'Eutanásia, quando indicado, de animais de relevância para a saúde pública.',
                  'Recolhimento e transporte de animais, quando couber, de relevância para a saúde pública.',
                  'Recepção de animais vivos e de cadáveres de animais quando forem de relevância para a saúde pública.',
                  'Doação de animais com realização prévia do exame sorológico dos animais disponíveis.',
                  'Manutenção e cuidados básicos de animais recolhidos em estabelecimento responsável por vigilância de zoonoses pertencente ao Sistema Único de Saúde (SUS), observando normatização vigente quanto aos prazos estipulados de permanência do animal, quando houver.',
                ],
              },
            ],
          },
        ],
      },
      layoutType: 'vertical',
      collapsable: true,
      selectedNode: null,
    };
  },
  methods: {
    labelClassName(data) {
      return 'bg';
    },
    onExpand(e, data) {
      console.log(data);
      console.log(e);
      if ('expand' in data) {
        data.expand = !data.expand;

        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, 'expand', true);
      }
    },
    collapse(list) {
      list.forEach((child) => {
        if (child.expand) {
          child.expand = false;
        }

        child.children && this.collapse(child.children);
      });
    },
    unselect(root) {
      this.$set(root, 'selectedKey', false);

      if (root.children) {
        root.children.forEach((child) => {
          this.unselect(child);
        });
      }
    },
    onNodeClick(e, data) {
      this.unselect(this.treeData);
      this.$set(data, 'selectedKey', !data.selectedKey);
      this.selectedNode = data;
      this.layoutType = 'horizontal';
    },
  },
};
</script>
<style scoped>
.card-scroll {
  overflow-y: auto;
  max-height: 600px;
}
</style>
<style>
.pointer {
  cursor: pointer;
}
</style>
