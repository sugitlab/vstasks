import * as assert from "assert";
import * as vscode from "vscode";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as extension from "../../extension"; // 'extension' is defined but never used

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Starting test suite");

  test("Extension should be present", () => {
    assert.ok(vscode.extensions.getExtension("vstasks"));
  });

  test("Extension should activate", async () => {
    const ext = vscode.extensions.getExtension("vstasks");
    if (ext) {
      await ext.activate();
      assert.ok(true);
    } else {
      assert.fail("Extension not found");
    }
  });
});
