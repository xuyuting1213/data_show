@echo off
echo.
echo [信息] 使用 nodeJS 运行 二楼异型插件机生产装配看板 工程。
echo.

%~d0
cd %~dp0

cd ..
node server.js

echo [信息]OK