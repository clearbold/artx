/* New modernizr test for all touch devices */
Modernizr.addTest('touchcapable', function () {
    var bool;
    if(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
      bool = true;
    } else {
      bool = false;
    }
    return bool;
});

/* Global namespace */
var ArtX = ArtX || {};

ArtX.data = ArtX.data || {};

ArtX.el = {
    html            : $('html'),
    win             : $(window),
    doc             : $(document),
    body            : $('body')
};

ArtX.util = {
    hasTouch        : Modernizr.touchcapable,
    hasPosFixed     : Modernizr.positionfixed,
    hasiOSPosFixed  : Modernizr.iospositionfixed,
    viewportWidth   : function() { return ArtX.el.win.width();     },
    viewportHeight  : function() { return ArtX.el.win.height();     },
    docHeight       : function() { return ArtX.el.doc.height();    },
    bodyHeight      : function() { return ArtX.el.body.height();    },
    footerHeight    : function() { return ArtX.el.footer.height();    },
    scrollPos       : function() { return ArtX.el.win.scrollTop(); },
    mobileMode      : function() {
        return (ArtX.util.viewportWidth() <= 767)? true : false;
    },
    desktopMode     : function() {
        return (ArtX.util.viewportWidth() >= 1024)? true : false;
    },
    orientation     : function() {
        if (typeof orientation != 'undefined') {
            return (Math.abs(window.orientation) === 90)? "landscape" : "portrait";
        } else {
            return (ArtX.util.viewportWidth() >= ArtX.util.viewportHeight()) ? "landscape" : "portrait";
        }
    },
    replaceAll: function (txt, replace, with_this) {
        return txt.replace(new RegExp(replace, 'g'),with_this);
    },
    isOldIE: function() {
        return (($.browser.msie) && ($.browser.version <= 8))? true : false;
    }
};

/* Set up Accessible Skiplinks
   ========================================================================== */
ArtX.setupSkipLinks = function() {
    /* Skiplink Javascript for Safari and Chrome */
    if ($("#skiptarget").length > 0) {
        var is_webkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1;
        var is_opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1;
        if( is_webkit || is_opera ) {
            var target = document.getElementById('skiptarget');
            target.href="#skiptarget";
            target.innerText="Start of main content";
            target.setAttribute("tabindex" , "0");
            document.getElementById('skiplink').setAttribute("onclick" , "document.getElementById('skiptarget').focus();");
        }
    }
};

/* Set up slide-in menu panels
   ========================================================================== */

ArtX.setupSlidingPanels = function() {

    var $masthead = $(".masthead"),
        $footer = $(".footer"),
        mastheadHeight = $masthead.outerHeight,
        footerHeight = $footer.outerHeight,
        $slidingMenuPanel = $("#menu-panel"),
        $slidingTagsPanel = $("#tags-panel"),
        menuSliderOptions,
        tagsSliderOptions;

    if (($slidingMenuPanel.length > 0) || ($slidingTagsPanel.length > 0) ) {
        if (ArtX.el.html.hasClass("positionfixed")) {
            menuSliderOptions = {
                name: 'menu-panel',
                side: 'right',
                displace: false
            };
            tagsSliderOptions = {
                name: 'tags-panel',
                side: 'left', // By default
                displace: false
            };
        } else {
            menuSliderOptions = {
                name: 'menu-panel',
                side: 'right'
            };
            tagsSliderOptions = {
                name: 'tags-panel',
                side: 'left' // By default
            };
        }

        // Initialize Menu panel
        if ($slidingMenuPanel.length > 0) {
            console.log("Initializing Menu sliding panel");

            var $slidingMenuTrigger = $("#menu-trigger");

            $slidingMenuTrigger.sidr(menuSliderOptions);
        }
        
        // Initialize Tags panel
        if ($slidingTagsPanel.length > 0) {
            console.log("Initializing Tags sliding panel");

            var $slidingTagsTrigger = $("#tags-trigger");

            $slidingTagsTrigger.sidr(tagsSliderOptions);
        }


    }
   
};


/* Set up Peeking slider
   ========================================================================== */

ArtX.setupPeekSlider = function() {
    // Assumption -- there will only ever be one peek-style slider per page/screen
    var $peekSlider = $(".slider-style-peek").find("ul");
    if ($peekSlider.length > 0) {
        console.log("Initializing peeking slider");

        var peekSlideInstance = $peekSlider.bxSlider({
            oneToOneTouch:false,
            pager:false,
            auto:false,
            onSliderLoad: function(currentIndex) {
                //console.log("currentIndex: " + currentIndex);
                $peekSlider.find("li").eq(currentIndex).addClass("slide-prev");
                $peekSlider.find("li").eq(currentIndex+2).addClass("slide-next");
            },
            onSlideBefore: function($slideElement, oldIndex, newIndex) {
                //console.log("oldIndex: " + oldIndex);
                //console.log("newIndex: " + newIndex);
                $(".slide-prev").removeClass("slide-prev");
                $(".slide-next").removeClass("slide-next");
                $peekSlider.find("li").eq(newIndex).addClass("slide-prev");
                $peekSlider.find("li").eq(newIndex+2).addClass("slide-next");
            }
        });

        $('#peek-slider-next').click(function(){
          peekSlideInstance.goToNextSlide();
          return false;
        });

        $('#peek-slider-previous').click(function(){
          peekSlideInstance.goToPrevSlide();
          return false;
        });
    }
};

/* Set up Favorites slider in footer
   ========================================================================== */
ArtX.setupFavoriteSlider = function() {
    var $favoriteSlider = $("#favorite-slider");
    if ($favoriteSlider.length > 0) {
        console.log("Initializing favorites slider");

        var favSlideInstance = $favoriteSlider.bxSlider({
            minSlides:3,
            maxSlides:4,
            moveSlides:1,
            slideWidth:300,
            slideMargin:5,
            oneToOneTouch:false
        });

        $('#favorite-slider-next').click(function(){
          favSlideInstance.goToNextSlide();
          return false;
        });

        $('#favorite-slider-previous').click(function(){
          favSlideInstance.goToPrevSlide();
          return false;
        });
    }
};

/* Set up Favorite stars
   ========================================================================== */

ArtX.setupFavoriteStars = function() {
    var $favoriteStars = $(".favorite-star");
    if ($favoriteStars.length > 0) {
        console.log("Initializing favorite stars");

        $favoriteStars.click(function() {
            var $thisStarIcon = $(this).find(".icon");
            if ($thisStarIcon.hasClass("icon-star")) {
                $thisStarIcon.removeClass("icon-star").addClass("icon-star2");
            } else {
                $thisStarIcon.removeClass("icon-star2").addClass("icon-star");
            }
            return false;
        });
       
    }
};

/* Initialize/Fire
   ========================================================================== */
ArtX.startup = {
    init : function () {
        //console.log("Initial load: scripting initializing");
        $('a[href="#"]').click(function(e){e.preventDefault();});
        picturefill();
        ArtX.setupSkipLinks();

        ArtX.setupSlidingPanels();
        ArtX.setupPeekSlider();
        ArtX.setupFavoriteSlider();
        ArtX.setupFavoriteStars();

        // Initialize FastClick on certain items, to remove the 300ms delay on touch events
        FastClick.attach(document.body);

        // Check for caching updates
        /*
        if (window.applicationCache) {
            applicationCache.addEventListener('updateready', function() {
                if (confirm('An update is available. Reload now?')) {
                    window.location.reload();
                }
            });
        }*/
    },
    finalize : function() {
        //console.log("Initial load: scripting finalized");
    }
};


$(document).ready(function() {

    Modernizr.load([
        
        // Test need for matchMedia polyfill
        {
            test: window.matchMedia,
            nope: ['/ui/js/standalone/media.match.min.js'],
            load: ['/ui/js/standalone/enquire.min.js','/ui/js/standalone/picturefill.min.js'],
            complete: function() {

                /* Fire based on document context 
                ========================================================================== */

                var namespace  = ArtX.startup, context = document.body.id;
                if (typeof namespace.init === 'function') {
                    namespace.init();
                }
                if (namespace && namespace[ context ] && (typeof namespace[ context ] === 'function')) {
                    namespace[ context ]();
                }
                if (typeof namespace.finalize === 'function') {
                    namespace.finalize();
                }

                
            }
        }
    ]);
});