'use strict';

/**
 * @ngdoc directive
 * @name sandboxApp.directive:bootstrapForms
 * @description
 * # bootstrapForms
 */

angular.module('ngbBootstrapForms', []);

(function () {
    function otos(o) {
        var s = '', keys = Object.keys(o);
        for (var i = 0; i < keys.length; i++) {
            s += keys[i] + '="' + o[keys[i]] + '" ';
        }
        return s;
    }

    function extractAttributes(iElement, scope, prefix) {
        var mtAttributes = {}, origAttributes = {};
        for (var i = 0; i < iElement[0].attributes.length; i++) {
            var attr = iElement[0].attributes[i];
            if (attr.name.indexOf(prefix + '-l-') === 0) {
                mtAttributes[attr.name.replace(new RegExp(prefix + '-l-'), '') ] = attr.value;
                origAttributes[attr.name] = attr.value;
            } else if (attr.name.indexOf(prefix + '-') === 0) {
                mtAttributes[attr.name.replace(new RegExp(prefix + '-'), '') ] = '{{' + attr.value + '}}';
                origAttributes[attr.name] = attr.value;
            }
        }
        return { processed: mtAttributes, original: origAttributes };
    }

    function buildFormControlTemplate(scope, iElement, baseTemplate) {
        var template = baseTemplate,
            fcAttributes = extractAttributes(iElement, scope, 'fc'),
            fcControlAttributes = extractAttributes(iElement, scope, 'fc-control'),
            fcLabelAttributes = extractAttributes(iElement, scope, 'fc-label'),
            fcOriginalAttributes = fcAttributes.original;

        template = template.replace(/\[\[fc\-original\-attributes\]\]/, otos(fcOriginalAttributes))
            .replace(/\[\[fc\-label\-attributes\]\]/, otos(fcLabelAttributes.processed))
            .replace(/\[\[fc\-control\-attributes\]\]/, otos(fcControlAttributes.processed))
            .replace(/\[\[fc\-type\]\]/, iElement.attr('fc-type'))
            .replace(/\[\[fc\-control\-placeholder\]\]/, iElement.attr('fc-control-placeholder'));
        return template;
    }

    function buildFormControl($compile, template, scope, iElement) {
        var newElement = $compile(template)(scope);
        iElement.empty();
        iElement.append(newElement);
        iElement.after(' \n');
        return iElement;
    }

    function mutate(iElement, scope, transclude, baseTemplate) {
        var baseTemplate = baseTemplate ? baseTemplate : '<node-name mt-attributes></node-name>',
            nodeName = iElement[0].attributes['mutate-node-name'].value ?
                iElement[0].attributes['mutate-node-name'].value :
                iElement[0].nodeName,
            template = baseTemplate.replace(/node-name/g, scope.$eval(nodeName) ? scope.$eval(nodeName) : 'span'),
            prefix = iElement[0].attributes['mutate-prefix'].value, willTransclude = true,
            newElement, newAttributes;

        iElement.attr('mutate', null);
        willTransclude = willTransclude &&
            (
                iElement[0].attributes['mutate-transclude'] ?
                    scope.$eval(iElement[0].attributes['mutate-transclude'].value) :
                    true
                );

        newAttributes = extractAttributes(iElement, scope, prefix);
        template = template.replace(/mt-attributes/, newAttributes);
        newElement = $compile(template)(scope);
        if (willTransclude && transclude) {
            if (newElement.find('.transclude-target').size > 0) {
                newElement.find('.transclude-target').append($compile(transclude(scope))(scope));
            } else {
                newElement.append($compile(transclude(scope))(scope));
            }
        }
        iElement.replaceWith(newElement);
        iElement.remove();
        return newElement;
    }

    angular.module('ngBootstrapForms')
        .directive('inputFormControl', function ($compile) {
            var formControlTemplates = {
                default: '<input class="form-control" [[fc-original-attributes]] [[fc-control-attributes]] type="{{[[fc-type]]}}">',
                checkbox: '<div class="checkbox"><label [[fc-original-attributes]] [[fc-label-attributes]]>' +
                    '<input [[fc-control-attributes]] type="checkbox">{{[[fc-control-placeholder]]}}</label></div>',
                radio: '<div class="checkbox"><label class="radio" [[fc-original-attributes]] [[fc-label-attributes]]>' +
                    '<input [[fc-control-attributes]] type="radio">{{[[fc-control-placeholder]]}}</label></div>',
                inlineCheckbox: '<label class="checkbox-inline" [[fc-original-attributes]] [[fc-label-attributes]]>' +
                    '<input [[fc-control-attributes]] type="checkbox">{{[[fc-control-placeholder]]}}</label>',
                inlineRadio: '<label class="radio-inline" [[fc-original-attributes]] [[fc-label-attributes]]>' +
                    '<input [[fc-control-attributes]] type="radio">{{[[fc-control-placeholder]]}}</label>'
            };
            return {
                restrict: 'A',
                replace: true,
                template: '<span class="fcContainer"></span>',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) {
                            scope.$watch(iElement.attr('fc-type'), function (oldValue, newValue) {
                                var template = buildFormControlTemplate(scope, iElement,
                                    formControlTemplates[
                                        formControlTemplates[scope.$eval(iElement.attr('fc-type'))] ?
                                            scope.$eval(iElement.attr('fc-type')) :
                                            'default'
                                        ]);
                                iElement = buildFormControl($compile, template, scope, iElement);
                            });
                        }
                    }
                }
            };
        })
        .directive('textareaFormControl', function ($compile) {
            var baseTemplate = '<textarea class="form-control"  [[fc-original-attributes]] [[fc-control-attributes]] ></textarea>';
            return {
                restrict: 'A',
                replace: true,
                template: '<span class="fcContainer"></span>',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, iElement) {
                            var template = buildFormControlTemplate(scope, iElement, baseTemplate);
                            iElement = buildFormControl($compile, template, scope, iElement);
                        }
                    }
                }
            };
        })
        .directive('selectFormControl', function ($compile) {
            var baseTemplate = '<select  class="form-control"  [[fc-original-attributes]] [[fc-control-attributes]] ></select>';
            return {
                restrict: 'A',
                replace: true,
                template: '<span class="fcContainer"></span>',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) {
                            var template = buildFormControlTemplate(scope, iElement, baseTemplate);
                            iElement = buildFormControl($compile, template, scope, iElement);
                        }
                    }
                }
            };
        })
        .directive('formControl', function ($compile) {
            var baseTemplate = '<span [[form-control-type]]-form-control [[fc-control-attributes]] [[fc-original-attributes]] ></span>';
            return {
                restrict: 'A',
                replace: true,
                template: '<span class="fcContainer"></span>',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) {
                            scope.$watch(iElement.attr('fc-form-control-type'), function (oldValue, newValue) {
                                var template = baseTemplate,
                                    fcAttributes = extractAttributes(iElement, scope, 'fc'),
                                    fcControlAttributes = extractAttributes(iElement, scope, 'fc-control'),
                                    fcLabelAttributes = extractAttributes(iElement, scope, 'fc-label'),
                                    fcOriginalAttributes = fcAttributes.original,
                                    fcFormControlType = scope.$eval(iElement.attr('fc-form-control-type')) || 'input';

                                template = template.replace(/\[\[fc\-original\-attributes\]\]/, otos(fcOriginalAttributes))
                                    .replace(/\[\[fc\-label\-attributes\]\]/, otos(fcLabelAttributes.processed))
                                    .replace(/\[\[fc\-control\-attributes\]\]/, otos(fcControlAttributes.processed))
                                    .replace(/\[\[fc\-type\]\]/, iElement.attr('fc-type'))
                                    .replace(/\[\[fc\-control\-placeholder\]\]/, iElement.attr('fc-control-placeholder'))
                                    .replace(/\[\[form\-control\-type\]\]/, fcFormControlType);

                                var newElement = $compile(template)(scope);
                                iElement.empty();
                                iElement.append(newElement);

                                console.log(template);
                            });
                        }
                    }
                }
            };
        })
})();