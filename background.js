let psshs=[];
let requests=[];
function convertHeaders(obj){
    return Object.fromEntries(obj.map(header => [header.name, header.value]))
}
chrome.webRequest.onBeforeSendHeaders.addListener(
 function(details) {
    if (details.method === "POST") {
      requests.push({
          url:details.url,
          headers:convertHeaders(details.requestHeaders)
      });
    }
 },
 {urls: ["<all_urls>"]},
 ["requestHeaders"]
);

//Receive PSSH from content.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch(request.type){
        case "RESET":
            psshs=[];
            requests=[];
            break;
        case "PSSH":
            psshs.push(request.text)
            break;
    }
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: "popup.html", // 開きたいURLを指定
        type: "popup" // 新規ウィンドウを開く
    });
});

window.getPsshs = () => {
  return psshs;
};

window.getRequests = () => {
  return requests;
};
