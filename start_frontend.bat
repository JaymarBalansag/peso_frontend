@echo off
title PESO Frontend

echo Starting PESO Frontend...
echo.

serve dist --listen tcp://0.0.0.0:3000 --single

pause