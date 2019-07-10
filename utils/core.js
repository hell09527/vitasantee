// 部分wx api与常用方法底层封装
const core = {
    /**==========
     * wxapi数据
     * ========== */
    systemInfo:{
        brand: '设备品牌',
        model: '设备型号',
        pixelRatio: '设备像素比',
        screenWidth: '屏幕宽度',
        screenHeight: '屏幕高度',
        language: '微信设置的语言',
        version: '微信版本号',
        system: '操作系统及版本',
        platform: '客户端平台',
        SDKVersion: '客户端基础库版本',
        fontSizeSetting: '用户字体大小',
        // benchmarkLevel: '设备性能等级',
        // albumAuthorized: '允许微信使用相册的开关',
        // cameraAuthorized: '允许微信使用摄像头的开关',
        // locationAuthorized: '允许微信使用定位的开关',
        // microphoneAuthorized: '允许微信使用麦克风的开关',
        // notificationAuthorized: '允许微信通知的开关',
        // notificationAlertAuthorized: '允许微信通知带有提醒的开关',
        // notificationBadgeAuthorized: '允许微信通知带有标记的开关',
        // notificationSoundAuthorized: '允许微信通知带有声音的开关',
        // bluetoothEnabled: '蓝牙的系统开关',
        // locationEnabled: '地理位置的系统开关',
        // wifiEnabled: 'Wi-Fi 的系统开关',
        // safeArea: '在竖屏正方向下的安全区域'
    },
    /**==========
     * wxapi部分
     * ========== */
    /**
     * @description 通用微信api -> Promise封装
     * @param {string} key  微信api名称(默认为登录)
     * @return {promise}
     *  */
    wxApi(key = 'login',config = {}) {
        return new Promise((resolve, reject) => {
            config.success = res => resolve(res);
            config.fail = e => reject(e);
            wx[key](config);
        });
    },
    /**
    * @description 获取页面对象
    * @param {string} route  页面路由信息
    * @return {page}
     *  */
    getPage(route = 'pages/index/index') {
        let all = getCurrentPages();
        for (let i = 0, len = all.length; i < len; i++) {
            if (all[i].route == route) return all[i];
        }
        return null;
    },
    /**
    * @description 权限检查(并自动获取授权)
    * @param {string} scope  权限字符串(用户授权权限无法使用,自动跳过)
    * @return {promise}
     *  */
    checkAuthorize(scope) {
        // 自动跳过权限列表
        let exclude = ['scope.userInfo'];
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting[scope]) {
                        if (exclude.indexOf(scope) != -1) {
                            reject(scope + '未授权！');
                        } else {
                            wx.authorize({
                                scope: scope,
                                success: () => resolve(),
                                fail: e => reject()
                            });
                        }
                    } else {
                        resolve();
                    }
                },
                fail: e => reject(e)
            })
        });
    },
    /**
    * tips提示
    * @param {string} title  提示信息
    * @param {string} icon   提示图标
    * @param {string} complete  提示完成回调
     *  */
    toast({ title, icon = 'none', complete = ()=>{} }) {
        let config = {
            title,
            icon,
            duration: 1500,
            mask: true,
            complete
        }
        wx.showToast(config);
    },
    /**
    * @description 弹框提示
    * @param {object} param  提示框配置参数
     *  */
    showModal(param) {
        // 默认自定义配置
        let defaultConfig = {
            title: '提示',
            showCancel: false,
            confirmColor: '#3CC51F'
        };
        // 合并配置
        let config = Object.assign({}, defaultConfig, param);
        return this.wxApi('showModal',config);
    },
    /**
    * @description 页面跳转
    * @param {string} url  跳转路由
     *  */
    link(url) {
        return this.wxApi('navigateTo',{ url });
    },
    /**==========
     * 常用方法部分
     * ========== */
    /**
    * @description 检测对象是否为空
    * @param {object} obj  检测对象
     *  */
    isObjectEmpty(obj) {
        if (obj instanceof Object) {
            return Object.keys(obj).length > 0;
        } else {
            throw '非对象空检测';
        }
    }
}

module.exports = core;
