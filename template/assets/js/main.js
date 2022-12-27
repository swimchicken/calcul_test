const lift = "left";
const right = "right";

const event_message = "message";
const event_other = "other";

const user_photo_url = [    //圖標url
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408584.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408537.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408540.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408545.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408551.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408556.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408564.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408571.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408578.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408720.svg"
]

var person_img = user_photo_url[getRandomNum(0,user_photo_url.length)];
var person_name = "User" + Math.floor(Math.random() * 1000);  //使用者名稱使用random並output

var url = "ws://" + window.location.host + "/ws?id=" + person_name;
var ws = new WebSocket(url);  //定義WebSocket變數

var chatroom = document.getElementsByClassName("msger-chat");   //聊天室的class名稱
var text = document.getElementById("msg");   //訊息欄位的html標籤id
var send = document.getElementById("send");  //送出的html標籤id


send.onclick = function(e) {
    handle_message_event();   //用button按下,則執行
}
text.onkeydown = function(e) {
    if (e.keyCode ==  13 && text.value !== ""){   //當如果是enter鍵,則執行
        handle_message_event();
    }
}


ws.onmessage = function (e){
    var m = JSON.parse(e.data)
    var msg = ""
    switch (m.event){
        case event_message:
            if (m.name == person_name){
                msg = getMessage(m.name,m.photo,right,m.content);
            }
            else{
                msg = getMessage(m.name,m.photo,lift,m.content);
            }
            break;
        case event_other:
            if (m.name == person_name){
                msg = geteventmess(m.name + " " + m.content); 
            }
            else{
                msg = geteventmess("你已" + m.content);
            }
            break;
        
    }
    insertmsg(msg,chatroom[0]);
};

ws.onclose = function (e){
    console.log(e);
}

function handle_message_event(){   //傳出資料型別(字典)

    content = text.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (text.value != ""){
        ws.send(JSON.stringify({
            "event":"message",
            "photo":"person_img",
            "name":"person_name",
            "content":content,
        }));
    }
    
    text.value = "";  //傳出後清空
}

function geteventmess(msg){
    var msg = `<div class="msg-left">${msg}</div>`;  //抓取容器中訊息
    return msg;
}

function getdatamess(msg){
    var msg = `<div class="msg-date"><span class="time-tag">${msg}</span></div>`
    return msg;
}

function formatdata(data){
    return data.split('T')[0];
}


function formatTime(d) {
    return d.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replaceAll("/", "-");

}



function getMessage(name, img, side, text) {
    const d = new Date();
    //   Simple solution for small apps
    var msg = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatTime(d)}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `
    return msg;
}


function insertmsg(msg,domObj){
    domObj.insertAdjacentHTML("beforeend", msg);
    domObj.scrollTop += 500;
}



function getRandomNum(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}





