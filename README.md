Miscellaneous
=============

Miscellaneous code from various platforms

##CollapsiblePanel

Callable on a container selector. Toggles the container to open/closed when the header is clicked. Needs the following structure on the page:

    <div class="ui-widget collapse">
        <div id="expander-demo-control" class="ui-widget-header">
            <span class="ui-icon ui-expander floatLeft">+</span>
            <span style="display: inline">Lime49 Expandy Widgets Inc.</span>
        </div>
        <div id="expander-demo" class="ui-widget-content">
            <p>Snap! the overstrained line sagged down in one long festoon; the tugging log was gone.</p>
     
            <p>"I crush the quadrant, the thunder turns the needles, and now the mad sea parts the log-line. But Ahab can mend all. Haul in here, Tahitian; reel up, Manxman. And look ye, let the carpenter make another log, and mend thou the line. See to it."</p>
     
            <p>"There he goes now; to him nothing's happened; but to me, the skewer seems loosening out of the middle of the world. Haul in, haul in, Tahitian! These lines run whole, and whirling out: come in broken, and dragging slow. Ha, Pip? come to help; eh, Pip?"</p>
        </div>
     </div>

##PressableBarButton

UIBarButton item which shown an offset or different image when tapped. 

Documetation at http://www.leghumped.com/blog/2012/07/01/pressable-uibarbutton-in-ios/

##Theme-a-Go-Go

JavaScript stylesheet switcher.

Documentation at http://www.leghumped.com/blog/2012/10/31/jquery-stylesheet-switcher/

###Options

* **filenames**: An array of CSS files to switch out/in from the theme directories
* **baseDirectory**: The base directory containing theme directories
* **servicePath**: The path to the web service used to save theme preferences
* **themes**: An array of theme name/array pairs. The <em>folder</em> parameter should be a subdirectory of <em>baseDirectory</em>.

##jQuery.textprogress

A jQuery progress meter that fills up as text is entered into a textarea or input.

Documentation at http://www.leghumped.com/2013/02/22/jquery-text-progress-meter/

###Options

* **messageFormat**: The format for the count label. Available placeholders are {current}, {total} and {percent}
* **showCount**: true/false - Whether or not to display a total of the current length/maximum allowed length.
* **max**: The maximum allowed length
* **allowOverLength**: true/false - Whether or not to prevent more text being entered than allowed.
* **classes**: An object containing two keys:
  * **standard**: The progress bar class if less than the allowed length of text is entered.
  * **over**: The class if equal to or more than the allowed text length is entered

* **textbox**: The textbox/input element to measure.
