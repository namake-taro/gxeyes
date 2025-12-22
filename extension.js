import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import {EyesWidget} from './eyesWidget.js';

/**
 * XEyesButton - トップバーに表示されるボタン
 */
const XEyesButton = GObject.registerClass({
    GTypeName: 'XEyesButton',
}, class XEyesButton extends PanelMenu.Button {
    _init(extensionObject) {
        super._init(0.0, 'XEyes');

        this._extensionObject = extensionObject;
        this._settings = extensionObject.getSettings();

        // 目のウィジェット
        this._eyes = new EyesWidget(this._settings);
        this.add_child(this._eyes);

        // タイマーでマウス位置を監視
        this._timerId = null;
        this._startTimer();

        // 設定変更の監視
        this._settingsChangedId = this._settings.connect('changed',
            this._onSettingsChanged.bind(this));
    }

    /**
     * タイマーを開始
     */
    _startTimer() {
        const interval = this._settings.get_int('update-interval');

        this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
            this._updateEyes();
            return GLib.SOURCE_CONTINUE;
        });

        // 初回更新
        this._updateEyes();
    }

    /**
     * 目を更新
     */
    _updateEyes() {
        const [x, y] = global.get_pointer();
        this._eyes.updatePupils(x, y);
    }

    /**
     * タイマーを停止
     */
    _stopTimer() {
        if (this._timerId) {
            GLib.Source.remove(this._timerId);
            this._timerId = null;
        }
    }

    /**
     * 設定変更時のコールバック
     */
    _onSettingsChanged(settings, key) {
        this._eyes.updateSettings();

        // 更新間隔が変更された場合、タイマーを再起動
        if (key === 'update-interval') {
            this._stopTimer();
            this._startTimer();
        }
    }

    /**
     * 破棄処理
     */
    destroy() {
        this._stopTimer();

        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        super.destroy();
    }
});

/**
 * XEyesExtension - メインエクステンションクラス
 */
export default class XEyesExtension extends Extension {
    /**
     * エクステンション有効化
     */
    enable() {
        this._button = new XEyesButton(this);
        Main.panel.addToStatusArea('xeyes-indicator', this._button);
    }

    /**
     * エクステンション無効化
     */
    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }
}
