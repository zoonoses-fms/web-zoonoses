<template>
  <div class="container-fluid m-0 p-0 flex-container">
    <header class="border-top border-primary border-3 justify-content-center">
      <div class="container my-2">
        <small class="text-primary"
          >Seja Bem vindo - Teresina, {{ dateNow }}</small
        >
        <div class="row my-2">
          <div class="col-12 col-md-6 col-lg-4 justify-content-end">
            <img :src="bannerFms" class="img-fluid" alt="banner" />
          </div>
          <div
            class="col-12 col-md-6 col-lg-8 d-none d-print-none d-md-inline justify-content-start"
          >
            <img :src="bannerPmt" class="img-fluid" alt="banner" />
          </div>
        </div>
      </div>
      <BNavbar toggleable="lg" type="dark" variant="primary">
        <div class="container">
          <BNavbarBrand to="/">
            <BIconHouse />
          </BNavbarBrand>

          <BNavbarToggle target="nav-collapse"></BNavbarToggle>

          <BCollapse id="nav-collapse" is-nav>
            <BNavbarNav>
              <BNavItem to="/site/institutional/chart">Organograma</BNavItem>
              <BNavItem to="/systemz">SystemZ</BNavItem>
<!--
              <BNavItemDropdown text="Intitucional" left>
                <BDropdownItem to="/site/institutional/chart"
                  >Organograma</BDropdownItem
                >
                <BDropdownItem to="/site/institutional/historic"
                  >Histórico</BDropdownItem
                >
                <BDropdownItem to="/site/institutional/legislation"
                  >Legislação</BDropdownItem
                >
              </BNavItemDropdown>

              <BNavItem to="/dashboards">Dashboards</BNavItem>
 -->
            </BNavbarNav>
          </BCollapse>
        </div>
      </BNavbar>
    </header>
    <div class="container"><Nuxt /></div>
    <footer class="container-fluid text-light bg-dark">
      <div class="container">
        <div class="row">
          <div class="col-12 col-12 col-md-8 col-lg-9">
            <h4>
              <strong>Fundação Municipal de Saúde de Teresina - FMS</strong>
            </h4>
          </div>
        </div>
        <div class="row footer">
          <div class="col-12 col-12 col-md-8 col-lg-9">
            <p>
              A FMS tem por objetivo o planejamento e a execução da política de
              saúde do Município de Teresina, desenvolvendo atividades
              integradas de prevenção, proteção, promoção e recuperação da
              saúde.
            </p>
            <ul class="list-unstyled">
              <li>
                <BIconHouse /> Rua Governador Artur de Vasconcelos,
                3015 - Aeroporto, Teresina - PI CEP: 64002-530
              </li>
              <li><BIconTelephone /> (+55) 86 3228-8700</li>
              <li>
                <BIconMailbox /> <a href="mailto:ouvidoriasus@pmt.pi.gov.br" target="_blank"
                  >ouvidoriasus@pmt.pi.gov.br</a
                >
              </li>
              <li>
                <BIconPinMap /> <a
                  href="https://www.google.com.br/maps/place/Funda%C3%A7%C3%A3o+Municipal+de+Sa%C3%BAde+-+FMS/@-5.0633289,-42.8153531,17z/data=!4m5!3m4!1s0x78e39af7bcd04e3:0x538a10faed175a6a!8m2!3d-5.0620892!4d-42.8153638?hl=pt-BR"
                  target="_blank"
                  >Encontre no Google Maps</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LayoutSite',
  data() {
    return {
      dateNow: new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      bannerFms: require('~/assets/img/banner/banner-fms.png'),
      bannerPmt: require('~/assets/img/banner/banner-pmt.png'),
    };
  },
};
</script>
<style scoped>
.flex-container {
  background-color: #f6f6f1;
  min-height: 100vh !important;
}
</style>
