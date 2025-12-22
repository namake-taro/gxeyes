# GNOME XEyes

A GNOME Shell extension that recreates the classic UNIX `xeyes` command. Displays eyes in the top bar that follow your mouse cursor.

![Screenshot](./screenshot.png)

## Features

- Two eyes that track your mouse pointer in real-time
- Resource-efficient design (automatically pauses updates when idle)
- Customizable appearance via settings
  - Eye size and spacing
  - Pupil size ratio
  - Colors (eye, pupil, outline)
  - Update interval

## Supported Versions

- GNOME Shell 45, 46, 47, 48

## Installation

### From GNOME Extensions (Recommended)

<!-- Add URL after publishing
Install with one click from [GNOME Extensions](https://extensions.gnome.org/extension/XXXX/gnome-xeyes/).
-->

*Coming soon*

### Manual Installation

1. Clone the repository

```bash
git clone https://github.com/namake-taro/gnome-xeyes.git
cd gnome-xeyes
```

2. Copy to extensions directory

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/gnome-xeyes@namake-taro.github.io
cp -r ./* ~/.local/share/gnome-shell/extensions/gnome-xeyes@namake-taro.github.io/
```

3. Compile schemas

```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/gnome-xeyes@namake-taro.github.io/schemas/
```

4. Restart GNOME Shell
   - **Wayland**: Log out and log back in
   - **X11**: Press `Alt+F2`, type `r`, press `Enter`

5. Enable the extension

```bash
gnome-extensions enable gnome-xeyes@namake-taro.github.io
```

Or enable it from the Extensions app.

## Configuration

Open settings from the Extensions app, or run:

```bash
gnome-extensions prefs gnome-xeyes@namake-taro.github.io
```

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Eye Width | Width of each eye (pixels) | 20 |
| Eye Height | Height of each eye (pixels) | 24 |
| Eye Spacing | Space between eyes (pixels) | 4 |
| Pupil Ratio | Pupil size relative to eye | 0.35 |
| Update Interval | Mouse tracking interval (ms) | 100 |
| Eye Color | Background color of eyes | White |
| Pupil Color | Color of pupils | Black |
| Outline Color | Eye outline color | Black (80% opacity) |

## Uninstall

```bash
gnome-extensions disable gnome-xeyes@namake-taro.github.io
rm -rf ~/.local/share/gnome-shell/extensions/gnome-xeyes@namake-taro.github.io
```

## License

GPL-3.0

## Author

[@namake-taro](https://github.com/namake-taro)
