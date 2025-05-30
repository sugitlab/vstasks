// Generated by Copilot
// ワークスペース全体でのタスク検出・ファイル操作・大量ファイルパフォーマンステスト
import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

describe("Workspace Integration Test", function () {
  this.timeout(60000);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const testFolder = workspaceFolders && workspaceFolders[0].uri.fsPath;
  const testFile = testFolder
    ? path.join(testFolder, "integration-test.md")
    : "";

  afterEach(async () => {
    if (testFile && fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  // 型定義: WorkspaceTask
  interface IWorkspaceTask {
    description?: string;
  }

  it("detects tasks across the workspace", async () => {
    if (!testFile) {
      return;
    }
    fs.writeFileSync(testFile, "- [ ] Integration Task\n- [x] Done Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IWorkspaceTask[]).some(
        (t) => t.description === "Integration Task"
      )
    );
  });

  it("responds to file create/edit/delete", async () => {
    if (!testFile) {
      return;
    }
    fs.writeFileSync(testFile, "- [ ] File Create Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    let tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IWorkspaceTask[]).some(
        (t) => t.description === "File Create Task"
      )
    );
    fs.writeFileSync(testFile, "- [ ] File Edit Task");
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IWorkspaceTask[]).some(
        (t) => t.description === "File Edit Task"
      )
    );
    fs.unlinkSync(testFile);
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      !(tasks as IWorkspaceTask[]).some(
        (t) => t.description === "File Edit Task"
      )
    );
  });

  it("handles performance with many files", async () => {
    if (!testFolder) {
      return;
    }
    const files: string[] = [];
    for (let i = 0; i < 100; i++) {
      const f = path.join(testFolder, `mass-task-${i}.md`);
      fs.writeFileSync(f, `- [ ] Mass Task ${i}`);
      files.push(f);
    }
    await vscode.commands.executeCommand(
      "workbench.files.action.refreshFilesExplorer"
    );
    const tasks = await vscode.commands.executeCommand("vstasks.getAllTasks");
    if (!Array.isArray(tasks)) {
      throw new Error("tasks is not an array");
    }
    assert.ok(
      (tasks as IWorkspaceTask[]).filter(
        (t) => t.description && t.description.startsWith("Mass Task")
      ).length >= 100
    );
    files.forEach((f) => {
      fs.unlinkSync(f);
    });
  });
});
