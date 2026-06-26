/**
 * Oclean Care 远程去广告脚本
 */
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 清空数据结构中的广告内容
        if (obj.data) {
            if (Array.isArray(obj.data)) {
                obj.data = [];
            } else if (typeof obj.data === 'object') {
                obj.data.advertList = [];
                obj.data.showTime = 0;
                obj.data.status = 0;
                if (obj.data.advert) obj.data.advert = null;
            }
        }
        
        // 2. 根目录兜底清除
        obj.showTime = 0;
        obj.advertList = [];
        if (obj.code) obj.code = 200; // 保证状态码正常让App顺利往下走
        
        body = JSON.stringify(obj);
    } catch (e) {
        // 解析失败则不做处理
    }
}

$done({ body });
