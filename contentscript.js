function redirect(tabId, changeInfo, tab)
{
  var tabUrl = encodeURIComponent(tab.url);
  var parts = tabUrl.split(".");

  if (parts.length < 2)
  {
    console.error("Invalid URL");
    return;
  }

  var lastIndex = parts.length - 1;
  var newUrl = "";
  var found = false;

  for (var i = 0; i < lastIndex; i++)
  {
    var part = parts[i];
    if (part === "m" && !found)
    {
      found = true;
    }
    else
    {
      newUrl += parts[i] + ".";
      found = true;
    }
  }
  
  newUrl += parts[lastIndex];

  chrome.tabs.update(tabId, {url: newUrl});
}

chrome.tabs.onUpdated.addListener(redirect);