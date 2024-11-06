import * as vscode from "vscode"

let statusBarItem: vscode.StatusBarItem

export function activate(context: vscode.ExtensionContext) {
  // 创建状态栏项
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)

  statusBarItem.command = "timeBar.updateTime"

  // 更新时间的函数
  function updateDateTime() {
    const now = new Date()
    const dateTimeString = now
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-")

    statusBarItem.text = `$(calendar) ${dateTimeString}`
    statusBarItem.tooltip = "点击更新时间"
    statusBarItem.show()
  }

  // 立即更新一次时间
  updateDateTime()

  // 设置定时器，每秒更新一次
  const interval = setInterval(updateDateTime, 1000)

  let disposable = vscode.commands.registerCommand("timeBar.updateTime", () => {
    updateDateTime()
    vscode.window.showInformationMessage("已更新时间！")
  })

  // 添加到订阅列表
  context.subscriptions.push(disposable)
  context.subscriptions.push(statusBarItem)
  context.subscriptions.push({
    dispose: () => {
      clearInterval(interval)
      if (statusBarItem) {
        statusBarItem.dispose()
      }
    },
  })
}

export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose()
  }
}
