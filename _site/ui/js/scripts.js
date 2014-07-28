/**
 * App Cache Handling
 * Here is the simplified version. Courtesy of Mike Koss.
 * 
 * See, http://labnote.beedesk.com/the-pitfalls-of-html5-applicationcache
 */
function handleAppCache() {
    if (applicationCache === undefined) {
        return;
    }
  
    if (applicationCache.status == applicationCache.UPDATEREADY) {
        applicationCache.swapCache();
        location.reload();
        return;
    }
  
    applicationCache.addEventListener('updateready', handleAppCache, false);
}

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
    body            : $('body'),
    calendarContainer: $("#event-calendar"),
    eventCalendar   : "",
    eventListTarget : $("#event-list"),
    eventListTemplate: $("#template-eventlist").html()
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
    },
    getNumberOfChildItems: function(container) {
        var $containerObj = $(container);
        var childItemCount = 0;

        if ($containerObj.length > 0) {
            var $childrenOfContainer = $containerObj.children();
            if ($childrenOfContainer.length > 0) {
                childItemCount = $childrenOfContainer.length;
            }
        }
        return childItemCount;
    }
};

// Variables that can be used throughout
ArtX.var = {
    itemsPerPage : 5
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
        menuSliderOptions;

    if ($slidingMenuPanel.length > 0) {
        if (ArtX.el.html.hasClass("positionfixed")) {
            menuSliderOptions = {
                name: 'menu-panel',
                side: 'right',
                displace: false
            };
        } else {
            menuSliderOptions = {
                name: 'menu-panel',
                side: 'right'
            };
        }

        // Initialize Menu panel
        if ($slidingMenuPanel.length > 0) {
            console.log("Initializing Menu sliding panel");

            var $slidingMenuTrigger = $("#menu-trigger");

            $slidingMenuTrigger
                .sidr(menuSliderOptions)
                .click(function(e) {
                    e.preventDefault();
                });
        }
    }
   
};

/* Set up Back button
   ========================================================================== */
ArtX.setupBackButton = function() {
    var $backButton = $(".btn-back");
    if ($backButton.length > 0) {
        console.log("Initializing back button");

        $backButton.click(function() {
            location.href=document.referrer;
        });
    }
};

/* Set up toggle switches
   ========================================================================== */
ArtX.setupToggleSwitches = function() {
    $toggleBoxes = $(".onoffswitch").find("input[type='checkbox']");

    if ($toggleBoxes.length > 0) {
        console.log("Initializing toggle switches");
        $toggleBoxes.onoff();
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
            slideWidth:300,
            slideMargin:5,
            oneToOneTouch:false,
            pager:false
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

/* Set up Text Truncation 
   ========================================================================== */
ArtX.setupTextTruncation = function() {
    console.log("Initializing text truncation");

    $(".truncate").trunk8({
        lines: 2,
        tooltip: false
    });

    // Set up a resize event for truncated text
    ArtX.el.win.resize(function() {
        $(".truncate").trunk8({
            lines: 2,
            tooltip: false
        });
    });  
};

/* Set up Signup Modal 
   ========================================================================== */
ArtX.setupSignupModal = function() {
    console.log("Setting up Signup Modal window");

    var isSignedIn = true,
        $signupModalObj = $("#signup-popup");

    // DEV NOTE: This should be replaced with a more robust solution in the final site.
    // This detection is just for demo purposes.

    if ($("#favorite-notsignedin").length > 0) {
        isSignedIn = false;
    }

    console.log("Signed in? " + isSignedIn);

    if (!isSignedIn) {
        $signupModalObj.foundation('reveal', 'open');
    }

    // Set up behavior on modal close
    $(document).on("click", ".close-reveal-modal, .reveal-modal-bg", function() {
        $signupModalObj.foundation('reveal', 'close');
        //console.log("Modal closed");
    });

    // Set up modal trigger link
    $(document).on("click", ".open-signup", function() {
        $signupModalObj.foundation('reveal', 'open');
    });

};

/* Set up custom checkboxes 
   ========================================================================== */
ArtX.setupCustomCheckboxes = function() {
    var $checkboxes = $(".customize-checkbox");

    if ($checkboxes.length > 0) {
        console.log("Setting up custom checkboxes");

        $checkboxes.customInput();
    }
};

/* Set up By Date Event Calendar 
   ========================================================================== */
ArtX.calendar = {
    getEvents: function(jsonURL) {
        $.getJSON(jsonURL, function(data) {
            eventArray = data;

            // Create a Clndr and save the instance as myCalendar
            ArtX.el.eventCalendar = ArtX.el.calendarContainer.clndr({
                template: $('#template-calendar').html(),
                events: eventArray,
                dateParameter: 'start_date',
                multiDayEvents: {
                    startDate: 'start_date',
                    endDate: 'end_date'
                },
                clickEvents: {
                    click: function(target) {
                        // clear any existing selection states
                        $(".day").removeClass("day-selected");
                        $(target.element).addClass("day-selected");
                        ArtX.calendar.displayEventList(target);
                    }
                },
                doneRendering: function(){ 
                    $(".day.today").trigger("click");
                }
            });
        });
    },
    displayEventList: function(target) {
        var eventArray = target.events;
        ArtX.el.eventListTarget.fadeOut(400, function() {
            ArtX.el.eventListTarget.html(_.template(ArtX.el.eventListTemplate, {eventArray:eventArray}));
            ArtX.el.eventListTarget.fadeIn(400, function() {
                // Re-do truncation once fade is complete
                ArtX.setupTextTruncation();
            }); 
        });
    },
    init: function() {
        if (ArtX.el.calendarContainer.length > 0) {
            console.log("Setting up event calendar");

            // This is for demo purposes only, this should be much more robust
            var eventArray = [],
                thisMonth,
                thisMonthURL,
                juneEventURL = "/ui/js/json/events-june.json",
                julyEventURL = "/ui/js/json/events-july.json",
                augEventURL = "/ui/js/json/events-august.json";

            thisMonth = moment().month(); // integer from 0 to 11
            
            if (thisMonth == 5) { // June
                thisMonthURL = juneEventURL;
            } else if (thisMonth == 6) { // July
                thisMonthURL = julyEventURL;
            } else if (thisMonth == 7) { // August
                thisMonthURL = augEventURL;
            }

            ArtX.calendar.getEvents("/ui/js/json/events-july.json");
        }
    }  
};

/* Set up form validation for email, passwords, etc.
   ========================================================================== */
ArtX.setupFormValidation = function() {
    var $formToValidate = $("form.validate");

    if ($formToValidate.length > 0) {
       console.log("Setting up form validation");
       $formToValidate.validate({
            rules: {
                "signup-password": "required",
                "signup-confirmpassword": {
                    equalTo: "#signup-password"
                },
                "signup-email": {
                    required: true,
                    email: true,
                    remote: {
                        url: "/CheckEmail",
                        type: "post"
                    }
                }
            },
            messages: {
                "signup-email": {
                    required: "This field is required.",
                    email: "Please enter a valid email address.",
                    remote: "This email address is already taken."
                },
                "signup-password": {
                    required: "This field is required."
                },
                "signup-confirmpassword": {
                    required: "This field is required.",
                    equalTo: "Passwords must match."
                }
            }
       });
    }
};


/* Set up Load More functionality 
   ========================================================================== */
ArtX.loadMore = {
    vars: {
        loadMoreLink : $("#load-more"),
        nextPageJsonURL : "",
        itemContainer : "",
        itemTemplate : $("#item-template").html(),
        currentPage : 1,
        nextPage : 2
    },
    setupLoadMoreLink: function() {
        console.log("Setting up the Load More link click events");

        ArtX.loadMore.vars.loadMoreLink
            .removeClass("btn-hidden") // Show the Load More link
            .click(function() {
                // Fade out the button, so that we don't get into a situation where a slow Ajax load
                // leaves the button there, and a frustrated user clicks a million times and you
                // get lots of multiple entries

                ArtX.loadMore.vars.loadMoreLink.fadeOut();

                var jsonArray;
                var $newResults;

                // Get the results from an Ajax call to the JSON data

                // Figure out which page to fetch

                /*  DEV NOTE: When this is hooked up to a real JSON feed,
                    we'll feed it the next page URL from the Load More link's data-feed attribute like this: 

                    ArtX.loadMore.vars.nextPageJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                    ArtX.loadMore.vars.nextPageJsonURL += ArtX.loadMore.vars.nextPage;

                    But since this is a demo with static JSON files, we're putting in a temporary switch statement for it here: */

                var temporaryJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                
                switch(temporaryJsonURL) {
                    case "/LoadFavorites/" :
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                        break;
                    default:
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                }

                $.getJSON(ArtX.loadMore.vars.nextPageJsonURL, function(data) {
                    jsonArray = data;
                    
                    // Format results with underscore.js template
                    // Assign those results to a variable and chain .hide()
                    $newResults = $(_.template(ArtX.loadMore.vars.itemTemplate, {jsonArray:jsonArray})).hide();

                    // Append newResults to the list 
                    $newResults.appendTo(ArtX.loadMore.vars.itemContainer);

                    // Fade in the new results
                    $newResults.fadeIn();

                    // Re-do truncation
                    ArtX.setupTextTruncation();

                    // Update the variables
                    ArtX.loadMore.vars.currentPage = ArtX.loadMore.vars.nextPage;
                    ArtX.loadMore.vars.nextPage = ArtX.loadMore.vars.nextPage + 1;

                    // Check to see if we still need to show the Load More link
                    // Hide if not needed anymore
                    
                    var currentItemsCount = ArtX.util.getNumberOfChildItems(ArtX.loadMore.vars.itemContainer);

                    /*  DEV NOTE: When this is hooked up to a real JSON feed,
                        we'll feed it the next page URL from the Load More link's data-feed attribute like this: 

                        ArtX.loadMore.vars.nextPageJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                        ArtX.loadMore.vars.nextPageJsonURL += ArtX.loadMore.vars.nextPage;

                        But since this is a demo with static JSON files, we're putting in a temporary switch statement for it here: */

                    var temporaryJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                    
                    switch(temporaryJsonURL) {
                        case "/LoadFavorites/" :
                            ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                            break;
                        default:
                            ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                    }

                    // Check to see if there are more results to show
                    $.getJSON(ArtX.loadMore.vars.nextPageJsonURL, function(nextdata) {
                        var nextjsonArray = nextdata;
                        console.log("Array length of " + ArtX.loadMore.vars.nextPageJsonURL + ": " + nextjsonArray.length);
                        if (nextjsonArray.length !== 0) {
                            // More results; we need to show the "Load More" link again
                            ArtX.loadMore.vars.loadMoreLink.fadeIn();
                        } else {
                            // No more results; we need to hide the "Load More" link
                            console.log("Checking...There are no more results to show");
                        }
                    });
                });
            });
    },
    init: function() {
        if (ArtX.loadMore.vars.loadMoreLink.length > 0) {
            console.log("Initializing Load More functionality");

            // We need to check to see how many items are currently being shown.
            // If the number of items equals our number-per-page variable, 
            // check to see if there are more results to show.

            // First, let's get the item container and assign it to a variable
            // Assumption: the load more link is always directly preceded by the item container
            ArtX.loadMore.vars.itemContainer = ArtX.loadMore.vars.loadMoreLink.prev();

            var currentItemsCount = ArtX.util.getNumberOfChildItems(ArtX.loadMore.vars.itemContainer);

            if (currentItemsCount == ArtX.var.itemsPerPage) { 
                // There's the same amount as our items per page,
                // so there might be more to pull down

                /*  DEV NOTE: When this is hooked up to a real JSON feed,
                    we'll feed it the page 2 URL from the Load More link's data-feed attribute like this: 

                    ArtX.loadMore.vars.nextPageJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                    ArtX.loadMore.vars.nextPageJsonURL += "2";

                    But since this is a demo with static JSON files, we're putting in a temporary switch statement for it here: */

                var temporaryJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");
                
                switch(temporaryJsonURL) {
                    case "/LoadFavorites/" :
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page2.json";
                        break;
                    default:
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page2.json";
                }

                // Check to see if there are more results to show, and set up the Load More link if so
                $.getJSON(ArtX.loadMore.vars.nextPageJsonURL, function(data) {
                    jsonArray = data;
                    if (jsonArray.length > 0) {
                        // There are more, so we need to show the "Load More" link
                        console.log("Checking...There are at least " + jsonArray.length + " more results to show");

                        ArtX.loadMore.setupLoadMoreLink();
                    } else {
                        console.log("Checking...There are no more results to show");
                    }
                });
            }
        } 
    }
};

/* Setting up My Settings Ajax functionality
   ========================================================================== */
ArtX.setupMySettings = function() {
    var $mySettingsForm = $("#settings-form");

    if ($mySettingsForm.length > 0) {
        console.log("Initializing Ajax for My Settings");

        var $ajaxInputs = $mySettingsForm.find("input[type=checkbox]");
        var isCheckboxChecked = false;
        var checkboxID;

        $ajaxInputs.click(function() {
            isCheckboxChecked = $(this).prop("checked");
            checkboxID = $(this).prop("id");

            /* This stub Ajax call sends the checkbox ID and whether it's checked to the /settings URL (currently a placeholder file).  Eventually, we should add success/fail/error handling, etc */
            
            $.ajax({
                type: "POST",
                url: "/settings/",
                data: {
                    settingCheckbox: checkboxID,
                    settingSelected: isCheckboxChecked
                }
            });
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
        ArtX.setupSignupModal();
        ArtX.setupBackButton();
        ArtX.setupTextTruncation();
        ArtX.calendar.init();
        ArtX.setupSlidingPanels();
        ArtX.setupPeekSlider();
        ArtX.setupFavoriteSlider();
        ArtX.setupFavoriteStars();
        ArtX.setupCustomCheckboxes();
        ArtX.setupToggleSwitches();
        ArtX.setupFormValidation();
        ArtX.setupMySettings();
        ArtX.loadMore.init();

        // Initialize FastClick on certain items, to remove the 300ms delay on touch events
        FastClick.attach(document.body);
    },
    finalize : function() {
        
    }
};


$(document).ready(function() {

    handleAppCache();

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