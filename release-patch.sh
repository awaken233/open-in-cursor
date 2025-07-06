#!/bin/sh
# 该脚本用于自动化插件的补丁版本发布流程。
# 它会依次执行：工作区检查、ESLint、Prettier、版本提升和推送。
# 如果任何一步失败，脚本将立即停止。

set -e

# --- 步骤 1: 检查是否存在未提交的更改 ---
echo "🔍 步骤 1: 检查是否存在未提交的更改..."
if ! git diff --quiet HEAD --; then
    echo "❌ 错误：您有已暂存或未暂存的更改。"
    echo "在运行发布脚本之前，请先提交或贮藏它们。"
    git status --short
    exit 1
fi
echo "✅ 工作区是干净的。"
echo

# --- 步骤 2: 运行 ESLint ---
echo "🔬 步骤 2: 运行 ESLint 检查..."
npx eslint . --ext .ts
echo "✅ ESLint 检查通过。"
echo

# --- 步骤 3: 提升版本号（但不创建 git 标签） ---
echo "🔖 步骤 3: 提升版本号..."
# --no-git-tag-version 只修改文件，不执行 git 操作
npm version patch --no-git-tag-version
echo "✅ 版本文件已更新。"
echo

# --- 步骤 4: 再次运行 Prettier 格式化文件 ---
echo "💅 步骤 4: 再次运行 Prettier 以格式化版本文件..."
# 在版本号更新后再次格式化，确保所有文件（包括被 npm version 修改的）都符合规范
npx prettier --write .
echo "✅ Prettier 格式化已应用。"
echo

# --- 步骤 5: 提交所有更改并打上标签 ---
echo "📝 步骤 5: 提交所有更改并创建标签..."
# 从 package.json 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")

git add .
git commit -m "chore(release): v$NEW_VERSION"
git tag "v$NEW_VERSION"
echo "✅ 已创建提交和标签 (v$NEW_VERSION)。"
echo

# --- 步骤 6: 推送到远程仓库 ---
echo "🚀 步骤 6: 推送到远程仓库..."
git push && git push --tags
echo "🎉 发布流程顺利完成！" 