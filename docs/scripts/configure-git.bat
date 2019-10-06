@echo off
git config core.autocrlf false
git config core.ignorecase false
git config core.fscache true
git config diff.renameLimit 0
git config status.renameLimit 0
git config merge.renameLimit 0
git config http.postBuffer 1048576000
git config pack.threads 1
git config index.threads 0
