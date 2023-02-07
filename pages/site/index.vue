<template>
  <div>
    <div class="row my-2">
      <div class="news col-12 col-md-8 col-lg-9 px-1">
        <div class="row my-1 px-3">
          <BCarousel
            id="carousel-1"
            v-model="slide"
            :interval="4000"
            controls
            indicators
            background="#ababab"
            img-width="1024"
            img-height="480"
            style="text-shadow: 1px 1px 2px #333"
          >
            <!-- Text slides with image -->
            <BCarouselSlide
              caption="First slide"
              text="Nulla vitae elit libero, a pharetra augue mollis interdum."
              img-src="https://picsum.photos/1024/480/?image=52"
            ></BCarouselSlide>

            <!-- Slides with custom text -->
            <BCarouselSlide img-src="https://picsum.photos/1024/480/?image=54">
              <h1>Hello world!</h1>
            </BCarouselSlide>

            <!-- Slides with image only -->
            <BCarouselSlide
              img-src="https://picsum.photos/1024/480/?image=58"
            ></BCarouselSlide>

            <!-- Slides with img slot -->
            <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
            <BCarouselSlide>
              <template #img>
                <img
                  class="d-block img-fluid w-100"
                  width="1024"
                  height="480"
                  src="https://picsum.photos/1024/480/?image=55"
                  alt="image slot"
                />
              </template>
            </BCarouselSlide>

            <!-- Slide with blank fluid image to maintain slide aspect ratio -->
            <BCarouselSlide
              caption="Blank Image"
              img-blank
              img-alt="Blank image"
            >
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse eros felis, tincidunt a tincidunt eget, convallis
                vel est. Ut pellentesque ut lacus vel interdum.
              </p>
            </BCarouselSlide>
          </BCarousel>
        </div>

        <div class="row my-1">
          <div class="col-12">
            <CardsNews>
              <template #card-header> Zoonoses </template>
              <template #card-title>
                <h2>Why do we use it?</h2>
              </template>
              <div class="col single-post no-gutters">
                <div class="image-wrapper float-left pr-3">
                  <img src="https://placeimg.com/192/192/animals" alt="" />
                </div>
                <div class="single-post-content-wrapper p-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here', making it look like readable English.
                  Many desktop publishing packages and web page editors now use
                  Lorem Ipsum as their default model text, and a search for
                  'lorem ipsum' will uncover many web sites still in their
                  infancy. Various versions have evolved over the years,
                  sometimes by accident, sometimes on purpose (injected humour
                  and the like).
                  <a href="#">Link</a>
                </div>
              </div>
              <template #card-footer> data: 25/01/2023 </template>
            </CardsNews>
          </div>
        </div>
        <div class="row px-2">
          <div class="col-12 col-lg-6 p-2">
            <CardsNews>
              <template #card-header> Zoonoses </template>
              <template #card-title>
                <h4>Why do we use it?</h4>
              </template>
              <div class="col single-post no-gutters">
                <div class="image-wrapper float-left pr-3">
                  <img src="https://placeimg.com/192/192/animals" alt="" />
                </div>
                <div class="single-post-content-wrapper p-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here'...
                  <a href="#">Link</a>
                </div>
              </div>
              <template #card-footer> data: 25/01/2023 </template>
            </CardsNews>
          </div>
          <div class="col-12 col-lg-6 p-2">
            <CardsNews>
              <template #card-header> Zoonoses </template>
              <template #card-title>
                <h4>Why do we use it?</h4>
              </template>
              <div class="col single-post no-gutters">
                <div class="image-wrapper float-left pr-3">
                  <img src="https://placeimg.com/192/192/animals" alt="" />
                </div>
                <div class="single-post-content-wrapper p-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here'...
                  <a href="#">Link</a>
                </div>
              </div>
              <template #card-footer> data: 25/01/2023 </template>
            </CardsNews>
          </div>
          <div class="col-12 col-lg-6 p-2">
            <CardsNews>
              <template #card-header> Zoonoses </template>
              <template #card-title>
                <h4>Why do we use it?</h4>
              </template>
              <div class="col single-post no-gutters">
                <div class="image-wrapper float-left pr-3">
                  <img src="https://placeimg.com/192/192/animals" alt="" />
                </div>
                <div class="single-post-content-wrapper p-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here'...
                  <a href="#">Link</a>
                </div>
              </div>
              <template #card-footer> data: 25/01/2023 </template>
            </CardsNews>
          </div>
          <div class="col-12 col-lg-6 p-2">
            <CardsNews>
              <template #card-header> Zoonoses </template>
              <template #card-title>
                <h4>Why do we use it?</h4>
              </template>
              <div class="col single-post no-gutters">
                <div class="image-wrapper float-left pr-3">
                  <img src="https://placeimg.com/192/192/animals" alt="" />
                </div>
                <div class="single-post-content-wrapper p-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here'...
                  <a href="#">Link</a>
                </div>
              </div>
              <template #card-footer> data: 25/01/2023 </template>
            </CardsNews>
          </div>
        </div>
      </div>
      <div class="link col-12 col-md-4 col-lg-3 h-100 px-0">
        <CardsLinks />
      </div>
    </div>
  </div>
</template>

<script>
import stringUtil from '~/mixins/string_util';
export default {
  name: 'HomePage',
  mixins: [stringUtil],
  layout: 'site',
  auth: false,
  data() {
    return {
      slide: 0,
    };
  },
};
</script>
<style scoped>
/* .news {
  background-color: chocolate;
} */
</style>
