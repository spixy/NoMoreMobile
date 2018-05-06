// Saves options to browser.storage
var urlList = null;
var urlItem = null;
var enabledItem = null;
var urls = [];

function GetItemCount() {
  return urlList.childNodes.length - 2;
}

function getIndex(button) {
  return Number(button.id.split("-")[3]);
}

function on_key_down(event) {
  if (event.keyCode == 13) {
    const li = event.currentTarget.parentNode;
    if (li.childNodes[1].value !== "")
      add_url()
  }
}

function enabled_changed(event) {
  const disabled = !event.currentTarget.checked;
  set_disabled(disabled);
}

function set_disabled(disabled) {
  const count = urlList.childNodes.length;

  for (let i = 0; i < count; i++) {
    const child = urlList.childNodes[i];
    if (child.nodeName.toLowerCase() !== "li")
      continue;

      const items = child.childNodes;
    items[1].disabled = disabled;
    items[3].disabled = disabled;
    items[5].disabled = disabled;
  }
}

function add_url_click(event) {
  add_url();
}

function reload_click(event) {
  for (let i = urlList.childNodes.length - 2; i >= 0; i--) {
    urlList.childNodes[i].remove();
  }
  urlItem = urlList.childNodes[0];
  restore_options();
}

function remove_url_click(event) {
  const li = event.currentTarget.parentNode;
  if (GetItemCount() === 1) {
    li.childNodes[1].value = "";
  } else {
    li.remove();
  }
}

function add_url(url) {
  const newUrlItem = urlItem.cloneNode(true);
  newUrlItem.id = "item-url-" + GetItemCount();

  const newUrlInput = newUrlItem.childNodes[1];
  newUrlInput.value = url ? url : "";
  
  add_event_handlers(newUrlItem);

  urlList.append(newUrlItem);
}

function add_event_handlers(item) {
  
  item.childNodes[1].addEventListener('keydown', on_key_down);
  item.childNodes[3].addEventListener('click', add_url_click);
  item.childNodes[5].addEventListener('click', remove_url_click);
}

function save_options() {

  var urls = [];
  const count = urlList.childNodes.length;

  for (let i = 0; i < count; i++) {
    const child = urlList.childNodes[i];
    if (child.nodeName.toLowerCase() !== "li")
      continue;

    const value = child.childNodes[1].value.trim();
    if (value === "")
      continue;

      urls.push(value);
  }

  browser.storage.sync.set({
      urls: urls,
      enabled: enabledItem.checked
  });
}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
function restore_options() {

  var enabled_storage = browser.storage.sync.get('enabled');
  enabled_storage.then((res) => {

    var enabled = res.enabled || false;
    enabledItem.checked = enabled;
    
    var urls_storage = browser.storage.sync.get('urls');
    urls_storage.then((res) => {
      urls = res.urls;

      if (!urls)
        return;
      
      for (let i = 0; i < urls.length; i++) {
        add_url(urls[i]);
      }

      urlList.insertBefore(urlItem, null);

      set_disabled(!enabled);
    });
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('reload').addEventListener('click', reload_click);
document.getElementById('save').addEventListener('click', save_options);

urlItem = document.getElementById("item-url-0");
urlList = document.getElementById("url-list");
enabledItem = document.getElementById("enabled");
enabledItem.addEventListener('change', enabled_changed);

add_event_handlers(urlItem);