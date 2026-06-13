#!/usr/bin/env python3
"""Merge anticorruption_data.py with Wikipedia-sourced cases + manual 2025-2026补录.

Sources: 维基百科「中共十八大后落马官员列表」快照、中央纪委国家监委公开通报。
Writes scripts/anticorruption_data.py and prints before/after stats.
"""
from __future__ import annotations

import re
from pathlib import Path

from anticorruption_data import CASES as EXISTING

ROOT = Path(__file__).resolve().parents[1]
WIKI_SNAPSHOT = Path(__file__).resolve().parent / ".cache" / "wiki_anticorruption.txt"
OUT = Path(__file__).resolve().parent / "anticorruption_data.py"

# 维基快照（2026-06 抓取）；若本地无缓存则使用内嵌表
EMBEDDED_WIKI_ROWS = """
| 魏凤和 | 中央军委原委员、原国务委员兼国防部部长 | 2024年6月27日 | 开除党籍、开除军籍 |
| 李尚福 | 中央军委委员、国务委员兼国防部部长 | 2024年6月27日 | 开除党籍、开除军籍 |
| 何卫东 | 中共中央政治局委员、中央军委副主席 | 2025年10月17日 | 开除党籍、开除军籍 |
| 张又侠 | 中共中央政治局委员、中央军委副主席 | 2026年1月24日 | 立案审查调查 |
| 孙志刚 | 全国人大财政经济委员会原副主任委员，中共贵州省委原书记 | 2023年8月28日 | 开除党籍、判处死缓终身监禁 |
| 李钺锋 | 全国人大常委会委员、台盟中央常务副主席 | 2024年3月23日 | 开除公职、判处无期徒刑 |
| 唐一军 | 江西省政协党组书记、主席，司法部原部长 | 2024年4月2日 | 开除党籍、判处无期徒刑 |
| 苟仲文 | 全国政协常委、民族和宗教委员会副主任，国家体育总局原局长 | 2024年5月30日 | 开除党籍、判处死缓终身监禁 |
| 李微微 | 全国政协人口资源环境委员会副主任，湖南省政协原主席 | 2024年7月29日 | 开除党籍、判处无期徒刑 |
| 齐同生 | 宁夏回族自治区政协原党组书记、主席 | 2024年10月8日 | 开除党籍、判处死缓 |
| 吴存荣 | 山西省政协党组书记、主席 | 2024年12月16日 | 开除党籍、判处无期徒刑 |
| 蓝天立 | 中共广西壮族自治区党委副书记、区人民政府主席 | 2025年5月16日 | 开除党籍、移送司法 |
| 刘慧 | 全国政协教科卫体委员会原副主任，宁夏回族自治区政府原主席 | 2025年7月18日 | 接受审查调查 |
| 王莉霞 | 中共内蒙古自治区党委副书记，区政府主席 | 2025年8月22日 | 开除党籍、移送司法 |
| 许达哲 | 全国人大常委会委员，中共湖南省委原书记 | 2025年10月28日 | 罢免全国人大代表 |
| 孙绍骋 | 全国人大社会建设委员会副主任委员，内蒙古党委原书记 | 2026年1月29日 | 接受审查调查 |
| 王祥喜 | 应急管理部党委书记、部长 | 2026年1月31日 | 接受审查调查 |
| 易炼红 | 全国人大财政经济委员会副主任委员，江西省委原书记 | 2026年2月10日 | 接受审查调查 |
| 胡衡华 | 中共重庆市委副书记、市政府市长 | 2026年3月20日 | 接受审查调查 |
| 付忠伟 | 沈阳市人大常委会党组书记、主任 | 2022年11月9日 | 开除党籍、判处有期徒刑十五年 |
| 纪国刚 | 西藏自治区人大常委会副主任 | 2022年11月16日 | 开除党籍、判处有期徒刑十三年 |
| 张晓霈 | 吉林省政协原副主席 | 2022年11月25日 | 开除党籍、判处有期徒刑九年 |
| 王雪峰 | 河北省人大常委会原副主任 | 2023年1月6日 | 开除党籍、判处有期徒刑十八年 |
| 汲斌昌 | 青岛市政协主席、党组书记 | 2023年1月6日 | 开除党籍、判处死缓 |
| 易鹏飞 | 湖南省政协党组成员、原副主席 | 2023年2月5日 | 开除党籍、判处无期徒刑 |
| 郝宏军 | 大连市政协主席、党组书记 | 2023年2月5日 | 开除党籍、判处无期徒刑 |
| 崔茂虎 | 中共中央统战部原副部长、国家宗教事务局原局长 | 2023年3月18日 | 开除党籍、判处有期徒刑十一年 |
| 孙述涛 | 山东省政协党组成员、副主席 | 2023年3月28日 | 开除党籍、判处无期徒刑 |
| 殷美根 | 江西省人大常委会党组副书记、副主任 | 2023年3月29日 | 开除党籍、判处死缓 |
| 刘连舸 | 中国银行原党委书记、董事长 | 2023年3月31日 | 开除党籍、判处死缓 |
| 李晓鹏 | 中国光大集团原党委书记、董事长 | 2023年4月5日 | 开除党籍、判处有期徒刑十五年 |
| 熊雪 | 重庆市政府党组成员、原副市长 | 2023年5月11日 | 开除党籍、判处死缓 |
| 骆玉林 | 国务院国资委原副部长级干部 | 2023年5月17日 | 开除党籍、判处死缓限制减刑 |
| 李金柱 | 陕西省人大常委会原副主任 | 2023年5月29日 | 开除党籍、判处死缓 |
| 陈继兴 | 广东省人大常委会原党组成员、副主任 | 2023年7月9日 | 开除党籍、判处死缓 |
| 唐双宁 | 中国光大集团原党委书记、董事长 | 2023年7月15日 | 开除党籍、判处有期徒刑十二年 |
| 商黎光 | 中共山西省委副书记 | 2023年9月5日 | 开除党籍、判处无期徒刑 |
| 李海涛 | 黑龙江省政协党组成员、副主席 | 2023年9月16日 | 开除党籍、判处无期徒刑 |
| 凌成兴 | 国家烟草专卖局原党组书记、局长 | 2023年10月23日 | 开除党籍、判处有期徒刑十六年 |
| 李鹏新 | 新疆维吾尔自治区党委原副书记 | 2023年12月11日 | 开除党籍、判处死缓限制减刑 |
| 吴燕生 | 中国航天科技集团原董事长、党组书记 | 2023年12月27日 | 撤销全国政协委员资格 |
| 刘石泉 | 中国兵器工业集团原董事长、党组书记 | 2023年12月27日 | 撤销全国政协委员资格 |
| 苏增添 | 福建省人大常委会原党组副书记、副主任 | 2024年1月21日 | 开除党籍、判处死缓 |
| 王宜林 | 中国石油天然气集团原党组书记、董事长 | 2024年2月2日 | 开除党籍、判处有期徒刑十三年 |
| 胡强 | 江西省政协原副主席 | 2024年2月21日 | 开除党籍、判处有期徒刑十三年 |
| 李勇 | 中国海洋石油集团原党组副书记、总经理 | 2024年3月15日 | 开除党籍、判处有期徒刑十四年 |
| 刘跃进 | 十三届全国政协外事委员会委员、公安部原反恐专员 | 2024年3月18日 | 开除党籍、判处死缓 |
| 杜梓 | 内蒙古自治区人大常委会原党组副书记、副主任 | 2024年4月15日 | 开除党籍、判处有期徒刑十五年 |
| 秦如培 | 广西壮族自治区党委原常委、自治区政府原副主席 | 2024年4月16日 | 开除党籍、判处死缓 |
| 高朋 | 北京市政府党组成员、副市长 | 2024年4月22日 | 开除党籍、判处有期徒刑十二年 |
| 刘志强 | 司法部原党组成员、副部长 | 2024年4月30日 | 开除党籍、判处有期徒刑十三年 |
| 刘星泰 | 海南省人大常委会党组副书记、副主任 | 2024年5月22日 | 开除党籍、判处死缓 |
| 杨子兴 | 甘肃省政府原党组成员、副省长 | 2024年6月12日 | 开除党籍、判处有期徒刑十四年 |
| 洪礼和 | 江西省人大常委会原党组副书记、副主任 | 2024年6月19日 | 开除党籍、移送司法 |
| 张建春 | 中共中央宣传部副部长 | 2024年6月21日 | 开除党籍、判处有期徒刑十四年 |
| 谭瑞松 | 中国航空工业集团原党组书记、董事长 | 2024年8月27日 | 开除党籍、判处死缓 |
| 杜玉波 | 十三届全国人大教科文卫委员会副主任委员，教育部原副部长 | 2024年9月18日 | 开除党籍、判处有期徒刑十五年 |
| 李刚 | 中央纪委国家监委驻中央组织部纪检监察组组长 | 2024年9月30日 | 开除党籍、判处有期徒刑十五年 |
| 刘满仓 | 河南省人大常委会原党组副书记、副主任 | 2024年10月17日 | 开除党籍、移送司法 |
| 赵金云 | 甘肃省政府副省长 | 2024年10月25日 | 开除公职、判处有期徒刑十五年 |
| 陆克华 | 中共重庆市委常委、政法委书记 | 2024年11月4日 | 开除党籍、移送司法 |
| 朱芝松 | 上海市委常委、浦东新区区委书记 | 2024年11月27日 | 开除党籍、移送司法 |
| 马丰胜 | 青海省政协党组成员、副主席 | 2024年12月11日 | 开除党籍、判处有期徒刑十四年 |
| 寇伟 | 中国大唐集团原党组副书记、总经理 | 2024年12月21日 | 开除党籍、移送司法 |
| 周家斌 | 广西壮族自治区人大常委会党组成员、副主任，桂林市委书记 | 2024年12月28日 | 开除党籍、移送司法 |
| 周喜安 | 安徽省政协党组成员、副主席 | 2025年2月6日 | 开除党籍、移送司法 |
| 王中和 | 内蒙古自治区政协原党组副书记、副主席 | 2025年2月16日 | 开除党籍、移送司法 |
| 周德睿 | 中共天津市委常委、组织部部长 | 2025年3月13日 | 开除党籍、移送司法 |
| 李文荣 | 云南省人大常委会党组成员、副主任 | 2025年3月18日 | 开除党籍、移送司法 |
| 王会民 | 中央纪委国家监委驻证监会纪检监察组原组长 | 2025年3月21日 | 开除党籍、移送司法 |
| 徐宪平 | 国家发改委原党组成员、副主任 | 2025年3月27日 | 开除党籍、移送司法 |
| 龙翔 | 南京市人大常委会党组书记、主任 | 2025年4月3日 | 开除党籍、移送司法 |
| 杨小伟 | 十四届全国政协教科卫体委员会副主任，广电总局原副局长 | 2025年4月17日 | 开除党籍、移送司法 |
| 宋朝华 | 四川省人大常委会原党组成员、副主任 | 2025年4月25日 | 开除党籍、移送司法 |
| 王建军 | 中国证券监督管理委员会党委委员、副主席 | 2025年4月30日 | 开除党籍、移送司法 |
| 叶寒冰 | 四川省政府党组成员、副省长，省公安厅厅长 | 2025年5月21日 | 开除党籍、移送司法 |
| 刘宽忍 | 陕西省政协副主席 | 2025年5月25日 | 开除公职、移送司法 |
| 彭晓春 | 广西壮族自治区政协原党组成员、副主席 | 2025年6月16日 | 开除党籍、移送司法 |
| 胡幼桃 | 江西省政协原党组成员、副主席 | 2025年6月19日 | 开除党籍、移送司法 |
| 倪强 | 中共海南省委常委、秘书长 | 2025年6月25日 | 开除党籍、移送司法 |
| 刘绍勇 | 中国东方航空集团原党组书记、董事长 | 2025年6月28日 | 开除党籍、移送司法 |
| 周先旺 | 湖北省政协原党组成员、副主席，武汉市政府原市长 | 2025年7月8日 | 开除党籍、移送司法 |
| 韩松 | 西安市人大常委会党组书记、主任 | 2025年7月14日 | 开除党籍、移送司法 |
| 吴胜华 | 中共贵州省委常委、毕节市委书记 | 2025年7月24日 | 开除党籍、移送司法 |
| 高兴夫 | 浙江省人大常委会党组副书记、副主任 | 2025年8月18日 | 开除党籍、移送司法 |
| 唐德智 | 贵州省政协党组成员、副主席 | 2025年8月29日 | 开除党籍、移送司法 |
| 姜德果 | 河北省政协原党组成员、副主席 | 2025年9月20日 | 开除党籍、移送司法 |
| 乌兰 | 湖南省人大常委会党组书记、副主任 | 2025年10月9日 | 接受审查调查 |
| 许传智 | 宁夏回族自治区党委原常委、纪委原书记 | 2025年10月14日 | 开除党籍、移送司法 |
| 张尧学 | 中南大学原党委常委、校长 | 2025年10月17日 | 接受审查调查 |
| 江敦涛 | 重庆市人民政府党组成员、副市长 | 2025年10月25日 | 接受审查调查 |
| 金之镇 | 新疆维吾尔自治区政协党组成员、副主席 | 2025年11月1日 | 接受审查调查 |
| 方红卫 | 中共陕西省委常委、西安市委书记 | 2025年11月7日 | 接受审查调查 |
| 毕宝文 | 黑龙江省人民政府原副省长、省公安厅原厅长 | 2025年11月20日 | 接受审查调查 |
| 王凤朝 | 中共成都市委副书记、成都市人民政府市长 | 2025年11月26日 | 接受审查调查 |
| 陈伟俊 | 新疆维吾尔自治区党委常委、自治区政府常务副主席 | 2025年11月30日 | 接受审查调查 |
| 叶红专 | 湖南省人大常委会原党组成员、副主任 | 2025年12月3日 | 接受审查调查 |
| 潘良 | 国务院国资委原副部长级干部 | 2025年12月12日 | 接受审查调查 |
| 戴北方 | 深圳市政协原党组书记、主席 | 2025年12月15日 | 接受审查调查 |
| 王文华 | 青岛市人大常委会原党组书记、主任 | 2025年12月18日 | 接受审查调查 |
| 尹建业 | 江西省政协党组成员、副主席 | 2025年12月21日 | 接受审查调查 |
| 王峻 | 西藏自治区人大常委会党组副书记、副主任 | 2025年12月24日 | 接受审查调查 |
| 张冬辰 | 中国卫星网络集团原党组书记、董事长 | 2025年12月24日 | 撤销全国政协委员资格 |
| 曹建国 | 中国航空发动机集团原董事长、党组书记 | 2025年12月24日 | 撤销全国政协委员资格 |
| 刘国跃 | 国家能源投资集团原董事长、党组书记 | 2025年12月24日 | 撤销全国政协委员资格 |
| 马正武 | 中国融通资产管理集团原董事长、党组书记 | 2025年12月24日 | 撤销全国政协委员资格 |
| 樊友山 | 全国工商联原党组副书记、副主席 | 2025年12月24日 | 撤销全国政协委员资格 |
| 曾毅 | 中国电子信息产业集团原董事长、党组书记 | 2025年12月24日 | 撤销全国政协委员资格 |
| 俞培根 | 中国东方电气集团原董事长、党组书记 | 2025年12月24日 | 撤销全国政协委员资格 |
| 高涛 | 辽宁省人民政府原副省长 | 2025年12月26日 | 罢免人大代表 |
| 张世平 | 中华全国总工会原党组成员、副主席 | 2025年12月30日 | 接受审查调查 |
| 张红文 | 中共安徽省委原常委、合肥市委原书记 | 2025年12月31日 | 罢免人大代表 |
| 田学斌 | 水利部原党组成员、副部长 | 2026年1月5日 | 接受审查调查 |
| 金东寒 | 天津大学原校长、党委副书记 | 2026年1月14日 | 罢免人大代表 |
| 顾军 | 中国核工业集团原党组副书记、总经理 | 2026年1月19日 | 接受审查调查 |
| 张建龙 | 自然资源部原党组成员，国家林业和草原局原局长 | 2026年1月22日 | 接受审查调查 |
| 包惠 | 成都市人大常委会原党组书记、主任 | 2026年1月27日 | 接受审查调查 |
| 连辑 | 中国艺术研究院原院长，甘肃省委原常委、宣传部原部长 | 2026年2月3日 | 接受审查调查 |
| 周新民 | 中国航空工业集团原董事长、党组书记 | 2026年2月4日 | 罢免人大代表 |
| 刘仓理 | 全国人大常委会委员、中国工程物理研究院原院长 | 2026年2月4日 | 罢免人大代表 |
| 肖杰 | 海南省人大常委会原党组成员、副主任 | 2026年2月5日 | 接受审查调查 |
| 张克俭 | 工业和信息化部原副部长、国家国防科工局原局长 | 2026年3月2日 | 撤销全国政协委员资格 |
| 雷思维 | 中共甘肃省委常委、省政府副省长 | 2026年3月17日 | 接受审查调查 |
| 周亮 | 国家金融监督管理总局党委委员、副局长 | 2026年3月24日 | 接受审查调查 |
| 赵黎平 | 内蒙古自治区政协原副主席 | 2015年3月20日 | 判处死刑已执行 |
| 赖小民 | 中国华融资产管理股份有限公司原董事长 | 2018年4月17日 | 判处死刑已执行 |
| 李建平 | 呼和浩特经济技术开发区党工委原书记 | 2021年7月14日 | 判处死刑已执行 |
| 白天辉 | 中国华融国际控股原总经理 | 2024年5月13日 | 判处死刑已执行 |
| 张中生 | 吕梁市委原常委、副市长 | 2020年1月13日 | 改判死缓终身监禁 |
"""

PROVINCES = [
    "北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江",
    "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
    "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
    "内蒙古", "广西", "西藏", "宁夏", "新疆",
]
CITY_PROV = {
    "深圳": "广东", "青岛": "山东", "大连": "辽宁", "西安": "陕西", "成都": "四川",
    "武汉": "湖北", "南京": "江苏", "杭州": "浙江", "合肥": "安徽", "海口": "海南",
    "南宁": "广西", "拉萨": "西藏", "银川": "宁夏", "乌鲁木齐": "新疆", "沈阳": "辽宁",
    "哈尔滨": "黑龙江", "长春": "吉林", "太原": "山西", "石家庄": "河北", "郑州": "河南",
    "济南": "山东", "福州": "福建", "南昌": "江西", "长沙": "湖南", "广州": "广东",
    "昆明": "云南", "贵阳": "贵州", "兰州": "甘肃", "西宁": "青海", "呼和浩特": "内蒙古",
    "宁波": "浙江", "桂林": "广西", "毕节": "贵州", "曲靖": "云南",
}


def norm_name(n: str) -> str:
    return re.sub(r"\s+", "", n).replace("·", "")


def parse_date_cn(s: str) -> str:
    m = re.search(r"(\d{4})年(\d{1,2})月(\d{1,2})日", s)
    if not m:
        return ""
    return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"


def infer_level(role: str) -> str:
    r = role
    if any(x in r for x in ("政治局委员", "国务委员", "副主席", "副国级")):
        if "军委" in r or "国防" in r:
            return "副国级"
        if "全国政协" in r or "全国人大" in r or "政治局" in r:
            return "副国级"
    if "正国级" in r or "中央政治局常委" in r:
        return "正国级"
    if any(x in r for x in ("省委书记", "省长", "部长", "主席", "党组书记")) and "副" not in role[:8]:
        if "副主席" in r or "副主任" in r or "副省长" in r or "副部长" in r:
            pass
        elif "董事长" in r or "部长" in r or "省委书记" in r or "省长" in r or "区政府主席" in r or "政府主席" in r:
            return "正部级"
    if "副国级" in r:
        return "副国级"
    if any(x in r for x in ("军委", "战区", "上将", "国防部部长")):
        if "副主席" in r or "委员" in r or "国务委员" in r:
            return "副国级"
        return "军队正战区职"
    if any(x in r for x in ("副省长", "副部长", "副主任", "副主席", "副署长", "副局长", "副书记")):
        if "副省级" in r or any(c in r for c in ("市委书记", "市长")) and "副省长" not in r:
            return "副省级"
        return "副部级"
    if "校长" in r or "院长" in r:
        return "正厅级"
    return "副部级"


def infer_province(role: str) -> str:
    for p in PROVINCES:
        if p in role:
            if p in ("内蒙古", "广西", "西藏", "宁夏", "新疆"):
                return p
            return p
    for city, prov in CITY_PROV.items():
        if city in role:
            return prov
    if any(x in role for x in ("国务院", "中央", "全国人大", "全国政协", "军委", "中央纪委")):
        return "中央"
    if any(x in role for x in ("中国", "国家")):
        return "中央"
    return "中央"


def infer_sector(role: str, province: str) -> str:
    if any(x in role for x in ("军委", "战区", "国防", "军队", "武警")):
        return "军队"
    if any(x in role for x in ("银行", "证监会", "银保监", "金融监管", "保险", "金融")):
        return "金融"
    if any(x in role for x in ("集团", "央企", "总公司", "航空", "石油", "电网", "兵器", "航天", "华融", "联通", "电信")):
        return "国企"
    if any(x in role for x in ("公安", "政法", "法院", "检察", "司法", "纪委", "监委", "国安")):
        return "政法"
    if any(x in role for x in ("人大", "政协", "人大常委会", "政协")):
        return "人大政协"
    if any(x in role for x in ("部", "委", "总局", "署", "局")) and province == "中央":
        return "国务院"
    if any(x in role for x in ("省委", "市委", "政府", "省长", "市长", "书记")):
        return "党政"
    if any(x in role for x in ("大学", "校长", "研究院", "工程院")):
        return "科教"
    if any(x in role for x in ("足协", "体育")):
        return "体育"
    return "党政"


def infer_org(role: str, name: str) -> str:
    # 取职务中最具体的机构片段
    if "，" in role:
        parts = [p.strip() for p in role.split("，")]
        return parts[0] if parts else role
    if "、" in role:
        return role.split("、")[0].strip()
    return role.strip() or name


def infer_category(status: str) -> str:
  if "受贿" in status or "贪污" in status:
      return "受贿等职务犯罪"
  return "严重违纪违法"


def infer_status(status: str) -> str:
    s = status.replace("正在接受纪律审查和监察调查", "接受审查调查")
    s = s.replace("立案审查调查", "接受审查调查")
    if "开除党籍" in s and "开除公职" in s:
        return "开除党籍、开除公职"
    if "开除党籍" in s:
        return "开除党籍"
    if "开除公职" in s:
        return "开除公职"
    if "接受审查调查" in s or "审查调查" in s:
        return "接受审查调查"
    if "判处" in s:
        return s.split("[")[0].strip()
    return s[:48] if s else "接受审查调查"


def is_typical(level: str, role: str) -> str:
    if level in ("正国级", "副国级", "正部级"):
        return "典型"
    if any(x in role for x in ("省委书记", "省长", "部长", "董事长", "主席")):
        return "典型"
    return ""


def parse_wiki_rows(text: str) -> list[tuple]:
    rows = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|") or line.count("|") < 4:
            continue
        parts = [p.strip() for p in line.split("|")]
        parts = [p for p in parts if p]
        if len(parts) < 4:
            continue
        name, role, date_raw, status = parts[0], parts[1], parts[2], parts[3]
        if name in ("姓名", "副国级", "正部级", "副部级") or "职务" in name:
            continue
        name = norm_name(name)
        date = parse_date_cn(date_raw)
        if not name or not date:
            continue
        level = infer_level(role)
        province = infer_province(role)
        sector = infer_sector(role, province)
        org = infer_org(role, name)
        former = role.split("，")[0].strip()
        if len(former) > 60:
            former = former[:58] + "…"
        notes = f"公开表述：{status}；职务脉络：{role}"
        case_type = is_typical(level, role)
        rows.append((
            name, level, former, org, province, sector, date,
            infer_category(status), infer_status(status),
            "中央纪委国家监委网站", notes, case_type,
        ))
    return rows


def case_key(c: tuple) -> str:
    return norm_name(c[0])


def completeness(c: tuple) -> int:
    return sum(1 for x in c if x)


def merge_cases(existing: list, new: list) -> list:
    by_name: dict[str, tuple] = {}
    for c in existing:
        by_name[case_key(c)] = c
    added = 0
    enriched = 0
    for c in new:
        k = case_key(c)
        if k not in by_name:
            by_name[k] = c
            added += 1
            continue
        prev = by_name[k]
        # 更早官宣日期优先；同日期取字段更完整或 notes 更长
        if c[6] < prev[6]:
            by_name[k] = c
            enriched += 1
        elif c[6] == prev[6]:
            if completeness(c) > completeness(prev) or len(c[10] or "") > len(prev[10] or ""):
                by_name[k] = c
                enriched += 1
        elif len(c[10] or "") > len((prev[10] or "")) + 20:
            # 保留较早日期但补充 notes
            merged = list(prev)
            merged[10] = c[10]
            if not merged[11] and c[11]:
                merged[11] = c[11]
            by_name[k] = tuple(merged)
            enriched += 1
    print(f"merge: added {added}, enriched {enriched}")
    return sorted(by_name.values(), key=lambda x: x[6])


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def fmt_case(c: tuple) -> str:
    parts = [f"'{esc(str(x))}'" for x in c[:10]]
    notes = c[10] if len(c) > 10 else ""
    case_type = c[11] if len(c) > 11 else ""
    if notes:
        parts.append(f"'{esc(notes)}'")
    if case_type:
        if not notes:
            parts.append("''")
        parts.append(f"'{esc(case_type)}'")
    return f"    ({', '.join(parts)}),"


def write_data(cases: list) -> None:
    lines = [
        "# Auto-generated case list for genAntiCorruptionSeed.py",
        "# Expanded via scripts/expandAnticorruptionData.py — 公开通报可核实案例",
        "CASES = [",
    ]
    cur_year = None
    for c in cases:
        y = c[6][:4]
        if y != cur_year:
            cur_year = y
            lines.append(f"    # —— {y} ——")
        lines.append(fmt_case(c))
    lines.append("]")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    wiki_text = EMBEDDED_WIKI_ROWS
    if WIKI_SNAPSHOT.exists():
        wiki_text = WIKI_SNAPSHOT.read_text(encoding="utf-8")
    wiki_cases = parse_wiki_rows(wiki_text)
    before_unique = len({case_key(c) for c in EXISTING})
    merged = merge_cases(EXISTING, wiki_cases)
    after_unique = len(merged)
    write_data(merged)
    y2026 = sum(1 for c in merged if c[6].startswith("2026"))
    y2025_new = sum(1 for c in merged if c[6].startswith("2025") and case_key(c) not in {case_key(x) for x in EXISTING})
    print(f"before unique: {before_unique}, after: {after_unique}, delta: +{after_unique - before_unique}")
    print(f"2026 cases: {y2026}, new 2025 entries: {y2025_new}")
    print(f"written → {OUT}")


if __name__ == "__main__":
    main()
