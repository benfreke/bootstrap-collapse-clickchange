/**
 * Project: Bootstrap Collapse Clickchange
 * Author: Ben Freke
 *
 * Dependencies: Bootstrap's Collapse plugin, jQuery
 *
 * A simple plugin to enable Bootstrap collapses to provide additional UX cues.
 *
 * License: GPL v2
 *
 * Version: 1.0.1
 */
(function ( $ ) {

    var ClickChange = function() {};

    ClickChange.defaults = {
        'when' : 'before',
        'targetclass' : '',
        'parentclass' : '',
        'iconchange' : false,
        'iconprefix' : 'glyphicon',
        'iconprefixadd' : true,
        'iconclass' : 'chevron-up chevron-down'
    };

    /**
     * Set up the functions to fire on the bootstrap events
     * @param options The options passed in
     * @param controller Optional parent which controls a groups options
     * @returns object For chaining
     */
    $.fn.clickChange = function ( options, controller ) {
        // In a grouping, I've passed in the controller to get data from
        var settings = $.extend(
            {}
            , ClickChange.defaults
            , $(this).data()
            , (typeof controller == 'object' && controller) ? controller.data() : {}
            , typeof options == 'object' && options
        );

        // Now amend the icon class
        if (settings.iconclass.length && settings.iconprefixadd) {
            tmpArr = settings.iconclass.split(' ');
            settings.iconclass = '';
            tmpArr.forEach(function(element) {
                settings.iconclass += ' ' + settings.iconprefix + '-' + element;
            });
            // Remove the first space, probably not necessary but it makes the code neater
            settings.iconclass.trim();
        }

        // When do we fire the event?
        var eventStart = (settings.when === 'after') ? 'shown' : 'show';
        var eventEnd = (settings.when === 'after') ? 'hidden' : 'hide';

        // Because it could be a group, we use each to iterate over the jQuery object
        $(this).each(function(index, element) {
            var clickElement = $(element);

            // Get my target. This handles buttons and a
            var clickTarget = clickElement.attr('data-target') || clickElement.attr('href');

            // turn off previous events if we're re-initialising
            if (clickElement.data('clickchange')) {
                $(document).off('show.bs.collapse hide.bs.collapse', clickTarget);
                $(document).off('shown.bs.collapse hidden.bs.collapse', clickTarget);
            }
            clickElement.data('clickchange', 'yes');

            // As we're toggling, the same changes happen for both events
            $(document).on(eventStart + '.bs.collapse ' + eventEnd + '.bs.collapse', clickTarget, function(event) {

                // Stop the event bubbling up the chain to the parent collapse
                event.stopPropagation();

                // Toggle clickable element class?
                if (settings.parentclass) {
                    clickElement.toggleClass(settings.parentclass);
                }

                // Toggle the target class?
                if (settings.targetclass) {
                    $(event.target).toggleClass(settings.targetclass);
                }

                // Do I have icons to change?
                if (settings.iconchange && settings.iconclass.length) {
                    clickElement.find('.' + settings.iconprefix).toggleClass(settings.iconclass);
                }
            });
        });
        return this;
    };

    $(document).ready(function () {
        // Clickchange to all toggleable elements
        $('[data-click="clickchange"]').each(function() {
            if ($(this).data('toggle') != 'collapse') {
                // It's a grouping, as I place the data on the parent element
                var theParent = $(this);
                // Find only the elements that are part of this grouping
                theParent
                    .find('[data-parent="#' + theParent.attr('id') + '"]')
                    .clickChange(null, theParent);
            } else {
                // This covers stand alone elements
                $(this).clickChange();
            }
        });
    });

}( jQuery ));