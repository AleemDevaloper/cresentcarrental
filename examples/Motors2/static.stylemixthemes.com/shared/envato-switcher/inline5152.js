(function ($) {
    $(document).ready(function() {
        $.get( "../../../static.stylemixthemes.com/shared/envato-switcher/inline.html").done(function( data ) {
            $('body').append( data );
        });
    });
})(jQuery);