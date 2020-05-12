angular.module('movieApp.directives', [])
  
.directive('student', ['adminServices', function(adminServices) {
    var directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = "./views/directive/movie_detail_popup.html";
    directive.scope = {
        toggle: "=",
        data: "=",
        reload: "&"
    }

    directive.compile = function(element, attributes) {
        
        var linkFunction = function($scope, element, attributes) {
            $scope.view = {}
            $scope.view.new = false
            if($scope.data == null){
                $scope.data = {}
                $scope.view.new = true
            }
            $scope.innerData = {}
            $scope.innerData.img_url = {}
            $scope.innerData.img_url.url = "http://130.211.52.161/tradeo-content/themes/nucleare-pro/images/no-image-box.png"

            $scope.$watch('toggle', ()=>{
                if($scope.toggle){
                    $("body").css("overflow", "hidden");
                    $scope.innerData.img_url = {}
                    $scope.innerData.img_url.url = "http://130.211.52.161/tradeo-content/themes/nucleare-pro/images/no-image-box.png"
                    if($scope.data.movie_db_id != null) {
                         $scope.fetch($scope.data.movie_db_id)
                    } else {
                        $scope.innerData.img_url = {}
                        $scope.innerData.img_url.url = "http://130.211.52.161/tradeo-content/themes/nucleare-pro/images/no-image-box.png"
                    }
                }
            }, true);
            
            $scope.close = function(){
                $scope.toggle = false
                $("body").css("overflow", "auto");
            }

            $scope.copylink = function(data){
                copyTextToClipboard(data)
            }

            $scope.fetch = function(data){
                if(data != null && data != ''){
                    adminServices.getMoviedbData(data).then(function(results) {
                        $scope.innerData.img_url = null
                        $scope.innerData.img_url = results.data
                    }, function(error) {
                        console.log("Fetching movies db error.", error)
                    })
                }
            }

            $scope.save = function(data){
                adminServices.saveMovie(data).then(function(results) {
                    $scope.close()
                    $scope.reload()
                }, function(error) {
                    console.log("Fetching movies db error.", error)
                })
            }

            $scope.create = function(data){
                adminServices.createMovie(data).then(function(results) {
                    $scope.close()
                    $scope.reload()
                }, function(error) {
                    console.log("Fetching movies db error.", error)
                })
            }


            $scope.delete = function(data){
                adminServices.deleteMovie(data).then(function(results) {
                    $scope.close()
                    $scope.reload()
                }, function(error) {
                    console.log("Fetching movies db error.", error)
                })
            }

            function copyTextToClipboard(text) {
                var textArea = document.createElement("textarea");
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = 0;
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    // console.log('Copying text command was ' + msg);
                } catch (err) {
                    // console.log('Oops, unable to copy');
                }
                document.body.removeChild(textArea);
            }
        }
        return linkFunction;
    }

    return directive;
}])


.directive('movieThumb', ['$state', function($state) {
    var directive = {};
    directive.restrict = 'AE';
    directive.replace = true;
    directive.templateUrl = "./views/directive/movie_thumb.html";
    directive.scope = {
        data: "="
    }

    directive.compile = function(element, attributes) {
        
        var linkFunction = function($scope, element, attributes) {
            
            $scope.goto = function(id){
                
            }
        }
        return linkFunction;
    }

    return directive;
}])

.directive('peopleThumb', [function() {
    var directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = "./views/directive/people_thumb.html";
    directive.scope = {
        data: "=",
        imgSize: '='
    }

    directive.compile = function(element, attributes) {
        
        var linkFunction = function($scope, element, attributes) {
            // console.log($scope.data)
        }
        return linkFunction;
    }

    return directive;
}])

.directive('scrollerWidget', [function() {
    var directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = "./views/directive/scroller_widget.html";
    directive.scope = {
        data: "="
    }

    directive.compile = function(element, attributes) {
        
        var linkFunction = function($scope, element, attributes) {
           
        }
        return linkFunction;
    }

    return directive;
}])

.directive('dragScroll', ['$window','$timeout', function($window, $timeout) {
    return function (scope, element) {
        // imporper way of handling the size
        var thumbline_size = {
            768 : 250,
            767 : 150
        }
        var startx = 0;
        var endx = 0;
        var dist = 0;
        var startLock = 0;
        var endLock = 0;
        var tempMovedWidth = 0;
        var childElementWidth = 0;
        var w = angular.element($window);
        var windowWidth = window.innerWidth;

        scope.setThumblineWidth = function(screanSize) {
            if(screanSize >= 768) {
                childElementWidth = thumbline_size[768];
            } else {
                childElementWidth = thumbline_size[767];
            }

            $timeout(function() {
                 element.css({'width': (childElementWidth*element.children().length)+'px'});
            }, true);
        }

        scope.setThumblineWidth(windowWidth)

        // watching resize of screan
        angular.element($window).bind('resize', function(){
         scope.setThumblineWidth(window.innerWidth)
         scope.$digest();
        });
        

        // mouse events
        function mousedown(e) {
            var touchobj = e
            startx = parseInt(touchobj.clientX) - tempMovedWidth

            e.stopPropagation();
            e.preventDefault();

            element.bind('mousemove', mousemove);
            element.bind('mouseup', mouseup);
            element.bind('mouseout', mouseout);
        }

        function mousemove(e) {
            var touchobj = e
            var dist = parseInt(touchobj.clientX) - startx
            startLock = 0;
            endLock =  element.width()-$(window).width();
            
            if (dist <= 0 && -(dist) <= endLock) {
                element.css({"-webkit-transform":"translateX("+dist+"px)"})
                tempMovedWidth = dist
            }


            e.stopPropagation();
            e.preventDefault();
        }

        function mouseup(e) {
            e.stopPropagation();
            e.preventDefault();
            element.unbind('mousemove', mousemove);
            element.unbind('mouseup', mouseup);
            element.unbind('mouseout', mouseout);
        }

        function mouseout(ev) {
            var e = ev.toElement || ev.relatedTarget;
            while(e && e.parentNode && e.parentNode != window) {
                if (e.parentNode == this||  e == this) {
                    if(e.preventDefault) e.preventDefault();
                    return false;
                }
                e = e.parentNode;
            }

            element.unbind('touchmove mousemove', mousemove);
            element.unbind('touchend mouseup', mouseup);
            element.unbind('mouseout', mouseout);
        }

        element.bind('mousedown', mousedown);

        // touch events
        function touchstart(e) {
            var touchobj = e.changedTouches[0] 
            startx = parseInt(touchobj.clientX) - tempMovedWidth

            // e.stopPropagation();
            // e.preventDefault();

            element.bind('touchmove', touchmove);
            element.bind('touchend', touchend);
        }

        function touchmove(e) {
            var touchobj = e.changedTouches[0] 
            var dist = parseInt(touchobj.clientX) - startx
            startLock = 0;
            endLock =  element.width()-$(window).width();
            
            if (dist <= 0 && -(dist) <= endLock) {
                element.css({"-webkit-transform":"translateX("+dist+"px)"})
                tempMovedWidth = dist
            }


            // e.stopPropagation();
            // e.preventDefault();
        }

        function touchend(e) {
            // e.stopPropagation();
            // e.preventDefault();
            element.unbind('touchmove', touchmove);
            element.unbind('touchend', touchend);
        }

        element.bind('touchstart', touchstart);
    }
}]);

// $(window).scroll(function() {
//   var scrolledY = $(window).scrollTop();
//   $('#container').css('background-position', 'left ' + ((scrolledY)) + 'px');
// });