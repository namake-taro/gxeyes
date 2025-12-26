import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GXEyesPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'preferences-system-symbolic',
        });
        window.add(page);

        const sizeGroup = new Adw.PreferencesGroup({
            title: _('Size Settings'),
        });
        page.add(sizeGroup);

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

        const perfGroup = new Adw.PreferencesGroup({
            title: _('Performance'),
        });
        page.add(perfGroup);

        const intervalRow = new Adw.SpinRow({
            title: _('Pointer Tracking Interval'),
            subtitle: _('Callback interval when pointer moves (ms). No callbacks while idle.'),
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 500,
                step_increment: 10,
                value: settings.get_int('update-interval'),
            }),
        });
        intervalRow.connect('notify::value', () => {
            settings.set_int('update-interval', intervalRow.get_value());
        });
        perfGroup.add(intervalRow);

        const colorGroup = new Adw.PreferencesGroup({
            title: _('Colors'),
        });
        page.add(colorGroup);

        const eyeColorRow = new Adw.EntryRow({
            title: _('Eye Color'),
        });
        eyeColorRow.set_text(settings.get_string('eye-color'));
        eyeColorRow.connect('changed', () => {
            settings.set_string('eye-color', eyeColorRow.get_text());
        });
        colorGroup.add(eyeColorRow);

        const pupilColorRow = new Adw.EntryRow({
            title: _('Pupil Color'),
        });
        pupilColorRow.set_text(settings.get_string('pupil-color'));
        pupilColorRow.connect('changed', () => {
            settings.set_string('pupil-color', pupilColorRow.get_text());
        });
        colorGroup.add(pupilColorRow);

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
