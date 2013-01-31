
(function ($) {
    $.fn.extend({
        collapsiblePanel: function () {
            $(this).each(function () {
                var indicator = $(this).find('.ui-expander').first();
                var header = $(this).find('.ui-widget-header').first();
                var content = $(this).find('.ui-widget-content').first();
                if (content.is(':visible')) {
                    indicator.removeClass('ui-icon-triangle-1-e ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
                } else {                                       
                    indicator.removeClass('ui-icon-triangle-1-e ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-s');
                }

                header.click(function () {
                    content.slideToggle(500, function () {
                        console.log(content.is(':visible'));
                        if (content.is(':visible')) {
                            indicator.removeClass('ui-icon-triangle-1-e ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
                        } else {                                       
                            indicator.removeClass('ui-icon-triangle-1-e ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-s');
                        }
                    });
                });
            });
        }
    });
})(jQuery);