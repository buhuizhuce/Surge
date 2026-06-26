/**
 * Oclean Care 远程去广告脚本 (终极完美版)
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

// 1. 精准重构广告接口返回，不给 App 任何死角
if (url.includes("SafetyGetStartAdvert")) {
    obj = {
        "code": 200,
        "message": "success",
        "data": {
            "status": 0,
            "showTime": 0,
            "advertList": [],
            "advert": null
        },
        "showTime": 0,
        "advertList": []
    };
}

// 2. 清洗全局资源接口
if (url.includes("GetAllResources")) {
    if (obj.data) {
        const targetKeys = ["advert", "advertList", "splash", "popup", "showTime", "startButton"];
        let cleanConfig = (item) => {
            if (item && typeof item === 'object') {
                for (let key in item) {
                    if (targetKeys.some(k => key.toLowerCase().includes(k))) {
                        if (typeof item[key] === 'number') item[key] = 0;
                        else if (Array.isArray(item[key])) item[key] = [];
                        else item[key] = null;
                    } else {
                        cleanConfig(item[key]);
                    }
                }
            }
        };
        cleanConfig(obj.data);
    }
}

$done({ body: JSON.stringify(obj) });
