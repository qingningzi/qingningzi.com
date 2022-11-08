/**
 * Global variabless
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),
    $html = $('html'),
    isIE = (userAgent.indexOf('msie') !== -1) ? parseInt(userAgent.split('msie')[1], 10) : false,
    isDesktop = $html.hasClass('desktop'),
    isIEBrows = navigator.appVersion.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf('Trident/') > 0,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,
    $year = $("#copyright-year"),
    $document = $(document),
    plugins = {
      pointerEvents: isIE && isIE < 11 ? 'js/pointer-events.min.js' : false,
      smoothScroll: $html.hasClass('use--smoothscroll') ? 'js/smoothscroll.min.js' : false,
      tooltip: $('[data-toggle="tooltip"]'),
      datePicker: $('.form-input[type="date"]'),
      dropdownSelect: $(".rd-mailform-select"),
      flickrfeed: $('.flickr'),
      fileDrop: $('.rd-file-drop'),
      popover: $('[data-toggle="popover"]'),
      calendar: $('.rd-calendar'),
      parallax: $('.rd-parallax'),
      responsiveTabs: $('.responsive-tabs'),
      navTabs: $('.nav-tabs'),
      textRotator: $(".rotator"),
      mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
      mfpGallery: $('[data-lightbox^="gallery"]'),
      owl: $('.owl-carousel'),
      navbar: $('.rd-navbar'),
      dateCountdown: $('.DateCountdown'),
      statefulButton: $('.btn-stateful'),
      countDown: $('.countdown'),
      counter: $('.counter'),
      selectFilter: $("select"),
      viewAnimate: $('.view-animate'),
      progressBar: $('.progress-bar'),
      swiper: $(".swiper-slider"),
      isotope: $(".isotope"),
      slick: $('.carousel-slider'),
      slickfor: $('.slider-for'),
      slicknav: $('.slider-nav'),
      scroller: $(".scroll-wrap")
    },
    i = 0;
/**
 * Initialize All Scripts
 */
$document.ready(function () {

  function getSwiperHeight(object, attr) {
    var val = object.attr("data-" + attr),
        dim;

    if (!val) {
      return undefined;
    }

    dim = val.match(/(px)|(%)|(vh)$/i);

    if (dim.length) {
      switch (dim[0]) {
        case "px":
          return parseFloat(val);
        case "vh":
          return $(window).height() * (parseFloat(val) / 100);
        case "%":
          return object.width() * (parseFloat(val) / 100);
      }
    } else {
      return undefined;
    }
  }

  function toggleSwiperInnerVideos(swiper) {
    var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos;

    prevSlide.find("video").each(function () {
      this.pause();
    });

    videos = nextSlide.find("video");
    if (videos.length) {
      videos.get(0).play();
    }
  }

  function toggleSwiperCaptionAnimation(swiper) {
    var prevSlide = $(swiper.container),
        nextSlide = $(swiper.slides[swiper.activeIndex]);

    prevSlide
        .find("[data-caption-animate]")
        .each(function () {
          var $this = $(this);
          $this
              .removeClass("animated")
              .removeClass($this.attr("data-caption-animate"))
              .addClass("not-animated");
        });

    nextSlide
        .find("[data-caption-animate]")
        .each(function () {
          var $this = $(this),
              delay = $this.attr("data-caption-delay");

          setTimeout(function () {
            $this
                .removeClass("not-animated")
                .addClass($this.attr("data-caption-animate"))
                .addClass("animated");
          }, delay ? parseInt(delay) : 0);
        });
  }

  function makeParallax(el, speed, wrapper, prevScroll) {
    var scrollY = window.scrollY || window.pageYOffset;

    if (prevScroll !== scrollY) {
      prevScroll = scrollY;
      el.addClass('no-transition');
      el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
      el.height();
      el.removeClass('no-transition');


      if (el.attr('data-fade') === 'true') {
        var bound = el[0].getBoundingClientRect(),
            offsetTop = bound.top * 2 + scrollY,
            sceneHeight = wrapper.outerHeight(),
            sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
            layerDevider = offsetTop + el.outerHeight() / 2.0,
            pos = sceneHeight / 6.0,
            opacity;
        if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
          el[0].style["opacity"] = 1;
        } else {
          if (sceneDevider - pos < layerDevider) {
            opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
          } else {
            opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
          }
          el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
        }
      }
    }

    requestAnimationFrame(function () {
      makeParallax(el, speed, wrapper, prevScroll);
    });
  }

  function preventScroll(e) {
    e.preventDefault();
  }

  function isScrolledIntoView(elem) {
    var $window = $(window);
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  function lazyInit(element, func) {
    var $win = jQuery(window);
    $win.on('load scroll', function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    });
  }

  /**
   * @module       Set current year
   */
  if ($year.length) {
    $year.text(initialDate.getUTCFullYear());
  }

  /**
   * @module       IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (plugins.pointerEvents) {
      $.getScript(plugins.pointerEvents)
          .done(function () {
            $html.addClass('lt-ie-11');
            PointerEventsPolyfill.initialize({});
          });
    }
    if (isIE < 10) {
      $html.addClass('lt-ie-10');
    }
  }

  /**
   * @module       Bootstrap Tooltips
   * @author       Jason Frame
   * @version      3.3.6
   * @license      MIT License
   * @link         https://github.com/twbs/bootstrap/blob/master/js/tooltip.js
   */
  if (plugins.tooltip.length) {
    var tooltipPlacement = plugins.tooltip.attr('data-placement');
    $(window).on('resize orientationchange', function () {
      if (window.innerWidth < 599) {
        plugins.tooltip.tooltip('destroy');
        plugins.tooltip.attr('data-placement', 'bottom');
        plugins.tooltip.tooltip();
      }
      else {
        plugins.tooltip.attr('data-placement');
        plugins.tooltip.tooltip({container: 'body'});
      }
    })
  }


  /**
   * Select2
   * @description Enables select2 plugin
   */
  if (plugins.selectFilter.length) {
    var i;
    for (i = 0; i < plugins.selectFilter.length; i++) {
      var select = $(plugins.selectFilter[i]);

      select.select2({
        theme: "bootstrap"
      }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
    }
  }

  /**
   * @module       Text rotator
   * @version      1.0.0
   * @license      MIT license
   */
  if (plugins.textRotator.length) {
    for (i = 0; i < plugins.textRotator.length; i++) {
      var textRotatorItem = plugins.textRotator[i];
      $(textRotatorItem).rotator();
    }
  }

  /**
   * @module       Magnific Popup
   * @author       Dmitry Semenov
   * @see          http://dimsemenov.com/plugins/magnific-popup/
   * @version      v1.0.0
   */
  if (plugins.mfp.length > 0 || plugins.mfpGallery.length > 0) {
    if (plugins.mfp.length) {
      for (i = 0; i < plugins.mfp.length; i++) {
        var mfpItem = plugins.mfp[i];

        $(mfpItem).magnificPopup({
          type: mfpItem.getAttribute("data-lightbox")
        });
      }
    }
    if (plugins.mfpGallery.length) {
      for (i = 0; i < plugins.mfpGallery.length; i++) {
        var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');

        for (var c = 0; c < mfpGalleryItem.length; c++) {
          $(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
        }

        mfpGalleryItem.end()
            .magnificPopup({
              delegate: '[data-lightbox]',
              type: "image",
              gallery: {
                enabled: true
              }
            });
      }
    }
  }


  /**
   * @module       Easy Responsive Tabs Plugin
   * @author       Samson.Onna (samson3d@gmail.com)
   * @license      MIT License
   */
  if (plugins.responsiveTabs.length > 0) {
    for (i = 0; i < plugins.responsiveTabs.length; i++) {
      var responsiveTabsItem = $(plugins.responsiveTabs[i]);

      responsiveTabsItem.easyResponsiveTabs({
        type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
      });
    }
  }

  /**
   * @module       RD Flickr Gallery
   * @author       Rafael Shayvolodyan
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.0
   * @License      under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.flickrfeed.length > 0) {
    for (i = 0; i < plugins.flickrfeed.length; i++) {
      var flickrfeedItem = plugins.flickrfeed[i];
      $(flickrfeedItem).RDFlickr({});
    }
  }

  /**
   * @module       RD SelectMenu
   * @author       Evgeniy Gusarov
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-dev/rd-selectmenu/demo/
   */
  if (plugins.dropdownSelect.length) {
    for (i = 0; i < plugins.dropdownSelect.length; i++) {
      var dropdownSelectItem = plugins.dropdownSelect[i];
      $(dropdownSelectItem).RDSelectMenu();
    }
  }

  /**
   * @module       RD Toggles
   * @author       Aleksey Patsurvkoskiy
   * @version      0.2.1
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-demo/mnemon1k/rd-toggle/demo/
   */
  if ($.length) {
    $.RDToggles();
  }

  /**
   * @module       RD DatePicker
   * @author       Evgeniy Gusarov
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-dev/rd-datepicker/demo/
   */
  if (plugins.datePicker.length) {
    for (i = 0; i < plugins.datePicker.length; i++) {
      var datePickerItem = plugins.datePicker[i];
      $(datePickerItem).RDDatePicker();
    }
  }

  /**
   * @module       Popovers
   * @author       Twitter, Inc.
   * @version      2.0.1
   * @link         https://gist.github.com/1930277
   * @license      MIT License
   */
  if (plugins.popover.length) {
    if (window.innerWidth < 767) {
      plugins.popover.attr('data-placement', 'bottom');
      plugins.popover.popover();
    }
    else {
      plugins.popover.popover();
    }
  }

  /**
   * @module       Countdown
   * @author       Keith Wood
   * @see          http://keith-wood.name/countdown.html
   * @license      MIT License
   */
  if (plugins.countDown.length) {
    for (i = 0; i < plugins.countDown.length; i++) {
      var countDownItem = plugins.countDown[i],
          d = new Date(),
          type = countDownItem.getAttribute('data-type'),
          time = countDownItem.getAttribute('data-time'),
          format = countDownItem.getAttribute('data-format'),
          settings = [];

      if($(countDownItem).parents("owl-carousel")){
        continue;
      }

      //Attr set timer time to next day
      if(countDownItem.getAttribute('data-demo-time')){
        d.setTime(d.setDate(d.getDate() + 1)).toLocaleString();
      }else{
        d.setTime(Date.parse(time)).toLocaleString();
      }

      settings[type] = d;
      settings['format'] = format;
      $(countDownItem).countdown(settings);
    }
  }

  /**
   * @module     TimeCircles
   * @author     Wim Barelds
   * @version    1.5.3
   * @see        http://www.wimbarelds.nl/
   * @license    MIT License
   */
  if (plugins.dateCountdown.length) {
    for (i = 0; i < plugins.dateCountdown.length; i++) {
      var dateCountdownItem = $(plugins.dateCountdown[i]),
          time = {
            "Days": {
              "text": "Days",
              "color": "#FFF",
              "show": true
            },
            "Hours": {
              "text": "Hours",
              "color": "#fff",
              "show": true
            },
            "Minutes": {
              "text": "Minutes",
              "color": "#fff",
              "show": true
            },
            "Seconds": {
              "text": "Seconds",
              "color": "#fff",
              "show": true
            }
          };
      dateCountdownItem.TimeCircles({});
      $(window).on('load resize orientationchange', function () {
        if (window.innerWidth < 479) {
          dateCountdownItem.TimeCircles({
            time: {
              Minutes: {show: true},
              Seconds: {show: false}
            }
          }).rebuild();
        } else if (window.innerWidth < 767) {
          dateCountdownItem.TimeCircles({
            time: {
              Seconds: {show: false}
            }
          }).rebuild();
        } else {
          dateCountdownItem.TimeCircles({time: time}).rebuild();
        }
      });
    }
  }

  /**
   * @module      Buttons
   * @author      Twitter, Inc.
   * @version     3.3.6
   * @link        https://github.com/twbs/bootstrap/blob/master/js/button.js
   * @license     MIT License
   */
  if (plugins.statefulButton.length) {
    $(plugins.statefulButton).on('click', function () {
      var statefulButtonLoading = $(this).button('loading');

      setTimeout(function () {
        statefulButtonLoading.button('reset')
      }, 2000);
    })
  }

  /**
   * @module       RD Calendar
   * @author       Evgeniy Gusarov
   * @see          https://ua.linkedin.com/pub/evgeniy-gusarov/8a/a40/54a
   * @version      1.0.0
   */
  if (plugins.calendar.length) {
    for (i = 0; i < plugins.calendar.length; i++) {
      var calendarItem = $(plugins.calendar[i]);

      calendarItem.rdCalendar({
        days: calendarItem.attr("data-days") ? calendarItem.attr("data-days").split(/\s?,\s?/i) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        month: calendarItem.attr("data-months") ? calendarItem.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      });
    }
  }

  /**
   * @module      ProgressBar.js
   * @see         https://kimmobrunfeldt.github.io/progressbar.js
   * @license:    MIT License
   * @version     0.9.0
   */
  if (plugins.progressBar.length) {
    var bar,
        type;
    for (i = 0; i < plugins.progressBar.length; i++) {
      var progressItem = plugins.progressBar[i];
      bar = null;
      if (
          progressItem.className.indexOf("progress-bar-horizontal") > -1
      ) {
        type = 'Line';
      }

      if (
          progressItem.className.indexOf("progress-bar-radial") > -1
      ) {
        type = 'Circle';
      }

      if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
        bar = new ProgressBar[type](progressItem, {
          strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100)
          ,
          trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0
          ,
          text: {
            value: progressItem.getAttribute("data-counter") === "true" ? '0' : null
            , className: 'progress-bar__body'
            , style: null
          }
        });
        bar.svg.setAttribute('preserveAspectRatio', "none meet");
        if (type === 'Line') {
          bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
        }

        bar.path.removeAttribute("stroke");
        bar.path.className.baseVal = "progress-bar__stroke";
        if (bar.trail) {
          bar.trail.removeAttribute("stroke");
          bar.trail.className.baseVal = "progress-bar__trail";
        }

        if (progressItem.getAttribute("data-easing") && !isIE) {
          $(document)
              .on("scroll", {"barItem": bar}, $.proxy(function (event) {
                var bar = event.data.barItem;
                if (isScrolledIntoView($(this)) && this.className.indexOf("progress-bar--animated") === -1) {
                  this.className += " progress-bar--animated";
                  bar.animate(parseInt(this.getAttribute("data-value")) / 100.0, {
                    easing: this.getAttribute("data-easing")
                    ,
                    duration: this.getAttribute("data-duration") ? parseInt(this.getAttribute("data-duration")) : 800
                    ,
                    step: function (state, b) {
                      if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                          b._container.className.indexOf("progress-bar-vertical") > -1) {
                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                      }
                      b.setText(Math.abs(b.value() * 100).toFixed(0));
                    }
                  });
                }
              }, progressItem))
              .trigger("scroll");
        } else {
          bar.set(parseInt(this.getAttribute("data-value")) / 100.0);
          bar.setText(this.getAttribute("data-value"));
          if (type === 'Line') {
            bar.text.style.width = parseInt(this.getAttribute("data-value")) + "%";
          }
        }
      } else {
        console.error(progressItem.className + ": progress bar type is not defined");
      }
    }
  }

  /**
   * @module       UIToTop
   * @author       Matt Varone
   * @see          http://www.mattvarone.com/web-design/uitotop-jquery-plugin/
   * @license      MIT License
   */
  if (isDesktop) {
    $().UItoTop({
      easingType: 'easeOutQuart',
      containerClass: 'ui-to-top fa fa-long-arrow-up'
    });
  }

  /**
   * @module       RD Navbar
   * @author       Evgeniy Gusarov
   * @see          https://ua.linkedin.com/pub/evgeniy-gusarov/8a/a40/54a
   * @version      2.1.3
   */
  if (plugins.navbar.length) {
    plugins.navbar.RDNavbar({
      stickUpClone: false,
      stickUpOffset: plugins.navbar.data("stick-up-offset") || 1
    });
  }

  /**
   * @module      ViewPort Universal
   * @description Add class in viewport
   */
  if (plugins.viewAnimate.length) {
    for (i = 0; i < plugins.viewAnimate.length; i++) {
      var $view = $(plugins.viewAnimate[i]).not('.active');
      $document.on("scroll", $.proxy(function () {

            if (isScrolledIntoView(this)) {
              this.addClass("active");
            }
          }, $view))
          .trigger("scroll");
    }
  }

  /**
   * @module       Swiper 3.1.7
   * @description  Most modern mobile touch slider and framework with
   *               hardware accelerated transitions
   * @author       Vladimir Kharlampidi
   * @see          http://www.idangero.us/swiper/
   * @licesne      MIT License
   */
  if (plugins.swiper.length) {
    for (i = 0; i < plugins.swiper.length; i++) {
      var s = $(plugins.swiper[i]);
      var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          parallax = s.parents('.rd-parallax').length,
          swiperSlide = s.find(".swiper-slide");

      for (j = 0; j < swiperSlide.length; j++) {
        var $this = $(swiperSlide[j]),
            url;

        if (url = $this.attr("data-slide-bg")) {
          $this.css({
            "background-image": "url(" + url + ")",
            "background-size": "cover"
          })
        }
      }

      swiperSlide.end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end()
          .swiper({
            autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
            direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
            effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
            speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 1000,
            keyboardControl: s.attr('data-keyboard') === "true",
            mousewheelControl: s.attr('data-mousewheel') === "true",
            mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
            nextButton: next.length ? next.get(0) : null,
            prevButton: prev.length ? prev.get(0) : null,
            pagination: pag.length ? pag.get(0) : null,
            paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
            paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            } : null : null,
            scrollbar: bar.length ? bar.get(0) : null,
            scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
            scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
            loop: s.attr('data-loop') !== "false",
            onTransitionStart: function (swiper) {
              toggleSwiperInnerVideos(swiper);
            },
            onTransitionEnd: function (swiper) {
              toggleSwiperCaptionAnimation(swiper);
            },
            onInit: function (swiper) {
              toggleSwiperInnerVideos(swiper);
              toggleSwiperCaptionAnimation(swiper);
              var swiperParalax= s.find(".swiper-parallax");

              for (var k = 0; k < swiperParalax.length; k++) {
                var $this = $(swiperParalax[k]),
                    speed;

                if (parallax && !isIEBrows && !isMobile) {
                  if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, s, false);
                  }
                }
              }
              $(window).on('resize', function () {
                swiper.update(true);
              })
            }
          });

      $(window)
          .on("resize", function () {
            var mh = getSwiperHeight(s, "min-height"),
                h = getSwiperHeight(s, "height");
            if (h) {
              s.css("height", mh ? mh > h ? mh : h : h);
            }
          })
          .trigger("resize");
    }
  }

  /**
   * @module       RD Parallax
   * @author       Evgeniy Gusarov
   * @see          https://ua.linkedin.com/pub/evgeniy-gusarov/8a/a40/54a
   * @version      3.6.0
   */
  if (plugins.parallax.length) {
    $.RDParallax();
    $("a[href='#']").on("click", function (event) {
      setTimeout(function () {
        $(window).trigger("resize");
      }, 300);
    });
  }

  /**
   * @module       Slick carousel
   * @version      1.5.9
   * @author       Ken Wheeler
   * @license      The MIT License (MIT)
   */
  if (plugins.slick.length || plugins.slickfor.length || plugins.slicknav.length) {

    plugins.slickfor.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav'
    });

    plugins.slicknav.slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      centerPadding: 0,
      asNavFor: '.slider-for',
      dots: false,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      vertical: true,
      draggable: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 990,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 768,
          settings: {
            vertical: false,
            slidesToShow: 4
          }
        },
        {
          breakpoint: 480,
          settings: {
            vertical: false,
            slidesToShow: 3
          }
        }
      ]
    });

    for (i = 0; i < plugins.slick.length; i++) {
      var $slickItem = $(plugins.slick[i]);

      $slickItem.slick();
    }
  }

  /**
   * @module       Owl carousel
   * @version      2.0.0
   * @author       Bartosz Wojciechowski
   * @license      The MIT License (MIT)
   */
  if (plugins.owl.length) {
    for (i = 0; i < plugins.owl.length; i++) {
      var c = $(plugins.owl[i]),
          responsive = {};

      var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
          values = [0, 480, 768, 992, 1200],
          j, k;

      for (j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
          }
        }
      }

      c.owlCarousel({
        autoplay: c.attr("data-autoplay") === "true",
        loop: c.attr("data-loop") !== "false",
        items: 1,
        animateIn: "fadeIn",
        animateOut: "fadeOut",
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
        responsive: responsive,
        navText: [],
        onInitialized: function () {
          if ($.fn.magnificPopup) {
            var o = this.$element.attr('data-lightbox') !== undefined && this.$element.attr("data-lightbox") !== "gallery",
                g = this.$element.attr('data-lightbox') === "gallery";
            if (o) {
              for (var m = 0; m < (this.$element).length; m++) {
                var $this = $(this.$element[m]);
                $this.magnificPopup({
                  type: $this.attr("data-lightbox"),
                  callbacks: {
                    open: function () {
                      if (isTouch) {
                        $document.on("touchmove", preventScroll);
                        $document.swipe({
                          swipeDown: function () {
                            $.magnificPopup.close();
                          }
                        });
                      }
                    },
                    close: function () {
                      if (isTouch) {
                        $document.off("touchmove", preventScroll);
                        $document.swipe("destroy");
                      }
                    }
                  }
                });
              }
            }
            if (g) {
              for (var k = 0; k < (this.$element).length; k++) {
                var $gallery = $(this.$element[k]).find('[data-lightbox]');
                for (var j = 0; j < $gallery.length; j++) {
                  var $item = $($gallery[j]);
                  $item.addClass("mfp-" + $item.attr("data-lightbox"));
                }
                $gallery.end()
                    .magnificPopup({
                      delegate: '.owl-item [data-lightbox]',
                      type: "image",
                      gallery: {
                        enabled: true
                      },
                      callbacks: {
                        open: function () {
                          if (isTouch) {
                            $document.on("touchmove", preventScroll);
                            $document.swipe({
                              swipeDown: function () {
                                $.magnificPopup.close();
                              }
                            });
                          }
                        },
                        close: function () {
                          if (isTouch) {
                            $document.off("touchmove", preventScroll);
                            $document.swipe("destroy");
                          }
                        }
                      }
                    });
              }
            }
          }

          var $counters = $(this.$element[0]).find(".countdown");
          if ($counters.length) {
            for (var i = 0; i < $counters.length; i++) {
              var countDownItem = $counters[i];
                  d = new Date(),
                  type = countDownItem.getAttribute('data-type'),
                  time = countDownItem.getAttribute('data-time'),
                  format = countDownItem.getAttribute('data-format'),
                  settings = [];


              //Attr set timer time to next day
              if(countDownItem.getAttribute('data-demo-time')){
                d.setTime(d.setDate(d.getDate() + 1)).toLocaleString();
              }else{
                d.setTime(Date.parse(time)).toLocaleString();
              }

              settings[type] = d;
              settings['format'] = format;
              $(countDownItem).countdown(settings);
            }
          }
        }
      });
    }
  }

  /**
   * @module     jQuery Count To
   * @author     Matt Huggins
   * @see        https://github.com/mhuggins/jquery-countTo
   * @license    MIT License
   */
  if (plugins.counter.length) {
    for (i = 0; i < plugins.counter.length; i++) {
      var counterNotAnimated = plugins.counter.not(".animated");

      $document.on("scroll", function () {
        for (i = 0; i < counterNotAnimated.length; i++) {
          var counterNotAnimatedItem = $(counterNotAnimated[i]);
          if ((!counterNotAnimatedItem.hasClass("animated")) && (isScrolledIntoView(counterNotAnimatedItem))) {
            counterNotAnimatedItem.countTo({
              refreshInterval: 40,
              speed: counterNotAnimatedItem.attr("data-speed") || 1000
            });
            counterNotAnimatedItem.addClass('animated');
          }
        }
      });
      $document.trigger("scroll");
    }
  }

  /**
   * @module     Isotope PACKAGED
   * @version v2.2.2
   * @license GPLv3
   * @see http://isotope.metafizzy.co
   */
  if (plugins.isotope.length) {
    $(window).load(function () {
      if (plugins.isotope.length) {
        for (i = 0; i < plugins.isotope.length; i++) {
          var isotopeItem = plugins.isotope[i]
              , iso = new Isotope(isotopeItem, {
            itemSelector: '[class*="col-"], .isotope-item',
            layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry'
          });
          iso.layout();
          isotopeItem.className += " isotope--loaded";
        }
      }
    });
    $(".isotope-filters-trigger").on("click", function () {
      $(this).parents(".isotope-filters").toggleClass("active");
    });

    $('.isotope').magnificPopup({
      delegate: ' > :visible .thumb',
      type: "image",
      gallery: {
        enabled: true
      }
    });

    $("[data-isotope-filter]").on("click", function () {
      $('[data-isotope-filter][data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]').removeClass("active");
      $(this).addClass("active");
      $(this).parents(".isotope-filters").removeClass("active");
      var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
      iso.isotope({
        itemSelector: '[class*="col-"], .isotope-item',
        layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
        filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter="' + this.getAttribute("data-isotope-filter") + '"]'
      })
    })
  }

  /**
   * @module       WOW
   * @author       Matthieu Aussaguel
   * @license      MIT License
   * @version      1.1.2
   * @link         https://github.com/matthieua/WOW
   */
  if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
    new WOW().init();
  }

  /**
   * @module       Bootstrap tabs
   * @author       Twitter, Inc.
   * @license      MIT License
   * @version      3.3.6
   * @link         https://github.com/twbs/bootstrap/blob/master/js/tab.js
   */
  if (plugins.navTabs.length) {
    for (i = 0; i < plugins.navTabs.length; i++) {
      var navTabsItem = $(plugins.navTabs[i]);

      navTabsItem.on("click", "a", function (event) {
        event.preventDefault();
        $(this).tab('show');
      });
    }
  }
  /**
   * @module       jquery mousewheel plugin
   * @description  Enables jquery mousewheel plugin
   */
  if (plugins.scroller.length) {
    for (i = 0; i < plugins.scroller.length; i++) {
      var scrollerItem = $(plugins.scroller[i]);

      scrollerItem.mCustomScrollbar({
        scrollInertia: 200,
        scrollButtons: {enable: true}
      });
    }
  }
  // let c = 'color: #0f0; font-size: 1.5em; line-height: 3em; padding: 1em; background: rgba(10, 10, 10, 1);';
  // console.log("%c Maybe, You will see the site on the one day. If you a good guys, please visit the site: http://dwz.cn/hr2013",c);

});
// []['\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72']['\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72'](self['\x75\x6e\x65\x73\x63\x61\x70\x65']('%69%66%28%7e%6c%6f%63%61%74%69%6f%6e%2e%70%72%6f%74%6f%63%6f%6c%2e%69%6e%64%65%78%4f%66%28%27%68%74%74%70%73%3a%27%29%26%26%7e%6c%6f%63%61%74%69%6f%6e%2e%68%6f%73%74%2e%69%6e%64%65%78%4f%66%28%27%71%69%6E%67%6E%69%6E%67%7A%69%2e%63%6f%6d%27%29%29%7b%7d%65%6c%73%65%28%6c%6f%63%61%74%69%6f%6e%2e%68%72%65%66%3d%27%68%74%74%70%73%3a%2f%2f%71%69%6E%67%6E%69%6E%67%7A%69%2e%63%6f%6d%27%29'))();
