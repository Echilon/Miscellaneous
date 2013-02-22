(function ($) {
    $.fn.textprogress = function (option, settings) {
        if (typeof option === 'object') {
            settings = option;
        } else if (typeof option === 'string') {
            var values = [];
            var elements = this.each(function () {
                var data = $(this).data('_textprogress');
                if (data) {
                    if (option === 'destroy') { data.destroy(); }
                    else if (option === 'setAllowOverLength') { data.setAllowOverLength(settings); }
                    else if (option === 'setShowCount') { data.setShowCount(settings); }
                    else if (option === 'setFormat') { data.setFormat(settings); }
                    else if (option === 'setMax') { data.setMax(settings); }
                    else if ($.fn.textprogress.defaults[option] !== undefined) {
                        if (settings !== undefined) { data.settings[option] = settings; }
                        else { values.push(data.settings[option]); }
                    }
                }
            });

            if (values.length === 1) { return values[0]; }
            if (values.length > 0) { return values; }
            else { return elements; }
        }
        return this.each(function () {
            var $elem = $(this);
            var $settings = $.extend({}, $.fn.textprogress.defaults, settings || {});
            var textprogress = new TextProgress($settings, $elem);
            textprogress.setup($elem, $settings);
            $elem.data('_textprogress', textprogress);
        });
    }

    $.fn.textprogress.defaults = {
        messageFormat: '{current}/{total}',
        showCount: true,
        max: 280,
        allowOverLength: true,
        classes: {
            standard: 'bar bar-success',
            over: 'bar bar-danger'
        },
        textbox: ''
    };

    function TextProgress(settings, $elem) {
        this.textprogress = null;
        this.settings = settings;
        this.$elem = $elem;
        return this;
    }
    TextProgress.prototype = {
        updateProgress: function () {
            var currentValue = this.txtBox.val();
            var percentage = (currentValue.length / this.settings.max) * 100;
            this.innerProgressbar.progressbar('value',currentValue.length);
            if (this.settings.showCount) {
                var formattedMsg = this.settings.messageFormat
                                .replace(/{current}/g, currentValue.length)
                                .replace(/{total}/g, this.settings.max)
                                .replace(/{percent}/g, Math.ceil(percentage));
                this.lblIndicator.text(formattedMsg);
            }
			this.truncateText();
        },
        destroy: function () {
            this.txtBox.unbind('keyup');
            this.txtBox.unbind('change');
            this.innerProgressbar.progressbar('destroy');
            this.$elem.empty('');
        },
        truncateText: function () {
            var $str = this.txtBox.val();
            if ($str.length < this.settings.max) {
                if (!this.innerJqProgress.hasClass(this.settings.classes.standard))
                    this.innerJqProgress.attr('class', this.settings.classes.standard);
            } else {
                if (!this.innerJqProgress.hasClass(this.settings.classes.over))
                    this.innerJqProgress.attr('class', this.settings.classes.over);
                if (!this.settings.allowOverLength && $str.length > this.settings.max) {
                    var $strtemp = $str.substr(0, this.settings.max);
                    this.txtBox.val($strtemp);
                }
            }
        },
        setAllowOverLength: function (isAllowed) {
            this.settings.allowOverLength = isAllowed;
            this.updateProgress();
        },
        setShowCount: function (isShown) {
            this.settings.showCount = isShown;
            if (isShown && !this.lblIndicator) { // off -> on
                this.lblIndicator = $('<span class="progress-indicator"/>')
                    .appendTo(this.$elem);
            } else if (!isShown && this.lblIndicator) { // on -> off
                this.lblIndicator.remove();
                this.lblIndicator = undefined;
            }
            this.updateProgress();
        },
        setFormat: function (format) {
            this.settings.messageFormat = format;
            this.updateProgress();
        },
        setMax: function (newMax) {
            this.settings.max = newMax;
            this.innerProgressbar.option('max', newMax);
            this.updateProgress();
        },
        setup: function () {
            var $this = this;
            this.$elem.each(function () {
                if (!$this.settings.textbox) {
                    $.error('No textbox specified');
                    return;// no textbox
                }
                $this.innerProgressbar = $('<div class="progress"/>')
                    .appendTo($this.$elem)
                    .progressbar({ max: $this.settings.max });
                $this.innerJqProgress = $this.innerProgressbar.find('.ui-progressbar-value');
                if ($this.settings.showCount) {
                    $this.lblIndicator = $('<span class="progress-indicator"/>')
                        .appendTo($this.$elem);
                }
                $this.txtBox = $('#' + $this.settings.textbox);
                $this.txtBox.bind('keyup', function () { $this.updateProgress(); });
                $this.txtBox.bind('change', function () { $this.updateProgress(); });
                $this.updateProgress();
            });
        }
    }
})(jQuery);