/*
 * @Author: wangjie59
 * @Date: 2021-03-22 12:23:00
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-03-23 10:03:01
 * @Description: utils
 * @FilePath: /weixin/Users/wangjie/chromeCrx/autoB2E/js/utils.js
 */

const LOCALNAME = 'autob2e_token.local';


// 选择
const find = function(selector) {
	return document.querySelector(selector);
}

// // 读
// const getStorage = (key) => {
//   let _value = localStorage.getItem(key);
//   return _value;
// }

// // 写
// const setStorage = (key, value) => {
//   localStorage.setItem(key, value);
// }

// // 删
// const removeStorage = (key) => {
//   localStorage.removeItem(key);
// }

// 写
const setStorage = (key, value) => {
  chrome.storage.local.set({[key]: value}, function() {
    console.log(key+' is set to ' + value);
  });
}

// // 读
// const getStorage = (key) => {
//   chrome.storage.local.get([key], function(result) {
//     console.log(key+' currently is ' + result.key);
//     return result;
//   });
// }

// 删
const removeStorage = (key) => {
  chrome.storage.local.remove(key, () => {})
}


// // 获取用户缓存
// const getUserInfo = () => {
//   const USERINFO = getStorage(LOCALNAME);
      
//   if (!USERINFO || !JSON.parse(USERINFO)) {
//     // 未找到用户信息
//     return {};
//   }

//   return JSON.parse(USERINFO);
// }