#!/bin/sh

# Install necessary packages and set up the environment
apt-get update
apt-get install -y wget gnupg ca-certificates
wget -qO- https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable
