/**
 * Surge 策略流量收集脚本
 * 功能：根据模块传入的参数，收集并持久化存储指定策略的域名
 */

// 1. 获取用户在模块参数里填写的判定策略组名称
const targetPolicy = $argument;
if (!targetPolicy) {
    $done({});
}

// 2. 安全获取当前请求的域名
const host = $request.headers['Host'] || $request.hostname;

// 3. 获取当前请求在 Surge 内部最终命中的策略/策略组名称
const currentPolicy = $session.policy;

// 4. 核心逻辑：如果当前策略与目标策略一致，且域名有效，执行记录
if (currentPolicy === targetPolicy && host) {
    // 定义在持久化存储中的 Key，根据不同策略动态生成，防止数据混淆
    const storageKey = `Collected_${targetPolicy}`;
    
    // 读取已有的域名列表
    let savedHosts = $persistentStore.read(storageKey);
    let hostList = savedHosts ? JSON.parse(savedHosts) : [];
    
    // 如果域名不在列表里，追加并写入存储
    if (!hostList.includes(host)) {
        hostList.push(host);
        
        // 重新写入本地持久化存储
        const success = $persistentStore.write(JSON.stringify(hostList), storageKey);
        
        if (success) {
            // 可选：发送通知（频繁触发可能会打扰，调试时可开启）
            // $notification.post(`[${targetPolicy}] 收集到新域名`, "", host);
            console.log(`[CollectTool] 成功记录走 ${targetPolicy} 的新域名: ${host}`);
        } else {
            console.log(`[CollectTool] 写入存储失败，可能数据量过大`);
        }
    }
}

// 必须执行 $done，让请求正常通过
$done({});
