/*
 * @Author: wangjie59
 * @Date: 2021-03-22 11:12:18
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-03-23 10:46:54
 * @Description: popup.js
 * @FilePath: /weixin/Users/wangjie/chromeCrx/autoB2E/js/popup.js
 */
const sendMessage = chrome.tabs.sendMessage;
const onMessage = chrome.runtime.onMessage;
const query = chrome.tabs.query;

// TODO 自动登录的switch
const checkbox = find('#checkbox');

const container = find('#container');
const confirmBtn = find('#confirmBtn');
const addContainer = find('#addContainer');

const accountBtnArea = find('#accountBtnArea');

const accountInput = find('#account');
const passwordInput = find('#password');
const ACCOUNT_INFO = {};

const Plugin = {

	initButton() {
		// 查找缓存 localStorage 中的信息
		chrome.storage.local.get([LOCALNAME, 'isAutoLogin'], (result) => {
			const { account, password } = JSON.parse(result[LOCALNAME] || '{}');
			
			if (!account) {
				this.showPanel();
				return;
			}
			this.hidePanel();
	
			ACCOUNT_INFO.account = account;
			ACCOUNT_INFO.password = password;
	
			// 自动登录
			if (result.isAutoLogin) {
				this.fillTheBlank(ACCOUNT_INFO);
			}
	
			// 查找 localStorage ，生成按钮
			this.createButton(account);
		});
	},


	bindEvent() {
		// 对 account-btn 和 delete-btn 做事件代理
		accountBtnArea.addEventListener('click', (e) => {
			e.stopPropagation();
			let className = e.target.className;
			console.log('className', className);

			if (className === 'account-btn'){
				// 填充页面的 input
				console.log('login user', ACCOUNT_INFO.account);
				
				this.fillTheBlank(ACCOUNT_INFO);
			} else if (className === 'fa fa-trash'){
				// 删除当前项
				// alert(getStorage(ACCOUNT_INFO.account));
				
				// removeStorage(LOCALNAME);
				// this.fillTheBlank({}, 'REMOVE_STORAGE');
				chrome.storage.local.remove(LOCALNAME, () => {
					location.reload();
				});
			} else {
				console.error('none button');
			}
		}, false);

		//确认按钮
		confirmBtn.addEventListener('click', () => {
			ACCOUNT_INFO.account = accountInput.value;
			ACCOUNT_INFO.password = passwordInput.value;

			// empty check
			if (ACCOUNT_INFO.account === '' || ACCOUNT_INFO.password === '') {
				console.info('input incomplete.');
				return;
			}

			// alert(JSON.stringify(ACCOUNT_INFO));
			
			// setStorage(LOCALNAME, JSON.stringify(ACCOUNT_INFO));
			// alert(getStorage(LOCALNAME));
			// this.fillTheBlank(ACCOUNT_INFO, 'SET_STORAGE');
			chrome.storage.local.set({[LOCALNAME]: JSON.stringify(ACCOUNT_INFO)}, () => {
				console.log(LOCALNAME+' is set to ' + ACCOUNT_INFO);
				this.clearInput();
				location.reload();
			});

		}, false);

	},

	// 展示输入框
	showPanel: function() {
		addContainer.style.display = 'flex';
		accountBtnArea.style.display = 'none';
	},

	// 隐藏输入框
	hidePanel: function() {
		addContainer.style.display = 'none';
		accountBtnArea.style.display = 'flex';
	},

	// 清空 input
	clearInput() {
		accountInput.value = '';
		passwordInput.value = '';
		this.hidePanel();
	},

	// 新建DOM节点
	rander(dom, className) {
		const div = document.createElement(dom);
		div.className = className;
		return div;
	},

	// 在 showAddButton 之前加入一个 button
	createButton(account) {

		// button-row
		const div = this.rander('div', 'button-row');

		// account-btn
		const btn = this.rander('button', 'account-btn');
		btn.innerText = account;

		// icon-container
		const iconDiv = this.rander('div', 'icon-container');

		// icon
		const icon = this.rander('i', 'fa fa-trash');

		iconDiv.appendChild(icon);

		div.appendChild(btn);
		div.appendChild(iconDiv);
		
		accountBtnArea.appendChild(div);
	},

	// 发送指令到 content_script，填充页面的 input
	fillTheBlank(params, action = 'AUTO_LOGIN') {
		query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				sendMessage(tabs[0].id, {
					action,
					...params
				}, function(res) {
					console.log(res);
			});
		});
	},

	// popup初始化
	init: function() {
		// this.fillTheBlank({}, 'REMOVE_STORAGE');

		this.initButton();
		this.bindEvent();
	}
};

Plugin.init();
