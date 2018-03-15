function getNewUrl(url)
{
  var parts = url.split("//");

  if (parts.length != 2)
  {
    console.error("Invalid URL");
    return null;
  }

  var newUrl = parts[0] + "//";
  var parts = parts[1].split(".");

  if (parts.length == 0)
  {
    console.error("Invalid URL");
    return null;
  }

  var lastIndex = parts.length - 1;
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
  return newUrl;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details)
    {
        var host = getNewUrl(details.url);
         return {redirectUrl: host + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
    },
    {
        urls: [
          "*"
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);