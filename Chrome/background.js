var blackList = [];
var blackListSize = 0;
var useBlackList = false;

function fastIndexOf(array, item)
{
  var i = array.length;
  while (i--)
  {
     if (array[i] === item)
         return i;
  }
  return -1;
}

function tryGetNewUrl(url)
{
  var parts = url.split("//");
  if (parts.length !== 2)
  {
    return null;
  }

  var newUrl = parts[0];
  parts = parts[1].split(".");
  var m_index = fastIndexOf(parts, "m");

  // ".m." cannot be in 1st and 2nd level domain
  if (m_index === -1 || m_index > parts.length - 3)
  {
    return null;
  }

  // Check in blacklist
  if (useBlackList) {
    for (let i = 0; i < blackListSize; ++i)
    {
      if (url.includes(blackList[i]))
      {
        return null;
      }
    }
  }

  // create non-mobile URL
  return createNewUrl(parts, m_index, newUrl);
}

function createNewUrl(parts, m_index, newUrl)
{
  var last_index = parts.length - 1;
  newUrl += "//";
  for (let i = 0; i < m_index; ++i)
  {
    newUrl += parts[i] + ".";
  }
  for (let i = m_index + 1; i < last_index; ++i)
  {
    newUrl += parts[i] + ".";
  }
  return newUrl + parts[last_index];
}

// laod options
chrome.storage.sync.get({
  urls: [],
  enabled: false
  }, function(items) {
    blackList = items.urls;
    blackListSize = items.urls.length;
    useBlackList = items.enabled;
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details)
    {
        const host = tryGetNewUrl(details.url);
        if (host !== null)
        {
          return { redirectUrl: host };
        }
    },
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    ["blocking"]
);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];

    if (key === "urls") {
      blackList = storageChange.newValue;
      blackListSize = blackList.length;
    } else {
      useBlackList = storageChange.newValue;
    }
  }
});