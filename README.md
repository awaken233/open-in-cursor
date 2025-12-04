# Open in Cursor / 在 Cursor 中打开

[English](#english) | [中文](#中文)

---

## English

### 📖 Description

An Obsidian plugin that adds a hotkey to open the current file in Cursor IDE (or other VSCode-based IDEs) and automatically jump to the cursor position. Perfect for seamless integration between Obsidian note-taking and code editing workflows.

### ✨ Features

-   **Quick Access**: Open current file in Cursor IDE (or other VSCode-based IDEs) with a simple hotkey, and jump to the cursor position.
-   **Multi-IDE Support**: Compatible with Cursor, VSCode, Kiro, and other VSCode-based editors
-   **Cross-Platform**: Works on Windows, macOS, and Linux

You can set a custom hotkey in Obsidian's Hotkeys settings. You can also use the command palette: "Open in Cursor".
Note: No default hotkey is provided to avoid conflicts with existing user configurations.

### 🚀 Installation

#### Method 1: Community Plugin Store (Recommended)

1. Open Obsidian Settings
2. Go to `Community plugins` and disable Safe mode
3. Browse community plugins and search for "Open in Cursor"
4. Install and enable the plugin

#### Method 2: Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/awaken233/open-in-cursor/releases) (ZIP)
2. Extract the files to `VaultFolder/.obsidian/plugins/`
3. Reload Obsidian and enable the plugin in Settings

### ⚙️ Settings

-   **Cursor Command Path**: Customize the IDE executable path
-   **Notifications**: Toggle success/error notifications
-   **Debug Mode**: Enable for troubleshooting

#### Supported IDEs

You can configure the plugin to work with different VSCode-based IDEs by setting the command path:

**Cursor:**
```
/Applications/Cursor.app/Contents/Resources/app/bin/cursor
```

**Kiro:**
```
/Applications/Kiro.app/Contents/Resources/app/bin/code
```

**VSCode:**
```
/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code
```

Or simply use `cursor`, `code`, or `kiro` if they are in your system PATH.

---

## 中文

### 📖 简介

这是一个 Obsidian 插件，可以通过快捷键在 Cursor IDE（或其他类 VSCode IDE）中打开当前文件并自动跳转到光标位置。完美整合 Obsidian 笔记记录和代码编辑工作流程。

### ✨ 功能特性

-   **快速访问**：通过快捷键在 Cursor IDE（或其他类 VSCode IDE）中打开当前文件, 并跳转到光标位置
-   **多 IDE 支持**：兼容 Cursor、VSCode、Kiro 等所有基于 VSCode 的编辑器
-   **跨平台支持**：支持 Windows、macOS 和 Linux

您可以在 Obsidian 的热键设置中自定义快捷键。您也可以使用命令面板："Open in Cursor"。
注意：为避免与现有用户配置冲突，不提供默认快捷键。

### 🚀 安装方法

#### 方法一：社区插件商店 (推荐)

1. 打开 Obsidian 设置
2. 进入 `第三方插件` 并关闭安全模式
3. 浏览社区插件并搜索 "Open in Cursor"
4. 安装并启用插件

#### 方法二：手动安装

1. 从 [GitHub Releases](https://github.com/awaken233/open-in-cursor/releases) 下载最新版本 ZIP
2. 解压文件到 `VaultFolder/.obsidian/plugins/`
3. 重新加载 Obsidian 并在设置中启用该插件

### ⚙️ 设置选项

-   **Cursor 命令路径**：自定义 IDE 可执行文件路径
-   **通知设置**：切换成功/错误通知
-   **调试模式**：启用以进行故障排除

#### 支持的 IDE

您可以通过设置命令路径来配置插件使用不同的类 VSCode IDE：

**Cursor：**
```
/Applications/Cursor.app/Contents/Resources/app/bin/cursor
```

**Kiro：**
```
/Applications/Kiro.app/Contents/Resources/app/bin/code
```

**VSCode：**
```
/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code
```

或者如果它们在系统 PATH 中，可以直接使用 `cursor`、`code` 或 `kiro`。
