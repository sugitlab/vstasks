// Generated by Copilot
import * as vscode from "vscode";
import { ITask, TaskStatus, Priority } from "./models/task";
import { TaskDocumentHelper } from "./task-document-helper";

export class TaskDecorationProvider {
  /**
   * Update decorations for all tasks in the editor.
   * @generated Generated by Copilot
   */
  public updateDecorations(editor: vscode.TextEditor): void {
    const tasks = TaskDocumentHelper.getTasksInDocument(editor.document);
    const done: vscode.DecorationOptions[] = [];
    const none: vscode.DecorationOptions[] = [];
    const low: vscode.DecorationOptions[] = [];
    const medium: vscode.DecorationOptions[] = [];
    const high: vscode.DecorationOptions[] = [];
    const highest: vscode.DecorationOptions[] = [];
    for (const task of tasks) {
      const deco = this.createTaskDecoration(task);
      if (task.status === TaskStatus.DONE) {
        done.push(deco);
      } else {
        switch (task.priority) {
          case Priority.HIGHEST:
            highest.push(deco);
            break;
          case Priority.HIGH:
            high.push(deco);
            break;
          case Priority.MEDIUM:
            medium.push(deco);
            break;
          case Priority.LOW:
            low.push(deco);
            break;
          default:
            none.push(deco);
        }
      }
    }
    editor.setDecorations(TaskDecorationProvider.doneDecorationType, done);
    editor.setDecorations(TaskDecorationProvider.noneDecorationType, none);
    editor.setDecorations(TaskDecorationProvider.lowDecorationType, low);
    editor.setDecorations(TaskDecorationProvider.mediumDecorationType, medium);
    editor.setDecorations(TaskDecorationProvider.highDecorationType, high);
    editor.setDecorations(
      TaskDecorationProvider.highestDecorationType,
      highest
    );
  }

  /**
   * Create a decoration for a single task.
   * DecorationOptionsのrenderOptionsは使わず、rangeのみ返す。
   * @generated Generated by Copilot
   */
  public createTaskDecoration(task: ITask): vscode.DecorationOptions {
    const range = new vscode.Range(
      task.lineNumber,
      0,
      task.lineNumber,
      task.rawText.length
    );
    // DecorationTypeで色分けするため、ここではrangeのみ返す
    return { range };
  }

  // Decoration types
  private static doneDecorationType =
    vscode.window.createTextEditorDecorationType({
      textDecoration: "line-through",
      color: "#888",
    });
  private static noneDecorationType =
    vscode.window.createTextEditorDecorationType({ color: "inherit" });
  private static lowDecorationType =
    vscode.window.createTextEditorDecorationType({
      color: "#ffd600",
      fontWeight: "bold",
    });
  private static mediumDecorationType =
    vscode.window.createTextEditorDecorationType({
      color: "#ff9800",
      fontWeight: "bold",
    });
  private static highDecorationType =
    vscode.window.createTextEditorDecorationType({
      color: "#ff4500",
      fontWeight: "bold",
    });
  private static highestDecorationType =
    vscode.window.createTextEditorDecorationType({
      color: "#e6005a",
      fontWeight: "bold",
    });
}

// Priority color mapping now uses 1️⃣ (LOW), 2️⃣ (MEDIUM), 3️⃣ (HIGH), 4️⃣ (HIGHEST)
