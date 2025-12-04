# Open in Cursor 插件 IDE 兼容性修复报告 v1.0.8

## 修复内容

### 1. 多 IDE 引号处理兼容性修复

-   修复了 Kiro IDE 打开文件时文件名末尾出现多余双引号的问题
-   实现了针对不同 IDE 的条件性引号处理逻辑
-   保持了 Cursor IDE 的正常功能，同时兼容 VSCode 系列 IDE（Kiro、VSCode 等）

### 2. 问题分析

**原始问题：**

-   使用 Kiro IDE 时，打开的文件名末尾会多出一个双引号 `"`
-   Cursor IDE 中不会出现此问题

**根本原因：**

-   代码在第 95 行手动给文件路径添加了双引号：`const quotedFilePath = \`"${filePath}"\``
-   `execFile` 函数会将参数直接传递给目标进程，不经过 shell 解析
-   引号被当作参数值的一部分传递给 IDE
-   Cursor IDE 内部处理了这些引号，但 Kiro IDE（基于 VSCode）没有处理

**日志示例：**

```
Open in Cursor command: /Applications/Kiro.app/Contents/Resources/app/bin/code --goto "/Users/ve/Documents/Obsidian Vault/wiz/SpringCloud/SpringCloudAlibaba/Nacos/小白也能懂的Nacos服务模型.md":118:219
```

### 3. 代码变更详情

**修改位置：** `main.ts` 第 94-101 行

**修改前：**

```typescript
// Build and execute command
const command = this.settings.cursorCommand;

// Ensure file path is properly quoted for shell execution
const quotedFilePath = `"${filePath}"`;
const argsQuoted = [
	`--goto`,
	`${quotedFilePath}:${lineNumber}:${columnNumber}`,
];
```

**修改后：**

```typescript
// Build and execute command
const command = this.settings.cursorCommand;

// Conditional quote handling for different IDEs
// Cursor IDE requires quotes, but VSCode-based IDEs (like Kiro) don't
const isCursorIDE = command.toLowerCase().includes("cursor");
const pathArg = isCursorIDE ? `"${filePath}"` : filePath;
const argsQuoted = [`--goto`, `${pathArg}:${lineNumber}:${columnNumber}`];
```

**修改说明：**

-   添加了 IDE 类型检测：通过检查命令中是否包含 "cursor"（不区分大小写）
-   Cursor IDE：保持添加引号的行为 → `"文件路径":行:列`
-   其他 IDE：不添加引号 → `文件路径:行:列`
-   兼容所有基于 VSCode 架构的 IDE（Kiro、VSCode、Code - OSS 等）

## 测试步骤

### 1. 重新加载插件

-   在 Obsidian 中禁用并重新启用 "Open in Cursor" 插件
-   或者重启 Obsidian

### 2. 启用调试模式

-   进入插件设置
-   启用 "Debug mode" 选项
-   启用 "Enable notifications" 选项

### 3. 测试 Kiro IDE

**配置：**

-   Cursor command: `/Applications/Kiro.app/Contents/Resources/app/bin/code`

**测试用例：**

#### 用例 1：普通文件名（无空格）

-   文件：`test.md`
-   预期：正常打开，文件名正确，无多余引号

#### 用例 2：包含空格的文件名

-   文件：`test file with spaces.md`
-   预期：正常打开，文件名完整，无多余引号

#### 用例 3：包含中文的文件名

-   文件：`小白也能懂的Nacos服务模型.md`
-   预期：正常打开，中文显示正确，无多余引号

#### 用例 4：包含特殊字符的文件名

-   文件：`test-file_v1.0.md`
-   预期：正常打开，特殊字符保留

#### 用例 5：深层目录结构

-   路径：`/Users/ve/Documents/Obsidian Vault/wiz/SpringCloud/SpringCloudAlibaba/Nacos/test.md`
-   预期：正常打开，路径完整

#### 用例 6：行号列号定位

-   所有上述用例都需验证：光标能否准确定位到指定行号和列号

### 4. 回归测试 Cursor IDE

**配置：**

-   Cursor command: `/Applications/Cursor.app/Contents/Resources/app/bin/cursor` 或 `cursor`

**测试用例：**

-   执行与 Kiro IDE 相同的测试用例
-   确认 Cursor IDE 功能不受影响
-   验证文件能正常打开且光标定位准确

### 5. 验证调试信息

-   打开开发者控制台 (Cmd + Shift + I)
-   查看控制台输出的命令信息
-   确认不同 IDE 的参数格式正确：
    -   Cursor: `--goto "/path/to/file.md":118:219`
    -   Kiro: `--goto /path/to/file.md:118:219`

## 预期结果

### Kiro IDE

-   ✅ 文件名末尾不再出现多余的双引号
-   ✅ 包含空格的文件名能正常打开
-   ✅ 包含中文、特殊字符的文件名能正常打开
-   ✅ 行号、列号定位功能正常
-   ✅ 深层目录结构路径处理正确

### Cursor IDE（回归测试）

-   ✅ 所有原有功能正常工作
-   ✅ 文件能正确打开并跳转到指定位置
-   ✅ 不出现空白文档问题

### 其他 VSCode 系列 IDE

-   ✅ VSCode、Code - OSS 等 IDE 均可正常使用
-   ✅ 命令检测逻辑准确（不包含 "cursor" 的命令不添加引号）

## 故障排除

如果问题仍然存在：

### 1. 检查 IDE 命令配置

-   确认 IDE 已正确安装
-   在插件设置中测试 "Test cursor connection"
-   必要时手动设置完整的命令路径

### 2. 检查文件路径

-   确认文件路径格式正确
-   检查 vault 路径是否正确获取
-   验证文件确实存在于指定位置

### 3. 查看调试日志

-   启用 Debug mode
-   检查 Obsidian 开发者控制台的输出
-   查看实际执行的命令和参数
-   确认 `isCursorIDE` 判断是否正确

### 4. 特殊情况处理

如果使用的 IDE 命令路径中包含 "cursor" 但不是 Cursor IDE：

-   可能需要手动调整判断逻辑
-   或者使用不包含 "cursor" 的命令别名

## 技术细节

### IDE 检测逻辑

```typescript
const isCursorIDE = command.toLowerCase().includes("cursor");
```

**检测规则：**

-   命令中包含 "cursor"（不区分大小写）→ 判定为 Cursor IDE → 添加引号
-   命令中不包含 "cursor" → 判定为其他 IDE → 不添加引号

**支持的命令示例：**

| IDE    | 命令示例                                                               | 是否添加引号 |
| ------ | ---------------------------------------------------------------------- | ------------ |
| Cursor | `cursor`                                                               | ✅ 是        |
| Cursor | `/Applications/Cursor.app/Contents/Resources/app/bin/cursor`           | ✅ 是        |
| Kiro   | `/Applications/Kiro.app/Contents/Resources/app/bin/code`               | ❌ 否        |
| VSCode | `code`                                                                 | ❌ 否        |
| VSCode | `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code` | ❌ 否        |

### execFile 行为说明

-   `execFile` 直接执行进程，不经过 shell
-   参数数组中的每个元素直接传递给目标进程
-   不会进行 shell 转义或引号处理
-   因此手动添加的引号会成为参数值的一部分
