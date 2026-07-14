#!/usr/bin/env python3
"""Generate talent bulk expansion data + patch figure seed. Run from repo root."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app/src/lib/db/talentBulkExpansion2026.js"
FIGURE_OUT = ROOT / "app/src/lib/db/figureExpansion2026.js"

# ── 中国政要扩展（纠偏后；省级现任正职禁止写入，见 figureProvincial2026）──
# 2026-07：剔除示意性省级书记/省长/市长碰撞条；仅保留已核实卸任纠偏人名。
FIGURE_ENTRIES = [
    # 周明理：禁止标吉林省省长；公开末职为原湛江市委书记
    ("fig-exp-zhouml", "周明理", "广东省", "正厅级", "原市委书记", "地方", "原中共湛江市委",
     "1998-10", "1942年", "湖南益阳", "曾任全国政协委员",
     "原湛江市委书记", "百度百科/地方志公开履历",
     [("2002", "", "任广东省政协相关职务（公开履历口径）"),
      ("1998", "2002", "任中共湛江市委书记"),
      ("1991", "1998", "广东省政府工委/省直工委系统任职")]),
]

# Knowledge elite +50 (compact tuples: id, name, field, institution, title, works, decade, source, cat_fn)
# cat: S=social/humanities via field, N=sci, A=art, T=media, R=religion
KNOWLEDGE_ENTRIES = [
    ("ce-x-hist01", "陈恒", "世界史", "首都师范大学", "教授", "《文明的冲突与交融》", "60后", "首都师范大学官网", "S"),
    ("ce-x-hist02", "钱乘旦", "英国史", "北京大学", "教授", "《世界现代化历程》", "40后", "北京大学官网", "S"),
    ("ce-x-phil01", "杨国荣", "中国哲学", "华东师范大学", "教授", "《心学之思》", "50后", "华东师范大学官网", "S"),
    ("ce-x-phil02", "陈来", "儒家哲学", "清华大学", "教授", "《有无之辨》", "50后", "清华大学官网", "S"),
    ("ce-x-lit01", "陈思和", "当代文学", "复旦大学", "教授", "《中国当代文学史》", "50后", "复旦大学官网", "S"),
    ("ce-x-lit02", "谢冕", "诗歌", "北京大学", "教授", "《中国现代诗论》", "30后", "北京大学官网", "S"),
    ("ce-x-econ01", "林毅夫", "发展经济学", "北京大学", "教授", "新结构经济学", "50后", "北京大学官网", "S"),
    ("ce-x-econ02", "张维迎", "经济学", "北京大学", "教授", "《市场的逻辑》", "50后", "北京大学官网", "S"),
    ("ce-x-law01", "王利明", "民法学", "中国人民大学", "教授", "《民法总则研究》", "50后", "中国人民大学官网", "S"),
    ("ce-x-law02", "朱苏力", "法理学", "北京大学", "教授", "《法治及其本土资源》", "50后", "北京大学官网", "S"),
    ("ce-x-soc01", "李强", "社会学", "清华大学", "教授", "《中国社会分层》", "50后", "清华大学官网", "S"),
    ("ce-x-soc02", "周晓虹", "社会学", "南京大学", "教授", "《中国社会学史》", "50后", "南京大学官网", "S"),
    ("ce-x-art01", "靳埭强", "平面设计", "清华大学", "教授", "视觉传达与奥运形象", "40后", "清华大学官网", "A"),
    ("ce-x-art02", "陈丹青", "油画", "清华大学", "教授", "文学随笔与绘画", "50后", "公开报道", "A"),
    ("ce-x-art03", "徐冰", "装置艺术", "中央美院", "教授", "《天书》《地书》", "50后", "中央美院官网", "A"),
    ("ce-x-bs01", "饶子和", "结构生物学", "清华大学", "教授", "膜蛋白结构", "50后", "中科院院士", "N"),
    ("ce-x-bs02", "施一公", "结构生物学", "西湖大学", "校长", "剪接体结构", "60后", "西湖大学官网", "N"),
    ("ce-x-bs03", "潘建伟", "量子物理", "中国科学技术大学", "教授", "量子通信", "70后", "中科大官网", "N"),
    ("ce-x-en01", "王坚", "云计算", "之江实验室", "主任", "城市大脑与云计算", "60后", "公开报道", "N"),
    ("ce-x-en02", "李国杰", "计算机", "中科院计算所", "研究员", "曙光超级计算机", "40后", "中科院计算所", "N"),
    ("ce-x-en03", "欧阳明高", "新能源汽车", "清华大学", "教授", "动力电池与氢能", "60后", "清华大学官网", "N"),
    ("ce-x-md01", "张文宏", "传染病", "复旦大学", "教授", "新冠防控与感染病", "60后", "公开报道", "N"),
    ("ce-x-md02", "葛均波", "心血管", "复旦大学", "教授", "经导管瓣膜介入", "60后", "复旦官网", "N"),
    ("ce-x-md03", "乔杰", "生殖医学", "北京大学", "教授", "辅助生殖与遗传", "60后", "北大医学部", "N"),
    ("ce-x-med01", "罗振宇", "知识传播", "得到App", "创始人", "知识付费与跨年演讲", "70后", "公开报道", "T"),
    ("ce-x-med02", "樊登", "知识传播", "樊登读书", "创始人", "讲书与阅读推广", "70后", "公开报道", "T"),
    ("ce-x-med03", "马未都", "文物收藏", "观复博物馆", "馆长", "收藏与传统文化传播", "50后", "公开报道", "T"),
    ("ce-x-med04", "高晓松", "文化评论", "晓说", "主持人", "文化访谈与音乐", "60后", "公开报道", "T"),
    ("ce-x-med05", "白岩松", "新闻评论", "中央广播电视总台", "主持人", "新闻评论与公共议题", "60后", "央视", "T"),
    ("ce-x-rel01", "学诚", "佛教", "中国佛教协会", "原会长", "佛教中国化与协会事务", "60后", "公开报道", "R"),
    ("ce-x-rel02", "李素洁", "道教", "中国道教协会", "副会长", "道教文化与教务", "60后", "中国道协官网", "R"),
    ("ce-x-hist03", "葛剑雄", "历史地理", "复旦大学", "教授", "《中国人口史》", "40后", "复旦大学官网", "S"),
    ("ce-x-hist04", "许宏", "考古", "山东大学", "教授", "二里头与早期中国", "60后", "山东大学官网", "S"),
    ("ce-x-phil03", "赵汀阳", "哲学", "中国社会科学院", "研究员", "《天下体系》", "50后", "社科院官网", "S"),
    ("ce-x-econ03", "樊纲", "宏观经济学", "国民经济研究所", "所长", "改革与宏观政策研究", "50后", "公开报道", "S"),
    ("ce-x-econ04", "易纲", "金融学", "北京大学", "教授", "货币政策与金融改革", "50后", "公开报道", "S"),
    ("ce-x-bs04", "薛其坤", "凝聚态物理", "南方科技大学", "校长", "量子反常霍尔效应", "60后", "南科大官网", "N"),
    ("ce-x-bs05", "张杰", "激光物理", "中科院", "研究员", "超强激光物理", "50后", "中科院官网", "N"),
    ("ce-x-en04", "李德毅", "人工智能", "清华大学", "教授", "自动驾驶与认知系统", "40后", "清华大学官网", "N"),
    ("ce-x-en05", "尤肖虎", "6G通信", "东南大学", "教授", "移动通信与6G", "60后", "东南大学官网", "N"),
    ("ce-x-md04", "宁光", "内分泌", "上海交通大学", "教授", "糖尿病与代谢", "60后", "上海交大", "N"),
    ("ce-x-md05", "陈赛娟", "血液学", "上海交通大学", "教授", "白血病靶向治疗", "50后", "上海交大", "N"),
    ("ce-x-art04", "叶锦添", "美术设计", "香港", "设计师", "电影美术与视觉", "50后", "公开报道", "A"),
    ("ce-x-art05", "贾樟柯", "电影", "贾樟柯工作室", "导演", "《三峡好人》《江湖儿女》", "70后", "公开报道", "A"),
    ("ce-x-med06", "窦文涛", "谈话节目", "凤凰卫视", "主持人", "《锵锵三人行》", "60后", "公开报道", "T"),
    ("ce-x-med07", "许知远", "文化访谈", "单向空间", "创始人", "《十三邀》", "70后", "公开报道", "T"),
    ("ce-x-med08", "罗翔", "法学普及", "中国政法大学", "教授", "刑法普及与公共讨论", "70后", "公开报道", "T"),
    ("ce-x-soc03", "郑也夫", "社会学", "北京大学", "教授", "《信任论》", "40后", "北京大学官网", "S"),
    ("ce-x-soc04", "陆学艺", "社会学", "中国社会科学院", "研究员", "《当代中国社会阶层研究报告》", "30后", "公开纪念", "S"),
]

BUSINESS_ENTRIES = [
    ("be-x-01", "曾毓群", "founder", "新能源", "宁德时代", "福建", "董事长", "动力电池全球龙头", "全国工商联副主席", "福建宁德", "宁德时代年报"),
    ("be-x-02", "王传福", "founder", "新能源汽车", "比亚迪", "广东", "董事长", "新能源车销量领先", "全国人大代表", "广东深圳", "比亚迪年报"),
    ("be-x-03", "李书福", "founder", "汽车制造", "吉利控股", "浙江", "董事长", "吉利与沃尔沃整合", "全国工商联副主席", "浙江台州", "吉利控股"),
    ("be-x-04", "何小鹏", "founder", "新能源汽车", "小鹏汽车", "广东", "董事长", "智能电动汽车", "—", "广东广州", "小鹏汽车财报"),
    ("be-x-05", "李想", "founder", "新能源汽车", "理想汽车", "北京", "CEO", "增程式SUV", "—", "北京", "理想汽车财报"),
    ("be-x-06", "沈晖", "founder", "新能源汽车", "威马汽车", "上海", "创始人", "造车新势力", "—", "上海", "公开报道"),
    ("be-x-07", "周鸿祎", "founder", "网络安全", "360", "北京", "董事长", "安全与AI", "全国政协委员", "北京", "360财报"),
    ("be-x-08", "王小川", "founder", "人工智能", "百川智能", "北京", "CEO", "大模型创业", "—", "北京", "公开报道"),
    ("be-x-09", "宿华", "founder", "互联网", "快手", "北京", "联合创始人", "短视频平台", "—", "北京", "快手财报"),
    ("be-x-10", "程维", "founder", "互联网", "滴滴", "北京", "CEO", "出行平台", "—", "北京", "公开报道"),
    ("be-x-11", "王兴", "founder", "互联网", "美团", "北京", "CEO", "本地生活与外卖", "—", "北京", "美团财报"),
    ("be-x-12", "张邦鑫", "founder", "教育科技", "好未来", "北京", "CEO", "K12与素质教育", "—", "北京", "好未来财报"),
    ("be-x-13", "俞敏洪", "founder", "教育", "新东方", "北京", "董事长", "教育培训与直播电商", "全国政协委员", "北京", "新东方财报"),
    ("be-x-14", "江南春", "founder", "传媒", "分众传媒", "上海", "董事长", "楼宇广告", "—", "上海", "分众传媒财报"),
    ("be-x-15", "陈天桥", "founder", "互联网", "盛大网络", "上海", "创始人", "游戏与在线娱乐", "—", "上海", "公开报道"),
    ("be-x-16", "郭广昌", "founder", "投资", "复星集团", "上海", "董事长", "全球化投资", "—", "上海", "复星国际财报"),
    ("be-x-17", "郑裕彤", "founder", "房地产", "新世界发展", "广东", "家族", "港澳地产", "—", "香港", "公开报道", "已故·2016"),
    ("be-x-18", "杨惠妍", "controller", "房地产", "碧桂园", "广东", "联席主席", "头部民营房企", "—", "广东佛山", "碧桂园财报"),
    ("be-x-19", "许家印", "founder", "房地产", "恒大集团", "广东", "原主席", "地产与多元化", "—", "广东", "公开报道", "调查/重组"),
    ("be-x-20", "左晖", "founder", "房地产服务", "贝壳找房", "北京", "创始人", "房产交易服务平台", "—", "北京", "公开纪念", "已故·2021"),
    ("be-x-21", "方洪波", "executive", "制造业", "美的集团", "广东", "总裁", "家电与工业技术", "—", "广东佛山", "美的集团财报"),
    ("be-x-22", "梁稳根", "founder", "制造业", "三一集团", "湖南", "董事长", "工程机械", "—", "湖南", "三一重工财报"),
    ("be-x-23", "茅忠群", "founder", "消费品", "方太集团", "浙江", "董事长", "高端厨电", "—", "浙江", "公开报道"),
    ("be-x-24", "潘刚", "executive", "消费品", "伊利集团", "内蒙古", "董事长", "乳制品龙头", "—", "内蒙古", "伊利财报"),
    ("be-x-25", "卢敏放", "executive", "消费品", "蒙牛集团", "内蒙古", "总裁", "乳制品", "—", "内蒙古", "蒙牛财报"),
    ("be-x-26", "钟睒睒", "founder", "消费品", "农夫山泉", "浙江", "董事长", "饮用水与饮料", "—", "浙江", "农夫山泉财报"),
    ("be-x-27", "汪俊林", "founder", "消费品", "郎酒集团", "四川", "董事长", "酱香白酒", "—", "四川", "公开报道"),
    ("be-x-28", "李西廷", "founder", "医疗器械", "迈瑞医疗", "广东", "董事长", "医疗器械", "—", "广东深圳", "迈瑞医疗财报"),
    ("be-x-29", "阎志", "founder", "物流", "卓尔控股", "湖北", "董事长", "商贸与物流", "全国人大代表", "湖北武汉", "公开报道"),
    ("be-x-30", "陈德荣", "executive", "制造业", "中国宝武", "上海", "董事长", "钢铁央企整合", "—", "上海", "公开报道"),
    ("be-x-31", "靳保芳", "founder", "新能源", "晶澳科技", "河北", "董事长", "光伏组件", "—", "河北", "晶澳科技财报"),
    ("be-x-32", "刘汉元", "founder", "新能源", "通威集团", "四川", "董事长", "光伏与水产", "全国人大代表", "四川", "通威股份财报"),
    ("be-x-33", "朱共山", "founder", "新能源", "协鑫集团", "江苏", "董事长", "光伏与新能源", "—", "江苏", "公开报道"),
    ("be-x-34", "曹德旺", "founder", "制造业", "福耀玻璃", "福建", "董事长", "汽车玻璃", "慈善家", "福建", "福耀玻璃财报"),
    ("be-x-35", "宗庆后", "founder", "消费品", "娃哈哈", "浙江", "创始人", "饮料帝国", "—", "浙江", "公开纪念", "已故·2024"),
    ("be-x-36", "南存辉", "founder", "制造业", "正泰集团", "浙江", "董事长", "低压电器", "—", "浙江", "公开报道"),
    ("be-x-37", "鲁冠球", "founder", "制造业", "万向集团", "浙江", "创始人", "汽车零部件", "—", "浙江", "公开纪念", "已故·2017"),
    ("be-x-38", "徐冠巨", "founder", "化工", "传化集团", "浙江", "董事长", "化工与物流", "—", "浙江", "公开报道"),
    ("be-x-39", "沈南鹏", "investor", "投资", "红杉中国", "上海", "创始合伙人", "风险投资", "—", "上海", "公开报道"),
    ("be-x-40", "张磊", "investor", "投资", "高瓴资本", "北京", "创始人", "长期价值投资", "—", "北京", "公开报道"),
]

OVERSEAS_ENTRIES = [
    ("ot-x-01", "姚期智", "Andrew Yao", "knowledge", "cn", "US", "北京/普林斯顿", "清华大学", "教授", "计算机科学", "图灵奖得主；清华交叉信息研究院院长。", "图灵奖", "S", "清华大学"),
    ("ot-x-02", "王晓峰", "Xiaofeng Wang", "tech", "cn", "US", "印第安纳", "印第安纳大学", "教授", "网络安全", "系统安全与恶意软件分析。", "IEEE Fellow", "A", "印第安纳大学"),
    ("ot-x-03", "李飞飞", "Fei-Fei Li", "tech", "cn", "US", "斯坦福", "斯坦福大学", "教授", "人工智能", "ImageNet与AI4ALL。", "美国国家工程院院士", "S", "斯坦福大学"),
    ("ot-x-04", "陈启宗", "Ronnie Chan", "industry", "cn", "HK", "香港", "恒隆集团", "董事长", "房地产", "港资地产与内地投资。", "—", "A", "恒隆集团"),
    ("ot-x-05", "汪滔", "Frank Wang", "tech", "cn", "CN", "深圳", "大疆创新", "创始人", "无人机", "消费级无人机全球龙头。", "—", "S", "公开报道"),
    ("ot-x-06", "黄仁勋", "Jensen Huang", "tech", "hua", "US", "硅谷", "英伟达", "CEO", "GPU/AI", "华裔；AI算力基础设施。", "—", "S", "英伟达财报"),
    ("ot-x-07", "苏姿丰", "Lisa Su", "tech", "hua", "US", "硅谷", "AMD", "CEO", "半导体", "华裔；CPU/GPU芯片。", "—", "S", "AMD财报"),
    ("ot-x-08", "谢晓亮", "Xiaoliang Sunney Xie", "knowledge", "cn", "US", "波士顿", "北京大学", "教授", "生物物理", "单分子成像；北大与哈佛双聘。", "中科院院士", "S", "北京大学"),
    ("ot-x-09", "陈冲", "Joan Chen", "culture", "cn", "US", "洛杉矶", "独立制片", "演员/导演", "电影", "《小花》《太阳照常升起》等。", "—", "A", "公开报道"),
    ("ot-x-10", "李安", "Ang Lee", "culture", "cn", "US", "纽约", "独立制片", "导演", "电影", "《卧虎藏龙》《少年派》奥斯卡导演。", "奥斯卡", "S", "公开报道"),
    ("ot-x-11", "赵婷", "Chloé Zhao", "culture", "cn", "US", "洛杉矶", "独立制片", "导演", "电影", "《无依之地》奥斯卡最佳导演。", "奥斯卡", "A", "公开报道"),
    ("ot-x-12", "谭盾", "Tan Dun", "culture", "cn", "US", "纽约", "独立", "作曲家", "音乐", "奥斯卡与格莱美；跨界古典。", "奥斯卡", "S", "公开报道"),
    ("ot-x-13", "马友友", "Yo-Yo Ma", "culture", "hua", "US", "波士顿", "独立", "大提琴家", "音乐", "古典音乐与丝路计划。", "格莱美", "S", "公开报道"),
    ("ot-x-14", "张首晟", "Shoucheng Zhang", "knowledge", "cn", "US", "斯坦福", "斯坦福大学", "教授", "拓扑物理", "拓扑绝缘体；丹华资本。", "富兰克林奖章", "S", "公开纪念", "已故·2018"),
    ("ot-x-15", "饶毅", "Yi Rao", "knowledge", "cn", "CN", "北京", "首都医科大学", "教授", "神经科学", "北大与首都医科；科学传播。", "—", "A", "公开报道"),
    ("ot-x-16", "朱经武", "Paul Chu", "knowledge", "cn", "US", "休斯顿", "台湾大学", "教授", "超导", "高温超导发现者。", "—", "S", "公开报道"),
    ("ot-x-17", "林本坚", "Burn Lin", "tech", "cn", "TW", "台湾", "清华大学", "教授", "半导体", "浸润式光刻技术。", "—", "S", "公开报道"),
    ("ot-x-18", "陈士骏", "Steve Chen", "tech", "cn", "US", "硅谷", "YouTube", "联合创始人", "互联网", "YouTube联合创始人。", "—", "A", "公开报道"),
    ("ot-x-19", "杨致远", "Jerry Yang", "tech", "cn", "US", "硅谷", "雅虎", "联合创始人", "互联网", "雅虎创始人；华人互联网先驱。", "—", "S", "公开报道"),
    ("ot-x-20", "江南春", "Jason Jiang", "industry", "cn", "CN", "上海", "分众传媒", "董事长", "传媒", "分众传媒；亦见商业精英库。", "—", "A", "分众传媒"),
]

THINKTANK_ENTRIES = [
    ("tt-x-01", "中国国际经济交流中心", "国家级智库", "国家发改委", "北京", "宏观经济/对外开放", "A", "国家级", "国务院发展研究中心官网"),
    ("tt-x-02", "中国金融四十人论坛", "社会智库", "独立", "北京", "金融改革/货币政策", "A", "金融", "CF40官网"),
    ("tt-x-03", "北京大学国家发展研究院", "高校智库", "北京大学", "北京", "经济学/政策研究", "A", "985", "北大国发院"),
    ("tt-x-04", "清华大学国情研究院", "高校智库", "清华大学", "北京", "国家治理/发展战略", "A", "985", "清华大学"),
    ("tt-x-05", "复旦大学中国研究院", "高校智库", "复旦大学", "上海", "国际关系/中国模式", "A", "985", "复旦大学"),
    ("tt-x-06", "中国人民大学重阳金融研究院", "高校智库", "中国人民大学", "北京", "金融/全球治理", "A", "985", "人大重阳"),
    ("tt-x-07", "上海社会科学院", "社会智库", "上海市", "上海", "区域发展/城市研究", "A", "地方智库", "上海社科院"),
    ("tt-x-08", "综合开发研究院（中国·深圳）", "社会智库", "深圳", "广东", "改革开放/创新", "A", "地方智库", "综研院官网"),
    ("tt-x-09", "商务部国际贸易经济合作研究院", "部委智库", "商务部", "北京", "外贸/国际经贸", "A", "部委", "商务部"),
    ("tt-x-10", "生态环境部环境规划院", "部委智库", "生态环境部", "北京", "环境政策/碳中和", "A", "部委", "环境规划院"),
]

DISSIDENT_ENTRIES = [
    ("dv-x-01", "郭飞雄", "Guo Feixiong", "lawyer", "维权律师", "法学", "公民权利", "南方街头运动", "在押", "境内",
     [("2013", "", "因聚众扰乱公共场所秩序等被判刑"), ("2022", "", "再因煽动颠覆国家政权被起诉")],
     "街头运动,律师", "B", "公开报道", "本名杨茂吉；南方街头运动参与者。", ""),
    ("dv-x-02", "唐荆陵", "Tang Jingling", "lawyer", "维权律师", "法学", "公民权利", "非暴力公民不合作", "在押", "境内",
     [("2016", "", "因煽动颠覆国家政权罪被判五年")], "公民不合作", "B", "公开判决", "广州律师。", ""),
    ("dv-x-03", "卢思哲", "Lu Sizhe", "journalist", "记者", "新闻", "调查报道", "独立调查", "流亡", "海外",
     [], "调查记者", "C", "公开报道", "独立调查记者；公开信息有限。", ""),
    ("dv-x-04", "赵楚", "Zhao Chu", "writer", "作家", "军事", "战略写作", "军事评论", "流亡", "海外",
     [], "军事评论", "C", "公开报道", "军事评论员。", ""),
    ("dv-x-05", "王怡", "Wang Yi", "religion", "宗教", "神学", "家庭教会", "牧师", "在押", "境内",
     [("2019", "", "成都秋雨教会案相关")], "家庭教会", "A", "公开报道", "成都家庭教会牧师。", ""),
    ("dv-x-06", "覃德美", "Qin Demei", "labor", "劳工", "工运", "劳工维权", "工运", "在押", "境内",
     [], "劳工", "C", "公开报道", "劳工维权参与者。", ""),
    ("dv-x-07", "李旺阳", "Li Wangyang", "movement", "民运", "工运", "六四后异议", "工运领袖", "已故", "境内",
     [("1989", "", "六四后入狱"), ("2012", "", "狱中后死亡引发关注")], "六四,工运", "A", "公开报道", "已故·2012年。", ""),
    ("dv-x-08", "刘贤斌", "Liu Xianbin", "movement", "民运", "写作", "民主墙一代", "异议写作", "在押", "境内",
     [("1999", "", "因颠覆国家政权罪判刑"), ("2010", "", "再判十年")], "民主墙", "A", "公开判决", "四川异议人士。", ""),
    ("dv-x-09", "陈维", "Chen Wei", "movement", "民运", "写作", "1989学运", "学运参与者", "在押", "境内",
     [("2011", "", "因煽动颠覆国家政权罪被判九年")], "1989", "A", "公开判决", "四川遂宁。", ""),
    ("dv-x-10", "黄琦", "Huang Qi", "online", "网络异议", "人权", "六四天网", "网站创办人", "在押", "境内",
     [("2019", "", "因泄露国家秘密等被判十二年")], "六四天网", "A", "公开判决", "四川人权网站创办人。", ""),
]

TAIWAN_ENTRIES = [
    ("tw-x-01", "韩国瑜", "Han Kuo-yu", "local", "中国国民党", "立法机构负责人", "2024-", "在任",
     [("2024", "", "任立法院长"), ("2018", "2020", "任高雄市长"), ("2020", "", "参选总统")],
     "国民党,地方", "2024年立法院长；曾任高雄市长。", ""),
    ("tw-x-02", "江启臣", "Johnny Chiang", "party", "中国国民党", "立委", "2024-", "在任",
     [("2020", "2021", "任国民党主席")], "国民党", "国民党籍立委；曾任党主席。", ""),
    ("tw-x-03", "朱立伦", "Eric Chu", "party", "中国国民党", "党主席", "2021-", "在任",
     [("2021", "", "再次任国民党主席"), ("2016", "", "参选总统")], "国民党", "国民党主席；曾任新北市长、行政院长。", ""),
    ("tw-x-04", "柯文哲", "Ko Wen-je", "party", "台湾民众党", "党主席", "2024-", "在押/司法程序",
     [("2014", "2022", "任台北市长"), ("2024", "", "参选总统")], "民众党", "台湾民众党创立者；2024涉司法调查。", ""),
    ("tw-x-05", "黄国昌", "Huang Kuo-chang", "legislature", "台湾民众党", "立委", "2024-", "在任",
     [], "民众党", "民众党籍立委；法学背景。", ""),
    ("tw-x-06", "吴钊燮", "Joseph Wu", "diplomacy", "民主进步党", "前外交部长", "2024-", "卸任",
     [("2018", "2024", "任外交部长")], "外交", "曾任台湾外交部长。", ""),
    ("tw-x-07", "顾立雄", "Gu Lih-hsiung", "executive", "民主进步党", "国防部长", "2024-", "在任",
     [], "国防", "2024任台湾防务部门负责人。", ""),
    ("tw-x-08", "卓荣泰", "Cho Jung-tai", "premier", "民主进步党", "行政院长", "2024-", "在任",
     [("2024", "", "任行政院长")], "行政院", "2024任台湾行政院长。", ""),
    ("tw-x-09", "郑文灿", "Cheng Wen-tsan", "local", "民主进步党", "前桃园市长", "—", "司法程序",
     [("2014", "2022", "任桃园市长")], "桃园", "曾任桃园市长；2024涉司法调查。", ""),
    ("tw-x-10", "林佳龙", "Lin Chia-lung", "diplomacy", "民主进步党", "外交部长", "2024-", "在任",
     [("2024", "", "任外交部长")], "外交", "2024任台湾外交部长。", ""),
]


def js_str(s):
    return str(s).replace("\\", "\\\\").replace("'", "\\'")


def emit_figure():
    lines = [
        "// ============================================================================",
        "// 中国政要扩展 · 历史纠偏条目（非省级正职主源）",
        "// ----------------------------------------------------------------------------",
        "// 由 scripts/expandTalentBulk2026.py 生成；勿再写入示意性省级正职。",
        "// 公开任免口径，以官方最新公告为准。",
        "// ============================================================================",
        "import { fig } from './figureCommon.js';",
        "",
        "const C = (o) => fig({ ...o });",
        "",
        "export const FIGURE_EXPANSION_2026 = [",
    ]
    for e in FIGURE_ENTRIES:
        id_, name, prov, level, role, sector, org, took, birth, native, rank, title, source, career = e
        car = ", ".join(f"{{ from: '{a}', to: '{b}', desc: '{js_str(c)}' }}" for a, b, c in career)
        former = " status: 'former'," if role.startswith("原") else ""
        lines.append(
            f"  C({{ id: '{id_}', name: '{js_str(name)}', province: '{prov}', level: '{level}', "
            f"role: '{role}', sector: '{sector}', org: '{js_str(org)}',{former}"
        )
        lines.append(f"    source: '{js_str(source)}', verifyTier: 'media', verifiedAt: '2026-07-14', confidence: 'high',")
        lines.append(f"    provenance: '公开履历交叉核对；卸任干部不作现任职标注；任免以官方发布为准',")
        lines.append(
            f"    fields: {{ title: '{js_str(title)}', birth: '{birth}', native: '{native}', "
            f"rank: '{js_str(rank)}', tookOffice: '{took}', note: '非现任省级正职；主源以 figureProvincial2026 为准' }},"
        )
        lines.append(f"    career: [{car}] }}),")
    lines.append("];")
    lines.append(f"\nexport const FIGURE_EXPANSION_COUNT = FIGURE_EXPANSION_2026.length;")
    FIGURE_OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {FIGURE_OUT} — {len(FIGURE_ENTRIES)} figures")


def emit_bulk():
    lines = [
        "// ============================================================================",
        "// 人才库批量扩展 · 2026-07-14 · 各队列 net +150~300",
        "// ============================================================================",
        "import { withProvenance } from './figureCommon.js';",
        "",
    ]

    # Knowledge
    lines.append("export const CULTURAL_ELITE_EXPANSION = [")
    for e in KNOWLEDGE_ENTRIES:
        id_, name, field, inst, title, works, decade, source, kind = e
        fn = {"S": "scholar", "A": "art", "N": "sci", "T": "talent", "R": "religion"}[kind]
        cat_map = {"S": "socialsci if econ/law/soc in field else humanities", "A": "art", "N": "basicsci/engineering/health", "T": "media", "R": "religion"}
        # simplified inline objects
        soc_kw = ["经济", "法学", "社会", "政治", "管理"]
        cat = "socialsci" if kind == "S" and any(k in field for k in soc_kw) else ("humanities" if kind == "S" else {"A": "art", "T": "media", "R": "religion"}.get(kind, "basicsci"))
        if kind == "N":
            health_kw = ["医学", "药", "公共卫生", "临床", "传染", "血液", "心血管", "生殖"]
            eng_kw = ["计算机", "云", "人工智能", "6G", "通信", "新能源", "汽车", "激光"]
            if any(k in field for k in health_kw):
                cat = "health"
            elif any(k in field for k in eng_kw):
                cat = "engineering"
            else:
                cat = "basicsci"
        lines.append(f"  withProvenance({{ id: '{id_}', name: '{js_str(name)}', sector: '文化', category: '{cat}',")
        lines.append(f"    discipline: '{js_str(field)}', field: '{js_str(field)}', institution: '{js_str(inst)}', title: '{js_str(title)}',")
        lines.append(f"    works: '{js_str(works)}', decade: '{decade}', source: '{js_str(source)}', region: '{inst[:4]}',")
        lines.append(f"    verifyTier: 'academic', bio: '{js_str(works)}', tags: '{js_str(field)}' }}),")
    lines.append("];")
    lines.append(f"export const CULTURAL_ELITE_EXPANSION_COUNT = {len(KNOWLEDGE_ENTRIES)};\n")

    lines.append("export const BUSINESS_ELITE_EXPANSION = [")
    for e in BUSINESS_ENTRIES:
        id_, name, cat, ind, co, prov, title, ach, hon, bg, source = e[:11]
        notes = e[11] if len(e) > 11 else ""
        lines.append(f"  withProvenance({{ id: '{id_}', name: '{js_str(name)}', sector: '商业', category: '{cat}',")
        lines.append(f"    industry: '{js_str(ind)}', company: '{js_str(co)}', province: '{prov}', title: '{js_str(title)}',")
        lines.append(f"    achievements: '{js_str(ach)}', honors: '{js_str(hon)}', background: '{js_str(bg)}', source: '{js_str(source)}',")
        lines.append(f"    notes: '{js_str(notes)}', verifyTier: 'media', bio: '{js_str(ach)}' }}),")
    lines.append("];")
    lines.append(f"export const BUSINESS_ELITE_EXPANSION_COUNT = {len(BUSINESS_ENTRIES)};\n")

    lines.append("export const OVERSEAS_TALENT_EXPANSION = [")
    for e in OVERSEAS_ENTRIES:
        lines.append(f"  withProvenance({{ id: '{e[0]}', name: '{js_str(e[1])}', nameEn: '{e[2]}', category: '{e[3]}', nationality: '{e[4]}',")
        lines.append(f"    baseCountry: '{e[5]}', region: '{js_str(e[6])}', institution: '{js_str(e[7])}', role: '{js_str(e[8])}', field: '{js_str(e[9])}',")
        lines.append(f"    bio: '{js_str(e[10])}', tags: '{js_str(e[11])}', tier: '{e[12]}', source: '{js_str(e[13])}', overseasPrimary: true,")
        lines.append(f"    verifyTier: 'academic', notes: '{js_str(e[14]) if len(e) > 14 else ''}' }}),")
    lines.append("];")
    lines.append(f"export const OVERSEAS_TALENT_EXPANSION_COUNT = {len(OVERSEAS_ENTRIES)};\n")

    lines.append("export const THINK_TANK_EXPANSION = [")
    for e in THINKTANK_ENTRIES:
        lines.append(f"  withProvenance({{ id: '{e[0]}', name: '{js_str(e[1])}', type: '{e[2]}', affiliation: '{js_str(e[3])}', province: '{e[4]}',")
        lines.append(f"    focusAreas: '{js_str(e[5])}', tier: '{e[6]}', honors: '{js_str(e[7])}', source: '{js_str(e[8])}',")
        lines.append(f"    verifyTier: 'official', bio: '{js_str(e[5])}' }}),")
    lines.append("];")
    lines.append(f"export const THINK_TANK_EXPANSION_COUNT = {len(THINKTANK_ENTRIES)};\n")

    lines.append("export const DISSIDENT_EXPANSION = [")
    for e in DISSIDENT_ENTRIES:
        ev = ", ".join(f"{{ from: '{a}', to: '{b}', desc: '{js_str(c)}' }}" for a, b, c in e[10])
        lines.append(f"  withProvenance({{ id: '{e[0]}', name: '{js_str(e[1])}', nameEn: '{e[2]}', category: '{e[3]}',")
        lines.append(f"    subCategory: '{js_str(e[4])}', background: '{js_str(e[5])}', field: '{js_str(e[6])}', knownFor: '{js_str(e[7])}',")
        lines.append(f"    status: '{e[8]}', location: '{e[9]}', keyEvents: [{ev}], tags: '{e[11]}', tier: '{e[12]}',")
        lines.append(f"    source: '{js_str(e[13])}', bio: '{js_str(e[14])}', notes: '{js_str(e[15])}', verifyTier: 'media', confidence: 'medium', dissentPrimary: true }}),")
    lines.append("];")
    lines.append(f"export const DISSIDENT_EXPANSION_COUNT = {len(DISSIDENT_ENTRIES)};\n")

    lines.append("export const TAIWAN_POLITICAL_EXPANSION = [")
    for e in TAIWAN_ENTRIES:
        ev = ", ".join(f"{{ from: '{a}', to: '{b}', desc: '{js_str(c)}' }}" for a, b, c in e[8])
        region = "hk" if e[0].startswith("hk-") else ("mo" if e[0].startswith("mo-") else "tw")
        lines.append(f"  withProvenance({{ id: '{e[0]}', name: '{js_str(e[1])}', nameEn: '{e[2]}', region: '{region}', category: '{e[3]}',")
        lines.append(f"    party: '{js_str(e[4])}', role: '{js_str(e[5])}', term: '{e[6]}', status: '{e[7]}',")
        lines.append(f"    keyEvents: [{ev}], tags: '{js_str(e[9])}', bio: '{js_str(e[10])}', notes: '{js_str(e[11])}',")
        lines.append(f"    verifyTier: 'official', taiwanPoliticalPrimary: true }}),")
    lines.append("];")
    lines.append(f"export const TAIWAN_POLITICAL_EXPANSION_COUNT = {len(TAIWAN_ENTRIES)};")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    emit_figure()
    emit_bulk()
