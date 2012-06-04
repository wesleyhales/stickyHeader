(function($){
        var methods = {
            init : function(options) {

                var table = this;
                var thead = table.find('thead');
                var topmenuHeight = 0;
                //create a div for the top menu bar
                var topmenu = document.createElement('div');
                $(topmenu).prop('id','topmenu');
                //check options suplied in init
                if(options && options.topmenu){
                    //append temporary div to specified form
                    if(options.topmenu.parentFormID){
                        $(topmenu).appendTo(options.topmenu.parentFormID);
                    }else{
                        $.error('You must define the parent form of the
elements you are inserting.')
                    }

                    //clone and append specified elements
                    if(options.topmenu.addToTopMenu){
                        options.topmenu.addToTopMenu.each( function(i,
element) {
                            //here we are getting the first element incase we
                            //have
                            //duplicate classes or ids already in the DOM
                            $($(i)[0]).clone().appendTo($(topmenu));
                        });
                    }else{
                        $.error('You have not defined any elements to
insert.')
                    }

                    //calculate or store the height for later use
                    if(!options.topmenu.height){
                      topmenuHeight = $(topmenu).height();
                    }else{
                      topmenuHeight = options.topmenu.height;
                    }

                }

                //find the width of each th element
                var widths = [];
                var theadth = thead.find('th');
                var stickyfiller = $('<thead id="sticky-filler">' +
thead.html() + '</thead>').insertAfter(thead);
                $(stickyfiller).css('display','none');

                theadth.each( function(i, element) {
                    widths[i] = $(element).width();
                });

                var tempwidth;
                //set thead equal to table position left
                thead.css('left',table.offset().left);

                theadth.each( function(i, element) {
                    if ($.browser.mozilla) {
                        tempwidth = widths[i];
                    }else{
                        //needs an extra pixel for chrome and IE
                        tempwidth = widths[i] + 1;

                    }
                    $(element).css('width', tempwidth + 'px');
                });

                //hide sticky header on window resize
                $(window).resize(function(){
                  removeStyling()
                });

                $(window).scroll(function() {

                    var windowTop = $(window).scrollTop();

                    if (windowTop > table.offset().top - topmenuHeight) {
                        $(topmenu).addClass('sticky');
                        //refresh height incase of styling after sticky class
                        //applied
                        topmenuHeight = $(topmenu).height();
                        thead.addClass('sticky').css('top',topmenuHeight);
                        $(stickyfiller).css('display','');
                    }
                    else {
                        removeStyling();
                    }
                });

                function removeStyling() {
                  thead.removeClass('sticky');
                  $(topmenu).removeClass('sticky');
                  $(stickyfiller).css('display','none');
                }
            }
        };

        $.fn.stickyHeader = function(method) {
            //sorry, no IE7 :(
            if (!($.browser.msie && parseInt($.browser.version, 10) === 7)) {
                return methods.init.apply(this, arguments);
            }
        };
    })(jQuery);
