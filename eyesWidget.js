import GObject from 'gi://GObject';
import St from 'gi://St';

export const EyesWidget = GObject.registerClass({
    GTypeName: 'GXEyesWidget',
}, class EyesWidget extends St.DrawingArea {
    _init(settings) {
        this._settings = settings;

        this._eyeWidth = settings.get_int('eye-width');
        this._eyeHeight = settings.get_int('eye-height');
        this._eyeSpacing = settings.get_int('eye-spacing');
        this._pupilRatio = settings.get_double('pupil-ratio');

        const totalWidth = this._eyeWidth * 2 + this._eyeSpacing;

        super._init({
            width: totalWidth,
            height: this._eyeHeight,
            style_class: 'gxeyes-widget',
        });

        this._leftPupil = {x: 0, y: 0};
        this._rightPupil = {x: 0, y: 0};

        this._widgetX = 0;
        this._widgetY = 0;

        this.connect('repaint', this._onRepaint.bind(this));
    }

    updatePupils(mouseX, mouseY) {
        const eyeRadiusX = this._eyeWidth / 2;
        const eyeRadiusY = this._eyeHeight / 2;
        const pupilRadius = Math.min(eyeRadiusX, eyeRadiusY) * this._pupilRatio;
        // Pupil movement range = eye radius - pupil radius
        const maxMovement = Math.max(1, Math.min(eyeRadiusX, eyeRadiusY) - pupilRadius - 1);

        let widgetX = this._widgetX;
        let widgetY = this._widgetY;
        try {
            // GJS returns [x, y] array
            const pos = this.get_transformed_position();
            if (pos && pos.length >= 2) {
                widgetX = pos[0];
                widgetY = pos[1];
                this._widgetX = widgetX;
                this._widgetY = widgetY;
            }
        } catch (e) {
            // Use cached position on failure
        }

        const leftEyeCenterX = widgetX + eyeRadiusX;
        const leftEyeCenterY = widgetY + eyeRadiusY;
        const rightEyeCenterX = widgetX + this._eyeWidth + this._eyeSpacing + eyeRadiusX;
        const rightEyeCenterY = widgetY + eyeRadiusY;

        this._leftPupil = this._calculatePupilPosition(
            mouseX - leftEyeCenterX,
            mouseY - leftEyeCenterY,
            maxMovement
        );
        this._rightPupil = this._calculatePupilPosition(
            mouseX - rightEyeCenterX,
            mouseY - rightEyeCenterY,
            maxMovement
        );

        this.queue_repaint();
    }

    /**
     * Calculate pupil position using xeyes algorithm
     */
    _calculatePupilPosition(dx, dy, maxRadius) {
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!isFinite(distance) || !isFinite(dx) || !isFinite(dy) || distance === 0) {
            return {x: 0, y: 0};
        }

        if (distance <= maxRadius) {
            return {x: dx, y: dy};
        }
        // Clamp to max radius while preserving direction
        const ratio = maxRadius / distance;
        return {x: dx * ratio, y: dy * ratio};
    }

    _onRepaint(area) {
        const cr = area.get_context();
        const [width, height] = area.get_surface_size();

        const eyeColor = this._parseColor(this._settings.get_string('eye-color'));
        const pupilColor = this._parseColor(this._settings.get_string('pupil-color'));
        const outlineColor = this._parseColor(this._settings.get_string('outline-color'));

        const eyeRadiusX = this._eyeWidth / 2;
        const eyeRadiusY = this._eyeHeight / 2;
        const pupilRadius = Math.min(eyeRadiusX, eyeRadiusY) * this._pupilRatio;

        this._drawEye(cr, eyeRadiusX, height / 2, eyeRadiusX, eyeRadiusY,
            this._leftPupil, pupilRadius, eyeColor, pupilColor, outlineColor);

        this._drawEye(cr, this._eyeWidth + this._eyeSpacing + eyeRadiusX, height / 2,
            eyeRadiusX, eyeRadiusY, this._rightPupil, pupilRadius,
            eyeColor, pupilColor, outlineColor);

        cr.$dispose();
    }

    _drawEye(cr, centerX, centerY, radiusX, radiusY, pupilOffset, pupilRadius, eyeColor, pupilColor, outlineColor) {
        const px = (pupilOffset && isFinite(pupilOffset.x)) ? pupilOffset.x : 0;
        const py = (pupilOffset && isFinite(pupilOffset.y)) ? pupilOffset.y : 0;

        cr.save();
        cr.translate(centerX, centerY);
        cr.scale(radiusX, radiusY);
        cr.arc(0, 0, 1, 0, 2 * Math.PI);
        cr.restore();

        cr.setSourceRGBA(eyeColor.r, eyeColor.g, eyeColor.b, eyeColor.a);
        cr.fillPreserve();
        cr.setSourceRGBA(outlineColor.r, outlineColor.g, outlineColor.b, outlineColor.a);
        cr.setLineWidth(1.5);
        cr.stroke();

        cr.newPath();
        cr.arc(centerX + px, centerY + py, pupilRadius, 0, 2 * Math.PI);
        cr.closePath();
        cr.setSourceRGBA(pupilColor.r, pupilColor.g, pupilColor.b, pupilColor.a);
        cr.fill();
    }

    /**
     * Parse color string ('rgba(r,g,b,a)' or '#RRGGBB')
     */
    _parseColor(colorString) {
        if (colorString.startsWith('rgba')) {
            const match = colorString.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*([\d.]+)?\s*\)/);
            if (match) {
                return {
                    r: parseInt(match[1]) / 255,
                    g: parseInt(match[2]) / 255,
                    b: parseInt(match[3]) / 255,
                    a: match[4] ? parseFloat(match[4]) : 1.0,
                };
            }
        } else if (colorString.startsWith('#')) {
            const hex = colorString.slice(1);
            return {
                r: parseInt(hex.slice(0, 2), 16) / 255,
                g: parseInt(hex.slice(2, 4), 16) / 255,
                b: parseInt(hex.slice(4, 6), 16) / 255,
                a: 1.0,
            };
        }
        return {r: 1.0, g: 1.0, b: 1.0, a: 1.0};
    }

    updateSettings() {
        this._eyeWidth = this._settings.get_int('eye-width');
        this._eyeHeight = this._settings.get_int('eye-height');
        this._eyeSpacing = this._settings.get_int('eye-spacing');
        this._pupilRatio = this._settings.get_double('pupil-ratio');

        const totalWidth = this._eyeWidth * 2 + this._eyeSpacing;
        this.set_width(totalWidth);
        this.set_height(this._eyeHeight);

        this.queue_repaint();
    }
});
