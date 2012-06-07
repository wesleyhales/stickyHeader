(function ($, document, window) {

    var methods = {
        init: function (options) {

            var $table = this,
                $stickyHeader = $table.find('thead'),
                $thead = $stickyHeader,
                topmenuHeight = 0,
                topmenu,
                widths = [],
                $theadth = $stickyHeader.find('th'),
                tempwidth,
                isoldie = false,
                $stickyfiller;

            //check options suplied in init
            if (options && options.topmenu) {
                //create a div for the top menu bar
                topmenu = document.createElement('div');
                $(topmenu).prop('id', 'topmenu');

                //append temporary div to specified form
                if (options.topmenu.parentFormID) {
                    $(topmenu).appendTo(options.topmenu.parentFormID);
                } else {
                    $.error('You must define the parent form of the elements you are inserting.');
                }

                //clone and append specified elements
                if (options.topmenu.addToTopMenu) {
                    options.topmenu.addToTopMenu.each(function (i, element) {
                        //here we are getting the first element incase we have
                        //duplicate classes or ids already in the DOM
                        $($(i)[0]).clone().appendTo($(topmenu));
                    });
                } else {
                    $.error('You have not defined any elements to insert.');
                }

                //calculate or store the height for later use
                if (!options.topmenu.height) {
                    topmenuHeight = $(topmenu).height();
                } else {
                    topmenuHeight = options.topmenu.height;
                }

            }

            //add the temp header to original header
            $stickyfiller = $('<thead id="sticky-filler">' + $stickyHeader.html() + '</thead>').prependTo($table);

            //store the width of each th element
            $theadth.each(function (i, element) {
                widths[i] = $(element).width();
            });

            $theadth.each(function (i, element) {
                if ($.browser.mozilla) {
                    tempwidth = widths[i];
                } else {
                    //needs an extra pixel for chrome and IE
                    tempwidth = widths[i] + 1;

                }
                $(element).css('width', tempwidth + 'px');
            });

            //hide sticky header on window resize
            $(window).resize(function () {
                $stickyHeader.css('left', $table.offset().left);
            });

            //check for <= IE7 since we cannot have a fixed position on thead
            if ($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                isoldie = true;
                $stickyHeader = $('<table></table>');
                //setup new sticky table to hold thead for IE
                $stickyHeader.appendTo($table.parent());
                $stickyHeader.width($table.width());
                $stickyHeader.css('margin', '0');
                $stickyHeader.prop('id', $table.prop('id') + "-temp");
                $stickyHeader.attr('class', $table.attr('class'));
                $thead.prependTo($stickyHeader);
            }

            function removeStyling() {
                $stickyHeader.removeClass('sticky');
                if(!isoldie){
                    $stickyfiller.hide();
                }
                $(topmenu).removeClass('sticky').hide();
            }

            function trackHeader() {
                var windowTop = $(window).scrollTop();

                if (windowTop > $table.offset().top - topmenuHeight) {
                    $(topmenu).addClass('sticky').show();
                    //refresh height incase of styling after sticky class applied
                    topmenuHeight = $(topmenu).height();
                    $stickyHeader.addClass('sticky').css('top', topmenuHeight).show();
                    $stickyfiller.show();
                } else {
                    removeStyling();
                }
            }

            //IE6/7 fires events wildly, so we may need a setInterval on this if problems occur.
            //functions should not be bound to scroll event, but in this case it's ok
            $(window).scroll(function () {
                trackHeader();
            });
        }
    };

    $.fn.stickyHeader = function (method) {
        return methods.init.apply(this, arguments);
    };
})(jQuery, document, window);