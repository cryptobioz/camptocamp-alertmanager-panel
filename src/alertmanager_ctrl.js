import {MetricsPanelCtrl} from "app/plugins/sdk";
import _ from "lodash";
import coreModule from "app/core/core_module";
import kbn from "app/core/utils/kbn";
import moment from "moment";

import './css/alertmanager_panel.css!';

// Set and populatre panel defaults
const panelDefaults = {
	colors: {
		crit: 'rgba(245, 54, 54, 0.9)',
		warn: 'rgba(237, 129, 40, 0.9)',
		ok: 'rgba(50, 128, 45, 0.9)'
	}
}

export class AlertmanagerPluginCtrl extends MetricsPanelCtrl {
	/** @ngInject */
	constructor($scope, $injector, $log, $filter, annotationsSrv) {
		super($scope, $injector);
		_.defaultsDeep(this.panel, panelDefaults);

		this.filter = $filter;

		this.displayFormats = ['Details', 'OK / KO', 'Custom message'];
		this.displayDetails = false
		this.displayBool = true

		this.events.on('render', this.onRender.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
	}

	onDataReceived(dataList) {
		this.data = dataList[0].rows;
		this.render();
	}

	onInitEditMode() {
		this.addEditorTab('Options', 'public/plugins/camptocamp-alertmanager-panel/editor.html', 2);
		// Load in the supported units-of-measure formats so they can be displayed in the editor
		this.unitFormats = kbn.getUnitFormats();
	}

	onRender() {
		var alerts = this.data.length;
		var silences = 0;
		var firing = 0;

		for(var i=0;i<alerts;i++) {
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

	handleColoring(alerts, silences, firing) {
		if (alerts == 0) {
			this.$panelContainer.css('background-color', this.panel.colors.ok);
		} else if (silences > 0 && firing == 0) {
			this.$panelContainer.css('background-color', this.panel.colors.warn);
		} else {
			this.$panelContainer.css('background-color', this.panel.colors.crit);
		}
	}

	handleDisplay(alerts, silences, firing) {
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

	// Get panel from Grafana
	link(scope, elem, attrs, ctrl) {
		this.$panelContainer = elem.find('.panel-container');
		this.$panelContainer.addClass("st-card");
		this.$panelContoller = ctrl;
	}
}
AlertmanagerPluginCtrl.templateUrl = 'module.html';
