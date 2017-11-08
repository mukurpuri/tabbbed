// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url:chrome.extension.getURL("tabbbed.html")});
});*/
chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
});