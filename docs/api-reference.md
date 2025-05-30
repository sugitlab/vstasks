# VsTasks APIリファレンス

<!-- Generated by Copilot -->

## 概要
VsTasks拡張機能の開発者向けAPIリファレンスです。独自拡張やカスタマイズ、プラグイン開発の参考にしてください。

## 主なAPI

### タスク管理
- `WorkspaceTaskManager` : タスクのCRUD・検索・イベント
- `TaskIndex` : タグ/日付/ステータスでの高速検索
- `TaskParser` : Markdownからのタスク抽出

### クエリエンジン
- `QueryLexer` : クエリ字句解析
- `QueryParser` : クエリ構文解析
- `QueryExecutor` : クエリ実行・フィルタ・ソート

### UI/UX
- `TaskTreeDataProvider` : サイドバーTreeView
- `QueryResultPanel` : クエリWebView
- `TaskEditor` : クイック作成・編集ダイアログ

### 外部連携
- `GitHubIntegration`, `CalendarIntegration`, `WebhookManager`, `DataImportExport`

## 拡張・カスタマイズ方法
- プラグインAPI: `PluginManager`, `PluginContext`, `Plugin`
- サンプル: `TimeTrackingPlugin`, `NotificationPlugin`, `StatisticsPlugin`

## 型定義例
```ts
interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  filePath: string;
  lineNumber: number;
  dueDate?: Date;
  priority?: Priority;
  tags?: string[];
  recurrence?: RecurrenceRule;
}
```

## 詳細・最新情報
- [GitHubリポジトリ](https://github.com/your-org/vstasks)
- Issue/Discussionsで質問・要望受付中
