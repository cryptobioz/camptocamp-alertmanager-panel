"use strict";

System.register(["app/plugins/sdk", "lodash", "app/core/core_module", "app/core/utils/kbn", "moment", "./css/alertmanager_panel.css!"], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, coreModule, kbn, moment, _createClass, panelDefaults, AlertmanagerPluginCtrl;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	return {
		setters: [function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_appCoreCore_module) {
			coreModule = _appCoreCore_module.default;
		}, function (_appCoreUtilsKbn) {
			kbn = _appCoreUtilsKbn.default;
		}, function (_moment) {
			moment = _moment.default;
		}, function (_cssAlertmanager_panelCss) {}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			panelDefaults = {
				colors: {
					crit: 'rgba(245, 54, 54, 0.9)',
					warn: 'rgba(237, 129, 40, 0.9)',
					ok: 'rgba(50, 128, 45, 0.9)'
				}
			};

			_export("AlertmanagerPluginCtrl", AlertmanagerPluginCtrl = function (_MetricsPanelCtrl) {
				_inherits(AlertmanagerPluginCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function AlertmanagerPluginCtrl($scope, $injector, $log, $filter, annotationsSrv) {
					_classCallCheck(this, AlertmanagerPluginCtrl);

					var _this = _possibleConstructorReturn(this, (AlertmanagerPluginCtrl.__proto__ || Object.getPrototypeOf(AlertmanagerPluginCtrl)).call(this, $scope, $injector));

					_.defaultsDeep(_this.panel, panelDefaults);

					_this.filter = $filter;

					_this.displayFormats = ['Details', 'OK / KO', 'Custom message'];
					_this.displayDetails = false;
					_this.displayBool = true;

					_this.events.on('render', _this.onRender.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					return _this;
				}

				_createClass(AlertmanagerPluginCtrl, [{
					key: "onDataReceived",
					value: function onDataReceived(dataList) {
						this.data = dataList[0].rows;
						this.render();
					}
				}, {
					key: "onInitEditMode",
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/camptocamp-alertmanager-panel/editor.html', 2);
						// Load in the supported units-of-measure formats so they can be displayed in the editor
						this.unitFormats = kbn.getUnitFormats();
					}
				}, {
					key: "onRender",
					value: function onRender() {
						var alerts = this.data.length;
						var silences = 0;
						var firing = 0;

						for (var i = 0; i < alerts; i++) {
							var alert_state = this.data[i][this.data[i].length - 2];
							if (alert_state == "active") {
								firing++;
							} else {
								silences++;
							}
						}

						this.handleDisplay(alerts, silences, firing);

						this.handleColoring(alerts, silences, firing);
					}
				}, {
					key: "handleColoring",
					value: function handleColoring(alerts, silences, firing) {
						if (alerts == 0) {
							this.$panelContainer.css('background-color', this.panel.colors.ok);
						} else if (silences > 0 && firing == 0) {
							this.$panelContainer.css('background-color', this.panel.colors.warn);
						} else {
							this.$panelContainer.css('background-color', this.panel.colors.crit);
						}
					}
				}, {
					key: "handleDisplay",
					value: function handleDisplay(alerts, silences, firing) {
						if (this.panel.displayFormat == "Details") {
							this.displayMessage = false;
							this.silences = silences;
							this.firing = firing;
						} else if (this.panel.displayFormat == "OK / KO") {
							this.displayMessage = true;
							if (firing == 0) {
								this.message = "OK";
							} else {
								this.message = "KO";
							}
						} else if (this.panel.displayFormat == "Custom message") {
							this.displayMessage = true;
							this.message = this.filter('interpolateTemplateVars')(this.panel.customMessage, this.$scope);
						}
					}
				}, {
					key: "link",
					value: function link(scope, elem, attrs, ctrl) {
						this.$panelContainer = elem.find('.panel-container');
						this.$panelContainer.addClass("st-card");
						this.$panelContoller = ctrl;
					}
				}]);

				return AlertmanagerPluginCtrl;
			}(MetricsPanelCtrl));

			_export("AlertmanagerPluginCtrl", AlertmanagerPluginCtrl);

			AlertmanagerPluginCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=alertmanager_ctrl.js.map
