/*
 * @Author: wangjie59
 * @Date: 2021-03-22 09:54:18
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-03-23 10:51:01
 * @Description: contentscript
 * @FilePath: /weixin/Users/wangjie/chromeCrx/autoB2E/js/contentscript.js
 */

console.log('autoLogin：insert script => b2e.js');

const sendMessage = chrome.runtime.sendMessage;
const onMessage = chrome.runtime.onMessage;


const accountInput = find('#j_username');
const passwordInput = find('#j_password');
const loginButton = find('button.white.loginBt');
let timer;
const Page = {
  mounted() {
    // TODO: test
    // setStorage('isAutoLogin', false);
    // setStorage(LOCALNAME, JSON.stringify({account: 'wangjie59', password: 'Dhdemima.1'}))
  
    // 查找缓存 localStorage 中的信息
    
    chrome.storage.local.get(LOCALNAME, (result) => {
      const USERINFO = JSON.parse(result[LOCALNAME] || '{}')
      console.log('account currently is ' + USERINFO.account);
      if (!USERINFO.account) {
        console.log('none user info');
        
        // 未找到用户信息
        this.bindEvent();
      } else {
        this.autoLogin(USERINFO);
    
        clearTimeout(timer);
      }
    });

  },

  // 自动登录
  autoLogin(req) {
    console.log('Fill the login information of B2E...');
    accountInput.value = req.account;
    passwordInput.value = req.password;
    
    loginButton.click();
  },

  // pop手动登录
  bindEvent() {
    onMessage.addListener((req, sender, sendResponse) => {      
      if (req.action === 'AUTO_LOGIN') {
        this.autoLogin(req);
        sendResponse('Success.');
      } else if (req.action === 'SET_STORAGE') {
        setStorage(LOCALNAME, JSON.stringify(req));
      } else if (req.action === 'REMOVE_STORAGE') {
        removeStorage(LOCALNAME);
      }
    });
  },

  // 页面初始化
  init: function () {
    timer = setTimeout(() => {
      this.mounted()
    }, 200);
  }
};

Page.init();
