' Starts the local telemetry agent without opening a console window.
Option Explicit

Dim shell, projectRoot, command
Set shell = CreateObject("WScript.Shell")
projectRoot = "C:\Users\Administrator\Documents\Codex\2026-07-15\cre\work\pablo-schefer-portfolio"
command = "cmd.exe /c cd /d """ & projectRoot & """ && pnpm.cmd telemetry:start"
shell.Run command, 0, False
