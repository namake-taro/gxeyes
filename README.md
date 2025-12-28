# GXEyes (GNOME shell extension)

[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-45%20%7C%2046%20%7C%2047%20%7C%2048-blue)](https://extensions.gnome.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**GXEyes** is a GNOME Shell extension that recreates the classic UNIX `xeyes` command. It displays eyes in the top bar that follow your mouse cursor in real-time.

![Screenshot](./screenshot.png)

## Features

- Two eyes that track your mouse pointer in real-time
- Event-driven design using PointerWatcher (zero CPU usage when mouse is idle)
- Customizable appearance via settings
  - Eye size and spacing
  - Pupil size ratio
  - Colors (eye, pupil, outline)
  - Update interval

## Supported Versions

- GNOME Shell 45, 46, 47, 48

## Installation

### From GNOME Extensions (Recommended)

Install with one click from [GNOME Extensions](https://extensions.gnome.org/extension/9066/gxeyes/).

### Manual Installation

1. Clone the repository

```bash
git clone https://github.com/namake-taro/gxeyes.git
cd gxeyes
```

2. Copy to extensions directory

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/gxeyes@namake-taro.github.io
cp -r ./* ~/.local/share/gnome-shell/extensions/gxeyes@namake-taro.github.io/
```

3. Compile schemas

```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/gxeyes@namake-taro.github.io/schemas/
```

4. Restart GNOME Shell
   - **Wayland**: Log out and log back in
   - **X11**: Press `Alt+F2`, type `r`, press `Enter`

5. Enable the extension

```bash
gnome-extensions enable gxeyes@namake-taro.github.io
```

Or enable it from the Extensions app.

## Configuration

Open settings from the Extensions app, or run:

```bash
gnome-extensions prefs gxeyes@namake-taro.github.io
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
gnome-extensions disable gxeyes@namake-taro.github.io
rm -rf ~/.local/share/gnome-shell/extensions/gxeyes@namake-taro.github.io
```

## License

GPL-3.0

## Author

[@namake-taro](https://github.com/namake-taro)
