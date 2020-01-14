
function id_callback(callback)
{
  if(callback && typeof(callback) === "function")
  {
    callback("site_onoff");
    callback("all_onoff");
  }
}




// 'use strict';

// function site_onoff() {
//   chrome.tabs.executeScript(null, {
//     file : 'script.js'
//   }, function() {
//   window.close();
//   });
// }

// function all_onoff() {
//   chrome.tabs.executeScript(null, {
//     file : 'script.js'
//   }, function(obj) {
//     chrome.tabs.executeScript(null, {
//       code:"document.querySelector('#downloadstation a').click();"
//     }, function() {
//       window.close();
//     });
//   });
// }

// print("dddddddddddddgggggggggggdd")
//   var site_onoff = document.getElementById('site_onoff');
//   var all_onoff = document.getElementById("all_onoff");
//   site_onoff.addEventListener('change', site_onoff);
//   all_onoff.addEventListener('change', all_onoff);


// document.querySelector('#all_onoff').addEventListener('change', function () {
//   alert("hello")
//   });
  


function get_checkbox(id)
{
  var check = document.getElementById(id);
  return check.checked;
}

function set_checkbox(id, value)
{
  var check     = document.getElementById(id);
  check.checked = value;
}




document.querySelector('#all_onoff').addEventListener('change', function () {
 
  chrome.tabs.executeScript({
    code: 'document.querySelector("body").innerText'
  }, function (result) {
    if (get_checkbox("all_onoff")) {
      if (result != null) {
        var bodyText = result[0];
      }
      // alert("start");

      var xhr = new XMLHttpRequest();
      var data = {
        reviews : bodyText
      };
      xhr.onreadystatechange = function() { // 요청에 대한 콜백
        if (xhr.readyState === xhr.DONE) { 
          var res = "";
          var count = false;

          if (xhr.status === 200 || xhr.status === 201) {
        
            const obj = JSON.parse(xhr.response);
            var result = obj.predictions;//리스트였으면 
            var myNum = result.length;
            document.querySelector('#result').innerText = myNum;
            var url = "url";
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
              url = tabs[0].url;
              

              result.forEach(function(element) {
                var searchTerm = element.spoiler;

                var getHTML = function ( url, callback ) {
                  // Feature detection
                  if ( !window.XMLHttpRequest ) return;
                  // Create new request
                  var xhr = new XMLHttpRequest();
                  // Setup callback
                  xhr.onload = function() {
                    if ( callback && typeof( callback ) === 'function' ) {
                      callback( this.responseXML );
                    }
                  }
                  // Get the HTML
                  xhr.open( 'GET', url );
                  xhr.responseType = 'document';
                  xhr.send();
                  // alert("egt");
                };
  
                getHTML( url, function (response) {

                  // alert(count);
                  if (count == false){
                    res = response.documentElement.innerHTML;
                    count = true;
                    // alert("11111111?111111")
                  }
                  res = res.split(searchTerm).join("<<     SPOILER     >>");

                });

              });
              //반복문 끝

              if (myNum != 0){
                alert("Spoiler Detected! Open new page without spoiler");
                setTimeout(execute, 3000);
                function execute(){
                   var opened = window.open("");
                   opened.document.write(res);
                }
              }else{
                alert("Spoiler not Detected! Congratulation!");
              }

              // var opened = window.open("");
              // opened.document.write(res);


            });
            //replace 
            // alert("크롭 탭스 밖");
            // alert(res);
            // alert("all done");
          } else {
            console.error(xhr.responseText);
            alert("fail");
            alert(xhr.responseText);
          }
          // alert("요청 성공 실패 밖");

          
        }
      };
      xhr.open('POST', 'http://192.168.0.90:24/predict');
      xhr.setRequestHeader('Content-Type', 'application/json'); // 컨텐츠타입을 json으로
      xhr.send(JSON.stringify(data)); // 데이터를 stringify해서 보냄
      // alert('done'); 
    }
    alert("qwqahahahahaerhaerherhq"+res);
  });
  alert("qwqqqqqqqqqq"+res);
});