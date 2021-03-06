(function() {
  jQuery(document).ready(function() {
    var appendMessage, interviewId, lastChatId, pollChat, pollDelay, pollUrl, postUrl, privateOut, publicOut, sendChat;
    pollDelay = 1000;
    interviewId = $("#interview-id").val();
    postUrl = ("/chat/" + (interviewId));
    lastChatId = 0;
    publicOut = $("#public-out");
    privateOut = $("#private-out");
    appendMessage = function(cm) {
      var channel, txt;
      if (lastChatId < cm.id) {
        channel = cm.channel === "private" ? privateOut : publicOut;
        txt = ("<p class='chat_message'>" + (cm.time) + " " + (cm.name) + " " + (cm.message) + "</p>");
        channel.append(txt);
        channel.get(0).scrollTop = channel.get(0).scrollHeight;
        return (lastChatId = cm.id);
      }
    };
    pollUrl = function() {
      return "/chat/" + (interviewId) + "?after=" + (lastChatId);
    };
    sendChat = function(channel, txt) {
      var payload, response;
      payload = {
        channel: channel,
        message: txt
      };
      response = function(data) {
        return appendMessage(data.chat_message);
      };
      return jQuery.post(postUrl, payload, response, "json");
    };
    pollChat = function() {
      return jQuery.getJSON(pollUrl(), function(data) {
        var _a, _b, _c, c;
        _b = data;
        for (_a = 0, _c = _b.length; _a < _c; _a++) {
          c = _b[_a];
          appendMessage(c);
        }
        return setTimeout(pollChat, pollDelay);
      });
    };
    $("#public-out").click(function() {
      return $("#public-in").focus();
    });
    $("#private-out").click(function() {
      return $("#private-in").focus();
    });
    $("#public-in").bufferInput(function(txt) {
      return sendChat("public", txt);
    });
    $("#private-in").bufferInput(function(txt) {
      return sendChat("private", txt);
    });
    return pollChat();
  });
})();
