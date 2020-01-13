var storage = chrome.storage.local;

function load_model(){
  //post 해오기
}

function unload(file)
{
  var node = document.getElementById(file);
  if (node)
    node.parentNode.removeChild(node);
}

function on_off(file, loadCallback, unloadCallback)
{
  storage.get(file, (option) => {
    if (option[file])
    {
      if(loadCallback && typeof(loadCallback) === "function")
      {
        loadCallback(file);
        if(loadOption && typeof(loadOption) === "function")
          loadOption(file);
        if(file === "subpixel")
          unload("sharpen");
        if(file === "mathjax")
          load_mathjax();
      }
    } else
    {
      if(unloadCallback && typeof(unloadCallback) === "function")
      {
        unloadCallback(file);
        if(unloadOption && typeof(unloadOption) === "function")
          unloadOption(file);
      }
    }
  });
}

function check(file)
{
  on_off(file, load_model, unload);
}


function update()
{
  check("site_onoff");
  check("all_onoff");
}


//main code
window.addEventListener('load',update);
chrome.storage.onChanged.addListener(update);

//====================options
var feature = {
  site_onoff,
  all_onoff
};



// function load_option(file)
// {
//   feature[file].forEach((option) => {
//     on_off(option, load_model, unload);
//   });
// }

// function unload_option(file)
// {
//   feature[file].forEach((option) => {
//     unload(option);
//   });
// }







function matching(model){
  chrome.tabs.executeScript({
    code: 'document.querySelector("body").innerText'
  }, function (result) {
    // 위의 코드가 실행된 후에 이 함수를 호출해주세요. 그 때 result에 담아주세요. 
    //이 문서에서 body  태그 아래에 있는 모든 텍스를 가져온다. 그 결과를 bodyText라는 변수에 담는다.
    var bodyText = result[0];
    var bodySentence = bodyText.split('.')

    print(body)
    

    // id값이 result인 태그에 결과를 추가한다. 
    document.querySelector('#result').innerText = myNum + '/' + bodyNum + '(' + (per) + '%)';

  });
}
  
  
//크롬 스토리지에 저장된 값을 가져오세요. 
chrome.storage.sync.get(function (data) {
  // #user의 값으로 data의 값을 입력해주세요. 
  document.querySelector('#user').value = data.userWords;
  
  //분석해서 그 결과를 #result에 넣어주세요. 
  matching(data.userWords);
  
});
  
//컨텐츠 페이지의 #user 입력된 값이 변경 되었을 '때'
document.querySelector('#all_onoff').addEventListener('change', function () {
  
  
  // 크롬 스토리지에 입력값을 저장한다. 
  chrome.storage.sync.set({
    userWords: user
  });
  
  //컨텐츠 페이지를 대상으로 코드를 실행해주세요. 
  matching(user);
  
});