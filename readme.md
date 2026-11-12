# Deeke · 多平台获客自动化

面向创业团队、获客运营与技术合作方的 Android 端自动化获客工具。  
覆盖 **抖音 / 小红书 / 快手 / 视频号**，支持推荐引流、同行截流、私信拓客、AI 话术、评论采集与远程协同。

底层基于自研 <a href="https://doc.deeke.cn" target="_blank" rel="noopener noreferrer">DeekeScript</a>；支持贴牌 OEM、源码交付与定制开发。

快速导航：[截图](#软件实景截图展示) · [能解决什么问题](#能解决什么问题) · [操作模式](#操作模式无障碍--hid--无线-adb) · [平台功能](#平台功能一览) · [产品能力](#产品能力) · [技术扩展](#技术底座与扩展) · [落地与合作](#落地建议与合作) · [联系合作](#联系合作)

---

## 软件实景截图展示

<div style="justify-content: space-between;flex-wrap:wrap;width:100%;">
<img alt="Deeke主界面第一屏" src="photoNew/webp/home-1.webp" width="24%">
<img alt="Deeke主界面第二屏" src="photoNew/webp/home2.webp" width="24%">
<img alt="Deeke主界面第三屏" src="photoNew/webp/home3.webp" width="24%">
<img alt="Deeke主界面第四屏" src="photoNew/webp/home4.webp" width="24%">

<img alt="Deeke工具箱" src="photoNew/webp/home5.webp" width="24%">
<img alt="Deeke推荐营销设置页" src="photoNew/webp/function.webp" width="24%">
<img alt="Deeke推荐营销设置页" src="photoNew/webp/function2.webp" width="24%">
<img alt="Deeke权限设置" src="photoNew/webp/home-setting.webp" width="24%">

<img alt="Deeke工商企业查询" src="photoNew/webp/company.webp" width="24%">
<img alt="Deeke工商企业手机号" src="photoNew/webp/company-2.webp" width="24%">
<img alt="Deeke工商企业" src="photoNew/webp/company-detail.webp" width="24%">
<img alt="Deeke账户" src="photoNew/webp/account.webp" width="24%">

<img alt="Deeke账户充值" src="photoNew/webp/company-pay.webp" width="24%">
<img alt="Deeke智能体" src="photoNew/webp/agent.webp" width="24%">
<img alt="Deeke设置页面" src="photoNew/webp/setting.webp" width="24%">
<img alt="Deeke话术库" src="photoNew/webp/speech.webp" width="24%">

<img alt="Deeke智能话术" src="photoNew/webp/speech-ai.webp" width="24%">
<img alt="Deeke采集" src="photoNew/webp/grab.webp" width="24%">
<img alt="Deeke采集列表" src="photoNew/webp/grab2.webp" width="24%">
<img alt="Deeke采集详情" src="photoNew/webp/grab3.webp" width="24%">

<img alt="Deeke设置页面提示" src="photoNew/webp/setting2.webp" width="24%">
<img alt="Deeke功能说明" src="photoNew/webp/func.webp" width="24%">
<img alt="Deeke支付页面" src="photoNew/webp/pay.webp" width="24%">
<img alt="Deeke语音评论" src="photoNew/webp/comment-voice.webp" width="24%">

<img alt="Deeke数据统计" src="photoNew/webp/statistics.webp" width="24%">
<img alt="Deeke扫码设置" src="photoNew/webp/scan.webp" width="24%">
<img alt="Deeke图标" src="photoNew/webp/icon.webp" width="24%">
<img alt="Deeke演示" src="photoNew/webp/demo.webp" width="24%"/>
</div>

---

## 能解决什么问题

- **批量找到意向用户**：按关键词、同城、粉丝画像、UID、直播间、评论区等维度筛选目标人群  
- **自动完成获客动作**：点赞、评论、关注、私信、收藏、回访、语音评论等，贴近真人节奏  
- **降低人工成本**：一套流程同时服务抖音、小红书、快手、视频号  
- **可规模化分发**：支持贴牌品牌、代理后台、卡密体系，方便做产品化与渠道销售  

---

## 操作模式：无障碍 / HID / 无线 ADB

Deeke 提供可切换的行为模式，兼顾兼容性与安全性：

| 模式 | 识别方式 | 点击 / 滑动 / 输入 | 适合场景 |
| --- | --- | --- | --- |
| 纯无障碍（默认） | 无障碍 | 无障碍 | 开箱即用、快速验证流程 |
| Hid 蓝牙 | 无障碍识别界面 | Hid 外设输入 | 更接近人工操作，推荐日常获客 |
| 无线 ADB | 无障碍识别界面 | 无线 ADB 输入 | 需要更高稳定性与可控输入时 |

说明：

- 开启 **Hid** 或 **无线 ADB** 后，点击、滑动、键盘输入不再走无障碍操作，无障碍仅用于识别界面  
- Hid 方式更接近人工操作，降低自动化特征，**强烈推荐**  
- 使用前仍需按提示开启无障碍、悬浮窗、图色等基础权限  

---

## 平台功能一览

### 抖音

| 分组 | 功能 |
| --- | --- |
| 万能引流 | 推荐营销、同城营销、工具箱 |
| 同行截流 | 粉丝截流、关注截流、评论区截流、直播间截流、粉丝群截流、智能询盘 |
| 养号涨粉 | 垂直养号、快速涨粉、喜欢截流 |
| 精准拓客 | 轻松拓客、赞回访、好友转化 |
| UID 拓客 | UID 私信、UID 邀约 |
| 其他 | 精准行业、AI 回复、团购营销、直播间弹幕、视频截流、评论截流 II |

### 小红书

| 分组 | 功能 |
| --- | --- |
| 万能引流 | 万能营销、同行拓客、赞回访 |
| 同行截流 | 评论区截流、智能询盘 |
| 其他 | 用户 ID 私信、AI 回复、垂直养号 |

### 快手

| 分组 | 功能 |
| --- | --- |
| 万能引流 | 推荐营销、同城营销、精准行业 |
| 其他 | 评论区截流、智能询盘 |

### 视频号

| 分组 | 功能 |
| --- | --- |
| 万能引流 | 推荐营销、评论区截流、智能询盘 |

---

## 产品能力

### 获客与运营

- **话术库 / 智能话术**：统一评论与私信模板，可接入 AI 角色（如扣子智能体、DeepSeek / 豆包等大模型）  
- **语音评论**：支持抖音、小红书等场景的 AI 语音评论  
- **评论采集**：采集评论区线索，沉淀可跟进名单  
- **数据统计**：查看运行次数、任务进度与近 7 日趋势  
- **远程控制**：多设备远程触发任务，适合团队协同  

### 增长辅助

- **企业查询**：工商信息查询，辅助 B 端拓客与线索筛选  
- **权限与稳定性引导**：无障碍、悬浮窗、图色权限按步骤开启  
- **日志上传**：异常时可一键上传日志，便于售后定位  

### 商业化能力

- App 内支付与试用开通  
- 贴牌 OEM：Logo、名称、主题可定制，配套代理 / 卡密后台  
- 源码交付与功能定制，适合二次开发与私有化部署  

---

## 技术底座与扩展

- 自研运行时：<a href="https://doc.deeke.cn" target="_blank" rel="noopener noreferrer">DeekeScript 文档</a>  
- 任务脚本按平台拆分，可扩展新 App / 新流程  
- 支持行为模式切换（无障碍 / Hid / 无线 ADB），脚本侧可按环境适配  
- OEM 与源码方案可快速交付品牌版；复杂能力可按模块定制  
- 适合二次开发、私有化交付、渠道贴牌与内部获客中台搭建  

---

## 落地建议与合作

### 常见落地路径

1. 先明确获客目标：同城到店、私域沉淀、直播转化、同行截流等  
2. 选择对应平台功能组合：先引流筛选，再私信 / 评论深度跟进  
3. 控制互动频率与停留间隔，新号建议先养号 2-3 天  
4. 需要品牌化销售时，走贴牌或源码，用后台发卡给代理与终端用户  

### 合作方式

- **试用**：App 内可按天试用完整功能  
- **正式版**：按年订阅，功能与试用一致  
- **贴牌 OEM**：一次性交付品牌版 + 代理后台；支持自备服务器或托管  
- **源码**：可自行二次开发；升级可按需合并  
- **定制**：常规功能按项报价，复杂模块评估后报价  

> 具体报价与政策以商务沟通为准；年卡用户可申请兼职销售返佣。

---

## 后台系统展示

<div style="justify-content: space-between;flex-wrap:wrap;width:100%;">
<img alt="Deeke后台" src="photoNew/photo/webp/backend-main.webp" width="100%">
<img alt="Deeke代理后台" src="photoNew/photo/webp/backend-agent.webp" width="100%">
<img alt="Deeke后台登录界面" src="photoNew/photo/webp/backend-login.webp" width="100%">
<img alt="Deeke后台数据" src="photoNew/photo/webp/backend-data.webp" width="100%">
</div>

---

## 为什么选择 Deeke

1. **底层自研**：DeekeScript 自控，稳定性与兼容性更好  
2. **操作更安全可选**：纯无障碍、Hid、无线 ADB 按场景切换  
3. **功能面向获客结果**：引流、截流、拓客、AI 回复、采集一体  
4. **可产品化分发**：贴牌、代理后台、源码、定制齐全  
5. **上手路径清晰**：界面简洁，按提示开权限即可跑通  

---

## 联系合作

贴牌、定制、源码、代理合作，请扫码联系：

<a id="联系合作"></a>
<div style="justify-content: space-between;flex-wrap:wrap;width:100%;">
<img alt="Deeke技术支持" src="photoNew/photo/webp/weixin.webp" width="30%">
</div>

框架文档：<a href="https://doc.deeke.cn" target="_blank" rel="noopener noreferrer">https://doc.deeke.cn</a>

<img src="https://home.deeke.top/Index/githubStatistic?name=github-ad-deeke" width="1" height="1" alt="" />
