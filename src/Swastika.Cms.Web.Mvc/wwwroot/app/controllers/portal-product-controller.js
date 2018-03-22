﻿'use strict';
app.controller('ProductController', function ProductController($scope) {
    $scope.activedProduct = null;
    $scope.relatedProducts = [];
    $scope.data = [];
    $scope.errors = [];
    $scope.range = function (max) {
        var input = [];
        for (var i = 1; i <= max; i += 1) input.push(i);
        return input;
    };
    $scope.loadProduct = function (productId) {
        $scope.isBusy = true;
        var url = '/api/' + $scope.currentLanguage + '/product/details/be/' + productId;//byProduct/' + productId;
        $scope.settings.method = "GET";
        $scope.settings.url = url;// + '/true';
        $scope.settings.data = $scope.request;
        $.ajax($scope.settings).done(function (response) {
            if (response.isSucceed) {
                $scope.activedProduct = response.data;
                $scope.initEditor();
            }
            $scope.isBusy = false;
            $scope.$apply();
        });
    };
    $scope.loadProducts = function (pageIndex) {
        $scope.isBusy = true;
        if (pageIndex != undefined) {
            $scope.request.pageIndex = pageIndex;
        }
        if ($scope.request.fromDate != null) {
            $scope.request.fromDate = $scope.request.fromDate.toISOString();
        }
        if ($scope.request.toDate != null) {
            $scope.request.toDate = $scope.request.toDate.toISOString();
        }
        var url = '/api/' + $scope.currentLanguage + '/product/list';//byProduct/' + productId;
        $scope.settings.method = "POST";
        $scope.settings.url = url;// + '/true';
        $scope.settings.data = $scope.request;
        $.ajax($scope.settings).done(function (response) {
            ($scope.data = response.data);

            $.each($scope.data.items, function (i, product) {
                $.each($scope.activedProducts, function (i, e) {
                    if (e.productId == product.id) {
                        product.isHidden = true;
                    }
                })
            })
            $scope.isBusy = false;
            setTimeout(function () {
                $('[data-toggle="popover"]').popover({
                    html: true,
                    content: function () {
                        var content = $(this).next('.popover-body');
                        return $(content).html();
                    },
                    title: function () {
                        var title = $(this).attr("data-popover-content");
                        return $(title).children(".popover-heading").html();
                    }
                });
            }, 200);
            $scope.$apply();
        });
    };

    $scope.removeProduct = function (productId) {
        if (confirm("Are you sure!")) {
            var url = '/api/' + $scope.currentLanguage + '/product/delete/' + productId;
            $.ajax({
                method: 'GET',
                url: url,
                success: function (data) {
                    $scope.loadProducts();
                    $scope.$apply();
                },
                error: function (a, b, c) {
                    console.log(a + " " + b + " " + c);
                }
            });
        }
    };
    $scope.saveProduct = function (product) {
        $scope.isBusy = true;
        var json = (angular.toJson(product));
        var url = '/api/' + $scope.currentLanguage + '/product/save';
        $.ajax({
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            url: url,
            data: json,
            success: function (data) {
                //$scope.loadProducts();
                if (data.isSucceed) {
                    alert('success');
                }
                else {
                    $scope.errors = data.errors;
                }
                $scope.isBusy = false;
                $scope.$apply();
            },
            error: function (a, b, c) {
                console.log(a + " " + b + " " + c);
                $scope.isBusy = false;
                $scope.$apply();
            }
        });
    };

    $scope.addProperty = function (type) {
        var i = $(".property").length;
        $.ajax({
            method: 'GET',
            url: '/' + $scope.currentLanguage + '/Portal/' + type + '/AddEmptyProperty/' + i,
            success: function (data) {
                $('#tbl-properties > tbody').append(data);
                $(data).find('.prop-data-type').trigger('change');
            },
            error: function (a, b, c) {
                console.log(a + " " + b + " " + c);
            }
        });
    }
});