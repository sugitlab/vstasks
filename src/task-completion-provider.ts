// Generated by Copilot
import * as vscode from "vscode";

export class TaskCompletionProvider implements vscode.CompletionItemProvider {
  /**
   * Provide completion items for markdown task lines.
   */
  public provideCompletionItems(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    // Suggest common task keywords and tags
    items.push(
      new vscode.CompletionItem("- [ ] ", vscode.CompletionItemKind.Snippet)
    );
    items.push(
      new vscode.CompletionItem("- [x] ", vscode.CompletionItemKind.Snippet)
    );
    items.push(
      new vscode.CompletionItem("#work", vscode.CompletionItemKind.Keyword)
    );
    items.push(
      new vscode.CompletionItem("#personal", vscode.CompletionItemKind.Keyword)
    );
    items.push(
      new vscode.CompletionItem("📅 due: ", vscode.CompletionItemKind.Snippet)
    );
    items.push(
      new vscode.CompletionItem(
        "⏳ scheduled: ",
        vscode.CompletionItemKind.Snippet
      )
    );
    items.push(
      new vscode.CompletionItem(
        "1️⃣ high priority",
        vscode.CompletionItemKind.Snippet
      )
    );
    return items;
  }

  /**
   * Optionally resolve a completion item (not used here).
   */
  public resolveCompletionItem(
    item: vscode.CompletionItem
  ): vscode.CompletionItem {
    return item;
  }
}
