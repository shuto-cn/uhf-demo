// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.Keyboard) {
        cordova.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .controller('testCtrl', function ($scope) {

    // var HEX = /^[0-9a-fA-F]{24}$/;

    $scope.card = {site: {flag: false, id: 1}, param: 176, length: 6, search: '开始巡卡', start: false, epcs: {}};
    $scope.set = {power:null, param: 176};
    $scope.isEpc = function () {
      return $scope.card.site.flag;
    };

    $scope.choseEpc = function () {
      $scope.card.site.flag = false;
      $scope.card.site.id = 1;
    };

    $scope.choseUser = function () {
      $scope.card.site.flag = true;
      $scope.card.site.id = 3;
    };

    $scope.search = function () {
      $scope.card.epc = '';
      cordova.plugin.uhf.searchCard(function (res) {
      console.debug("read result: %s", JSON.stringify(res));
        $scope.$apply(function () {
          $scope.card.epc = res;
          console.log($scope.card.epc);
          console.log('success');
        });
      }, function (err) {
        console.log('err: %s', err);
      })
    };

    $scope.toggleSearch = function () {
      $scope.card.start = !$scope.card.start;
      if ($scope.card.start) {
        $scope.card.search = "停止巡卡";
          $scope.card.epcs = {};
          cordova.plugin.uhf.startSearchCard(function (res) {
          console.debug("read result: %o", res);
            if (!res) {
              console.debug("empty result");
              return;
            }
            $scope.$apply(function () {
              for (var i=0; i<res.length; i++) {
                console.debug("epcs: %o", $scope.card.epcs);
                var epc = res[i];
                if ($scope.card.epcs[epc]) {
                  $scope.card.epcs[epc] = $scope.card.epcs[epc]+1;
                }
                else {
                  $scope.card.epcs[epc] = 1;
                }
              }
              console.log($scope.card.epcs);
              console.log('success');
            });
          }, function (err) {
            console.log('err: %s', err);
          })
      }
      else {
        $scope.card.search = "开始巡卡";
          cordova.plugin.uhf.stopSearchCard(function (res) {
          console.debug("read result: %s", JSON.stringify(res));
            $scope.$apply(function () {
              console.log('success');
            });
          }, function (err) {
            console.log('err: %s', err);
          })
      }
    };

    $scope.read = function () {
      $scope.card.read = '';
      console.log($scope.card.length);
      cordova.plugin.uhf.readCard({site:3, addr: 0}, function (res) {
      console.debug("read result: %s", JSON.stringify(res));
        $scope.$apply(function () {
          $scope.card.read = res.data;
          console.log('success');
        });
      }, function (err) {
        $scope.$apply(function () {
          $scope.card.read = err;
          console.log('err: %s', err);
        });
      })
    };

    $scope.write = function () {
      $scope.card.write = '';
      cordova.plugin.uhf.writeCard({site:3, addr: 0, data: $scope.card.writeContent}, function (res) {
        $scope.$apply(function () {
          $scope.card.write = '写入成功';
          console.log($scope.card.write);
          console.log('success');
        });
      }, function (err) {
        $scope.write = '写入失败';
        console.log('err: %s', err);
      })
    };

    $scope.getPower = function () {
      cordova.plugin.uhf.getPower(function (res) {
        $scope.$apply(function () {
          $scope.card.power = res;
          console.log($scope.card.power);
          console.log('success');
        });
      }, function (err) {
        console.log('err: %s', err);
      })
    };

    $scope.setPower = function () {
      $scope.card.setPower = '';
      if ($scope.set.power) {
        if ($scope.set.power < 15) {
          $scope.set.power = 15;
        } else if ($scope.set.power > 26) {
          $scope.set.power = 26;
        }
      } else {
        $scope.card.setPower = '设置功率失败';
      }
      cordova.plugin.uhf.setPower($scope.set.power, function (res) {
        $scope.$apply(function () {
          $scope.card.setPower = '设置功率成功';
          console.log($scope.card.setPower);
          console.log(res);
          console.log('success');
        });
      }, function (err) {
        $scope.card.setPower = '设置功率失败';
        console.log('err: %s', err);
      })
    };

    $scope.getParam = function () {

      cordova.plugin.uhf.getParam(function (res) {
        $scope.$apply(function () {
          $scope.card.param = res.thrd;
          console.log('success');
        });
      }, function (err) {
        console.log('err: %s', err);
      })
    };

    $scope.setParam = function () {

      if ($scope.set.param > 65535) {
        $scope.set.param = 65535;
      } else if ($scope.set.param < 0) {
        $scope.set.param = 0;
      }

      cordova.plugin.uhf.setParam($scope.set.param, function (res) {
        $scope.$apply(function () {
          $scope.card.setParam = '设置成功';
          console.log($scope.card.power);
          console.log('success');
        });
      }, function (err) {
        $scope.card.setParam = '设置失败';
        console.log('err: %s', err);
      })
    }



  })
