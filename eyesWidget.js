import GObject from 'gi://GObject';
import St from 'gi://St';

/**
 * EyesWidget - St.DrawingArea + Cairo を使用した目の描画コンポーネント
 * 古典的なxeyesの動作を再現
 */
export const EyesWidget = GObject.registerClass({
    GTypeName: 'XEyesWidget',
}, class EyesWidget extends St.DrawingArea {
    _init(settings) {
        this._settings = settings;

        // 設定値を読み込み
        this._eyeWidth = settings.get_int('eye-width');
        this._eyeHeight = settings.get_int('eye-height');
        this._eyeSpacing = settings.get_int('eye-spacing');
        this._pupilRatio = settings.get_double('pupil-ratio');

        // トータル幅: 目×2 + 間隔
        const totalWidth = this._eyeWidth * 2 + this._eyeSpacing;

        super._init({
            width: totalWidth,
            height: this._eyeHeight,
            style_class: 'xeyes-widget',
        });

        // 瞳の位置（各目ごと、目の中心からのオフセット）
        this._leftPupil = {x: 0, y: 0};
        this._rightPupil = {x: 0, y: 0};

        // ウィジェットのグローバル座標（キャッシュ）
        this._widgetX = 0;
        this._widgetY = 0;

        this.connect('repaint', this._onRepaint.bind(this));
    }

    /**
     * マウス位置に基づいて瞳の位置を更新
     * @param {number} mouseX - マウスのX座標（グローバル）
     * @param {number} mouseY - マウスのY座標（グローバル）
     */
    updatePupils(mouseX, mouseY) {
        // 瞳の可動範囲（目の半径 - 瞳の半径）
        const eyeRadiusX = this._eyeWidth / 2;
        const eyeRadiusY = this._eyeHeight / 2;
        const pupilRadius = Math.min(eyeRadiusX, eyeRadiusY) * this._pupilRatio;
        const maxMovement = Math.max(1, Math.min(eyeRadiusX, eyeRadiusY) - pupilRadius - 1);

        // ウィジェットのグローバル座標を取得
        let widgetX = this._widgetX;
        let widgetY = this._widgetY;
        try {
            // GJSでは [x, y] を返す
            const pos = this.get_transformed_position();
            if (pos && pos.length >= 2) {
                widgetX = pos[0];
                widgetY = pos[1];
                this._widgetX = widgetX;
                this._widgetY = widgetY;
            }
        } catch (e) {
            // 座標取得に失敗した場合は前回の値を使用
        }

        // 左目の中心座標（グローバル）
        const leftEyeCenterX = widgetX + eyeRadiusX;
        const leftEyeCenterY = widgetY + eyeRadiusY;

        // 右目の中心座標（グローバル）
        const rightEyeCenterX = widgetX + this._eyeWidth + this._eyeSpacing + eyeRadiusX;
        const rightEyeCenterY = widgetY + eyeRadiusY;

        // 左目の瞳位置を計算
        this._leftPupil = this._calculatePupilPosition(
            mouseX - leftEyeCenterX,
            mouseY - leftEyeCenterY,
            maxMovement
        );

        // 右目の瞳位置を計算
        this._rightPupil = this._calculatePupilPosition(
            mouseX - rightEyeCenterX,
            mouseY - rightEyeCenterY,
            maxMovement
        );

        this.queue_repaint();
    }

    /**
     * xeyes アルゴリズム：瞳の位置を計算
     * @param {number} dx - マウスと目の中心のX距離
     * @param {number} dy - マウスと目の中心のY距離
     * @param {number} maxRadius - 瞳の最大移動半径
     * @returns {{x: number, y: number}} 瞳のオフセット
     */
    _calculatePupilPosition(dx, dy, maxRadius) {
        const distance = Math.sqrt(dx * dx + dy * dy);

        // NaN や無効な値のチェック
        if (!isFinite(distance) || !isFinite(dx) || !isFinite(dy)) {
            return {x: 0, y: 0};
        }

        // distance が 0 の場合（マウスが目の中心にある場合）
        if (distance === 0) {
            return {x: 0, y: 0};
        }

        if (distance <= maxRadius) {
            // マウスが目の近くにある場合、そのまま追従
            return {x: dx, y: dy};
        } else {
            // マウスが遠い場合、方向を維持しつつ最大半径に制限
            const ratio = maxRadius / distance;
            return {x: dx * ratio, y: dy * ratio};
        }
    }

    /**
     * 描画コールバック
     */
    _onRepaint(area) {
        const cr = area.get_context();
        const [width, height] = area.get_surface_size();

        // 色の取得
        const eyeColor = this._parseColor(this._settings.get_string('eye-color'));
        const pupilColor = this._parseColor(this._settings.get_string('pupil-color'));
        const outlineColor = this._parseColor(this._settings.get_string('outline-color'));

        // 瞳の半径
        const eyeRadiusX = this._eyeWidth / 2;
        const eyeRadiusY = this._eyeHeight / 2;
        const pupilRadius = Math.min(eyeRadiusX, eyeRadiusY) * this._pupilRatio;

        // 左目を描画
        this._drawEye(
            cr,
            eyeRadiusX,           // 左目の中心X
            height / 2,           // 中心Y
            eyeRadiusX,           // 半径X
            eyeRadiusY,           // 半径Y
            this._leftPupil,
            pupilRadius,
            eyeColor,
            pupilColor,
            outlineColor
        );

        // 右目を描画
        this._drawEye(
            cr,
            this._eyeWidth + this._eyeSpacing + eyeRadiusX,  // 右目の中心X
            height / 2,
            eyeRadiusX,
            eyeRadiusY,
            this._rightPupil,
            pupilRadius,
            eyeColor,
            pupilColor,
            outlineColor
        );

        cr.$dispose();
    }

    /**
     * 単一の目を描画
     */
    _drawEye(cr, centerX, centerY, radiusX, radiusY, pupilOffset, pupilRadius, eyeColor, pupilColor, outlineColor) {
        // pupilOffset の安全な値を取得
        const px = (pupilOffset && isFinite(pupilOffset.x)) ? pupilOffset.x : 0;
        const py = (pupilOffset && isFinite(pupilOffset.y)) ? pupilOffset.y : 0;

        // 白目（楕円）
        cr.save();
        cr.translate(centerX, centerY);
        cr.scale(radiusX, radiusY);
        cr.arc(0, 0, 1, 0, 2 * Math.PI);
        cr.restore();

        // 白目の塗りつぶし
        cr.setSourceRGBA(eyeColor.r, eyeColor.g, eyeColor.b, eyeColor.a);
        cr.fillPreserve();

        // アウトライン
        cr.setSourceRGBA(outlineColor.r, outlineColor.g, outlineColor.b, outlineColor.a);
        cr.setLineWidth(1.5);
        cr.stroke();

        // 瞳（円）- 新しいパスを開始
        cr.newPath();
        cr.arc(centerX + px, centerY + py, pupilRadius, 0, 2 * Math.PI);
        cr.closePath();
        cr.setSourceRGBA(pupilColor.r, pupilColor.g, pupilColor.b, pupilColor.a);
        cr.fill();
    }

    /**
     * 色文字列をパースしてRGBAオブジェクトに変換
     * @param {string} colorString - 'rgba(r,g,b,a)' または '#RRGGBB' 形式
     * @returns {{r: number, g: number, b: number, a: number}}
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
        // デフォルト: 白
        return {r: 1.0, g: 1.0, b: 1.0, a: 1.0};
    }

    /**
     * 設定変更時の更新
     */
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
