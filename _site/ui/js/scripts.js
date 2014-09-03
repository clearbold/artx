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
    if (
        ('ontouchstart' in window) || 
        (window.DocumentTouch && document instanceof DocumentTouch) || 
        (navigator.maxTouchPoints > 0) || 
        (navigator.msMaxTouchPoints > 0)
    ){
        // Secondary test to rule out some false positives
        if (
            (window.screen.width > 1279 && window.devicePixelRatio == 1) ||
            (window.screen.width > 1000 && window.innerWidth < (window.screen.width * 0.9)) // this checks if a user is using a resized browser window, not common on mobile devices
        ){
            bool = false;
        } else {
            bool = true;
        }
    } else {
        bool = false;
    }
    return bool;
});

/* Helper function to capitalize only the first letter of something */
// Usage: "hello world".capitalize();  =>  "Hello world"
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/* Global namespace */
var ArtX = ArtX || {};

ArtX.data = ArtX.data || {};

ArtX.el = {
    html            : $('html'),
    win             : $(window),
    doc             : $(document),
    body            : $('body'),
    calendarContainer: $("#event-calendar"),
    eventCalendar   : ""
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
    },
    isThereMore: function(data) {
        // Check to see if there are more results to show
        jsonArray = data;
        console.log(jsonArray);
        if (jsonArray.length > 0) {
            // More results to be fetched
            console.log("There are at least " + jsonArray.length + " results to be fetched");
            return true;
        } else {
            // No more results
            console.log("No more results");
            return false;
        }
    }
};

/* Logging Ajax errors */
ArtX.errors = {
    logAjaxError: function (jqXHR, error, errorThrown, isErrorAjaxResponse) {
        console.log("Error: " + errorThrown);
        console.log("jqXHR status: " + jqXHR.status + " " + jqXHR.statusText);
        if (isErrorAjaxResponse) {
            console.log("jqXHR response: " + jqXHR.responseText);
        }
    },
    showFormError: function (jsonError) {
        // Get results from JSON returned
        var result = $.parseJSON(jsonError);
        var errorText;
        var errorTarget;
        $.each(result, function(k, v) {
            errorTarget = $("#" + k);
            errorText = k.capitalize() + ' ' + v;
            console.log("Error text: " + errorText);
        });
    }
};

/* Setting up a dataService function that can handle different Ajax requests */
ArtX.dataService = {
    getJsonFeed: function(jsonUrl, callback) {
        $.getJSON(jsonUrl, function (data) {
            callback(data);
        });
    }
};


// Variables that can be used throughout
ArtX.var = {
    itemsPerPage : 5,
    isInitialLoad: true,
    hasVisitedBefore: false,
    jsonDomain: "http://artx-staging.herokuapp.com"
};


/* Set up Peeking slider
   ========================================================================== */
ArtX.setupPeekSlider = function() {
    // Assumption -- there will only ever be one peek-style slider per page/screen
    if ($(".slider-style-peek").find("ul").length > 0) {

        if ($(".slider-style-peek").find("ul").children().length > 1) { // there's more than one slide to show
            console.log("Initializing peeking slider");

            var peekSlideInstance = $(".slider-style-peek").find("ul").bxSlider({
                oneToOneTouch:false,
                pager:false,
                auto:false,
                onSliderLoad: function(currentIndex) {
                    //console.log("currentIndex: " + currentIndex);
                    $(".slider-style-peek").find("ul").find("li").eq(currentIndex).addClass("slide-prev");
                    $(".slider-style-peek").find("ul").find("li").eq(currentIndex+2).addClass("slide-next");
                },
                onSlideBefore: function($slideElement, oldIndex, newIndex) {
                    //console.log("oldIndex: " + oldIndex);
                    //console.log("newIndex: " + newIndex);
                    $(".slide-prev").removeClass("slide-prev");
                    $(".slide-next").removeClass("slide-next");
                    $(".slider-style-peek").find("ul").find("li").eq(newIndex).addClass("slide-prev");
                    $(".slider-style-peek").find("ul").find("li").eq(newIndex+2).addClass("slide-next");
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
    }
};

/* Set up Favorites-style slider in footer
   ========================================================================== */
ArtX.footerSlider = {
    vars: {
        footSlideInstance: "",
        footSlideOptions: {
            minSlides:3,
            maxSlides:4,
            slideWidth:300,
            slideMargin:5,
            oneToOneTouch:false,
            pager:false
        },
        itemTemplate : $("#item-template").html()
    },
    init: function() {
        if ($("#footer-slider").length > 0) {
            console.log("Initializing footer slider");

            var numberOfSlides = $("#footer-slider").children().length;

            console.log("Number of footer slides: " + numberOfSlides);

            ArtX.footerSlider.vars.footSlideInstance = $("#footer-slider").bxSlider(ArtX.footerSlider.vars.footSlideOptions);

            if (numberOfSlides > 3) {
                $('#footer-slider-next').click(function(){
                  ArtX.footerSlider.vars.footSlideInstance.goToNextSlide();
                  return false;
                });

                $('#footer-slider-previous').click(function(){
                  ArtX.footerSlider.vars.footSlideInstance.goToPrevSlide();
                  return false;
                });
            } else {
                $(".footer-slider").addClass("not-enough-slides");
            }
        }
    },
    reload: function() {
        if ($(".ui-page-active #footer-slider").length > 0) {
            console.log("Reloading footer slider");
            ArtX.footerSlider.vars.footSlideInstance.reloadSlider(ArtX.footerSlider.vars.footSlideOptions);
        }
    },
    destroy: function() {
        if ($(".ui-page-active #footer-slider").length > 0) {
            console.log("Destroying footer slider");
            ArtX.footerSlider.vars.footSlideInstance.destroySlider();
            ArtX.footerSlider.vars.footSlideInstance = "";
        }
    }
};

/* Set up Favorite stars
   ========================================================================== */

ArtX.favoriteStars = {
    init: function() {
        if ($(".favorite-star").length > 0) {
            console.log("Initializing favorite stars");

            var selectedEventID;

            $(".favorite-star").click(function() {

                console.log("The user clicked a star!");

                // Capture the Event ID from the data-attribute on the clicked link
                selectedEventID = $(this).data("eventID");

                // Is the click to set a favorite, or unset a favorite?
                var $thisStarIcon = $(this).find(".icon");
                var setterJsonUrl;
                var getterJsonUrl;

                if ($thisStarIcon.hasClass("icon-star")) {
                    // The user wishes to make this event a favorite

                    /* We need to query a backend script -- we send it an eventID to tell it which event should be favorited. */

                    /*  DEV NOTE: When this is hooked up to a real JSON feed,
                        we'll feed it the URL including the eventID like this:

                        jsonUrl = "/SetEventFavorite/" + selectedEventID;

                        But since this is currently a demo with static files, we're putting in a temporary file for it here: */

                    setterJsonUrl = "/SetEventFavorite/";

                    $.ajax({
                        type: "GET",
                        /* SMA: This is set to GET because POST was causing 412 errors on iPhone 
                        (http://stackoverflow.com/questions/21616009/412-server-response-code-from-ajax-request) */
                        url: setterJsonUrl,
                        success: function(data) {
                            // If it exists on the page, reload the favorites slider after the new item has been added

                            if ($("#footer-slider").length > 0) {

                                $("#footer-slider").fadeOut(400, function() {

                                    /*  DEV NOTE: When this is hooked up to a real JSON feed,
                                        we'll feed it the URL including the eventID like this:

                                        getterJsonUrl = "/GetEventById/" + selectedEventID;

                                        But since this is a demo with static JSON files, we're putting in a temporary file for it here: */

                                    getterJsonUrl = "/GetEventById/";

                                    $.getJSON(getterJsonUrl, function(data) {
                                        var jsonArray = data;

                                        // Format results with underscore.js template
                                        var eventHtml = _.template($("#item-template").html(), {jsonArray:jsonArray});

                                        //console.log("item template html" + $("#item-template").html());

                                        $(eventHtml).prependTo($("#footer-slider"));

                                        //ArtX.footerSlider.vars.footSlideInstance.reloadSlider(ArtX.footerSlider.vars.footSlideOptions);
                                        ArtX.footerSlider.reload();

                                    });
                                });
                            }

                            // Swap the star icon
                            $thisStarIcon.removeClass("icon-star").addClass("icon-star2");
                        }
                    });

                } else {
                    // The user wishes to remove favorite status

                    /*  DEV NOTE: When this is hooked up to a real JSON feed,
                        we'll feed it the URL including the eventID like this:

                        jsonUrl = "/DeleteFavorite/" + selectedEventID;

                        But since this is a demo with static JSON files, we're putting in a temporary file for it here: */

                    jsonUrl = "/DeleteFavorite/";

                    $.ajax({
                        type: "GET",
                        /* SMA: This is set to GET because POST was causing 412 errors on iPhone 
                        (http://stackoverflow.com/questions/21616009/412-server-response-code-from-ajax-request) */
                        url: jsonUrl,
                        success: function() {
                            // Swap the star
                            $thisStarIcon.removeClass("icon-star2").addClass("icon-star");
                        }
                    });
                }

                return false;
            });

        }
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
ArtX.signupModal = {
    init: function() {
        console.log("Setting up Signup Modal window");

        // Set up behavior for modal close
        //$(document).on("click", ".close-modal", function() {
        //    console.log("How many times does it think I clicked this?");
        //    $("#signup-popup").popup('close');
        //});

        // log popup events
        //$(document).on("popupcreate popupinit popupafteropen popupafterclose", "#signup-popup", function (e) {
        //    console.log(e.target.id + " -> " + e.type);
        //});

        // Set up form submit
        $("#signup-form").submit(function(event) {
            event.preventDefault();
            ArtX.signupModal.ajaxSubmit();
        });
    },
    ajaxSubmit: function() {
        var $errorTarget = $("#signup-error");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: ArtX.var.jsonDomain + "/registrations",
            data: {
                email: $("#email").val(),
                password:  $("#password").val(),
                password_confirmation: $("#confirmpassword").val(),
                zipcode:  $("#zipcode").val()
            },
            success: function( data ){
                console.log(data);
                $.cookie('token', data.user.authentication_token);
                $.cookie('currentuser', $("#email").val());
                $.mobile.pageContainer.pagecontainer ("change", "interests.html", {reloadPage: true});
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("User registration failed");
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
                ArtX.errors.showFormError(jqXHR.responseText);
            }
        });
    },
    open: function() {
        $("#signup-popup").popup('open');
    }
};

/* Set up custom checkboxes
   ========================================================================== */
ArtX.setupCustomCheckboxes = function(targetContainer) {
    var $checkboxes;

    if (targetContainer !== undefined && targetContainer !== null) {
        $checkboxes = $(targetContainer).find(".customize-checkbox");
    } else {
        $checkboxes = $(".customize-checkbox");
    }

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
            ArtX.el.eventCalendar = $("#event-calendar").clndr({
                template: $('#template-calendar').html(),
                events: eventArray,
                dateParameter: 'start_date',
                multiDayEvents: {
                    startDate: 'start_date',
                    endDate: 'end_date'
                },
                clickEvents: {
                    click: function(target) {
                        // if we click on a day
                        if ($(target.element).hasClass("day")) {
                            console.log("Day clicked!");
                            // clear any existing selection states
                            $(".day").removeClass("day-selected");
                            // select the new day
                            $(target.element).addClass("day-selected");
                            // and display events for that day
                            ArtX.calendar.displayEventList(target);
                        } else {
                            console.log("Click target not a day.");
                        }
                    },
                    onMonthChange: function(month) {
                        var chosenMonth = month.format("MM");
                        var chosenYear = month.format("YYYY");

                        // DEV NOTE: When the GetEventsByMonth URL is in place, comment out the temporary URL
                        // and uncomment the following line:

                        //var jsonURL = "/GetEventsByMonth/" + chosenYear + "/" + chosenMonth;
                        //console.log("New month JSON URL: " + jsonURL);

                        jsonURL = "/ui/js/json/events-august.json"; // temporary URL for testing

                        var newEventArray = [];
                        $.getJSON(jsonURL, function(data) {
                            newEventArray = data;
                            ArtX.el.eventCalendar.setEvents(newEventArray);
                        });

                    }
                },
                doneRendering: function(){
                    var thisMonth = moment().format("MMMM");
                    var displayedMonth = $(".clndr-controls").find(".month").html();
                    if (thisMonth == displayedMonth) {
                        // It's this month
                        // Show the events for today
                        $(".day.today").trigger("click");
                    } else {
                        // It's a month in the past or future
                        // Show the events for the first day of the month
                        if ($(".last-month").last().next().length > 0) {
                            $(".last-month").last().next().trigger("click");
                        } else {
                            $(".day").first().trigger("click");
                        }

                    }
                }
            });
        });
    },
    displayEventList: function(target) {
        console.log("Displaying event list");
        var eventArray = target.events;
        var eventTemplate = $('#template-eventlist').html();
        $("#event-list").fadeOut(400, function() {
            $("#event-list").html(_.template(eventTemplate, {eventArray:eventArray}));
            $("#event-list").fadeIn(400, function() {
                // Re-do truncation once fade is complete
                ArtX.setupTextTruncation();
            });
        });
    },
    init: function() {
        if ($("#event-calendar").length > 0) {
            console.log("Setting up event calendar");

            var eventArray = [],
                thisMonth,
                thisMonthURL,
                julyEventURL = "/ui/js/json/events-july.json",
                augEventURL = "/ui/js/json/events-august.json";

            thisMonth = moment().month(); // integer from 0 to 11
            thisYear = moment().year(); // 4-digit year, ex. 2014

            // DEV NOTE: When the GetEventsByMonth URL is in place, comment out the temporary URL
            // if statement and uncomment the following line:

            //thisMonthURL = "/GetEventsByMonth/" + thisYear + "/" + thisMonth;

            // Temporary static month URLs, until GetEventsByMonth is in place
            if (thisMonth == 6) { // July
                thisMonthURL = julyEventURL;
            } else { // August and onward
                thisMonthURL = augEventURL;
            }

            ArtX.calendar.getEvents(thisMonthURL);
        }
    }
};

/* Set up form validation for email, passwords, etc.
   ========================================================================== */
ArtX.setupFormValidation = function() {
    jQuery.validator.addMethod("zipcode", function(value, element) {
      return this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
    }, "Please provide a valid zip code.");

    if ($("form.validate").length > 0) {
       console.log("Setting up form validation");
       $("form.validate").validate({
            rules: {
                "password": "required",
                "confirmpassword": {
                    equalTo: "#password"
                },
                "email": {
                    required: true,
                    email: true/*,
                    remote: {
                        url: "/CheckEmail/",
                        type: "post"
                    }*/
                },
                "zipcode": "zipcode"
            },
            messages: {
                "email": {
                    required: "This field is required.",
                    email: "Please enter a valid email address.",
                    remote: "This email address is already taken."
                },
                "password": {
                    required: "This field is required."
                },
                "confirmpassword": {
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
                    ArtX.loadMore.vars.nextPageJsonURL += "/" + ArtX.loadMore.vars.nextPage + "/" + ArtX.var.itemsPerPage;

                    But since this is a demo with static JSON files, we're putting in a temporary switch statement for it here: */

                var temporaryJsonURL = ArtX.loadMore.vars.loadMoreLink.data("feed");

                switch(temporaryJsonURL) {
                    case "/GetEventsByLocation/" :
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/getEventsByLocation-page" + ArtX.loadMore.vars.nextPage + ".json";
                        break;
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
                        case "/GetEventsByLocation/" :
                            ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/getEventsByLocation-page" + ArtX.vars.nextPageJsonURL + ".json";
                            break;
                        case "/LoadFavorites/" :
                            ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                            break;
                        default:
                            ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page" + ArtX.loadMore.vars.nextPage + ".json";
                    }

                    // Check to see if there are more results to show
                    ArtX.dataService.getJsonFeed(ArtX.loadMore.vars.nextPageJsonURL, function(data) {
                            var isMoreResults = ArtX.util.isThereMore(data);
                            if (isMoreResults) {
                                // More results; we need to show the "Load More" link again
                                ArtX.loadMore.vars.loadMoreLink.fadeIn();
                            }
                        }
                    );

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
                    case "/GetEventsByLocation/" :
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/getEventsByLocation-page2.json";
                        break;
                    case "/LoadFavorites/" :
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page2.json";
                        break;
                    default:
                        ArtX.loadMore.vars.nextPageJsonURL = "/ui/js/json/loadFavorites-page2.json";
                }

                // Check to see if there are more results to show, and set up the Load More link if so
                ArtX.dataService.getJsonFeed(ArtX.loadMore.vars.nextPageJsonURL, function(data) {
                        var isMoreResults = ArtX.util.isThereMore(data);
                        if (isMoreResults) {
                            // More results; we need to show the "Load More" link again
                            ArtX.loadMore.setupLoadMoreLink();
                        }
                    }
                );
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

            /* This stub Ajax call sends the checkbox ID and whether it's checked to the /SetOption/ URL (currently a placeholder file).  Eventually, we should add success/fail/error handling, etc */

            $.ajax({
                type: "POST",
                url: "/SetOption/",
                data: {
                    settingCheckbox: checkboxID,
                    settingSelected: isCheckboxChecked
                }
            });
        });
    }
};

/* Setting up History Ajax functionality
   ========================================================================== */
ArtX.setupHistory = function() {
    var $myHistoryForm = $("#history-form");

    if ($myHistoryForm.length > 0) {
        console.log("Initializing Ajax for History");

        var $ajaxInputs = $myHistoryForm.find("input[type=checkbox]");
        var isCheckboxChecked = false;
        var checkboxID;

        $ajaxInputs.click( function() {
            isCheckboxChecked = $(this).prop("checked");
            checkboxID = $(this).prop("id");

            /* This stub Ajax call sends the checkbox ID and whether it's checked to the /SetAttendance/ URL (currently a placeholder file).  Eventually, we should add success/fail/error handling, etc */

            $.ajax({
                type: "GET",
                /* SMA: This is set to GET because POST was causing 412 errors on iPhone 
                (http://stackoverflow.com/questions/21616009/412-server-response-code-from-ajax-request) */
                url: "/SetAttendance/",
                data: {
                    eventCheckbox: checkboxID,
                    eventAttended: isCheckboxChecked
                }
            });
        });
    }
};

/* Setting up Interests functionality
   ========================================================================== */
ArtX.interests = {
    vars: { // Defaults are set to get the full list of interests
        ajaxType : "GET",
        ajaxURL : ArtX.var.jsonDomain + "/possible_interests/",
        ajaxData : "",
        ajaxSuccessMsg : "Successfully retrieved full list of possible interests",
        ajaxErrorMsg : "Retrieval of full possible interest list failed",
        ajaxCallback : function() {
            // empty function for now, will define later in the script
        },
        interestIntro : "#interest-onboarding-intro"
    },
    init: function() {
        if ($("#interest-form").length > 0) {
            console.log("Initializing functionality for My Interests");

            ArtX.interests.checkForInterests();
            
            var isCheckboxChecked = false;
            var checkboxID;
            var $thisCheckbox;

            // Set up click event for interest form checkboxes
            $("#interest-form-list").on("click", "input[type=checkbox]", function() {
                isCheckboxChecked = $(this).prop("checked");
                checkboxID = $(this).data("interest-id");
                console.log("checkboxID: " + checkboxID);
                checkboxValue = $(this).val();

                $thisCheckbox = $(this);

                if (isCheckboxChecked) {
                    // We're interested in this, send a POST request
                    ArtX.interests.vars.ajaxType = "POST";
                    ArtX.interests.vars.ajaxURL = ArtX.var.jsonDomain + "/interests/";
                    ArtX.interests.vars.ajaxData = {
                        "tag_id": checkboxID
                    };
                    ArtX.interests.vars.ajaxSuccessMsg = "Interest '" + checkboxValue + "' saved.";
                    ArtX.interests.vars.ajaxErrorMsg = "Saving interest '" + checkboxValue + "' failed!";

                    ArtX.interests.vars.ajaxCallback = function(checkboxObj, ajaxData) {
                        console.log("Callback for adding an interest");
                        var $myCheckbox = checkboxObj;
                        var userInterestID; 
                        $.each(ajaxData, function(index, interest) {
                            userInterestID = interest.id;
                            console.log("Selected interest ID for this user: " + userInterestID);
                        });
                        $myCheckbox.data("user-interest-id", userInterestID);
                    };
                } else {
                    // We're not interested in this anymore, send a DELETE request
                    var userInterestID = $(this).data("user-interest-id");
                    console.log("userInterestID: " + userInterestID);

                    ArtX.interests.vars.ajaxType = "POST";
                    ArtX.interests.vars.ajaxURL = ArtX.var.jsonDomain + "/interests/" + userInterestID;
                    ArtX.interests.vars.ajaxData = {
                        "_method":"delete"
                    };
                    ArtX.interests.vars.ajaxSuccessMsg = "Interest '" + checkboxValue + "' deleted.";
                    ArtX.interests.vars.ajaxErrorMsg = "Deleting interest '" + checkboxValue + "' failed!";

                    ArtX.interests.vars.ajaxCallback = function(checkboxObj) {
                        console.log("Callback for deleting an interest");
                        var $myCheckbox = checkboxObj;
                        $myCheckbox.removeData("user-interest-id");
                    };
                }

                /* Make the actual Ajax request to handle the interest  
                TODO: add success/fail/error handling, etc.
                No Load More functionality, possibly a future enhancement. */

                $.ajax({
                    type: ArtX.interests.vars.ajaxType,
                    url: ArtX.interests.vars.ajaxURL,
                    data: ArtX.interests.vars.ajaxData,
                    beforeSend: function (request) {
                        request.setRequestHeader("authentication_token", $.cookie('token'));
                    },
                    success: function ( data, textStatus, jqXHR ) {
                        console.log(ArtX.interests.vars.ajaxSuccessMsg);
                        ArtX.interests.vars.ajaxCallback($thisCheckbox, data);
                    },
                    error: function (jqXHR, error, errorThrown) {
                        console.log(ArtX.interests.vars.ajaxErrorMsg);
                        ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
                    }
                });
            });

        }
    },
    destroy: function() {
        if ($("#interest-form").length > 0) {
            console.log("Destroying interest checkbox click events");
            $("#interest-form-list").off("click");
        }
    },
    checkForInterests: function() {
        console.log("Checking for user interests");

        ArtX.interests.vars.ajaxType = "GET";
        ArtX.interests.vars.ajaxURL = ArtX.var.jsonDomain + "/interests/";
        ArtX.interests.vars.ajaxSuccessMsg = "Successfully checked list of user's interests";
        ArtX.interests.vars.ajaxErrorMsg = "Check of user's interest list failed";

        $.ajax({
            type: ArtX.interests.vars.ajaxType,
            url: ArtX.interests.vars.ajaxURL,
            beforeSend: function (request) {
                request.setRequestHeader("authentication_token", $.cookie('token'));
            },
            success: function ( data, textStatus, jqXHR ) {
                console.log(ArtX.interests.vars.ajaxSuccessMsg);
                //console.log("User interests: " + JSON.stringify(data));
                
                if(data.interests && data.interests.length) {
                    console.log("User has interests!");

                    ArtX.interests.vars.interestIntro = "#interest-normal-intro";
                    
                    // Display user's list
                    $("#interest-form-list").fadeOut(400, function() {
                        ArtX.interests.getUserInterests();
                    });
                    
                } else {
                    console.log("User has no interests yet");

                    ArtX.interests.vars.interestIntro = "#interest-onboarding-intro";

                    // Display all interests 
                    $("#interest-form-list").fadeOut(400, function() {
                        ArtX.interests.getAllInterests();
                    });
                }
            },
            error: function (jqXHR, error, errorThrown) {
                console.log(ArtX.interests.vars.ajaxErrorMsg);
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        });
    },
    buildInterestList: function(data, isChecked) {
        console.log("Building interest list");

        var jsonArray = data;
        var interestHtml;

        // Format results with underscore.js template
        if (isChecked) {
            interestHtml = _.template($("#interests-user-template").html(), {jsonArray:jsonArray});
        } else {
            interestHtml = _.template($("#interests-template").html(), {jsonArray:jsonArray});
        }

        $(interestHtml).appendTo($("#interest-form-list"));
    },
    showList: function() {
        var $interestIntro = $(ArtX.interests.vars.interestIntro);

        console.log("Showing finished interest list");
        ArtX.setupCustomCheckboxes("#interest-form-list");

        $interestIntro.fadeIn(400);
        $("#interest-form-list").fadeIn(400);
    },
    getAllInterests: function() {
        $.ajax({
            type: "GET",
            url: ArtX.var.jsonDomain + "/possible_interests/",
            success: function( data ){
                console.log("Successfully retrieved full list of possible interests");
                ArtX.interests.buildInterestList(data, false);
                ArtX.interests.showList();
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("Retrieval of full possible interest list failed");
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        });
    },
    getUncheckedInterests: function() {

        var unchecked = {};
        unchecked.tags = [];

        var allTagsUrl = ArtX.var.jsonDomain + "/possible_interests/";

        // All interests Ajax call
        $.ajax({
            type: "GET",
            url: allTagsUrl,
            success: function ( allTagsData, textStatus, jqXHR ) {
                console.log("Successfully retrieved full list of interests for subsetting");
                allTags = allTagsData.tags;
                //console.log("Total number of tags: " + allTags.length);

                // User's interests Ajax call
                $.ajax({
                    type: "GET",
                    url: ArtX.var.jsonDomain + "/interests/",
                    beforeSend: function (request) {
                        request.setRequestHeader("authentication_token", $.cookie('token'));
                    },
                    success: function ( userTagsData, textStatus, jqXHR ) {
                        console.log("Successfully retrieved list of user's interests for subsetting");
                        //console.log("User interests: " + JSON.stringify(userTagsData));
                        selectedInterests = userTagsData.interests;
                        
                        // Circle through all possible tags
                        for(i = 0; i < allTags.length; i++) {
                            tag = allTags[i];
                            unchecked.tags.push(tag);
                            //console.log("Number of unchecked tags after push: " + unchecked.tags.length);
                            //console.log("Comparing: " + tag.id);
                            
                            // Check against selected tags
                            for(j = 0; j < selectedInterests.length; j++){
                                interest = selectedInterests[j];        
                                //console.log("to " + interest.tag.id);
                                
                                if (tag.id === interest.tag.id) {
                                    //console.log("Removing " + tag.id + " from list");
                                    unchecked.tags.pop();
                                    selectedInterests.splice(j, 1);
                                    //console.log("Number of unchecked tags after splice: " + unchecked.tags.length);
                                }   
                                
                            } //End loop over selected tags
                            
                        } //End loop over all possible tags

                        // For testing: print results
                        // for(i = 0; i < unchecked.tags.length; i++) {
                        //    console.log(unchecked.tags[i].id);
                        //}

                        //console.log("Total number of unchecked tags: " + unchecked.tags.length);

                        ArtX.interests.buildInterestList(unchecked, false);
                        ArtX.interests.showList();

                    },
                    error: function (jqXHR, error, errorThrown) {
                        console.log("Failed retrieving selected interests feed for subsetting");
                        ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
                    }
                }); //End selected tags JSON call  
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("Failed retrieving all tags feed for subsetting"); 
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        }); //End all tags JSON call
      
        return unchecked;
    },
    getUserInterests: function() {
        $.ajax({
            type: "GET",
            url: ArtX.var.jsonDomain + "/interests/",
            beforeSend: function (request) {
                request.setRequestHeader("authentication_token", $.cookie('token'));
            },
            success: function ( data, textStatus, jqXHR ) {
                console.log("Successfully retrieved list of user's interests");
                ArtX.interests.buildInterestList(data, true);
                ArtX.interests.getUncheckedInterests();
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("Retrieval of user's interest list failed");
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        });

    }
};

/* Depreciated in favor of the structure above, breaking out tasks more nicely */
ArtX.setupMyInterests = function() {
    var $myInterestsForm = $("#interest-form");

    if ($("#interest-form").length > 0) {
        console.log("Initializing functionality for My Interests");

        
        console.log("First, let's see what my interests are.");

        $.ajax({
            type: "GET",
            url: ArtX.var.jsonDomain + "/interests",
            beforeSend: function (request) {
                request.setRequestHeader("authentication_token", $.cookie('token'));
            },
            success: function( data ){
                console.log(data);
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("Error retrieving user interests for Interests initialization");
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        });

        var isCheckboxChecked = false;
        var checkboxID;

        var ajaxType, 
            ajaxURL,
            ajaxData, 
            ajaxSuccessMsg, 
            ajaxErrorMsg,
            ajaxCallback;

        var $thisCheckbox;

        $(document).on("click", "#interest-form input[type=checkbox]", function() {
            isCheckboxChecked = $(this).prop("checked");
            checkboxID = $(this).data("interest-id");
            console.log("checkboxID: " + checkboxID);
            checkboxValue = $(this).val();

            $thisCheckbox = $(this);

            if (isCheckboxChecked) {
                // We're interested in this, send a POST request
                ajaxType = "POST";
                ajaxURL = ArtX.var.jsonDomain + "/interests/";
                ajaxData = {
                    "tag_id": checkboxID
                };
                ajaxSuccessMsg = "Interest '" + checkboxValue + "' saved.";
                ajaxErrorMsg = "Saving interest '" + checkboxValue + "' failed!";

                ajaxCallback = function(checkboxObj, ajaxData) {
                    console.log("Callback for adding an interest");
                    var $myCheckbox = checkboxObj;
                    var userInterestID; 
                    $.each(ajaxData, function(index, interest) {
                        userInterestID = interest.id;
                        console.log("Selected interest ID for this user: " + userInterestID);
                    });
                    $myCheckbox.data("user-interest-id", userInterestID);
                };
            } else {
                // We're not interested in this anymore, send a DELETE request
                var userInterestID = $(this).data("user-interest-id");
                console.log("userInterestID: " + userInterestID);

                ajaxType = "POST";
                ajaxURL = ArtX.var.jsonDomain + "/interests/" + userInterestID;
                ajaxData = {
                    "_method":"delete"
                };
                ajaxSuccessMsg = "Interest '" + checkboxValue + "' deleted.";
                ajaxErrorMsg = "Deleting interest '" + checkboxValue + "' failed!";

                ajaxCallback = function(checkboxObj) {
                    console.log("Callback for deleting an interest");
                    var $myCheckbox = checkboxObj;
                    $myCheckbox.removeData("user-interest-id");
                };
            }

            /* Make the actual Ajax request to handle the interest  
            TODO: add success/fail/error handling, etc.
            No Load More functionality, possibly a future enhancement. */

            $.ajax({
                type: ajaxType,
                url: ajaxURL,
                data: ajaxData,
                beforeSend: function (request) {
                    request.setRequestHeader("authentication_token", $.cookie('token'));
                },
                success: function ( data, textStatus, jqXHR ) {
                    console.log(ajaxSuccessMsg);
                    ajaxCallback($thisCheckbox, data);
                },
                error: function (jqXHR, error, errorThrown) {
                    console.log(ajaxErrorMsg);
                    ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
                }
            });
        });

    }
};

/* Login functionality
   ========================================================================== */
ArtX.login = {
    init: function() {
        if ($("#signin-form").length > 0) {
            console.log("Initializing sign-in form");
            console.log("Value of token cookie: " + $.cookie('token'));
            $("#signin-form").submit(function(event) {
                event.preventDefault();
                ArtX.login.ajaxSubmit();
            });
        }
    },
    ajaxSubmit: function() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: ArtX.var.jsonDomain + "/tokens/",
            data: {
                email: $("#signin-email").val(),
                password:  $("#signin-password").val()
            },
            success: function( data ){
                console.log("Login successful! Saving a cookie");
                $.cookie('token', data.authentication_token);
                $.cookie('currentuser', $("#email").val());
                $.cookie('currentuser', $("#signin-email").val());
                if (!ArtX.el.html.hasClass("is-logged-in")) {
                    ArtX.el.html.addClass("is-logged-in");
                }
                $.mobile.pageContainer.pagecontainer ("change", "index.html", {reloadPage: true});
            },
            error: function (jqXHR, error, errorThrown) {
                console.log("User login submit failed");
                ArtX.errors.logAjaxError(jqXHR, error, errorThrown);
            }
        });
    }
};

ArtX.logout = {
    init: function() {
        $(".action-logout").click(function() {
            console.log("Log out link clicked!");
            // Remove the authorization token and username cookies
            $.removeCookie('token');
            $.removeCookie('currentuser');
            // Remove the "is-logged-in" class from the HTML element
            ArtX.el.html.removeClass("is-logged-in");
            // Send them back to the main Discover page
            $.mobile.pageContainer.pagecontainer ("change", "index.html", {reloadPage: true});
        });
    }
};

ArtX.map = {

    vars : {
   
        mapContainer : "event-map",
        locationUrl : "/ui/js/json/locations_temp.json",
        eventUrl : "/ui/js/json/events-all.json",
        openWithVenueID : "-1"
    
    },

    init : function() {

        if ($("#event-map").length > 0) {
            console.log( "Initializing map" );

            // Set up map
            L.mapbox.accessToken = 'pk.eyJ1IjoiYXRvc2NhIiwiYSI6IlFSSDhOU0EifQ.8j2CBSsaQQmn-Ic7Vjx1bw';
            var map = L.mapbox.map( ArtX.map.vars.mapContainer, 'atosca.j55ofa87' );
            
            // Fetch location feed
            var $locations = $.getJSON( ArtX.map.vars.locationUrl, function( data ){
            
                $.each( data, function(){

                    //Create a marker for each location
                           
                    var name = this.name;

                    var marker = L.marker( [ this.latitude, this.longitude ], { 
                        icon : L.mapbox.marker.icon({ 
                            'marker-color': '#f86767',
                        })
                    });

                    marker.bindPopup( name ).openPopup();

                    //Fetch event feed when marker is clicked
                    marker.on( "click", function( e ){
                        var eventArray = [];
                        $.getJSON( ArtX.map.vars.eventUrl, function( data ) {
                            $.each( data, function(){ 
                                //Save events with matching location name
                                if ( this.location.name === name ) {
                                    console.log(this.location.name);
                                    if ( eventArray.length < ArtX.var.itemsPerPage ) {
                                        eventArray.push( this );
                                    }
                                } 
                            }); //End each
                                                    
                            //Refresh event list
                            $("#event-list").fadeOut( 400, function() {   
                                $("#event-list").html(_.template($('#template-eventlist').html(), {eventArray:eventArray}));
                                ArtX.loadMore.init();
                                $("#event-list").fadeIn(400, function() {
                                    // Re-do truncation once fade is complete
                                    ArtX.setupTextTruncation();
                                });            
                            }); //End fade out
                                            
                        }); //End events getJON
                                
                    }); //End click handler
                            
                    marker.addTo( map );

                }); //End each location

                // After locations are all loaded, we either need to display a specifically-requested venue + its list of events, or all venues. We might want to split out the event list creation into its own item, like ArtX.map.createList.
                // TODO: actually hook this up and test for real
                var foo = false; // this should be a test to see if it's a single location or not, using the ArtX.map.vars.openWithVenueID variable
                if (foo) {
                    // Specific location map needs to be displayed
                    // TBD
                } else {
                    // generic Boston map
                    map.setView([42.3581, -71.0636], 12);
                }
                
            }); //End locations getJSON
        }

    }
};

/* Initialize/Fire
   ========================================================================== */
ArtX.startup = {
    init : function () {
        console.log("**Beginning of scripts initializing");

        $('a[href="#"]').click(function(e){e.preventDefault();});

        ArtX.login.init();
        ArtX.logout.init();
        ArtX.interests.init();
        ArtX.setupTextTruncation();
        ArtX.calendar.init();
        ArtX.setupPeekSlider();
        ArtX.footerSlider.init();
        ArtX.favoriteStars.init();
        ArtX.setupCustomCheckboxes();
        ArtX.setupFormValidation();
        ArtX.setupMySettings();
        //ArtX.setupMyInterests();
        ArtX.setupHistory();
        ArtX.loadMore.init();
        ArtX.map.init();

        console.log("**End of scripts initializing");
    },
    finalize : function() {
        console.log("**Beginning of scripts finalizing");

        // Initialize FastClick on certain items, to remove the 300ms delay on touch events
        FastClick.attach(document.body);
        
        // If it's a new visitor, pop the Sign Up window
        if (ArtX.var.hasVisitedBefore !== true) {

            console.log("Popping the new visitor sign up window");
            setTimeout(function(){
                ArtX.signupModal.open();
            },1000);

            // Plant the cookie for next time
            $.cookie('priorvisit', 'yes', { expires: 365 * 10, path: '/' });
            // Set the variable to true as well
            ArtX.var.hasVisitedBefore = true;
        }

        // If they're already logged in, let's add the CSS class for that
        if ($.cookie('token') !== undefined) { 
            if (!ArtX.el.html.hasClass("is-logged-in")) {
                ArtX.el.html.addClass("is-logged-in");
            }
        }

        console.log("**End of scripts finalizing");
    }
};

$(document).ready(function() {
    console.log("****jQuery DOM Ready event firing");
    handleAppCache();

    // Since the modal popup is outside jQuery Mobile's "pages", we need to instantiate it separately
    $("#signup-popup").enhanceWithin().popup({ 
        history: false
    });

    ArtX.signupModal.init();
});

/*
 * ------------------------------------------------------
 * jQuery Mobile events (in the order in which they fire) 
 * (reference: http://jqmtricks.wordpress.com/2014/03/26/jquery-mobile-page-events/)
 * ------------------------------------------------------
 */

$(document).on( "mobileinit", function( event ) {
    console.log("****JQM mobileinit event firing");
    $.mobile.popup.prototype.options.history = false;
});


$(document).on( "pagebeforechange", function( event ) {
    console.log("****JQM pagebeforechange event firing");
});


$(document).on( "pagebeforecreate", function( event ) {
    console.log("****JQM pagebeforecreate event firing");
});


$(document).on( "pagecreate", function( event ) {
    console.log("****JQM pagecreate event firing");
});


$(document).on( "pagebeforehide", function( event ) {
    console.log("****JQM pagebeforehide event firing");

    /* Destroying sliders before hiding a page */
    ArtX.footerSlider.destroy();

    /* Destroying interest checkbox bindings before hiding a page */
    ArtX.interests.destroy();

    // Setting the initial load variable to false, as we're moving to another page
    ArtX.var.isInitialLoad = false;
});


$(document).on("pagehide", "div[data-role=page]", function(event){
    console.log("****JQM pagehide event firing");

    /* Removing the prior page on page hide, so that we don't have multiple versions of pages cluttering the DOM */
    console.log("Hiding the previous page");
    $(event.target).remove();
});


$(document).on( "pagecontainerbeforeshow", function( event ) {
    console.log("****JQM pagecontainerbeforeshow event firing");
});


$(document).on( "pagecontainershow", function( event ) {

    console.log("****JQM pagecontainershow event firing");

    console.log("***Beginning of new page load scripts");

    /* Fire based on document context
    ========================================================================== */

    var namespace  = ArtX.startup;
    if (typeof namespace.init === 'function') {
        namespace.init();
    }

    console.log("Cookie value: " + $.cookie('priorvisit'));

    // Check for a cookie that says that they've visited before.
    if ($.cookie('priorvisit') === undefined) { 
        console.log("Checking cookie -- new visitor");
    } else {
        console.log("Checking cookie -- they've been here before");
        ArtX.var.hasVisitedBefore = true; 
    }

    if (typeof namespace.finalize === 'function') {
        namespace.finalize();
    }

    console.log("***End of new page load scripts");
  
});


$(document).on( "pagecontainertransition", function( event ) {
    console.log("****JQM pagecontainertransition event firing");
});
