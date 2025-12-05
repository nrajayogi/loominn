#!/bin/bash

# Add all changes
git add .

# Commit with timestamp
timestamp=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Update: $timestamp"

# Push to current branch
git push
