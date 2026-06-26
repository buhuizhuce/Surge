/**
 * Oclean Care 远程去广告脚本 (精细兼容版 - 解决头像丢失与倒计时)
 */
let url = $request.url;
let body = $response.body;
let obj = {};

if (body) {
    try {
        obj = JSON.parse(body);
    } catch (e) {
        obj = {};
    }
}

// 1. 精准重构 SafetyGetStartAdvert 返回：彻底根除开屏广告与倒计时
// 我们模拟一个完整的、code 为 200 的“成功”响应，但所有广告字段全部清空
if (url.includes("SafetyGetStartAdvert")) {
    obj = {
        "code": 200,
        "message": "success",
        "data": {
            "id": 0,
            "name": "no_advert",
            "type": 0,
            "showTime": 0,       // 关键：强制展示时间为 0，消除倒计时
            "startTime": "2020-01-01 00:00:00",
            "endTime": "2020-01-01 00:00:00",
            "status": 0,         // 关键：状态设为 0 (不显示)
            "advert": null,      // 关键：具体广告内容置空
            "advertList": []     // 关键：广告列表置空
        },
        "success": true
    };
}

// 2. 精细清洗 GetAllResources：只清理开屏和弹窗，【保留其他业务字段】
if (url.includes("GetAllResources")) {
    if (obj.data) {
        // 🚨 修正：不再使用关键词盲洗，转为精准清洗可疑列表
        // 保留可能包含头像链接的通用数据结构，只清洗具体的列表和标志位
        
        // 洗掉 GetAllResources 里可能潜伏的开屏广告列表
        if (Array.isArray(obj.data.advertList)) {
            obj.data.advertList = [];
        }
        
        // 洗掉 GetAllResources 里的弹窗广告 (弹窗叫 Popup)
        if (Array.isArray(obj.data.popupList)) {
            obj.data.popupList = [];
        }
        
        // 洗掉特定开屏倒计时标志
        if (typeof obj.data.splashShowTime === 'number') {
            obj.data.splashShowTime = 0;
        }

        // ✅ 不对 obj.data 或 obj.data 里的非特定列表执行深度盲洗，从而保留头像链接
    }
}

$done({ body: JSON.stringify(obj) });
