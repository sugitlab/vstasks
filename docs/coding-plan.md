# VsTasks Extension - AI Coding プロンプト計画

## Phase 1: プロジェクト準備・基盤構築

### Step 1.1: プロジェクト初期化

**AI指示プロンプト:**
```
VSCode拡張機能「VsTasks」を作成したい。以下の要件でプロジェクトの初期構成を作成してください：

要件：
- TypeScript使用
- マークダウンファイル内のタスク（- [ ] 形式）を管理
- Obsidian Tasks互換のクエリ機能
- ワークスペース全体でのタスク検索

以下を生成してください：
1. package.json（拡張機能設定、依存関係含む）
2. tsconfig.json
3. .vscode/launch.json（デバッグ設定）
4. src/extension.ts（基本的なエントリーポイント）
5. webpack.config.js（バンドル設定）

VSCode Extension APIを使用し、activationEvents、contributes、commandsを適切に設定してください。
```

### Step 1.2: 基本データ構造定義

**AI指示プロンプト:**
```
VSCode Tasks拡張機能のコアデータ構造を定義してください。

以下のインターface/type/enumを作成：

1. Task interface - タスクの基本情報
   - id, description, status, filePath, lineNumber
   - dueDate, scheduledDate, completedDate (optional)
   - priority, tags, recurrence (optional)

2. TaskStatus enum - 未完了、完了、キャンセル等

3. Priority enum - なし、低、中、高、最高

4. RecurrenceRule interface - 繰り返しルール
   - type (daily, weekly, monthly等)
   - interval, endDate

5. TaskQuery interface - クエリ構造
   - filters, sorting, grouping

6. WorkspaceTaskManager interface - タスク管理の中心インターface

TypeScriptで、JSDocコメント付きで作成してください。Obsidian Tasksの機能を参考に設計してください。
```

### Step 1.3: マークダウンタスクパーサー

**AI指示プロンプト:**
```
マークダウンファイルからタスクを抽出するパーサーを作成してください。

要件：
- チェックボックス形式のタスクを検出（- [ ], - [x], * [ ] 等）
- Obsidian Tasks形式の日付解析（📅 2024-01-15, ⏳ 2024-01-20 等）
- 繰り返し設定解析（🔁 every week 等）
- 優先度解析（⏫ 高, ⬆️ 中 等）
- タグ解析（#tag 形式）

以下のクラス/関数を作成：
1. TaskParser class
   - parseMarkdownContent(content: string, filePath: string): Task[]
   - parseLine(line: string, lineNumber: number, filePath: string): Task | null
   - extractDates(text: string): {due?: Date, scheduled?: Date}
   - extractPriority(text: string): Priority
   - extractTags(text: string): string[]
   - extractRecurrence(text: string): RecurrenceRule | null

正規表現を効果的に使用し、エラーハンドリングも含めて実装してください。
テストケースも併せて作成してください。
```

---

## Phase 2: ファイル監視・タスク管理

### Step 2.1: ファイル監視システム

**AI指示プロンプト:**
```
VSCodeワークスペース内のマークダウンファイルを監視し、タスクの変更を検出するシステムを作成してください。

要件：
- VSCode FileSystemWatcher使用
- .md, .markdown ファイルを対象
- ファイルの作成、変更、削除を監視
- パフォーマンスを考慮（大量ファイル対応）
- 無限ループ防止

以下のクラスを作成：
1. WorkspaceWatcher class
   - constructor(taskManager: WorkspaceTaskManager)
   - startWatching(): void
   - stopWatching(): void
   - onFileChanged(uri: vscode.Uri): void
   - onFileCreated(uri: vscode.Uri): void
   - onFileDeleted(uri: vscode.Uri): void

2. FileTaskExtractor class
   - extractTasksFromFile(uri: vscode.Uri): Promise<Task[]>
   - isMarkdownFile(uri: vscode.Uri): boolean

VSCode APIを使用し、適切なエラーハンドリングとログ出力を含めてください。
debounce機能も実装してください（短時間の連続変更対応）。
```

### Step 2.2: タスク管理中心クラス

**AI指示プロンプト:**
```
すべてのタスクを管理する中心的なクラスを作成してください。

要件：
- タスクのCRUD操作
- インメモリキャッシュによる高速検索
- ファイル変更の反映
- イベント通知機能

以下のクラスを作成：
1. WorkspaceTaskManager class
   - private tasks: Map<string, Task[]> (ファイルパス → タスクリスト)
   - addTasks(filePath: string, tasks: Task[]): void
   - removeTasks(filePath: string): void
   - updateTask(taskId: string, updates: Partial<Task>): boolean
   - getAllTasks(): Task[]
   - getTasksByFile(filePath: string): Task[]
   - findTasks(predicate: (task: Task) => boolean): Task[]
   - onTasksChanged: vscode.EventEmitter<{added?: Task[], removed?: Task[], updated?: Task[]}>

2. TaskIndex class（検索最適化用）
   - private indexByTag: Map<string, Set<string>>
   - private indexByStatus: Map<TaskStatus, Set<string>>
   - private indexByDueDate: Map<string, Set<string>>
   - updateIndex(task: Task): void
   - removeFromIndex(taskId: string): void
   - findByTag(tag: string): string[]
   - findByStatus(status: TaskStatus): string[]
   - findByDueDateRange(start: Date, end: Date): string[]

メモリ効率とパフォーマンスを重視して実装してください。
```

---

## Phase 3: クエリエンジン開発

### Step 3.1: クエリ字句解析器

**AI指示プロンプト:**
```
Obsidian Tasks互換のクエリ言語を解析する字句解析器（Lexer）を作成してください。

対応クエリ例：
- "not done"
- "due before tomorrow"
- "tag contains #work"
- "group by filename"
- "sort by due reverse"
- "limit 100"

要件：
1. Token定義（enum TokenType）
   - KEYWORD (not, done, due, before, after等)
   - OPERATOR (contains, before, after等)  
   - VALUE (tomorrow, today, #tag等)
   - DATE (2024-01-15等)
   - NUMBER (100等)
   - EOF, WHITESPACE等

2. Lexer class
   - constructor(input: string)
   - nextToken(): Token
   - peek(): Token
   - hasNext(): boolean
   - getPosition(): {line: number, column: number}

3. Token interface
   - type: TokenType
   - value: string
   - position: {line: number, column: number}

日付の自然言語解析（today, tomorrow, next week等）も含めてください。
エラーハンドリングと詳細なログ出力を実装してください。
```

### Step 3.2: クエリ構文解析器

**AI指示プロンプト:**
```
字句解析器のトークンを使用してクエリのAST（抽象構文木）を構築するパーサーを作成してください。

要件：
1. AST Node interfaces
   - QueryNode (ルート)
   - FilterNode (条件フィルター)
   - SortNode (ソート指定)  
   - GroupNode (グループ化)
   - LimitNode (件数制限)

2. Parser class
   - constructor(lexer: Lexer)
   - parseQuery(): QueryNode
   - parseFilter(): FilterNode
   - parseSort(): SortNode
   - parseGroup(): GroupNode
   - parseLimit(): LimitNode
   - parseExpression(): ExpressionNode

3. Expression types
   - ComparisonExpression (due before tomorrow)
   - ContainsExpression (tag contains #work)
   - NotExpression (not done)
   - AndExpression, OrExpression

パーサーはrecursive descent方式で実装してください。
構文エラーの詳細な報告機能も含めてください。
適切なエラー回復機能も実装してください。
```

### Step 3.3: クエリ実行エンジン

**AI指示プロンプト:**
```
パーサーで生成されたASTを実行してタスクをフィルタリング・ソートするクエリ実行エンジンを作成してください。

要件：
1. QueryExecutor class
   - constructor(taskManager: WorkspaceTaskManager)
   - executeQuery(queryNode: QueryNode): QueryResult
   - applyFilters(tasks: Task[], filters: FilterNode[]): Task[]
   - applySorting(tasks: Task[], sorts: SortNode[]): Task[]
   - applyGrouping(tasks: Task[], groups: GroupNode[]): GroupedTasks
   - applyLimit(tasks: Task[], limit: LimitNode): Task[]

2. FilterEvaluator class  
   - evaluateFilter(task: Task, filter: FilterNode): boolean
   - evaluateComparison(task: Task, expr: ComparisonExpression): boolean
   - evaluateContains(task: Task, expr: ContainsExpression): boolean
   - evaluateNot(task: Task, expr: NotExpression): boolean

3. DateResolver class
   - resolveRelativeDate(dateStr: string): Date
   - resolveTomorrow(): Date
   - resolveNextWeek(): Date
   - resolveThisWeek(): Date

4. QueryResult interface
   - tasks: Task[]
   - groupedTasks?: GroupedTasks
   - totalCount: number
   - executionTime: number

パフォーマンスを重視し、大量のタスクでも高速動作するよう実装してください。
```

---

## Phase 4: UI/UX実装

### Step 4.1: タスクツリービュー

**AI指示プロンプト:**
```
VSCodeサイドバーにタスク一覧を表示するTreeViewを作成してください。

要件：
- VSCode TreeDataProvider使用
- ファイル別、ステータス別、タグ別グループ表示
- タスクのインライン編集
- リアルタイム更新

以下のクラスを作成：
1. TaskTreeDataProvider class (implements vscode.TreeDataProvider<TaskTreeItem>)
   - getTreeItem(element: TaskTreeItem): vscode.TreeItem
   - getChildren(element?: TaskTreeItem): TaskTreeItem[]
   - refresh(): void
   - onDidChangeTreeData: vscode.EventEmitter

2. TaskTreeItem class
   - constructor(task?: Task, group?: string, type?: 'task'|'group'|'file')
   - id: string
   - label: string
   - description?: string
   - iconPath?: vscode.ThemeIcon
   - contextValue?: string
   - command?: vscode.Command

3. TaskTreeView class
   - constructor(taskManager: WorkspaceTaskManager)
   - show(): void
   - hide(): void
   - refresh(): void
   - revealTask(taskId: string): void

アイコン、色分け、ツールチップを適切に設定してください。
コンテキストメニュー（右クリック）対応も含めてください。
```

### Step 4.2: クエリ結果WebView

**AI指示プロンプト:**
```
クエリ結果を表示するWebViewパネルを作成してください。

要件：
- HTMLテーブル形式でタスク表示
- ソート、フィルター機能
- タスクステータスのインライン変更
- レスポンシブデザイン

以下のクラスとファイルを作成：
1. QueryResultPanel class
   - constructor(extensionUri: vscode.Uri)
   - show(queryResult: QueryResult): void
   - hide(): void
   - updateContent(queryResult: QueryResult): void
   - handleMessage(message: any): void

2. HTML template (webview/query-result.html)
   - タスクテーブル
   - フィルター入力欄
   - ソートボタン
   - ステータス変更ボタン

3. CSS (webview/styles.css)
   - VSCodeテーマ対応
   - ダークモード対応
   - レスポンシブレイアウト

4. JavaScript (webview/script.js)
   - テーブルソート機能
   - フィルタリング機能
   - VSCode拡張機能とのメッセージ通信

WebView Security設定も適切に行ってください。
CSPヘッダーも設定してください。
```

### Step 4.3: タスク作成・編集ダイアログ

**AI指示プロンプト:**
```
新しいタスクの作成と既存タスクの編集を行うQuickPickダイアログを作成してください。

要件：
- VSCode QuickPick使用
- タスクの各属性（期日、優先度、タグ等）の設定
- 既存タスクの編集
- バリデーション機能

以下のクラスを作成：
1. TaskEditor class
   - showCreateDialog(): Promise<Task | undefined>
   - showEditDialog(task: Task): Promise<Task | undefined>
   - showQuickPick<T>(items: QuickPickItem<T>[], options: QuickPickOptions): Promise<T | undefined>

2. TaskQuickPickItem class (implements vscode.QuickPickItem)
   - label: string
   - description?: string
   - detail?: string
   - task: Task

3. TaskInputValidator class
   - validateDescription(description: string): string | undefined
   - validateDate(dateStr: string): Date | undefined
   - validatePriority(priorityStr: string): Priority | undefined
   - validateTags(tagsStr: string): string[]

4. QuickPickFlow class
   - stepDescription(): Promise<string>
   - stepDueDate(): Promise<Date | undefined>
   - stepPriority(): Promise<Priority>
   - stepTags(): Promise<string[]>
   - stepRecurrence(): Promise<RecurrenceRule | undefined>

ユーザーフレンドリーなインターface、入力ヒント、エラーメッセージを含めてください。
```

---

## Phase 5: コマンド・統合機能

### Step 5.1: VSCodeコマンド実装

**AI指示プロンプト:**
```
VSCodeコマンドパレットで使用できるコマンドを実装してください。

要件：
- すべてのコマンドはpackage.jsonに登録
- キーバインド対応
- エラーハンドリング

以下のコマンドクラスを作成：
1. TaskCommands class
   - registerCommands(context: vscode.ExtensionContext): void
   - createTask(): Promise<void>
   - toggleTaskStatus(task?: Task): Promise<void>
   - editTask(task?: Task): Promise<void>
   - deleteTask(task?: Task): Promise<void>
   - showAllTasks(): Promise<void>
   - showTasksByTag(): Promise<void>
   - runCustomQuery(): Promise<void>

2. QuickActions class
   - showQuickActionPicker(): Promise<void>
   - showTaskAtCursor(): Promise<void>
   - insertTaskAtCursor(): Promise<void>
   - toggleTaskAtCursor(): Promise<void>

3. WorkspaceCommands class
   - refreshAllTasks(): Promise<void>
   - exportTasks(): Promise<void>
   - importTasks(): Promise<void>
   - showTaskStatistics(): Promise<void>

各コマンドに適切なエラーハンドリング、ユーザーフィードバック（通知）、ログ出力を含めてください。
package.jsonのcontributes.commandsセクションも生成してください。
```

### Step 5.2: エディタ統合機能

**AI指示プロンプト:**
```
マークダウンエディタ内でのタスク操作機能を実装してください。

要件：
- カーソル位置のタスク検出
- ホバー時の情報表示
- CodeLens表示
- 自動補完機能

以下のクラスを作成：
1. TaskCodeLensProvider class (implements vscode.CodeLensProvider)
   - provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[]
   - resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens

2. TaskHoverProvider class (implements vscode.HoverProvider)
   - provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover

3. TaskCompletionProvider class (implements vscode.CompletionItemProvider)
   - provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[]
   - resolveCompletionItem(item: vscode.CompletionItem): vscode.CompletionItem

4. TaskDocumentHelper class
   - getTaskAtPosition(document: vscode.TextDocument, position: vscode.Position): Task | undefined
   - getTasksInDocument(document: vscode.TextDocument): Task[]
   - updateTaskInDocument(document: vscode.TextDocument, oldTask: Task, newTask: Task): Promise<void>

5. TaskDecorationProvider class
   - updateDecorations(editor: vscode.TextEditor): void
   - createTaskDecoration(task: Task): vscode.DecorationOptions

マークダウンシンタックスハイライトとの連携も考慮してください。
```

### Step 5.3: 設定システム

**AI指示プロンプト:**
```
拡張機能の設定システムを実装してください。

要件：
- VSCode settings.jsonとの統合
- 設定変更の即座反映
- デフォルト値の適切な設定
- 設定検証機能

以下のクラスとインターfaceを作成：
1. SettingsManager class
   - constructor()
   - getSettings(): ExtensionSettings
   - updateSetting<K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]): Promise<void>
   - onSettingsChanged: vscode.EventEmitter<ExtensionSettings>
   - watchSettingsChanges(): void

2. ExtensionSettings interface
   - dateFormat: string
   - defaultPriority: Priority
   - autoRefresh: boolean
   - refreshInterval: number
   - enableCodeLens: boolean
   - enableHover: boolean
   - maxTasksInView: number
   - customTaskStatuses: TaskStatus[]
   - queryTimeout: number
   - debugMode: boolean

3. SettingsValidator class
   - validateDateFormat(format: string): boolean
   - validateRefreshInterval(interval: number): boolean
   - validateMaxTasks(maxTasks: number): boolean

4. package.jsonのcontributes.configuration
   - 全設定項目の定義
   - デフォルト値
   - 説明文（多言語対応準備）

設定のマイグレーション機能も含めてください（将来のバージョンアップ対応）。
```

---

## Phase 6: 高度な機能

### Step 6.1: 繰り返しタスク処理

**AI指示プロンプト:**
```
繰り返しタスクの自動生成と管理機能を実装してください。

要件：
- 複雑な繰り返しルールサポート
- 完了時の次タスク自動生成
- スキップ・延期機能
- 繰り返し履歴管理

以下のクラスを作成：
1. RecurrenceEngine class
   - generateNextOccurrence(task: Task): Task | null
   - calculateNextDueDate(rule: RecurrenceRule, currentDate: Date): Date | null
   - isRecurringTask(task: Task): boolean
   - shouldGenerateNext(task: Task): boolean

2. RecurrenceRule拡張
   - type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
   - interval: number
   - daysOfWeek?: number[] (0=Sunday, 6=Saturday)
   - dayOfMonth?: number
   - endDate?: Date
   - maxOccurrences?: number
   - skipWeekends?: boolean

3. RecurrenceScheduler class
   - startScheduler(): void
   - stopScheduler(): void
   - checkPendingRecurrences(): void
   - generateDueRecurrences(): void

4. RecurrenceHistory class
   - addOccurrence(taskId: string, occurrence: TaskOccurrence): void
   - getHistory(taskId: string): TaskOccurrence[]
   - removeHistory(taskId: string): void

5. TaskOccurrence interface
   - originalTaskId: string
   - generatedDate: Date
   - dueDate: Date
   - completedDate?: Date
   - skipped: boolean

自然言語での繰り返し設定解析（"every 2 weeks", "monthly on the 15th"等）も実装してください。
```

### Step 6.2: タスク統計・レポート

**AI指示プロンプト:**
```
タスクの統計情報とレポート機能を実装してください。

要件：
- 完了率、期限遵守率の計算
- 日別、週別、月別の統計
- WebViewでのグラフ表示
- CSV/JSON形式でのエクスポート

以下のクラスを作成：
1. TaskStatistics class
   - calculateCompletionRate(dateRange?: DateRange): number
   - calculateOverdueRate(dateRange?: DateRange): number
   - getTaskCountByStatus(): Map<TaskStatus, number>
   - getTaskCountByPriority(): Map<Priority, number>
   - getTaskCountByTag(): Map<string, number>
   - getProductivityTrend(days: number): DailyProductivity[]

2. ReportGenerator class
   - generateDailyReport(date: Date): DailyReport
   - generateWeeklyReport(startDate: Date): WeeklyReport
   - generateMonthlyReport(year: number, month: number): MonthlyReport
   - generateCustomReport(criteria: ReportCriteria): CustomReport

3. DataExporter class
   - exportToCSV(tasks: Task[], filePath: string): Promise<void>
   - exportToJSON(tasks: Task[], filePath: string): Promise<void>
   - exportStatistics(stats: TaskStatistics, format: 'csv'|'json'): Promise<void>

4. StatisticsWebView class
   - showStatistics(stats: TaskStatistics): void
   - renderCharts(data: ChartData[]): string
   - generateHTML(stats: TaskStatistics): string

5. ChartData interface + Chart types
   - pieChart, barChart, lineChart用のデータ構造
   - Chart.js使用を想定

Chart.js等のライブラリを使用してWebView内でグラフを表示してください。
```

### Step 6.3: 外部連携機能

**AI指示プロンプト:**
```
他のツールとの連携機能を実装してください。

要件：
- GitHub Issues連携（オプション）
- カレンダーアプリ連携
- ファイルエクスポート/インポート
- Webhook通知

以下のクラスを作成：
1. GitHubIntegration class
   - authenticateWithGitHub(): Promise<void>
   - syncWithIssues(repoUrl: string): Promise<void>
   - createIssueFromTask(task: Task): Promise<string>
   - updateTaskFromIssue(issueData: GitHubIssue): Promise<void>

2. CalendarIntegration class
   - exportToICS(tasks: Task[]): string
   - importFromICS(icsContent: string): Task[]
   - syncWithCalendar(calendarType: 'outlook'|'google'): Promise<void>

3. WebhookManager class
   - registerWebhook(url: string, events: WebhookEvent[]): void
   - removeWebhook(webhookId: string): void
   - triggerWebhook(event: WebhookEvent, data: any): Promise<void>

4. DataImportExport class
   - importFromObsidian(filePath: string): Promise<Task[]>
   - importFromTodoist(filePath: string): Promise<Task[]>
   - importFromAsana(filePath: string): Promise<Task[]>
   - exportToFormat(tasks: Task[], format: ExportFormat): string

5. ExternalAPIClient class
   - makeAuthenticatedRequest(url: string, options: RequestOptions): Promise<any>
   - handleRateLimit(response: Response): void
   - retryOnFailure<T>(operation: () => Promise<T>, maxRetries: number): Promise<T>

セキュリティを重視し、APIキーの安全な保存方法も実装してください。
VSCode Secret Storage使用を推奨します。
```

---

## Phase 7: テスト・品質保証

### Step 7.1: ユニットテスト

**AI指示プロンプト:**
```
全主要クラスのユニットテストを作成してください。

要件：
- Jest使用
- 90%以上のコードカバレッジ
- モック使用による単体テスト
- 境界値テスト含む

以下のテストファイルを作成：
1. src/test/task-parser.test.ts
   - TaskParserの全メソッドテスト
   - 様々なマークダウン形式のテスト
   - エッジケース（不正な形式等）のテスト
   - 日付解析、タグ解析、優先度解析のテスト

2. src/test/query-engine.test.ts
   - Lexer, Parser, Executorのテスト
   - 複雑なクエリのテスト
   - エラーケースのテスト
   - パフォーマンステスト（大量データ）

3. src/test/task-manager.test.ts
   - WorkspaceTaskManagerのテスト
   - CRUD操作のテスト
   - イベント発火のテスト
   - 同期処理のテスト

4. src/test/recurrence.test.ts
   - RecurrenceEngineのテスト
   - 様々な繰り返しパターンのテスト
   - 境界値テスト（月末、うるう年等）

5. test/test-helper.ts
   - テスト用のユーティリティ関数
   - モックファクトリー
   - テストデータ生成器

VSCode API呼び出しはモックを使用してください。
テストの可読性を重視し、describeブロックで論理的にグループ化してください。
```

### Step 7.2: 統合テスト

**AI指示プロンプト:**
```
コンポーネント間の連携をテストする統合テストを作成してください。

要件：
- VSCode Extension Test Runner使用
- 実際のワークスペースでのテスト
- ファイル操作のテスト
- UIコンポーネントのテスト

以下のテストファイルを作成：
1. src/test/integration/workspace-integration.test.ts
   - ワークスペース全体でのタスク検出テスト
   - ファイル作成・編集・削除時の動作テスト
   - 大量ファイルでのパフォーマンステスト

2. src/test/integration/ui-integration.test.ts
   - TreeViewの表示テスト
   - WebViewの動作テスト
   - コマンド実行テスト
   - ユーザー操作フローテスト

3. src/test/integration/query-integration.test.ts
   - エンドツーエンドのクエリテスト
   - 複数ファイルでの検索テスト
   - リアルタイム更新のテスト

4. src/test/fixtures/
   - テスト用のマークダウンファイル
   - 様々なタスク形式のサンプル
   - 大量データ用のファイル

5. src/test/integration/performance.test.ts
   - 1000ファイル以上での動作テスト
   - メモリ使用量のテスト
   - レスポンス時間のテスト

実際のVSCode環境でのテストケースも含めてください。
```

### Step 7.3: エンドツーエンドテスト

**AI指示プロンプト:**
```
実際のユーザー操作をシミュレートするE2Eテストを作成してください。

要件：
- VSCode Extension Test使用
- 実際のユーザーワークフロー再現
- 異常系シナリオも含む
- パフォーマンス計測

以下のテストファイルを作成：
1. src/test/e2e/user-workflows.test.ts
   - 新規タスク作成 → 編集 → 完了のフロー
   - 複雑なクエリ実行フロー
   - 繰り返しタスクの生成・管理フロー
   - エクスポート・インポートフロー

2. src/test/e2e/error-scenarios.test.ts
   - 不正なマークダウンファイル処理
   - ネットワークエラー時の動作
   - 大量データでのメモリ不足シナリオ
   - 設定ファイル破損時の回復

3. src/test/e2e/performance-scenarios.test.ts
   - 10,000タスクでの操作テスト
   - リアルタイム更新のレスポンス測定
   - メモリリーク検出テスト

4. src/test/e2e/compatibility.test.ts
   - 異なるVSCodeバージョンでのテスト
   - 他の拡張機能との競合テスト
   - 異なるOS環境でのテスト

テスト結果の詳細なレポート生成機能も含めてください。
```

---

## Phase 8: デプロイ・リリース準備

### Step 8.1: パッケージング・ビルド

**AI指示プロンプト:**
```
VSCode拡張機能のリリース用パッケージングシステムを作成してください。

要件：
- webpack最適化
- ファイルサイズ最小化
- 依存関係の適切な処理
- 複数環境対応

以下のファイルを作成：
1. webpack.config.js（プロダクション用）
   - TypeScriptコンパイル設定
   - バンドルサイズ最適化
   - ソースマップ設定
   - 外部依存関係設定

2. scripts/build.js
   - ビルドプロセス自動化
   - バージョン管理
   - アセット処理
   - 品質チェック統合

3. scripts/package.js
   - .vsix ファイル生成
   - メタデータ検証
   - ファイルサイズチェック
   - 署名処理（将来用）

4. .vsceignore
   - 不要ファイルの除外設定
   - テストファイル除外
   - 開発用ファイル除外

5. package.json更新
   - scriptsセクション充実
   - engines指定
   - repository, bugs, homepage設定
   - keywords設定

GitHub Actionsワークフローファイルも作成してください（自動ビルド・テスト用）。
```

### Step 8.2: ドキュメント作成

**AI指示プロンプト:**
```
ユーザー向けの包括的なドキュメントを作成してください。

要件：
- 初心者にも分かりやすい説明
- 豊富な使用例
- スクリーンショット準備指示
- 複数言語対応準備

以下のドキュメントファイルを作成：
1. README.md
   - 拡張機能の概要説明
   - インストール方法
   - 基本的な使用方法
   - スクリーンショット埋め込み箇所指示
   - 貢献方法
   - ライセンス情報

2. docs/user-guide.md
   - 詳細な機能説明
   - タスク作成方法
   - クエリ言語の完全な説明
   - 設定オプションの説明
   - トラブルシューティング

3. docs/query-reference.md
   - クエリ構文の完全リファレンス
   - 使用例集
   - 関数・演算子リスト
   - よくあるクエリパターン

4. docs/api-reference.md
   - 開発者向けAPI説明
   - 拡張方法
   - カスタマイゼーション方法

5. CHANGELOG.md
   - バージョン履歴のテンプレート
   - セマンティックバージョニング説明

6. CONTRIBUTING.md
   - 開発環境セットアップ
   - コード規約
   - プルリクエストガイドライン

マークダウン形式で、GitHub Pages対応も考慮してください。
```

### Step 8.3: マーケットプレイス準備

**AI指示プロンプト:**
```
Visual Studio Code Marketplaceでの公開準備を行ってください。

要件：
- 魅力的な説明文
- 適切なカテゴリ・タグ設定
- スクリーンショット・デモGIF準備指示
- SEO最適化

以下のファイル・内容を作成：
1. marketplace-description.md
   - キャッチーな紹介文
   - 主要機能の箇条書き
   - 使用例とメリット
   - 競合ツールとの差別化点

2. package.json marketplace設定
   - displayName（魅力的な名前）
   - description（検索最適化）
   - categories適切な設定
   - keywords（検索用）
   - galleryBanner設定

3. media/screenshots/
   - 必要なスクリーンショットのリスト
   - キャプション案
   - デモGIFのシナリオ

4. icon.png要件
   - サイズとフォーマット指定
   - デザインガイドライン
   - ブランディング要素

5. marketplace-checklist.md
   - 公開前チェックリスト
   - 品質基準
   - テスト項目

アクセシビリティとユーザビリティを重視した内容にしてください。
```

---

## Phase 9: 高度な機能・拡張

### Step 9.1: プラグインシステム

**AI指示プロンプト:**
```
サードパーティ開発者が機能を拡張できるプラグインシステムを作成してください。

要件：
- 安全な拡張機能アーキテクチャ
- API定義
- プラグイン登録・管理システム
- サンプルプラグイン

以下のシステムを作成：
1. PluginManager class
   - loadPlugin(pluginPath: string): Promise<Plugin>
   - unloadPlugin(pluginId: string): void
   - listPlugins(): PluginInfo[]
   - enablePlugin(pluginId: string): void
   - disablePlugin(pluginId: string): void

2. Plugin interface
   - id: string
   - name: string
   - version: string
   - activate(context: PluginContext): void
   - deactivate(): void
   - onTaskCreated?(task: Task): void
   - onTaskUpdated?(task: Task): void
   - onQueryExecuted?(query: string, result: QueryResult): void

3. PluginContext interface
   - taskManager: WorkspaceTaskManager
   - queryEngine: QueryExecutor
   - ui: UIManager
   - logger: Logger
   - settings: SettingsManager

4. Sample plugins
   - TimeTrackingPlugin (作業時間記録)
   - NotificationPlugin (期限アラート)
   - StatisticsPlugin (詳細統計)

5. PluginAPI class
   - 安全なAPI提供
   - 権限管理
   - サンドボックス実行

セキュリティを最重視し、悪意のあるプラグインから保護する仕組みも実装してください。
```

### Step 9.2: モバイル・クロスプラットフォーム対応

**AI指示プロンプト:**
```
VSCode Web版での動作とモバイル対応を実装してください。

要件：
- VSCode for the Web対応
- レスポンシブUI
- タッチ操作対応
- オフライン機能

以下の対応を実装：
1. WebCompatibilityManager class
   - detectEnvironment(): Environment
   - adaptToWebEnvironment(): void
   - handleLimitedFileSystem(): void
   - manageBrowserStorage(): void

2. MobileUIAdapter class
   - adaptTreeViewForMobile(): void
   - adaptWebViewForMobile(): void
   - handleTouchGestures(): void
   - optimizeForSmallScreen(): void

3. OfflineManager class
   - cacheTaskData(): void
   - syncWhenOnline(): void
   - handleConflictResolution(): void

4. Progressive Web App対応
   - manifest.json
   - service-worker.js
   - offline-first設計

5. Cross-platform testing
   - Browser compatibility tests
   - Mobile device tests
   - Performance optimization

Web版の制限事項への対処方法も含めてください。
```

### Step 9.3: AI統合機能

**AI指示プロンプト:**
```
AI/ML機能を統合してユーザー体験を向上させる機能を実装してください。

要件：
- 自然言語クエリ処理
- タスク優先度の自動提案
- 作業パターン分析
- スマートな期限設定

以下のAI機能を作成：
1. NaturalLanguageProcessor class
   - parseNaturalQuery(query: string): QueryNode
   - extractTaskFromText(text: string): Partial<Task>
   - suggestTaskCompletion(partial: string): string[]

2. TaskPriorityAnalyzer class
   - analyzePriority(task: Task): Priority
   - learnFromUserBehavior(completedTasks: Task[]): void
   - suggestOptimalSchedule(tasks: Task[]): ScheduleSuggestion[]

3. ProductivityAnalyzer class
   - analyzeWorkPatterns(history: TaskHistory[]): WorkPattern[]
   - predictTaskDuration(task: Task): number
   - suggestBreakTimes(): Date[]

4. SmartScheduler class
   - autoScheduleTasks(tasks: Task[]): ScheduledTask[]
   - optimizeWorkload(timeframe: DateRange): TaskRecommendation[]
   - detectOvercommitment(): OvercommitmentWarning[]

5. LocalMLModel class（オプション）
   - trainModel(trainingData: TaskData[]): void
   - predict(input: TaskInput): TaskPrediction
   - updateModel(newData: TaskData[]): void

API使用（OpenAI等）またはローカル処理の選択肢を提供してください。
プライバシーを重視し、データの外部送信は明示的な同意後のみにしてください。
```

---

## 実行ガイドライン

### 各プロンプトの使用方法

1. **段階的実行**: 各Phaseを順番に実行し、前のPhaseの成果物を次のPhaseで活用
2. **成果物確認**: 各Stepで生成されたコードは必ずテストし、動作確認を行う
3. **カスタマイズ**: プロンプトは必要に応じてプロジェクトの要件に合わせて調整
4. **品質管理**: 各コードにはJSDoc、エラーハンドリング、ログ出力を含める

### 効果的なAI活用のコツ

1. **具体的な要求**: 「〜を作って」ではなく「〜を満たす△△クラスを作って」
2. **成果物明記**: 「以下のクラスを作成」「以下のファイルを生成」等、具体的に指定
3. **技術制約明記**: 使用ライブラリ、APIバージョン、パフォーマンス要件等を明記
4. **エラーケース含む**: 正常系だけでなく異常系処理も必ず要求

### 品質保証

- 各Stepの成果物には必ずテストコードを含める
- TypeScript strict modeを使用
- ESLint + Prettierでコード品質を保持
- すべてのpublic methodにJSDocを記載
