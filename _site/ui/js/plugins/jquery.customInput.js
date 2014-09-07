/**
 * --------------------------------------------------------------------
 * jQuery customInput plugin
 * Author: Maggie Costello Wachs maggie@filamentgroup.com, Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 *
 * ~'~'~'~'~
 * Edited by Sherri Alexander (sherri@sherri-alexander.com) 9/7/2014 to allow for a "destroy" action
 * --------------------------------------------------------------------
 */

(function ($) {

    $.fn.customInput = function( action ){
        
        if (action === "destroy") {

            // We need to undo all the bindings
            return $(this).each(function(){ 
                if($(this).is('[type=checkbox],[type=radio]')){
                    var input = $(this);
                    
                    // get the associated label using the input's id
                    var label = $('label[for="'+input.attr('id')+'"]');
                    
                    // Remove the "custom-foo" div
                    if (input.parent().hasClass("custom-checkbox")) {
                        input.unwrap();
                    }
                    
                    // Unbind all events on the label and input
                    label.unbind()
                    input.unbind();
                }
            });
        } else {
            return $(this).each(function(){ 
                if($(this).is('[type=checkbox],[type=radio]')){
                    var input = $(this);
                    
                    // get the associated label using the input's id
                    var label = $('label[for="'+input.attr('id')+'"]');
                    
                    // wrap the input + label in a div 
                    input.add(label).wrapAll('<div class="custom-'+ input.attr('type') +'"></div>');
                    
                    // necessary for browsers that don't support the :hover pseudo class on labels
                    label.hover(
                        function(){ $(this).addClass('hover'); },
                        function(){ $(this).removeClass('hover'); }
                    );
                    
                    //bind custom event, trigger it, bind click,focus,blur events                   
                    input.bind('updateState', function(){   
                        input.is(':checked') ? label.addClass('checked') : label.removeClass('checked checkedHover checkedFocus'); 
                    })
                    .trigger('updateState')
                    .click(function(){ 
                        $('input[name="'+ $(this).attr('name') +'"]').trigger('updateState'); 
                    })
                    .focus(function(){ 
                        label.addClass('focus'); 
                        if(input.is(':checked')){  $(this).addClass('checkedFocus'); } 
                    })
                    .blur(function(){ label.removeClass('focus checkedFocus'); });
                }
            });
        }
    };

}(jQuery));
