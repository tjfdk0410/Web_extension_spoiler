/*jshint esversion: 6 */
/* =====================================================
 Checkbox Load && Storage
 옵션 상태 로딩 및 저장
 ===================================================== */
 var storage = chrome.storage.local;

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
 
 function load_checkbox(id)
 {
   var state = id.substring(5);
   storage.get(state, (option) => {
     set_checkbox(id, option[state]);
   });
 }
 
 function toggle_storage(id)
 {
   var state = id.substring(5);
   if (get_checkbox(id))
     storage.set({[state]: true});
   else
     storage.set({[state]: false});
 }
 
 function click_check(id)
 {
   var font = document.getElementById(id);
   font.addEventListener("click", function() {
     toggle_storage(id);
   });
 }
//  팝업 혹은 옵션 페이지 로드 시 각 옵션의 id값에 따라 체크박스를 로드. 체크하는 기능 활성화
 window.addEventListener('load', () => {
   id_callback(load_checkbox);
   id_callback(click_check);
 });