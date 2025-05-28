# VsTasks - Markdown Task Management for VSCode

## 概要

**VsTasks**は、VSCode上でMarkdownファイル内のタスク（- [ ] 形式）をObsidian Tasks互換で管理できる拡張機能です。ワークスペース全体のタスク検索、強力なクエリ、繰り返し・統計・WebView表示など多彩な機能を提供します。

## 主な特徴

- Markdownタスクの自動検出・管理
- Obsidian Tasks互換のクエリ言語
- サイドバーTreeView/クエリWebView

## インストール方法

[VSCode Marketplace](https://marketplace.visualstudio.com/)で「VsTasks」を検索しインストール

## 基本的な使い方

1. Markdownファイルで `- [ ] タスク内容` を記述
2. サイドバー「VsTasks」からタスク一覧を確認
3. コマンドパレット（Cmd+Shift+P）で `VsTasks: Create New Task` などを実行
4. クエリパネルで `due before tomorrow` などのクエリを実行

## クエリ例（Query Examples）

- `status is not done`
- `due before tomorrow`
- `priority >= high`
- `tag includes #work`
- `description includes "レポート"`
- `due after 2024-01-01 and due before 2024-12-31`
- `status is done and completed after last week`

## コントリビューション

詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス
MIT License
