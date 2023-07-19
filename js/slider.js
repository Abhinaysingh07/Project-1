
// slider 1

var swiper = new Swiper(".container", {
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el:
            ".swiper-pagination", clickable: true,
    },
});


// slider 2

var swiper = new Swiper(".sliding", {
    centeredSlides: true,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    slidesOffsetBefore: 0, breakpoints: {
        0: {
            slidesPerView: 1,
        }, 640: { slidesPerView: 1, }, 700: { slidesPerView: 2, },
        768: { slidesPerView: 2, }, 968: { slidesPerView: 2, }, 1100: {
            slidesPerView:
                2,
        }, 1250: { slidesPerView: 6, },
    },
});
