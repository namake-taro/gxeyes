import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PointerWatcher from 'resource:///org/gnome/shell/ui/pointerWatcher.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import {EyesWidget} from './eyesWidget.js';

const GXEyesButton = GObject.registerClass({
    GTypeName: 'GXEyesButton',
}, class GXEyesButton extends PanelMenu.Button {
    _init(extensionObject) {
        super._init(0.0, 'GXEyes');

        this._extensionObject = extensionObject;
        this._settings = extensionObject.getSettings();

        this._eyes = new EyesWidget(this._settings);
        this.add_child(this._eyes);

        this._pointerWatch = null;
        this._startPointerWatch();

        this._settingsChangedId = this._settings.connect('changed',
            this._onSettingsChanged.bind(this));
    }

    _startPointerWatch() {
        const interval = this._settings.get_int('update-interval');

        // PointerWatcher: callbacks only during pointer movement, auto-stops when idle
        this._pointerWatch = PointerWatcher.getPointerWatcher().addWatch(interval, (x, y) => {
            this._eyes.updatePupils(x, y);
        });

        const [x, y] = global.get_pointer();
        this._eyes.updatePupils(x, y);
    }

    _stopPointerWatch() {
        if (this._pointerWatch) {
            this._pointerWatch.remove();
            this._pointerWatch = null;
        }
    }

    _onSettingsChanged(settings, key) {
        this._eyes.updateSettings();

        if (key === 'update-interval') {
            this._stopPointerWatch();
            this._startPointerWatch();
        }
    }

    destroy() {
        this._stopPointerWatch();

        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        super.destroy();
    }
});

export default class GXEyesExtension extends Extension {
    enable() {
        this._button = new GXEyesButton(this);
        Main.panel.addToStatusArea('gxeyes-indicator', this._button);
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }
}
