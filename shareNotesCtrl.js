
// ********* Code Created by Sauradip Nag **********
// This is a Sample of Angular.js Code I worked on in ApnaStudy Technologies Pvt.Ltd


(function () {
    
    'use strict';
    var controllerId = 'shareNotesCtrl';
    var app = angular.module('app');
    
    app.controller(controllerId, ['$scope', 'authIdentity', 'ajaxFac', 'featureFac',
         'exceptionCatcherFac', 'appConfig', 'classResourceFac', shareNotesCtrl]);
    
    function shareNotesCtrl($scope, authIdentity, ajaxFac, featureFac, exceptionCatcherFac, appConfig, classResourceFac) {
        
        $scope.classList = {};
        $scope.selectedClass = {};
        $scope.classNotes = [];
        
        var user = authIdentity.currentUser();
        var token = authIdentity.getToken();
        
        function init() {
            if ($scope.hasFeature(new featureList.availableFeatures().ReadClass)) {
                ajaxFac.httpGet('/api/class/allclassenames',
                    function (result) {
                    $scope.classList = result;
                });
            }
        }
        
        $scope.$watch('selectedClass', function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                if ($scope.hasFeature(new featureList.availableFeatures().ReadClass) && 
                validate(new classCtrlVld.verifyClassId({ classId: $scope.selectedClass.classId }), true)) {
                    ajaxFac.httpPost('/api/class/sharedresources', { classId: $scope.selectedClass.classId }, 
                    function (result) {                        
                        refreshFileList(result);
                    });
                }
            }
        }, true);
        
        $scope.uploadNotes = function (files) {
            classResourceFac.uploadNotes(files, $scope.selectedClass.classId).then(function (response) {
                if (response) {
                    var fileDisplayName = files[0].name;
                    var fileName = files[0].name;
                    if (response.newFileName)
                        fileName = response.newFileName;
                    $scope.uploadType = 'notes';
                    $scope.noteUploadSuccess = false;
                    classResourceFac.addOrUpdate(files[0], $scope.selectedClass.classId, 'notes', 
                                        fileName, fileDisplayName).then(function (res) {
                        refreshFileList(res);
                    });
                }
            });
        };
        
        $scope.downloadFile = function (fileName) {
             var fileUrl = appConfig.stServerAddress +
                            '/api/class/notefilestream?classId=' + $scope.selectedClass.classId +
                            '&filename=' + fileName +
                            '&userId=' + user.userId + '&token=' + token;

            
            window.open(fileUrl, '_blank', '');
            
        };
        
        $scope.removeResource = function (note) {
            if(!note)
                return;
                
            classResourceFac.removeResource(note.fileName, 'notes', 
                $scope.selectedClass.classId).then(function (res) {
                refreshFileList(res);
            });
        };

        function refreshFileList(resources) {
            $scope.classNotes = [];
            
            _.each(resources, function (item) {
                if (item.resourceType === 'notes')
                    $scope.classNotes.push({fileName: item.fileName, displayName: item.fileDisplayName});
            });
        }

        function validate(cData, showMsg) {
            if (!cData.isValid() && showMsg) {
                exceptionCatcherFac.notifyInvalidParam(cData.errorMsg);
            }
            return cData.isValid();
        }
        
        $scope.hasFeature = function (requiredFeature) {
            return featureFac.hasAccessToFeature(requiredFeature, true);
        };
        
        init();
        
    }
})();
