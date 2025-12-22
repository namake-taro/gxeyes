import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

/**
 * XEyesPreferences - 設定画面
 */
export default class XEyesPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // メインページ
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'preferences-system-symbolic',
        });
        window.add(page);

        // === サイズ設定グループ ===
        const sizeGroup = new Adw.PreferencesGroup({
            title: _('Size Settings'),
        });
        page.add(sizeGroup);

        // 目の幅
        const eyeWidthRow = new Adw.SpinRow({
            title: _('Eye Width'),
            subtitle: _('Width of each eye in pixels'),
            adjustment: new Gtk.Adjustment({
                lower: 8,
                upper: 40,
                step_increment: 2,
                value: settings.get_int('eye-width'),
            }),
        });
        eyeWidthRow.connect('notify::value', () => {
            settings.set_int('eye-width', eyeWidthRow.get_value());
        });
        sizeGroup.add(eyeWidthRow);

        // 目の高さ
        const eyeHeightRow = new Adw.SpinRow({
            title: _('Eye Height'),
            subtitle: _('Height of each eye in pixels'),
            adjustment: new Gtk.Adjustment({
                lower: 8,
                upper: 30,
                step_increment: 2,
                value: settings.get_int('eye-height'),
            }),
        });
        eyeHeightRow.connect('notify::value', () => {
            settings.set_int('eye-height', eyeHeightRow.get_value());
        });
        sizeGroup.add(eyeHeightRow);

        // 目の間隔
        const eyeSpacingRow = new Adw.SpinRow({
            title: _('Eye Spacing'),
            subtitle: _('Space between eyes in pixels'),
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 20,
                step_increment: 1,
                value: settings.get_int('eye-spacing'),
            }),
        });
        eyeSpacingRow.connect('notify::value', () => {
            settings.set_int('eye-spacing', eyeSpacingRow.get_value());
        });
        sizeGroup.add(eyeSpacingRow);

        // 瞳の比率
        const pupilRatioRow = new Adw.SpinRow({
            title: _('Pupil Size Ratio'),
            subtitle: _('Pupil size relative to eye (0.1 - 0.5)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.1,
                upper: 0.5,
                step_increment: 0.05,
                value: settings.get_double('pupil-ratio'),
            }),
        });
        pupilRatioRow.connect('notify::value', () => {
            settings.set_double('pupil-ratio', pupilRatioRow.get_value());
        });
        sizeGroup.add(pupilRatioRow);

        // === パフォーマンス設定グループ ===
        const perfGroup = new Adw.PreferencesGroup({
            title: _('Performance'),
        });
        page.add(perfGroup);

        // 更新間隔（ミリ秒）
        const intervalRow = new Adw.SpinRow({
            title: _('Update Interval'),
            subtitle: _('Milliseconds between updates (lower = smoother)'),
            adjustment: new Gtk.Adjustment({
                lower: 16,    // ~60 FPS
                upper: 500,   // 2 FPS
                step_increment: 10,
                value: settings.get_int('update-interval'),
            }),
        });
        intervalRow.connect('notify::value', () => {
            settings.set_int('update-interval', intervalRow.get_value());
        });
        perfGroup.add(intervalRow);

        // === 色設定グループ ===
        const colorGroup = new Adw.PreferencesGroup({
            title: _('Colors'),
        });
        page.add(colorGroup);

        // 白目の色
        const eyeColorRow = new Adw.EntryRow({
            title: _('Eye Color'),
        });
        eyeColorRow.set_text(settings.get_string('eye-color'));
        eyeColorRow.connect('changed', () => {
            settings.set_string('eye-color', eyeColorRow.get_text());
        });
        colorGroup.add(eyeColorRow);

        // 瞳の色
        const pupilColorRow = new Adw.EntryRow({
            title: _('Pupil Color'),
        });
        pupilColorRow.set_text(settings.get_string('pupil-color'));
        pupilColorRow.connect('changed', () => {
            settings.set_string('pupil-color', pupilColorRow.get_text());
        });
        colorGroup.add(pupilColorRow);

        // アウトラインの色
        const outlineColorRow = new Adw.EntryRow({
            title: _('Outline Color'),
        });
        outlineColorRow.set_text(settings.get_string('outline-color'));
        outlineColorRow.connect('changed', () => {
            settings.set_string('outline-color', outlineColorRow.get_text());
        });
        colorGroup.add(outlineColorRow);
    }
}
