angular.module('starter.directive',[])
.directive('ionSearch', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                getData: '&source',
                model: '=?',
                search: '=?filter'
            },
            link: function(scope, element, attrs) {
                attrs.minLength = attrs.minLength || 0;
                scope.placeholder = attrs.placeholder || '';
                scope.search = {value: ''};

                if (attrs.class)
                    element.addClass(attrs.class);

                if (attrs.source) {
                    scope.$watch('search.value', function (newValue, oldValue) {
                        if (newValue.length > attrs.minLength) {
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                            });
                        } else {
                            scope.model = [];
                        }
                    });
                }

                scope.clearSearch = function() {
                    scope.search.value = '';
                };
            },
            template: '<div class="item-input-wrapper">' +
                        '<i class="icon ion-android-search"></i>' +
                        '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                      '</div>'
        };
    })

    .directive('ionslider',function($timeout){
        return{
            restrict:'E',
            scope:{min:'=',
                max:'=',
                type:'@',
                prefix:'@',
                maxPostfix:'@',
                prettify:'@',
                grid:'@',
                gridMargin:'@',
                postfix:'@',
                step:'@',
                hideMinMax:'@',
                hideFromTo:'@',
                from:'=',
                disable:'=',
                onChange:'=',
                onFinish:'='

            },
            template:'<div></div>',
            replace:true,
            link:function($scope,$element,attrs){
                (function init(){
                    $element.ionRangeSlider({
                        min: $scope.min,
                        max: $scope.max,
                        type: $scope.type,
                        prefix: $scope.prefix,
                        maxPostfix: $scope.maxPostfix,
                        prettify: $scope.prettify,
                        grid: $scope.grid,
                        gridMargin: $scope.gridMargin,
                        postfix:$scope.postfix,
                        step:$scope.step,
                        hideMinMax:$scope.hideMinMax,
                        hideFromTo:$scope.hideFromTo,
                        from:$scope.from,
                        disable:$scope.disable,
                        onChange:$scope.onChange,
                        onFinish:$scope.onFinish
                    });
                })();
                $scope.$watch('min', function(value) {
                    $timeout(function(){ $element.data("ionRangeSlider").update({min: value}); });
                },true);
                $scope.$watch('max', function(value) {
                    $timeout(function(){ $element.data("ionRangeSlider").update({max: value}); });
                });
                $scope.$watch('from', function(value) {
                    $timeout(function(){ $element.data("ionRangeSlider").update({from: value}); });
                });
                $scope.$watch('disable', function(value) {
                    $timeout(function(){ $element.data("ionRangeSlider").update({disable: value}); });
                });
            }
        }
    });
