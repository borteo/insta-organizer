/**
* controllers/relationships.js
*/
angular.module('Instagram')
  .controller('RelationshipsCtrl', function( 
    $scope, 
    $rootScope, 
    $auth, 
    apiSrv,
    usersMdl,
    $timeout
  ) {

    // console.log( 'currentUser', $rootScope.currentUser );
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    // activate the selected tab
    $scope.selectTab = function( index ) {
      for( var i = 0, nodes = $scope.tabs.length; i < nodes; i++ ) {
        $scope.tabs[ i ].active = false;  
      }
      $scope.tabs[ index ].active = true;
    }

    $scope.unfollow = function( userId, index ) {
      // add loading status to the model
      $scope.relationships.theyNotFollowingBack[ index ].loading = true;
      
      apiSrv
        .updateRelationship( userId, 'unfollow')
        .success(function() {
          $scope.relationships.theyNotFollowingBack[ index ].loading = false;
          $scope.relationships.theyNotFollowingBack[ index ].deleted = true;

          // delete the follower from the list - 2s delay
          $timeout(function() {
            $scope.relationships.unfollowUser( userId );  
          }, 2000);
        })
        .error(function( data ) {
          $scope.relationships.theyNotFollowingBack[ index ].loading = false;
          $scope.alerts.push(
            {
              type: 'danger', 
              msg: 'Woops! ' + data.message
            }
          );
        });
    }

    $scope.closeAlert = function( index ) {
      $scope.alerts.splice( index, 1 );
    };

    var initialize = function() {
      if ( !$auth.isAuthenticated() || !$rootScope.currentUser  ) {
        return;
      }
      $scope.alerts = [];
      $scope.tabs   = [
        { 
          title: 'Following',
          type: 'follows',
          active: true
        },
        { 
          title: 'Followers',
          type: 'followedBy',
          active: false
        },
        { 
          title: 'Following back',
          type: 'followingBack',
          active: false
        }, {
          title: 'You Not following back',
          type: 'youNotFollowingBack',
          active: false
        }, {
          title: 'They Not following back',
          type: 'theyNotFollowingBack',
          active: false
        }
      ];
      
      apiSrv.getFollows( $rootScope.currentUser.instagramId );
      apiSrv.getFollowedBy( $rootScope.currentUser.instagramId );

      $scope.relationships = usersMdl;
    }

    initialize();

  });
