var socket = io(); 
var myUsername = $('#username').html();
socket.emit('login', myUsername);
var historyMsgHashmap = new HashMap();
var notReadHasMsghmap = new HashMap();

$('form').submit(function(){
  var msg = $('#m').val();
  if(!msg){
    return false;
  } 
  if(!($('#to_text').val())){
    alert('请先选择一个用户再发送消息');
    return false;
  } 
  var time = new Date().toLocaleString();
  $('#messages').append($('<li>').text('我: '+time));
  $('#messages').append($('<li>').text(msg));

  var jsonMsg = {   
    "from": myUsername,   
    "to":   $('#to_text').val(),
    "msg":  msg,
    "time": time
  };  
  socket.emit('message',JSON.stringify(jsonMsg));
  //clear the input
  $('#m').val('');
  //scroll to the bottom
  window.scrollTo(0, document.getElementById("messages").clientHeight);
  return false;
});

socket.on('message', function(msg){
  var msgRecv = JSON.parse(msg);
  //if is chatting 
  if( msgRecv.from=== ($('#to_text').val()) ){
    $('#messages').append($('<li>').text(msgRecv.from+': '+msgRecv.time));
    $('#messages').append($('<li>').text(msgRecv.msg));       
    window.scrollTo(0, document.getElementById("messages").clientHeight);
  }else{
    var href = document.getElementById(msgRecv.from+'_href');
    href.innerHTML = '有新消息';
    //save msg that not read######################3
    notReadHasMsghmap.push(msgRecv.from,msgRecv);
  }
  
});

socket.on('online', function(values){
  deleteAllOnlineDiv();
  for(var i=0;i<values.length; i++){
    if(values[i]!==myUsername){//if it's me, don't display
      addOnlineDiv(values[i]);
    }
  }
});

function addOnlineDiv(id){                

  var newDiv = document.createElement("div");
  newDiv.id=id+'_div';
  document.getElementById("online_users_div").appendChild(newDiv);

  var span = document.createElement('span');
  span.id = id+'_span';
  span.innerHTML = id;

  var href = document.createElement('a');
  href.innerHTML = '聊天';
  href.id = id+'_href';
  href.onclick=  function onChatClick(){
    //change 有新消息 to 聊天
    href.innerHTML = '聊天';

    /*********************save history start*******************/
    var toNow = $('#to_text').val();
    if(toNow){
      var ul = document.getElementById("messages");
      var lis = ul.getElementsByTagName("li");
      var array = new Array();
      for(var i=0;i<lis.length;i++){
        array.push(lis.item(i).innerHTML);
      }
      if(lis.length>0){
        historyMsgHashmap.put(toNow,array);
      }
    }
    /********************************save history end********************************/
    var to = document.getElementById(id+'_span').innerHTML;
    $('#dialog_span').text('与 '+to+' 的聊天');
    $('#to_text').val(to);
    clearChatRecord();
    /***************************get history start********************************/
    var msgFromHistoryMap = historyMsgHashmap.get(to);
    if(msgFromHistoryMap){
      for(var i=0;i<msgFromHistoryMap.length;i++){
        $('#messages').append($('<li>').text(msgFromHistoryMap[i]));   
      }
      //don`t need remove them. msg with the same key will be covered 
      //historyMsgHashmap.remove(to);
    }
    /**************************get history end************************************/



    /****************************show msg that not read start*************************/
      var notReadMsgArray = notReadHasMsghmap.get(to);
      if(notReadMsgArray){
        for(var i=0;i<notReadMsgArray.length;i++){
          $('#messages').append($('<li>').text(notReadMsgArray[i].from+': '+notReadMsgArray[i].time));
          $('#messages').append($('<li>').text(notReadMsgArray[i].msg));
        }
        //clear the msg tha not read
        notReadHasMsghmap.remove(to);
      }
    /****************************show msg that not read end*************************/    
  };
  document.getElementById(id+'_div').appendChild(span);
  document.getElementById(id+'_div').appendChild(href); 
}

function deleteAllOnlineDiv(){
  var div = document.getElementById("online_users_div");
  while(div.hasChildNodes()){
    div.removeChild(div.firstChild);
  }
}

function clearChatRecord(){
  var ul = document.getElementById("messages");
  while(ul.hasChildNodes()){
    ul.removeChild(ul.firstChild);
  }
}

//my hashmap to save msg in native
function HashMap(){  
  /**Map大小**/  
  var size=0;  
  /**对象**/  
  var entry = new Object();  
  /**Map的存put方法**/  
  this.put=function(key,value){  
    if(!this.containsKey(key)){  
      size++;  
    }
    entry[key]=value;  
  } 
  /**  push an ArrayData with the same key      */
  this.push=function(key,value){
    if(!this.containsKey(key)){
      size++;
      entry[key]=new Array(value);
    }else{
      var valueArray = this.get(key);
      if(!isArray(valueArray)){
        return;
      }
      valueArray.push(value);
      this.put(key,valueArray);
    }
  } 
  /**Map取get方法**/  
  this.get=function(key){  
    return this.containsKey(key) ? entry[key] : null;  
  }  
  /**Map删除remove方法**/  
  this.remove=function(key){  
    if(this.containsKey(key) && ( delete entry[key] )){  
      size--;  
    }  
  }  
  /**是否包含Key**/  
  this.containsKey= function (key){  
    return (key in entry);  
  }  
  /**是否包含Value**/  
  this.containsValue=function(value){  
    for(var prop in entry)  
    {  
      if(entry[prop]==value){  
        return true;  
      }  
    }  
    return false;  
  }  
  /**所有的Value**/  
  this.values=function(){  
    var values=new Array();  
    for(var prop in entry)  
    {  
      values.push(entry[prop]);  
    }  
    return values;  
  }  
  /**所有的 Key**/  
  this.keys=function(){  
    var keys=new Array();  
    for(var prop in entry)  
    {  
      keys.push(prop);  
    }  
    return keys;  
  }  
  /**Map size**/  
  this.size=function(){  
    return size;  
  }  
  /**清空Map**/  
  this.clear=function(){  
    size=0;  
    entry=new Object();  
  }  
    
}  

function isArray(obj) {  
  return Object.prototype.toString.call(obj) === '[object Array]';   
}