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

# --- 步骤 3: 运行 Prettier 格式化文件 ---
echo "💅 步骤 3: 运行 Prettier 格式化文件..."
npx prettier --write .
echo "✅ Prettier 格式化已应用。"
echo

# --- 步骤 4: 如果 Prettier 有改动，则提交 ---
echo "📝 步骤 4: 检查格式化改动并提交..."
# 检查 Prettier 运行后是否有任何更改
if ! git diff --quiet HEAD --; then
    echo "发现格式化改动，正在提交..."
    git commit -am "style: apply prettier formatting"
    echo "✅ 格式化改动已提交。"
else
    echo "✅ 无需提交格式化改动。"
fi
echo

# --- 步骤 5: 提升版本号 ---
echo "🔖 步骤 5: 使用 'npm version patch' 提升版本号..."
npm version patch
echo "✅ 版本已提升。"
echo

# --- 步骤 6: 推送到远程仓库 ---
echo "🚀 步骤 6: 推送到远程仓库..."
git push && git push --tags
echo "🎉 发布流程顺利完成！" 