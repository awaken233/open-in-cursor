import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { execFile, ExecException } from "child_process";
import { platform } from "os";
import { join } from "path";

// Remember to rename these classes and interfaces!

interface OpenInCursorSettings {
	cursorCommand: string;
	enableNotifications: boolean;
	hotkey: string;
	debugMode: boolean;
}

const DEFAULT_SETTINGS: OpenInCursorSettings = {
	cursorCommand: "cursor",
	enableNotifications: true,
	hotkey: "",
	debugMode: false,
};

export default class OpenInCursorPlugin extends Plugin {
	settings: OpenInCursorSettings;

	async onload() {
		await this.loadSettings();

		// Always attempt to auto-detect cursor command on load
		await this.autoDetectCursorCommand();

		// Register main command
		this.addCommand({
			id: "open-in-cursor",
			name: "Open",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.openInCursor(editor, view);
			},
		});

		// Add settings tab
		this.addSettingTab(new OpenInCursorSettingTab(this.app, this));

		// Show load message
		if (this.settings.enableNotifications) {
			new Notice("Open in cursor plugin loaded");
		}
	}

	onunload() {
		if (this.settings.enableNotifications) {
			new Notice("Open in cursor plugin unloaded");
		}
	}

	async openInCursor(editor: Editor, view: MarkdownView) {
		try {
			// Get current active file
			const activeFile = this.app.workspace.getActiveFile();
			if (!activeFile) {
				new Notice("No active file found");
				return;
			}

			// Get cursor position
			const cursor = editor.getCursor();
			const lineNumber = cursor.line + 1; // Convert to 1-based index
			const columnNumber = cursor.ch + 1; // Convert to 1-based index

			// Get full file path using Obsidian's official API
			const adapter = this.app.vault.adapter;
			const vaultPath = adapter.getBasePath?.() || "";
			const filePath = vaultPath
				? join(vaultPath, activeFile.path)
				: activeFile.path;

			// Debug file path information
			if (this.settings.debugMode) {
				console.log("Active file:", activeFile.path);
				console.log("Full file path:", filePath);
				console.log("Line:Column:", `${lineNumber}:${columnNumber}`);
			}

			// Build and execute command
			const command = this.settings.cursorCommand;

			// Ensure file path is properly quoted for shell execution
			const quotedFilePath = `"${filePath}"`;
			const argsQuoted = [
				`--goto`,
				`${quotedFilePath}:${lineNumber}:${columnNumber}`,
			];

			// Debug logging
			if (this.settings.debugMode) {
				console.log(
					"Open in Cursor command:",
					command,
					argsQuoted.join(" ")
				);
			}

			// Execute command using execFile for better performance and security
			execFile(
				command,
				argsQuoted,
				(
					error: ExecException | null,
					stdout: string,
					stderr: string
				) => {
					if (error) {
						console.error("Error opening file in Cursor:", error);
						new Notice(
							`Failed to open in Cursor: ${error.message}`
						);
						return;
					}

					if (this.settings.debugMode) {
						console.log("Cursor execution stdout:", stdout);
						console.log("Cursor execution stderr:", stderr);
					}

					if (this.settings.enableNotifications) {
						const positionInfo = ` (${lineNumber}:${columnNumber})`;
						new Notice(
							`Opened in Cursor: ${activeFile.name}${positionInfo}`
						);
					}
				}
			);
		} catch (e: unknown) {
			const error = e as Error;
			console.error("Error in openInCursor:", error);
			new Notice(`Error: ${error.message}`);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Check if Cursor is available
	async checkCursorAvailability(): Promise<boolean> {
		return new Promise((resolve) => {
			execFile(
				this.settings.cursorCommand,
				["--version"],
				(error: ExecException | null) => {
					resolve(!error);
				}
			);
		});
	}

	// Auto-detect cursor command
	async autoDetectCursorCommand(): Promise<void> {
		const platformCommand = this.getPlatformSpecificCommand();
		if (!platformCommand) return; // Unsupported platform

		const isAvailable = await new Promise<boolean>((resolve) => {
			execFile(
				platformCommand,
				["--version"],
				(error: ExecException | null) => {
					resolve(!error);
				}
			);
		});

		if (
			isAvailable &&
			this.settings.cursorCommand === DEFAULT_SETTINGS.cursorCommand
		) {
			this.settings.cursorCommand = platformCommand;
			await this.saveSettings();
			if (this.settings.debugMode) {
				console.log("Auto-detected Cursor command:", platformCommand);
			}
		}
	}

	// Get platform-specific command
	getPlatformSpecificCommand(): string | null {
		switch (platform()) {
			case "win32":
				return "cursor"; // Assume 'cursor' is in PATH
			case "darwin":
				// Standard location for Cursor on macOS
				return "/Applications/Cursor.app/Contents/Resources/app/bin/cursor";
			case "linux":
				return "cursor"; // Assume 'cursor' is in PATH
			default:
				if (this.settings.debugMode) {
					console.log("Unsupported platform:", platform());
				}
				return null;
		}
	}
}

class OpenInCursorSettingTab extends PluginSettingTab {
	plugin: OpenInCursorPlugin;

	constructor(app: App, plugin: OpenInCursorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Basic Settings Section
		new Setting(containerEl).setName("Basic Settings").setHeading();

		new Setting(containerEl)
			.setName("Cursor command")
			.setDesc(
				'The command to run Cursor IDE (e.g., "cursor" or full path)'
			)
			.addText((text) =>
				text
					.setPlaceholder("cursor")
					.setValue(this.plugin.settings.cursorCommand)
					.onChange(async (value) => {
						this.plugin.settings.cursorCommand = value;
						await this.plugin.saveSettings();
					})
			);

		// User Interface Section
		new Setting(containerEl).setName("User Interface").setHeading();

		new Setting(containerEl)
			.setName("Enable notifications")
			.setDesc("Show notifications when opening files in Cursor")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableNotifications)
					.onChange(async (value) => {
						this.plugin.settings.enableNotifications = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Debug mode")
			.setDesc("Enable debug logging for troubleshooting")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.debugMode)
					.onChange(async (value) => {
						this.plugin.settings.debugMode = value;
						await this.plugin.saveSettings();
					})
			);

		// Testing Section
		new Setting(containerEl).setName("Testing").setHeading();

		new Setting(containerEl)
			.setName("Test cursor connection")
			.setDesc("Test if Cursor IDE is available and working")
			.addButton((button) =>
				button
					.setButtonText("Test Connection")
					.setCta()
					.onClick(async () => {
						const isAvailable =
							await this.plugin.checkCursorAvailability();
						if (isAvailable) {
							new Notice("✅ Cursor IDE is available!");
						} else {
							new Notice(
								"❌ Cursor IDE not found. Please check your command in settings."
							);
						}
					})
			);

		// Usage Information Section
		new Setting(containerEl).setName("Usage").setHeading();

		const usageDiv = containerEl.createEl("div", {
			cls: "open-in-cursor-usage",
		});
		usageDiv.createEl("p", {
			text: 'Use the command palette: "Open in Cursor"',
		});
		usageDiv.createEl("p", {
			text: "Note: You can set a custom hotkey in Obsidian's Hotkeys settings.",
		});
		usageDiv.createEl("p", {
			text: "No default hotkey is provided to avoid conflicts with existing configurations.",
		});
	}
}
