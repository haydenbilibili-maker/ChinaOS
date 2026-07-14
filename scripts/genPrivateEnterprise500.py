#!/usr/bin/env python3
"""Generate privateEnterpriseSeed.js — 2024中国民营企业500强 + 深度画像子集.

Sources:
  - 全国工商联《2024中国民营企业500强》榜单（2024-10-12，基于2023营收）
  - 上市公司年报/招股书、公司官网（Top N 创始人/股权/职业经理人）
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app/src/lib/db/privateEnterpriseSeed.js"
CACHE = Path(__file__).resolve().parent / ".cache" / "pe500_acfic.txt"

# Embedded 工商联榜单（序号|企业名称|省份|营收万元）
RAW_LIST = r"""
1|京东集团|北京市|108466200
2|阿里巴巴（中国）有限公司|浙江省|92749400
3|恒力集团有限公司|江苏省|81173689
4|华为投资控股有限公司|广东省|70417400
5|浙江荣盛控股集团有限公司|浙江省|61260568
6|腾讯控股有限公司|广东省|60901500
7|比亚迪股份有限公司|广东省|60231535
8|盛虹控股集团有限公司|江苏省|52882491
9|山东魏桥创业集团有限公司|山东省|52021385
10|浙江吉利控股集团有限公司|浙江省|49807231
11|万科企业股份有限公司|广东省|46573907
12|联想控股股份有限公司|北京市|43601217
13|浙江恒逸集团有限公司|浙江省|40682953
14|宁德时代新能源科技股份有限公司|福建省|40091704
15|青山控股集团有限公司|浙江省|38213706
16|美的集团股份有限公司|广东省|37370980
17|敬业集团有限公司|河北省|34065252
18|信发集团有限公司|山东省|29075381
19|新希望控股集团有限公司|四川省|28308461
20|泰康保险集团股份有限公司|北京市|27900403
21|江苏沙钢集团有限公司|江苏省|27779839
22|北京三快在线科技有限公司（美团）|北京市|27674495
23|小米通讯技术有限公司|北京市|27097014
24|顺丰控股股份有限公司|广东省|25840940
25|海亮集团有限公司|浙江省|25274166
26|北京建龙重工集团有限公司|北京市|24118660
27|通威集团有限公司|四川省|23879171
28|天能控股集团有限公司|浙江省|22515144
29|新疆广汇实业投资（集团）有限责任公司|新疆维吾尔自治区|21460318
30|德龙钢铁有限公司|河北省|21258057
31|珠海格力电器股份有限公司|广东省|20501812
32|万向集团公司|浙江省|20237495
33|复星国际有限公司|上海市|19820031
34|冀南钢铁集团有限公司|河北省|19386914
35|北京嘀嘀无限科技发展有限公司（滴滴出行）|北京市|19237992
36|雅戈尔集团股份有限公司|浙江省|19159142
37|洛阳栾川钼业集团股份有限公司|河南省|18626897
38|多弗国际控股集团有限公司|浙江省|18561437
39|龙湖集团控股有限公司|重庆市|18073658
40|桐昆控股集团有限公司|浙江省|18033065
41|中升（大连）集团有限公司|辽宁省|17929009
42|东方希望集团有限公司|上海市|17918329
43|协鑫集团有限公司|江苏省|17917777
44|蚂蚁科技集团股份有限公司|浙江省|17845321
45|河北新华联合冶金控股集团有限公司|河北省|17760122
46|TCL 科技集团股份有限公司|广东省|17436666
47|亨通集团有限公司|江苏省|17401914
48|长城汽车股份有限公司|河北省|17321207
49|南山集团有限公司|山东省|17120433
50|河北津西钢铁集团股份有限公司|河北省|16830377
51|上海找钢网信息科技股份有限公司|上海市|16265561
52|新奥集团股份有限公司|河北省|16120000
53|卓尔控股有限公司|湖北省|15731274
54|正泰集团股份有限公司|浙江省|15501491
55|九州通医药集团股份有限公司|湖北省|15013985
56|山东东明石化集团有限公司|山东省|15007876
57|传化集团有限公司|浙江省|14516624
58|宁波金田投资控股有限公司|浙江省|14266515
59|中国民生银行股份有限公司|北京市|14081700
60|利华益集团股份有限公司|山东省|14065245
61|弘润石化（潍坊）有限责任公司|山东省|13952769
62|中天钢铁集团有限公司|江苏省|13927763
63|海澜集团有限公司|江苏省|13830215
64|上海寻梦信息技术有限公司|上海市|13589291
65|河北普阳钢铁有限公司|河北省|13500344
66|上海均和集团有限公司|上海市|13469163
67|百度公司|北京市|13459800
68|万达控股集团有限公司|山东省|13301726
69|超威集团|浙江省|13131800
70|隆基绿能科技股份有限公司|陕西省|12949767
71|永卓控股有限公司|江苏省|12690505
72|内蒙古伊利实业集团股份有限公司|内蒙古自治区|12617946
73|中基宁波集团股份有限公司|浙江省|12608513
74|理想汽车|北京市|12385133
75|江苏新长江实业集团有限公司|江苏省|12311578
76|晶科能源控股有限公司|江西省|12228257
77|富冶集团有限公司|浙江省|12076934
78|TCL实业控股股份有限公司|广东省|12032191
79|天津荣程祥泰投资控股集团有限公司|天津市|12023455
80|神州数码集团股份有限公司|广东省|11962389
81|三一集团有限公司|湖南省|11955604
82|新城控股集团股份有限公司|上海市|11917428
83|河北鑫达钢铁集团有限公司|河北省|11829687
84|广东海大集团股份有限公司|广东省|11611716
85|牧原实业集团有限公司|河南省|11410056
86|福建大东海实业集团有限公司|福建省|11352122
87|天合光能股份有限公司|江苏省|11339178
88|唯品会（中国）有限公司|广东省|11285602
89|新凤鸣控股集团有限公司|浙江省|10846026
90|云账户技术（天津）有限公司|天津市|10844964
91|江西方大钢铁集团有限公司|江西省|10750772
92|山西鹏飞集团有限公司|山西省|10519804
93|广西盛隆冶金有限公司|广西壮族自治区|10429861
94|网易（杭州）网络有限公司|浙江省|10346816
95|中天控股集团有限公司|浙江省|10343706
96|新疆特变电工集团有限公司|新疆维吾尔自治区|10143554
97|日照钢铁控股集团有限公司|山东省|10053093
98|深圳市立业集团有限公司|广东省|9974960
99|歌尔股份有限公司|山东省|9857390
100|方同舟控股有限公司|北京市|9754720
"""

# 行业关键词推断
INDUSTRY_RULES = [
    (r"钢铁|冶金|特钢|线材|铜业|铝业|锰业|矿业|钼业|锂业|钴业|镍", "黑色金属冶炼和压延加工业"),
    (r"石化|石油|化工|炼化|聚酯|化纤|高纤", "石油和天然气开采及炼化"),
    (r"汽车|比亚迪|吉利|长城|理想|蔚来|小鹏|宇通|均胜|小康", "汽车制造业"),
    (r"电池|光能|光伏|新能源|锂能|储能|硅料|硅片", "新能源装备制造"),
    (r"保险|银行|证券|投资控股|信托|人寿|泰康|民生", "金融业"),
    (r"医药|药业|生物|医疗|迈瑞|智飞", "医药制造业"),
    (r"房地产|置业|控股.*房产|龙湖|万科|新城|滨江", "房地产业"),
    (r"快递|物流|顺丰|圆通|申通|韵达|极兔|满运|运通", "交通运输与物流"),
    (r"钢铁|建设|建工|建总|四建|五建|中成|金螳螂", "建筑业"),
    (r"纺织|服装|服饰|波司登|太平鸟|森马|雅戈尔|海澜", "纺织服装业"),
    (r"食品|乳业|伊利|牧原|温氏|双汇|海大|农夫山泉", "农副食品加工"),
    (r"互联网|网络|科技集团|京东|阿里|腾讯|百度|美团|滴滴|快手|拼多多|寻梦|菜鸟|贝壳", "互联网和相关服务"),
    (r"通讯|通信|华为|小米|联想|歌尔|立讯|华勤|传音", "计算机、通信和其他电子设备"),
    (r"家电|格力|美的|TCL|创维", "电气机械和器材制造"),
    (r"超市|零售|永辉|物美|家家悦", "批发和零售业"),
]

# Top N 深度画像（公开资料摘要，asOf 2024-2025）
DEEP_PROFILES = {
    "京东集团": {
        "industry": "互联网和相关服务",
        "listing": "纳斯达克/港交所",
        "founders": [{"name": "刘强东", "title": "创始人", "background": "江苏宿迁，中国人民大学，1998年创办京东；现侧重战略与海外业务"}],
        "managers": [{"name": "许冉", "title": "CEO", "since": "2023-05", "background": "普华永道出身，曾任京东CFO"}],
        "equity": [
            {"shareholder": "刘强东", "holderType": "自然人", "pct": 12.9, "note": "通过Max Smart Limited等", "source": "2024年报"},
            {"shareholder": "沃尔玛", "holderType": "机构", "pct": 9.2, "note": "战略投资者", "source": "2024年报"},
        ],
        "controlNote": "创始人仍具实质影响力；管理层职业化转型",
    },
    "阿里巴巴（中国）有限公司": {
        "industry": "互联网和相关服务",
        "listing": "港交所/纽交所",
        "founders": [
            {"name": "马云", "title": "创始人", "background": "杭州，教师出身，1999年创办阿里巴巴"},
            {"name": "蔡崇信", "title": "联合创始人/董事长", "background": "耶鲁法学，长期负责融资与治理"},
        ],
        "managers": [{"name": "吴泳铭", "title": "CEO", "since": "2023-09", "background": "阿里创始员工，曾任淘天集团董事长"}],
        "equity": [
            {"shareholder": "软银", "holderType": "机构", "pct": None, "note": "持续减持，已不再控股", "source": "港交所披露"},
            {"shareholder": "马云及管理层", "holderType": "一致行动", "pct": None, "note": "合伙人制度主导治理", "source": "招股书/年报"},
        ],
        "controlNote": "合伙人制度+AB股架构；无单一控股股东",
    },
    "恒力集团有限公司": {
        "industry": "石油和天然气开采及炼化",
        "listing": "未上市（恒力石化600346上市）",
        "founders": [
            {"name": "陈建华", "title": "创始人/董事长", "background": "苏州吴江，纺织起家转型炼化一体化"},
            {"name": "范红卫", "title": "联合创始人/副董事长", "background": "与陈建华夫妇共同创业"},
        ],
        "managers": [{"name": "范红卫", "title": "总裁", "since": "长期", "background": "集团经营负责人"}],
        "equity": [{"shareholder": "陈建华、范红卫", "holderType": "家族", "pct": None, "note": "家族绝对控股", "source": "公开报道"}],
        "controlNote": "典型民营炼化一体化家族企业",
    },
    "华为投资控股有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "未上市",
        "founders": [{"name": "任正非", "title": "创始人", "background": "深圳，1987年创办华为；员工持股平台治理"}],
        "managers": [
            {"name": "梁华", "title": "董事长", "since": "2018", "background": "监事会主席转任"},
            {"name": "胡厚崑", "title": "轮值董事长", "since": "轮值", "background": "公司经营管理团队"},
            {"name": "孟晚舟", "title": "轮值董事长/CFO", "since": "轮值", "background": "任正非之女，财务体系负责人"},
        ],
        "equity": [{"shareholder": "华为投资控股有限公司工会委员会", "holderType": "员工持股", "pct": 99, "note": "虚拟受限股+工会代持", "source": "华为年报/工商"}],
        "controlNote": "员工持股会+轮值董事长；任正非具精神领袖影响力",
    },
    "比亚迪股份有限公司": {
        "industry": "汽车制造业",
        "listing": "A股/港股",
        "founders": [{"name": "王传福", "title": "创始人/董事长", "background": "电池技术出身，1995年创办比亚迪"}],
        "managers": [
            {"name": "王传福", "title": "总裁", "since": "长期", "background": "董事长兼总裁"},
            {"name": "李柯", "title": "副总裁", "since": "长期", "background": "海外与销售体系"},
        ],
        "equity": [
            {"shareholder": "王传福", "holderType": "自然人", "pct": 16.9, "note": "A股直接持股", "source": "2024年报"},
            {"shareholder": "吕向阳", "holderType": "自然人", "pct": 8.2, "note": "王传福表哥，早期投资人", "source": "2024年报"},
        ],
        "controlNote": "王传福创始团队稳定控股",
    },
    "腾讯控股有限公司": {
        "industry": "互联网和相关服务",
        "listing": "港交所",
        "founders": [
            {"name": "马化腾", "title": "联合创始人/董事长", "background": "深圳，1998年与团队创办腾讯"},
            {"name": "张志东", "title": "联合创始人", "background": "首席技术官，已退休仍顾问"},
        ],
        "managers": [
            {"name": "马化腾", "title": "CEO", "since": "长期", "background": "董事长兼首席执行官"},
            {"name": "刘炽平", "title": "总裁", "since": "2006", "background": "前高盛，负责战略与投资"},
        ],
        "equity": [
            {"shareholder": "马化腾", "holderType": "自然人", "pct": 8.4, "note": "通过多家持股平台", "source": "2024年报"},
            {"shareholder": "南非Naspers/Prosus", "holderType": "机构", "pct": 23, "note": "最大机构股东，持续减持", "source": "港交所披露"},
        ],
        "controlNote": "马化腾与核心创始团队掌握投票权安排",
    },
    "宁德时代新能源科技股份有限公司": {
        "industry": "新能源装备制造",
        "listing": "A股/港交所",
        "founders": [{"name": "曾毓群", "title": "创始人/董事长", "background": "福建宁德，ATL背景，2011年创办宁德时代"}],
        "managers": [{"name": "曾毓群", "title": "总经理", "since": "长期", "background": "技术型企业家"}],
        "equity": [{"shareholder": "曾毓群", "holderType": "自然人", "pct": 23.3, "note": "含瑞庭投资等", "source": "2024年报"}],
        "controlNote": "创始团队技术控股",
    },
    "美的集团股份有限公司": {
        "industry": "电气机械和器材制造",
        "listing": "A股/港交所",
        "founders": [{"name": "何享健", "title": "创始人", "background": "佛山顺德，1968年创办美的；现已交棒"}],
        "managers": [{"name": "方洪波", "title": "董事长/总裁", "since": "2012", "background": "职业经理人接棒典范"}],
        "equity": [
            {"shareholder": "何享健", "holderType": "家族", "pct": None, "note": "通过美的控股控制约29%", "source": "2024年报"},
            {"shareholder": "美的控股有限公司", "holderType": "家族平台", "pct": 28.6, "note": "何享健家族", "source": "2024年报"},
        ],
        "controlNote": "家族控股+职业经理人治理",
    },
    "小米通讯技术有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "港交所（小米集团）",
        "founders": [{"name": "雷军", "title": "创始人/董事长", "background": "金山软件背景，2010年创办小米"}],
        "managers": [
            {"name": "雷军", "title": "CEO", "since": "长期", "background": "董事长兼CEO"},
            {"name": "卢伟冰", "title": "总裁", "since": "2022", "background": "手机与AIoT业务负责人"},
        ],
        "equity": [{"shareholder": "雷军", "holderType": "自然人", "pct": 24.1, "note": "含Smart Mobile Holdings", "source": "2024年报"}],
        "controlNote": "雷军同股不同权超级投票权",
    },
    "北京三快在线科技有限公司（美团）": {
        "industry": "互联网和相关服务",
        "listing": "港交所",
        "founders": [{"name": "王兴", "title": "创始人/董事长", "background": "清华，连续创业者，2010年创办美团"}],
        "managers": [{"name": "王兴", "title": "CEO", "since": "长期", "background": "董事长兼首席执行官"}],
        "equity": [
            {"shareholder": "王兴", "holderType": "自然人", "pct": 15.2, "note": "含Crown Nominees等", "source": "2024年报"},
            {"shareholder": "腾讯", "holderType": "机构", "pct": 17.0, "note": "战略股东", "source": "港交所披露"},
        ],
        "controlNote": "王兴掌握投票权；腾讯为重要股东",
    },
    "顺丰控股股份有限公司": {
        "industry": "交通运输与物流",
        "listing": "A股/港交所",
        "founders": [{"name": "王卫", "title": "创始人/董事长", "background": "广东佛山，1993年创办顺丰"}],
        "managers": [{"name": "王卫", "title": "总经理", "since": "长期", "background": "低调掌控经营"}],
        "equity": [{"shareholder": "王卫", "holderType": "自然人", "pct": 58.3, "note": "明德控股等", "source": "2024年报"}],
        "controlNote": "创始人绝对控股",
    },
    "珠海格力电器股份有限公司": {
        "industry": "电气机械和器材制造",
        "listing": "A股",
        "founders": [],  # 集体所有制改制而来
        "managers": [{"name": "董明珠", "title": "董事长/总裁", "since": "2012", "background": "销售出身，长期掌舵格力"}],
        "equity": [
            {"shareholder": "珠海明骏", "holderType": "机构", "pct": 16.2, "note": "高瓴资本牵头收购", "source": "2024年报"},
            {"shareholder": "董明珠", "holderType": "自然人", "pct": 0.9, "note": "个人持股", "source": "2024年报"},
        ],
        "controlNote": "股权分散，管理层影响力突出",
    },
    "新希望控股集团有限公司": {
        "industry": "农副食品加工",
        "listing": "新希望六和等上市",
        "founders": [{"name": "刘永好", "title": "创始人", "background": "四川，1982年与兄弟创办希望集团"}],
        "managers": [{"name": "刘永好", "title": "董事长", "since": "长期", "background": "家族与企业治理核心"}],
        "equity": [{"shareholder": "刘永好及家族", "holderType": "家族", "pct": None, "note": "刘氏兄弟分业后新希望系", "source": "公开报道"}],
        "controlNote": "家族企业分业经营",
    },
    "牧原实业集团有限公司": {
        "industry": "农副食品加工",
        "listing": "牧原股份A股",
        "founders": [{"name": "秦英林", "title": "创始人/董事长", "background": "河南南阳，1992年创办牧原"}],
        "managers": [{"name": "秦英林", "title": "总裁", "since": "长期", "background": "养殖技术驱动"}],
        "equity": [{"shareholder": "秦英林、钱瑛", "holderType": "家族", "pct": 54.0, "note": "夫妇控股", "source": "2024年报"}],
        "controlNote": "创始家族控股",
    },
    "隆基绿能科技股份有限公司": {
        "industry": "新能源装备制造",
        "listing": "A股",
        "founders": [{"name": "李振国", "title": "创始人/董事长", "background": "兰州交大，单晶硅龙头"}],
        "managers": [
            {"name": "李振国", "title": "总经理", "since": "长期", "background": "技术型创始人"},
            {"name": "钟宝申", "title": "董事长（曾任）/核心股东", "since": "长期", "background": "与李振国创业伙伴"},
        ],
        "equity": [{"shareholder": "李振国", "holderType": "自然人", "pct": 14.8, "note": "最大个人股东", "source": "2024年报"}],
        "controlNote": "创始团队共同创业",
    },
    "理想汽车": {
        "industry": "汽车制造业",
        "listing": "纳斯达克/港交所",
        "founders": [{"name": "李想", "title": "创始人/董事长", "background": "汽车之家创始人，连续创业"}],
        "managers": [{"name": "李想", "title": "CEO", "since": "长期", "background": "产品定义主导"}],
        "equity": [{"shareholder": "李想", "holderType": "自然人", "pct": 21.5, "note": "含Amp Lee Ltd", "source": "2024年报"}],
        "controlNote": "创始人超级投票权",
    },
    "百度公司": {
        "industry": "互联网和相关服务",
        "listing": "纳斯达克/港交所",
        "founders": [{"name": "李彦宏", "title": "创始人/董事长", "background": "北大+布法罗，2000年创办百度"}],
        "managers": [{"name": "李彦宏", "title": "CEO", "since": "长期", "background": "董事长兼CEO"}],
        "equity": [{"shareholder": "李彦宏", "holderType": "自然人", "pct": 20.1, "note": "含B类股投票权", "source": "2024年报"}],
        "controlNote": "AB股架构，创始人掌握控制权",
    },
    "网易（杭州）网络有限公司": {
        "industry": "互联网和相关服务",
        "listing": "纳斯达克/港交所",
        "founders": [{"name": "丁磊", "title": "创始人/董事长", "background": "浙江宁波，1997年创办网易"}],
        "managers": [{"name": "丁磊", "title": "CEO", "since": "长期", "background": "游戏与音乐业务"}],
        "equity": [{"shareholder": "丁磊", "holderType": "自然人", "pct": 44.7, "note": "高度控股", "source": "2024年报"}],
        "controlNote": "创始人高比例持股",
    },
    "三一集团有限公司": {
        "industry": "装备制造业",
        "listing": "三一重工等上市",
        "founders": [{"name": "梁稳根", "title": "创始人", "background": "湖南娄底，1989年创办三一"}],
        "managers": [{"name": "向文波", "title": "董事长", "since": "2022", "background": "职业经理人接棒"}],
        "equity": [{"shareholder": "梁稳根及三一系", "holderType": "家族/管理层", "pct": None, "note": "管理层持股平台", "source": "年报"}],
        "controlNote": "创始人退居幕后，职业化治理",
    },
    "浙江吉利控股集团有限公司": {
        "industry": "汽车制造业",
        "listing": "吉利汽车等上市",
        "founders": [{"name": "李书福", "title": "创始人/董事长", "background": "浙江台州，1986年创办吉利"}],
        "managers": [{"name": "李书福", "title": "总裁", "since": "长期", "background": "并购整合沃尔沃、极氪等"}],
        "equity": [{"shareholder": "李书福", "holderType": "自然人", "pct": None, "note": "通过吉利控股多层架构", "source": "年报"}],
        "controlNote": "李书福家族控制",
    },
    "山东魏桥创业集团有限公司": {
        "industry": "有色金属冶炼",
        "listing": "中国宏桥等上市",
        "founders": [{"name": "张士平", "title": "创始人（已故）", "background": "山东邹平，纺织铝电一体化"}],
        "managers": [{"name": "张波", "title": "董事长", "since": "2019", "background": "张士平之子接棒"}],
        "equity": [{"shareholder": "张氏家族", "holderType": "家族", "pct": None, "note": "二代接班", "source": "公开报道"}],
        "controlNote": "家族二代接班典型",
    },
    "青山控股集团有限公司": {
        "industry": "有色金属冶炼",
        "listing": "未上市（关联永清集团等）",
        "founders": [{"name": "项光达", "title": "创始人/董事局主席", "background": "温州瑞安，不锈钢与镍产业链"}],
        "managers": [{"name": "项光达", "title": "总裁", "since": "长期", "background": "产业链垂直整合"}],
        "equity": [{"shareholder": "项氏家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "不锈钢+新能源镍钴一体化",
    },
    "盛虹控股集团有限公司": {
        "industry": "石油和天然气开采及炼化",
        "listing": "东方盛虹等上市",
        "founders": [{"name": "缪汉根", "title": "创始人/董事长", "background": "江苏苏州，纺织转型炼化"}],
        "managers": [{"name": "缪汉根", "title": "总裁", "since": "长期", "background": "炼化一体化扩张"}],
        "equity": [{"shareholder": "缪汉根夫妇", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "民营炼化第二极",
    },
    "通威集团有限公司": {
        "industry": "新能源装备制造",
        "listing": "通威股份A股",
        "founders": [{"name": "刘汉元", "title": "创始人/董事长", "background": "四川，水产饲料转型光伏"}],
        "managers": [{"name": "刘汉元", "title": "总裁", "since": "长期", "background": "农牧+光伏双主业"}],
        "equity": [{"shareholder": "刘汉元", "holderType": "自然人", "pct": 43.8, "note": "通威股份", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "泰康保险集团股份有限公司": {
        "industry": "金融业",
        "listing": "未上市",
        "founders": [{"name": "陈东升", "title": "创始人/董事长", "background": "武汉大学，1996年创办泰康"}],
        "managers": [{"name": "陈东升", "title": "CEO", "since": "长期", "background": "保险+医养生态"}],
        "equity": [{"shareholder": "陈东升及家族", "holderType": "家族", "pct": None, "note": "管理层持股", "source": "公开报道"}],
        "controlNote": "创始人长期掌舵",
    },
    "万科企业股份有限公司": {
        "industry": "房地产业",
        "listing": "A股/港交所",
        "founders": [{"name": "王石", "title": "创始人（已退休）", "background": "1984年创办万科"}],
        "managers": [{"name": "郁亮", "title": "董事长/总裁", "since": "2017", "background": "职业经理人；2024年面临深铁介入"}],
        "equity": [
            {"shareholder": "深铁集团", "holderType": "国资", "pct": 27.2, "note": "2024年成为第一大股东", "source": "2024年报"},
        ],
        "controlNote": "国资入股后治理重构中",
    },
    "蚂蚁科技集团股份有限公司": {
        "industry": "互联网和相关服务",
        "listing": "未上市（IPO暂停）",
        "founders": [{"name": "马云", "title": "实际控制人", "background": "阿里生态金融科技平台"}],
        "managers": [{"name": "井贤栋", "title": "董事长/CEO", "since": "2019", "background": "支付与数字金融"}],
        "equity": [{"shareholder": "阿里巴巴", "holderType": "机构", "pct": 33, "note": "重要股东", "source": "招股书"}],
        "controlNote": "阿里生态内，监管整改后治理调整",
    },
    "上海寻梦信息技术有限公司": {
        "industry": "互联网和相关服务",
        "listing": "拼多多集团纳斯达克",
        "founders": [
            {"name": "黄峥", "title": "创始人（已退休）", "background": "浙大+威斯康星，2015年创办拼多多"},
        ],
        "managers": [{"name": "陈磊", "title": "董事长/CEO", "since": "2020", "background": "黄峥接班人"}],
        "equity": [{"shareholder": "黄峥", "holderType": "自然人", "pct": 25.7, "note": "退休前持股", "source": "2024年报"}],
        "controlNote": "创始人退后职业经理人接棒",
    },
    "北京快手科技有限公司": {
        "industry": "互联网和相关服务",
        "listing": "港交所",
        "founders": [
            {"name": "宿华", "title": "联合创始人（已退CEO）", "background": "清华，2011年创办快手"},
            {"name": "程一笑", "title": "联合创始人/CEO", "background": "产品技术出身"},
        ],
        "managers": [{"name": "程一笑", "title": "CEO", "since": "2021", "background": "接任CEO"}],
        "equity": [{"shareholder": "宿华", "holderType": "自然人", "pct": 11.7, "note": "B类股", "source": "2024年报"}],
        "controlNote": "双创始人架构",
    },
    "唯品会（中国）有限公司": {
        "industry": "互联网和相关服务",
        "listing": "纽交所",
        "founders": [{"name": "沈亚", "title": "联合创始人/董事长", "background": "广东，2008年创办唯品会"}],
        "managers": [{"name": "沈亚", "title": "CEO", "since": "长期", "background": "特卖电商"}],
        "equity": [{"shareholder": "沈亚", "holderType": "自然人", "pct": 7.0, "note": "与吴声等联合创始", "source": "年报"}],
        "controlNote": "联合创始人治理",
    },
    "内蒙古伊利实业集团股份有限公司": {
        "industry": "农副食品加工",
        "listing": "A股",
        "founders": [],  # 呼和浩特乳品厂改制
        "managers": [{"name": "潘刚", "title": "董事长/总裁", "since": "2005", "background": "职业经理人长期掌舵"}],
        "equity": [{"shareholder": "呼和浩特投资", "holderType": "国资", "pct": 8.4, "note": "无实际控制人披露", "source": "2024年报"}],
        "controlNote": "股权分散，管理层主导",
    },
    "长城汽车股份有限公司": {
        "industry": "汽车制造业",
        "listing": "A股/港交所",
        "founders": [{"name": "魏建军", "title": "创始人/董事长", "background": "河北保定，1990年接手长城"}],
        "managers": [{"name": "魏建军", "title": "总经理", "since": "长期", "background": "SUV与越野定位"}],
        "equity": [{"shareholder": "魏建军", "holderType": "自然人", "pct": 15.0, "note": "保定创新长城", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "晶科能源控股有限公司": {
        "industry": "新能源装备制造",
        "listing": "A股/纽交所",
        "founders": [{"name": "李仙德", "title": "创始人/董事长", "background": "江西上饶，光伏组件龙头"}],
        "managers": [{"name": "陈康平", "title": "CEO", "since": "长期", "background": "李仙德妹夫，经营负责人"}],
        "equity": [{"shareholder": "李仙德家族", "holderType": "家族", "pct": None, "note": "家族企业", "source": "年报"}],
        "controlNote": "家族经营",
    },
    "天合光能股份有限公司": {
        "industry": "新能源装备制造",
        "listing": "A股",
        "founders": [{"name": "高纪凡", "title": "创始人/董事长", "background": "常州，光伏组件与系统"}],
        "managers": [{"name": "高纪凡", "title": "总裁", "since": "长期", "background": "技术驱动"}],
        "equity": [{"shareholder": "高纪凡", "holderType": "自然人", "pct": 16.3, "note": "直接+间接", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "温氏食品集团股份有限公司": {
        "industry": "农副食品加工",
        "listing": "A股",
        "founders": [{"name": "温北英等七户", "title": "创始人集体", "background": "1983年广东新兴县集体创业"}],
        "managers": [{"name": "温志芬", "title": "董事长/总裁", "since": "2015", "background": "温氏二代接班"}],
        "equity": [{"shareholder": "温氏家族及管理层", "holderType": "家族/集体", "pct": None, "note": "温氏系", "source": "年报"}],
        "controlNote": "家族+合伙人式管理",
    },
    "广东海大集团股份有限公司": {
        "industry": "农副食品加工",
        "listing": "A股",
        "founders": [{"name": "薛华", "title": "创始人/董事长", "background": "水产饲料龙头，1998年创办"}],
        "managers": [{"name": "薛华", "title": "总裁", "since": "长期", "background": "农牧产业链"}],
        "equity": [{"shareholder": "薛华", "holderType": "自然人", "pct": 18.7, "note": "最大股东", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "安踏体育用品集团有限公司": {
        "industry": "纺织服装业",
        "listing": "安踏体育港交所",
        "founders": [{"name": "丁世忠", "title": "创始人/董事长", "background": "福建晋江，1991年创办安踏"}],
        "managers": [
            {"name": "丁世忠", "title": "CEO", "since": "长期", "background": "董事局主席"},
            {"name": "赖世贤", "title": "COO", "since": "长期", "background": "丁世忠妹夫"},
        ],
        "equity": [{"shareholder": "丁世忠、丁世家", "holderType": "家族", "pct": 45, "note": "兄弟控股", "source": "2024年报"}],
        "controlNote": "晋江家族企业",
    },
    "深圳传音控股股份有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "A股",
        "founders": [{"name": "竺兆江", "title": "创始人/董事长", "background": "非洲手机市场开拓者"}],
        "managers": [{"name": "竺兆江", "title": "总经理", "since": "长期", "background": "全球化运营"}],
        "equity": [{"shareholder": "竺兆江", "holderType": "自然人", "pct": 32.6, "note": "控股股东", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "农夫山泉股份有限公司": {
        "industry": "食品饮料",
        "listing": "港交所",
        "founders": [{"name": "钟睒睒", "title": "创始人/董事长", "background": "浙江，养生堂与农夫山泉"}],
        "managers": [{"name": "钟睒睒", "title": "总经理", "since": "长期", "background": "饮用水与饮料"}],
        "equity": [{"shareholder": "钟睒睒", "holderType": "自然人", "pct": 84.4, "note": "高度控股", "source": "2024年报"}],
        "controlNote": "创始人绝对控股",
    },
    "蓝思科技股份有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "A股",
        "founders": [{"name": "周群飞", "title": "创始人/董事长", "background": "湖南，玻璃视窗防护龙头"}],
        "managers": [{"name": "周群飞", "title": "总裁", "since": "长期", "background": "女企业家代表"}],
        "equity": [{"shareholder": "周群飞", "holderType": "自然人", "pct": 62.2, "note": "蓝思集团", "source": "2024年报"}],
        "controlNote": "创始人绝对控股",
    },
    "阳光电源股份有限公司": {
        "industry": "新能源装备制造",
        "listing": "A股",
        "founders": [{"name": "曹仁贤", "title": "创始人/董事长", "background": "合肥，光伏逆变器龙头"}],
        "managers": [{"name": "曹仁贤", "title": "总裁", "since": "长期", "background": "光储融合"}],
        "equity": [{"shareholder": "曹仁贤", "holderType": "自然人", "pct": 17.5, "note": "含汇泽投资", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "河南双汇投资发展股份有限公司": {
        "industry": "农副食品加工",
        "listing": "A股",
        "founders": [{"name": "万隆", "title": "创始人/董事长", "background": "河南漯河，肉类加工龙头"}],
        "managers": [{"name": "万隆", "title": "总裁", "since": "长期", "background": "双汇国际整合"}],
        "equity": [{"shareholder": "兴泰投资", "holderType": "家族平台", "pct": 34.7, "note": "万隆家族", "source": "2024年报"}],
        "controlNote": "家族企业国际化",
    },
    "重庆智飞生物制品股份有限公司": {
        "industry": "医药制造业",
        "listing": "A股",
        "founders": [{"name": "蒋仁生", "title": "创始人/董事长", "background": "疫苗代理与自研"}],
        "managers": [{"name": "蒋仁生", "title": "总经理", "since": "长期", "background": "疫苗龙头"}],
        "equity": [{"shareholder": "蒋仁生", "holderType": "自然人", "pct": 48.3, "note": "控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "深圳迈瑞生物医疗电子股份有限公司": {
        "industry": "医药制造业",
        "listing": "A股",
        "founders": [{"name": "李西廷", "title": "联合创始人/董事长", "background": "医疗器械出口龙头"}],
        "managers": [
            {"name": "李西廷", "title": "总经理", "since": "长期", "background": "海外与国内市场"},
            {"name": "徐航", "title": "联合创始人", "since": "长期", "background": "共同创业"},
        ],
        "equity": [{"shareholder": "李西廷", "holderType": "自然人", "pct": 26.5, "note": "最大股东", "source": "2024年报"}],
        "controlNote": "创始团队稳定",
    },
    "广东小鹏汽车科技有限公司": {
        "industry": "汽车制造业",
        "listing": "小鹏汽车纽交所/港交所",
        "founders": [{"name": "何小鹏", "title": "创始人/董事长", "background": "UC浏览器联合创始人"}],
        "managers": [{"name": "何小鹏", "title": "CEO", "since": "长期", "background": "智能电动车"}],
        "equity": [{"shareholder": "何小鹏", "holderType": "自然人", "pct": 8.1, "note": "含投票权安排", "source": "2024年报"}],
        "controlNote": "创始人控制",
    },
    "深圳市汇川技术股份有限公司": {
        "industry": "电气机械和器材制造",
        "listing": "A股",
        "founders": [{"name": "朱兴明", "title": "创始人/董事长", "background": "工业自动化龙头"}],
        "managers": [{"name": "朱兴明", "title": "总裁", "since": "长期", "background": "伺服与变频器"}],
        "equity": [{"shareholder": "朱兴明", "holderType": "自然人", "pct": 18.8, "note": "汇川投资", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "福耀玻璃工业集团股份有限公司": {
        "industry": "非金属矿物制品",
        "listing": "A股/港交所",
        "founders": [{"name": "曹德旺", "title": "创始人/董事长", "background": "福建福清，汽车玻璃全球龙头"}],
        "managers": [{"name": "曹德旺", "title": "总裁", "since": "长期", "background": "慈善家企业家"}],
        "equity": [{"shareholder": "曹德旺", "holderType": "自然人", "pct": 15.5, "note": "三益发展", "source": "2024年报"}],
        "controlNote": "创始人长期掌舵",
    },
    "浙江大华技术股份有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "A股",
        "founders": [{"name": "傅利泉", "title": "创始人/董事长", "background": "杭州，安防监控龙头"}],
        "managers": [{"name": "傅利泉", "title": "总裁", "since": "长期", "background": "与海康威视双雄"}],
        "equity": [{"shareholder": "傅利泉", "holderType": "自然人", "pct": 34.2, "note": "控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "歌尔股份有限公司": {
        "industry": "计算机、通信和其他电子设备",
        "listing": "A股",
        "founders": [{"name": "姜滨", "title": "创始人/董事长", "background": "山东潍坊，声学器件龙头"}],
        "managers": [{"name": "姜滨", "title": "总裁", "since": "长期", "background": "果链核心供应商"}],
        "equity": [{"shareholder": "姜滨、胡双美夫妇", "holderType": "家族", "pct": 34.0, "note": "夫妇控股", "source": "2024年报"}],
        "controlNote": "家族控股",
    },
    "复星国际有限公司": {
        "industry": "综合投资",
        "listing": "港交所",
        "founders": [{"name": "郭广昌", "title": "创始人/董事长", "background": "复旦，1992年创办复星"}],
        "managers": [{"name": "郭广昌", "title": "CEO", "since": "长期", "background": "全球化产业布局"}],
        "equity": [{"shareholder": "郭广昌", "holderType": "自然人", "pct": 58.7, "note": "复星控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "龙湖集团控股有限公司": {
        "industry": "房地产业",
        "listing": "港交所",
        "founders": [{"name": "吴亚军", "title": "创始人（已退休）", "background": "重庆，1993年创办龙湖"}],
        "managers": [{"name": "陈序平", "title": "CEO", "since": "2022", "background": "职业经理人接棒"}],
        "equity": [{"shareholder": "吴亚军", "holderType": "自然人", "pct": 42.1, "note": "退休前持股", "source": "年报"}],
        "controlNote": "创始人退后职业化",
    },
    "正泰集团股份有限公司": {
        "industry": "电气机械和器材制造",
        "listing": "正泰电器A股",
        "founders": [{"name": "南存辉", "title": "创始人/董事长", "background": "浙江乐清，低压电器龙头"}],
        "managers": [{"name": "南存辉", "title": "总裁", "since": "长期", "background": "光伏与电器双轮"}],
        "equity": [{"shareholder": "南存辉", "holderType": "自然人", "pct": 3.6, "note": "正泰集团控股平台", "source": "年报"}],
        "controlNote": "创始人通过集团控制",
    },
    "九州通医药集团股份有限公司": {
        "industry": "医药流通",
        "listing": "A股",
        "founders": [{"name": "刘宝林", "title": "创始人/董事长", "background": "湖北武汉，民营医药商业龙头"}],
        "managers": [{"name": "刘长云", "title": "总经理", "since": "长期", "background": "刘宝林之子"}],
        "equity": [{"shareholder": "刘宝林家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "年报"}],
        "controlNote": "家族企业",
    },
    "东方希望集团有限公司": {
        "industry": "综合（铝业、饲料、化工）",
        "listing": "未上市",
        "founders": [{"name": "刘永行", "title": "创始人/董事长", "background": "希望系四兄弟之一，铝业与饲料"}],
        "managers": [{"name": "刘永行", "title": "总裁", "since": "长期", "background": "重化工业扩张"}],
        "equity": [{"shareholder": "刘永行及家族", "holderType": "家族", "pct": None, "note": "刘氏兄弟分业", "source": "公开报道"}],
        "controlNote": "希望系分业典型",
    },
    "万向集团公司": {
        "industry": "汽车制造业",
        "listing": "万向钱潮A股",
        "founders": [{"name": "鲁冠球", "title": "创始人（已故）", "background": "浙江萧山，汽车零部件"}],
        "managers": [{"name": "鲁伟鼎", "title": "董事长", "since": "2017", "background": "鲁冠球之子接班"}],
        "equity": [{"shareholder": "万向系/鲁氏", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "二代接班",
    },
    "雅戈尔集团股份有限公司": {
        "industry": "纺织服装业",
        "listing": "A股",
        "founders": [{"name": "李如成", "title": "创始人/董事长", "background": "浙江宁波，衬衫到地产投资"}],
        "managers": [{"name": "李如成", "title": "总经理", "since": "长期", "background": "服装+投资双轮"}],
        "equity": [{"shareholder": "李如成", "holderType": "自然人", "pct": 37.6, "note": "雅戈尔控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "海亮集团有限公司": {
        "industry": "有色金属加工",
        "listing": "海亮股份A股",
        "founders": [{"name": "冯海良", "title": "创始人", "background": "浙江诸暨，铜加工与教育"}],
        "managers": [{"name": "冯亚丽", "title": "董事长", "since": "长期", "background": "冯海良之姐，家族接班"}],
        "equity": [{"shareholder": "冯氏家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "家族企业",
    },
    "江苏沙钢集团有限公司": {
        "industry": "黑色金属冶炼和压延加工业",
        "listing": "沙钢股份A股",
        "founders": [{"name": "沈文荣", "title": "创始人（已故）", "background": "江苏张家港，民营钢铁龙头"}],
        "managers": [{"name": "沈彬", "title": "董事长", "since": "2019", "background": "沈文荣之子接班"}],
        "equity": [{"shareholder": "沈氏家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "钢铁二代接班",
    },
    "敬业集团有限公司": {
        "industry": "黑色金属冶炼和压延加工业",
        "listing": "未上市",
        "founders": [{"name": "李赶坡", "title": "创始人/董事长", "background": "河北平山，钢铁起家"}],
        "managers": [{"name": "李赶坡", "title": "总裁", "since": "长期", "background": "短流程炼钢"}],
        "equity": [{"shareholder": "李赶坡", "holderType": "自然人", "pct": None, "note": "个人控股", "source": "公开报道"}],
        "controlNote": "创始人控股",
    },
    "浙江荣盛控股集团有限公司": {
        "industry": "石油和天然气开采及炼化",
        "listing": "荣盛石化A股",
        "founders": [{"name": "李水荣", "title": "创始人/董事长", "background": "浙江萧山，PTA-涤纶一体化"}],
        "managers": [{"name": "李水荣", "title": "总裁", "since": "长期", "background": "民营石化龙头"}],
        "equity": [{"shareholder": "李水荣", "holderType": "自然人", "pct": 51.5, "note": "荣盛控股", "source": "2024年报"}],
        "controlNote": "创始人绝对控股",
    },
    "浙江恒逸集团有限公司": {
        "industry": "石油和天然气开采及炼化",
        "listing": "恒逸石化A股",
        "founders": [{"name": "邱建林", "title": "创始人/董事长", "background": "浙江萧山，PTA产业链"}],
        "managers": [{"name": "邱奕博", "title": "总裁", "since": "2020", "background": "二代接班"}],
        "equity": [{"shareholder": "邱氏家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "石化家族二代接班",
    },
    "桐昆控股集团有限公司": {
        "industry": "石油和天然气开采及炼化",
        "listing": "桐昆股份A股",
        "founders": [{"name": "陈士良", "title": "创始人/董事长", "background": "浙江桐乡，涤纶长丝龙头"}],
        "managers": [{"name": "陈士良", "title": "总裁", "since": "长期", "background": "化纤产业链"}],
        "equity": [{"shareholder": "陈士良", "holderType": "自然人", "pct": 11.2, "note": "桐昆控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "联想控股股份有限公司": {
        "industry": "综合投资",
        "listing": "港交所",
        "founders": [{"name": "柳传志", "title": "创始人（已退休）", "background": "中科院计算所背景，1984年创办联想"}],
        "managers": [{"name": "宁旻", "title": "董事长", "since": "2021", "background": "职业经理人接棒"}],
        "equity": [{"shareholder": "中科院系/管理层", "holderType": "混合", "pct": None, "note": "混合所有制改制", "source": "年报"}],
        "controlNote": "中科院改制背景",
    },
    "北京建龙重工集团有限公司": {
        "industry": "黑色金属冶炼和压延加工业",
        "listing": "未上市",
        "founders": [{"name": "张志祥", "title": "创始人/董事长", "background": "河北钢铁并购整合者"}],
        "managers": [{"name": "张志祥", "title": "总裁", "since": "长期", "background": "民营钢铁整合"}],
        "equity": [{"shareholder": "张志祥", "holderType": "自然人", "pct": None, "note": "个人控股", "source": "公开报道"}],
        "controlNote": "并购型扩张",
    },
    "协鑫集团有限公司": {
        "industry": "新能源装备制造",
        "listing": "协鑫科技等上市",
        "founders": [{"name": "朱共山", "title": "创始人/董事长", "background": "江苏，光伏与清洁能源"}],
        "managers": [{"name": "朱共山", "title": "总裁", "since": "长期", "background": "多晶硅与电站"}],
        "equity": [{"shareholder": "朱共山", "holderType": "自然人", "pct": None, "note": "协鑫系", "source": "公开报道"}],
        "controlNote": "创始人控股",
    },
    "传化集团有限公司": {
        "industry": "化学原料和化学制品",
        "listing": "传化智联A股",
        "founders": [{"name": "徐传化", "title": "创始人", "background": "浙江萧山，纺织化学品"}],
        "managers": [{"name": "徐冠巨", "title": "董事长", "since": "长期", "background": "徐传化之子接班"}],
        "equity": [{"shareholder": "徐氏家族", "holderType": "家族", "pct": None, "note": "家族控股", "source": "公开报道"}],
        "controlNote": "家族二代接班",
    },
    "中天钢铁集团有限公司": {
        "industry": "黑色金属冶炼和压延加工业",
        "listing": "未上市",
        "founders": [{"name": "董才平", "title": "创始人/董事长", "background": "江苏常州，钢铁起家"}],
        "managers": [{"name": "董才平", "title": "总裁", "since": "长期", "background": "多元化扩张"}],
        "equity": [{"shareholder": "董才平", "holderType": "自然人", "pct": None, "note": "个人控股", "source": "公开报道"}],
        "controlNote": "创始人控股",
    },
    "永卓控股有限公司": {
        "industry": "黑色金属冶炼和压延加工业",
        "listing": "未上市",
        "founders": [{"name": "吴耀芳", "title": "创始人/董事长", "background": "江苏张家港，钢铁起家"}],
        "managers": [{"name": "吴耀芳", "title": "总裁", "since": "长期", "background": "永钢集团"}],
        "equity": [{"shareholder": "吴耀芳", "holderType": "自然人", "pct": None, "note": "个人控股", "source": "公开报道"}],
        "controlNote": "创始人控股",
    },
    "上海钢联电子商务股份有限公司": {
        "industry": "互联网和相关服务",
        "listing": "A股",
        "founders": [{"name": "朱军红", "title": "创始人/董事长", "background": "钢铁电商与数据服务"}],
        "managers": [{"name": "朱军红", "title": "总经理", "since": "长期", "background": "大宗商品资讯"}],
        "equity": [{"shareholder": "朱军红", "holderType": "自然人", "pct": 12.5, "note": "控股", "source": "2024年报"}],
        "controlNote": "创始人控股",
    },
    "贝壳控股有限公司": {
        "industry": "房地产业",
        "listing": "纽交所/港交所",
        "founders": [{"name": "左晖", "title": "创始人（已故）", "background": "链家/贝壳，房产经纪平台"}],
        "managers": [{"name": "彭永东", "title": "董事长/CEO", "since": "2021", "background": "左晖接班人"}],
        "equity": [{"shareholder": "左晖家族", "holderType": "家族", "pct": None, "note": "继承持股", "source": "年报"}],
        "controlNote": "创始人离世后职业化",
    },
    "北京爱奇艺科技有限公司": {
        "industry": "互联网和相关服务",
        "listing": "纳斯达克",
        "founders": [{"name": "龚宇", "title": "创始人/CEO", "background": "百度分拆，长视频平台"}],
        "managers": [{"name": "龚宇", "title": "CEO", "since": "长期", "background": "内容与会员"}],
        "equity": [{"shareholder": "百度", "holderType": "机构", "pct": 46.4, "note": "控股股东", "source": "2024年报"}],
        "controlNote": "百度系控股",
    },
}


def slugify(name: str, rank: int) -> str:
    s = re.sub(r"[^\w\u4e00-\u9fff]", "", name.split("（")[0].split("(")[0])
    return f"pe{rank:03d}_{s[:12]}"


def infer_industry(name: str) -> str:
    for pat, ind in INDUSTRY_RULES:
        if re.search(pat, name):
            return ind
    return "综合及其他"


def parse_list(raw: str) -> list:
    rows = []
    for line in raw.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("|")
        if len(parts) < 4:
            continue
        rank, name, province, rev = int(parts[0]), parts[1], parts[2], int(parts[3])
        rows.append({"rank": rank, "name": name, "province": province, "revenueWan": rev})
    return rows


def load_full_list() -> list:
    """Load 500 from cache file if present, else embedded + fetch attempt."""
    cache_path = CACHE
    if cache_path.exists():
        text = cache_path.read_text(encoding="utf-8")
        rows = []
        for m in re.finditer(r"\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|", text):
            rows.append({
                "rank": int(m.group(1)),
                "name": m.group(2).strip(),
                "province": m.group(3).strip(),
                "revenueWan": int(m.group(4)),
            })
        if len(rows) >= 400:
            return rows
    # fallback: embedded partial — script should save cache on first run
    embedded = parse_list(RAW_LIST)
    # Try urllib fetch
    try:
        import urllib.request
        url = "https://www.acfic.org.cn/ztzlhz/2024_500q/2024_500q_bangdan/202410/t20241012_317158.html"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(html, encoding="utf-8")
        rows = []
        for m in re.finditer(r"\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|", html):
            rows.append({
                "rank": int(m.group(1)),
                "name": m.group(2).strip(),
                "province": m.group(3).strip(),
                "revenueWan": int(m.group(4)),
            })
        if len(rows) >= 400:
            return rows
    except Exception as e:
        print(f"fetch warning: {e}")
    return embedded


def build():
    raw_rows = load_full_list()
    companies = []
    people = []
    equity = []

    for r in raw_rows:
        rank, name, province, rev = r["rank"], r["name"], r["province"], r["revenueWan"]
        cid = slugify(name, rank)
        prof = DEEP_PROFILES.get(name, {})
        industry = prof.get("industry") or infer_industry(name)
        listing = prof.get("listing", "待核实")
        depth = "full" if prof else "shell"

        companies.append({
            "id": cid,
            "rank": rank,
            "name": name,
            "province": province,
            "revenueWan": rev,
            "revenueYi": round(rev / 10000, 2),
            "industry": industry,
            "listing": listing,
            "listYear": 2024,
            "profileDepth": depth,
            "controlNote": prof.get("controlNote", ""),
        })

        for i, f in enumerate(prof.get("founders", [])):
            people.append({
                "id": f"{cid}_f{i}",
                "companyId": cid,
                "companyName": name,
                "rank": rank,
                "name": f["name"],
                "roleType": "founder",
                "title": f.get("title", "创始人"),
                "background": f.get("background", ""),
                "since": f.get("since", ""),
                "source": "公开资料",
            })
        for i, m in enumerate(prof.get("managers", [])):
            people.append({
                "id": f"{cid}_m{i}",
                "companyId": cid,
                "companyName": name,
                "rank": rank,
                "name": m["name"],
                "roleType": "manager",
                "title": m.get("title", ""),
                "background": m.get("background", ""),
                "since": m.get("since", ""),
                "source": "公开资料",
            })
        for i, e in enumerate(prof.get("equity", [])):
            equity.append({
                "id": f"{cid}_e{i}",
                "companyId": cid,
                "companyName": name,
                "rank": rank,
                "shareholder": e["shareholder"],
                "holderType": e.get("holderType", ""),
                "pct": e.get("pct"),
                "note": e.get("note", ""),
                "asOf": "2024-12-31",
                "source": e.get("source", "公开资料"),
            })

    meta = {
        "id": "pe500-2024",
        "asOf": "2026-07-14",
        "listYear": 2024,
        "listSource": "全国工商联《2024中国民营企业500强》",
        "listPublished": "2024-10-12",
        "revenueBaseYear": 2023,
        "thresholdYi": 263.13,
        "label": "民营经济500强 · 2024榜单",
        "scope": f"企业 {len(companies)} · 深度画像 {sum(1 for c in companies if c['profileDepth']=='full')} · 创始人/经理人 {len([p for p in people if p['roleType']=='founder'])} / {len([p for p in people if p['roleType']=='manager'])} · 股权 {len(equity)}",
        "notes": "深度画像覆盖Top公开资料丰富企业；其余为榜单壳数据（行业推断），股权/经理人待补。与政治人物简历库隔离。",
    }

    js = f"""// ============================================================================
// 民营经济500强 · 工商联2024榜单 + 深度画像子集 · 2026-06
// ----------------------------------------------------------------------------
// 榜单：全国工商联 2024-10-12 发布（基于2023营收）；深度画像来自年报/招股书/公开报道。
// 生成：scripts/genPrivateEnterprise500.py
// ============================================================================

export const PRIVATE_ENTERPRISE_META = {json.dumps(meta, ensure_ascii=False, indent=2)};

export const PE500_COMPANIES = {json.dumps(companies, ensure_ascii=False, indent=2)};

export const PE500_PEOPLE = {json.dumps(people, ensure_ascii=False, indent=2)};

export const PE500_EQUITY = {json.dumps(equity, ensure_ascii=False, indent=2)};

export const PE500_DATASETS = {{
  companies: {{
    id: 'pe500-companies',
    name: '民营经济500强 · 企业榜单',
    category: '民营经济',
    source: PRIVATE_ENTERPRISE_META.listSource,
    note: '工商联2024榜单 · 营收基准年2023',
    columns: ['id', 'rank', 'name', 'province', 'revenueWan', 'revenueYi', 'industry', 'listing', 'listYear', 'profileDepth', 'controlNote'],
    rows: PE500_COMPANIES,
  }},
  people: {{
    id: 'pe500-people',
    name: '民营经济500强 · 创始人与职业经理人',
    category: '民营经济',
    source: '年报/招股书/公司官网/公开报道',
    note: '与政治人物简历库隔离；roleType=founder|manager',
    columns: ['id', 'companyId', 'companyName', 'rank', 'name', 'roleType', 'title', 'background', 'since', 'source'],
    rows: PE500_PEOPLE,
  }},
  equity: {{
    id: 'pe500-equity',
    name: '民营经济500强 · 股权架构',
    category: '民营经济',
    source: '年报/招股书/公开报道',
    note: '主要股东持股与控制权备注；非上市或未披露标为 null',
    columns: ['id', 'companyId', 'companyName', 'rank', 'shareholder', 'holderType', 'pct', 'note', 'asOf', 'source'],
    rows: PE500_EQUITY,
  }},
}};

/** 一键载入三个数据集到 IndexedDB */
export async function loadPrivateEnterprise500(DB) {{
  const ts = Date.now();
  for (const ds of Object.values(PE500_DATASETS)) {{
    await DB.putDataset({{ ...ds, origin: 'seed', stampMs: ts }});
  }}
  return {{
    companies: PE500_COMPANIES.length,
    people: PE500_PEOPLE.length,
    equity: PE500_EQUITY.length,
    deep: PE500_COMPANIES.filter((c) => c.profileDepth === 'full').length,
  }};
}}
"""
    OUT.write_text(js, encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"  companies={len(companies)} people={len(people)} equity={len(equity)} deep={sum(1 for c in companies if c['profileDepth']=='full')}")


if __name__ == "__main__":
    # Save cache from agent fetch if available
    agent_cache = Path("/Users/hayden_lee/.cursor/projects/Users-hayden-lee-LifeOS-Workspace-Business-Projects-china2OS/agent-tools/2870e2e4-759d-4b2d-a75f-0d502b86c21f.txt")
    if agent_cache.exists() and not CACHE.exists():
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        CACHE.write_text(agent_cache.read_text(encoding="utf-8"), encoding="utf-8")
    build()
