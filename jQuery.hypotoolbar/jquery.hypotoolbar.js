/*
While jQuery provides a lot of great functionality, there's nothing to allow a simple toolbar to be created. This plugin can called on a container with an array of buttons and textarea ID. It will loop over a set of elements each button, adding CSS classes and wiring up event handlers to insert text. 
*/
/*
 * ****************************************************************************** *
 *  Copyright (c) 2013. Harry Jennerway
 *  email: hjennerway@mi6.nu
 *  portfolio:  http://lime49.com
 *  blog:       http://leghumped.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  Created: 2013-01-28
 *  *****************************************************************************/
(function ($) {
    $.fn.hypotoolbar = function (buttons, textAreaId) {
        var insertAtCaret = function(areaId, text) {
            var txtArea = document.getElementById(areaId);
            //IE
            if (document.selection) {
                txtArea.focus();
                var sel = document.selection.createRange();
                sel.text = text;
                return;
            }
            //Firefox, chrome, mozilla
            else if (txtArea.selectionStart || txtArea.selectionStart == '0') {
                var startPos = txtArea.selectionStart;
                var endPos = txtArea.selectionEnd;
                var scrollTop = txtArea.scrollTop;
                txtArea.value = txtArea.value.substring(0, startPos) + text + txtArea.value.substring(endPos, txtArea.value.length);
                txtArea.focus();
                txtArea.selectionStart = startPos + text.length;
                txtArea.selectionEnd = startPos + text.length;
            } else {
                txtArea.value += text.value;
                txtArea.focus();
            }
        }; 
        
        var tlb = $(this);
        tlb.addClass('ui-widget-header ui-state-hover')
                .wrap('<div class="ui-widget"/>');
        return tlb.each(function () {
            $.each(buttons, function() {
                var btn = $('#' + this.buttonId);
                var insertionText = this.insertionText;
                btn.button().click(function() {
                    insertAtCaret(textAreaId, insertionText);
                });
            });
        });
    };    
})(jQuery);