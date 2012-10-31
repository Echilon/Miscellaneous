/*
 * Theme-a-Go-Go v1.0
 * Harry Jennerway - http://www.lime49.com/ 
 * ==//== 
 * http://leghumped.com/ 
 * This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-sa/3.0/deed.en_US
 */

; (function ($) {
    $.fn.extend({
        themeAGoGo: function (selector, options) {
            this.isInitialized = false;
            this.defaultOpts = {
                themes:
                    {
                        'UI Lightness': {
                            folder: 'ui-lightness'
                        },
                        'Blitzer': {
                            folder: 'blitzer'
                        },
                        'South Street': {
                            folder: 'south-street'
                        }
                    },
                filenames: ['skin.css', 'jquery.css'],
                baseDirectory: '/styles',
                servicePath: '/Themes.asmx/SetTheme'
            };
            var settings = $.extend({ }, this.defaultOpts, options);

            var init = function (placeholderSelector) {
                var placeholder = $(placeholderSelector);
                if (this.isInitialized)
                    return;
                for (var themeName in settings.themes) {
                    var theme = settings.themes[themeName];
                    var themeDirectory = settings.baseDirectory + '/' + theme.folder + '/';
                    var themeHolder = $('<li/>')
                        .appendTo(placeholder);
                    var anchor = $('<a/>')
                        .attr('title', 'Switch to the '+ themeName+' theme')
                        .attr('href', '#')
                        .on('click', (function(t) {
                            return function () {
                                switchTheme(t);
                                return false;
                            };
                        })(theme))
                        .appendTo(themeHolder);
                    var swatch = $('<img/>').attr('src', themeDirectory + 'body/swatch.png')
                        .appendTo(anchor);
                }
                $('<div id="themeOverlay" style="display:none" />').appendTo('body');
                $('<div id="widthCheck" style="display:none" />').appendTo('body');
                this.isInitialized = true;
            },
                checkThemeLoaded = function(callback) {
                    if ($('#widthCheck').width() == 2) callback();
                    else setTimeout(function() { checkThemeLoaded(callback); }, 200);
                },
                switchTheme = function(theme) {
                    var themeDirectory = settings.baseDirectory + '/' + theme.folder + '/';
                    var head = $('head');
                    var stylesheets = head.find('link[rel=stylesheet]');
                    var addedStylesheets = [];

                    $('body').css({ height: '100%' });
                    $('#themeOverlay')
                        .css({
                            display: 'none',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1000,
                            background: 'black url(loading.gif) no-repeat center'
                        })
                        .fadeIn(500, function() {
                            checkThemeLoaded(function() {
                                $('#themeOverlay').fadeOut(500, function() {
                                    $(this).css('display', 'none');
                                    $('#widthCheck').css('display', 'none');
                                });
                            });
                        });

                    for (var i = 0; i < stylesheets.length; i++) {
                        var ss = $(stylesheets[i]);
                        var ssHref = ss.attr('href').toLowerCase(); // eg: /jquery/blah/skin.css
                        for (var j = 0; j < settings.filenames.length; j++) { // eg: skin.css
                            var skinFile = settings.filenames[j];
                            if (ssHref.indexOf(skinFile.toLowerCase()) >= 0 && $.inArray(skinFile, addedStylesheets) <= 0) {
                                ss.remove(); // this is a skin file, remove from the DOM and reload
                                var newLink = $('<link rel="stylesheet" type="text/css"/>')
                                    .attr('href', themeDirectory + skinFile)
                                    .appendTo(head);
                                addedStylesheets.push(skinFile);
                            }
                        }
                    }
                    $.get(settings.servicePath, { theme: theme.folder });
                };
            return init($(this));
        }
    });
})(jQuery);