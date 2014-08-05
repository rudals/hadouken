﻿angular.module('hadouken.settings.controllers.index', [
    'hadouken.messaging',
    'ui.bootstrap'
])
.controller('Settings.IndexController', [
    '$scope', '$http', '$modal', 'messageService', 'jsonrpc',
    function ($scope, $http, $modal, messageService, jsonrpc) {
        var dialogs = {};

        jsonrpc.request('extensions.getAll', {
            success: function(data) {
                $scope.extensions = data.result;
            }
        });

        $scope.save = function() {
        };

        $scope.configure = function(extensionId) {
            var dialog = dialogs[extensionId];

            if(!dialog) {
                throw new Error('Invalid extensionId: ' + extensionId);
            }

            $modal.open({
                controller: dialog.controller,
                templateUrl: dialog.templateUrl,
                size: dialog.size || 'md'
            });
        };

        $scope.toggleExtension = function(extensionId, enabled) {
            var method = enabled ? 'extensions.enable' : 'extensions.disable';
            jsonrpc.request(method, {
                params: [extensionId],
                success: function() {}
            });
        };

        $scope.hasDialog = function(extensionId) {
            return typeof dialogs[extensionId] !== 'undefined';
        };

        var subscription = messageService.subscribe('ui.settings.dialogs.add', function(event, params) {
            dialogs[params.extensionId] = params;
        });

        messageService.publish('ui.settings.onloaded', {});

        $scope.$on('$destroy', function() {
            subscription();
        });
    }
]);