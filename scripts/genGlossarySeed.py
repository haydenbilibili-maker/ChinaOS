#!/usr/bin/env python3
"""Scan project sources and emit app/src/lib/db/glossarySeed.js (200+ 术语词条)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "app/src/app/registry.js"
INDEX_MD = ROOT / "中国深度调研系列_索引与恢复指令.md"
OUT = ROOT / "app/src/lib/db/glossarySeed.js"

CATEGORIES = [
    ("politics", "政治体制"),
    ("econ", "经济理论"),
    ("module", "模块专有"),
    ("gy", "GY系列"),
    ("research", "调研术语"),
    ("legal", "法律政策"),
    ("military", "军事战略"),
    ("society", "社会文化"),
    ("tech", "技术概念"),
]

CAT_LABEL = dict(CATEGORIES)
CAT_IDS = set(CAT_LABEL)

# 常用汉字拼音首字母（覆盖本项目高频字，无外部依赖）
_PINYIN_TABLE = """
阿A八B嚓C搭D蛾E发F噶G哈H击J喀K拉L妈M拿N哦O啪P期Q然R撒S塌T挖W昔X压Y匝Z
"""
_CHAR_INITIAL: dict[str, str] = {}

def _build_char_initial():
    if _CHAR_INITIAL:
        return
    # 简表：按 Unicode 常用政治经济词汇字符手工补全
    pairs = """
    收支S 赛C 语Y 离L 岛D 算S 能N 新X 质Z 生S 产C 力L 权Q 力L 治Z 理L 体T 制Z 改G 革G 开K 放F
    博B 弈Y 修X 昔X 底D 德D 陷X 阱J 威W 慑S 战Z 略L 委W 托T 代D 理L 公G 地D 悲B 剧J 矛M 盾D 论L
    意Y 识S 形X 态T 建J 构G 主Z 义Y 现X 实S 主Z 义Y 路L 径J 依Y 赖L 耗H 散S 结J 构G 反F 脆C 弱R 性X
    康K 波B 周Z 期Q 中Z 等D 收S 入R 陷X 阱J 压Y 力L 体T 制Z 网W 格G 数S 字Z 政Z 府F 央Y 地D 关G 系X
    国G 有Y 资Z 本B 法F 治Z 建J 设S 统T 一Y 大D 市S 场C 人R 口K 零L 工G 医Y 疗L 住Z 房F 教J 育Y 内N 需X
    银Y 发F 生S 育Y 中Z 医Y 制Z 造Z 机J 器R 人R 材C 料L 源Y 核H 氢Q 智Z 网W 算S 力L 物W 流L 供G 应Y 链L
    基J 础S 设S 施S 超C 级J 工G 程C 航H 天T 低D 空K 医Y 疗L 文W 旅L 金J 融R 人R 民M 币B 债Z 务W 乡X 村C
    边B 疆J 区Q 域Y 东D 北B 海H 洋Y 极J 地D 资Z 源Y 离L 岸A 港G 澳A 量L 子Z 集J 成C 人R 工G 智Z 能N 生S 物W
    脑N 未W 来L 教J 科K 人R 才C 军J 事S 台T 海H 大D 安A 全Q 红H 色S 公G 共G 国G 运Y 领L 袖X 人R 才C 政Z 令L
    数S 据J 监J 测C 词C 典D 术S 语Y 调D 研Y 法F 律L 政Z 策C 社S 会H 文W 化H 技J 术S 概G 念N 模M 块K 专Z 有Y
    """.split()
    for i in range(0, len(pairs), 2):
        if i + 1 < len(pairs):
            ch, ini = pairs[i][0], pairs[i + 1][0]
            _CHAR_INITIAL[ch] = ini.upper()
    # 扩展：A-Z 映射常用字
    ext = {
        "一": "Y", "三": "S", "上": "S", "下": "X", "专": "Z", "世": "S", "两": "L", "中": "Z", "主": "Z", "之": "Z",
        "乐": "L", "九": "J", "也": "Y", "习": "X", "书": "S", "买": "M", "乱": "L", "争": "Z", "事": "S", "二": "E",
        "云": "Y", "互": "H", "五": "W", "亚": "Y", "交": "J", "产": "C", "人": "R", "从": "C", "他": "T", "代": "D",
        "以": "Y", "价": "J", "企": "Q", "众": "Z", "优": "Y", "会": "H", "传": "C", "体": "T", "何": "H", "供": "G",
        "保": "B", "信": "X", "修": "X", "倒": "D", "债": "Z", "值": "Z", "元": "Y", "先": "X", "光": "G", "全": "Q",
        "八": "B", "公": "G", "六": "L", "共": "G", "关": "G", "内": "N", "再": "Z", "农": "N", "出": "C", "分": "F",
        "切": "Q", "创": "C", "利": "L", "制": "Z", "前": "Q", "力": "L", "办": "B", "功": "G", "加": "J", "动": "D",
        "化": "H", "北": "B", "区": "Q", "十": "S", "半": "B", "华": "H", "协": "X", "单": "D", "南": "N", "博": "B",
        "占": "Z", "卡": "K", "去": "Q", "又": "Y", "及": "J", "反": "F", "发": "F", "变": "B", "口": "K", "古": "G",
        "可": "K", "台": "T", "史": "S", "合": "H", "同": "T", "名": "M", "向": "X", "否": "F", "含": "H", "吸": "X",
        "和": "H", "品": "P", "商": "S", "善": "S", "四": "S", "回": "H", "国": "G", "土": "T", "在": "Z", "地": "D",
        "场": "C", "均": "J", "坏": "H", "城": "C", "基": "J", "堂": "T", "增": "Z", "壁": "B", "外": "W", "多": "D",
        "大": "D", "天": "T", "失": "S", "头": "T", "女": "N", "好": "H", "如": "R", "子": "Z", "字": "Z", "存": "C",
        "学": "X", "它": "T", "安": "A", "完": "W", "官": "G", "定": "D", "实": "S", "审": "S", "家": "J", "对": "D",
        "小": "X", "少": "S", "就": "J", "层": "C", "居": "J", "展": "Z", "山": "S", "岛": "D", "工": "G", "差": "C",
        "已": "Y", "市": "S", "常": "C", "平": "P", "年": "N", "并": "B", "广": "G", "序": "X", "应": "Y", "底": "D",
        "度": "D", "庭": "T", "康": "K", "延": "Y", "建": "J", "开": "K", "异": "Y", "引": "Y", "强": "Q", "当": "D",
        "形": "X", "影": "Y", "往": "W", "征": "Z", "循": "X", "微": "W", "心": "X", "必": "B", "忆": "Y", "志": "Z",
        "快": "K", "态": "T", "思": "S", "性": "X", "总": "Z", "情": "Q", "意": "Y", "感": "G", "成": "C", "我": "W",
        "战": "Z", "户": "H", "所": "S", "手": "S", "打": "D", "托": "T", "执": "Z", "扩": "K", "批": "P", "承": "C",
        "技": "J", "投": "T", "抗": "K", "折": "Z", "护": "H", "报": "B", "押": "Y", "抽": "C", "担": "D", "拉": "L",
        "拍": "P", "拥": "Y", "择": "Z", "持": "C", "指": "Z", "按": "A", "挑": "T", "换": "H", "据": "J", "排": "P",
        "探": "T", "接": "J", "控": "K", "推": "T", "提": "T", "援": "Y", "搜": "S", "搞": "G", "搬": "B", "携": "X",
        "支": "Z", "改": "G", "攻": "G", "放": "F", "政": "Z", "效": "X", "敏": "M", "数": "S", "整": "Z", "文": "W",
        "斗": "D", "新": "X", "方": "F", "族": "Z", "无": "W", "日": "R", "旧": "J", "时": "S", "明": "M", "易": "Y",
        "星": "X", "是": "S", "更": "G", "最": "Z", "月": "Y", "有": "Y", "服": "F", "期": "Q", "未": "W", "本": "B",
        "机": "J", "权": "Q", "来": "L", "构": "G", "析": "X", "林": "L", "果": "G", "架": "J", "某": "M", "查": "C",
        "标": "B", "树": "S", "核": "H", "根": "G", "格": "G", "案": "A", "档": "D", "桥": "Q", "梯": "T", "检": "J",
        "概": "G", "次": "C", "正": "Z", "此": "C", "步": "B", "武": "W", "死": "S", "段": "D", "每": "M", "比": "B",
        "民": "M", "气": "Q", "水": "S", "永": "Y", "求": "Q", "汇": "H", "汉": "H", "江": "J", "池": "C", "没": "M",
        "治": "Z", "沿": "Y", "法": "F", "波": "B", "注": "Z", "活": "H", "流": "L", "测": "C", "海": "H", "消": "X",
        "深": "S", "清": "Q", "港": "G", "源": "Y", "满": "M", "漏": "L", "演": "Y", "潜": "Q", "火": "H", "灵": "L",
        "点": "D", "热": "R", "照": "Z", "燃": "R", "版": "B", "牛": "N", "物": "W", "特": "T", "独": "D", "率": "L",
        "环": "H", "现": "X", "理": "L", "生": "S", "用": "Y", "由": "Y", "电": "D", "男": "N", "界": "J", "留": "L",
        "略": "L", "疑": "Y", "疗": "L", "疯": "F", "白": "B", "百": "B", "的": "D", "皮": "P", "盈": "Y", "益": "Y",
        "监": "J", "盖": "G", "目": "M", "直": "Z", "相": "X", "看": "K", "真": "Z", "眼": "Y", "知": "Z", "短": "D",
        "石": "S", "码": "M", "破": "P", "硬": "Y", "确": "Q", "示": "S", "社": "S", "神": "S", "禁": "J", "离": "L",
        "科": "K", "秒": "M", "积": "J", "称": "C", "移": "Y", "程": "C", "空": "K", "突": "T", "立": "L", "站": "Z",
        "竞": "J", "端": "D", "第": "D", "策": "C", "算": "S", "管": "G", "精": "J", "系": "X", "素": "S", "红": "H",
        "约": "Y", "级": "J", "纪": "J", "线": "X", "组": "Z", "细": "X", "终": "Z", "经": "J", "结": "J", "给": "G",
        "统": "T", "继": "J", "维": "W", "综": "Z", "绿": "L", "网": "W", "置": "Z", "美": "M", "群": "Q", "老": "L",
        "考": "K", "而": "E", "耗": "H", "联": "L", "聚": "J", "股": "G", "背": "B", "能": "N", "脉": "M", "自": "Z",
        "至": "Z", "致": "Z", "舞": "W", "航": "H", "良": "L", "色": "S", "节": "J", "花": "H", "英": "Y", "范": "F",
        "草": "C", "荣": "R", "获": "H", "营": "Y", "落": "L", "著": "Z", "虚": "X", "融": "R", "血": "X", "行": "X",
        "衡": "H", "补": "B", "表": "B", "被": "B", "规": "G", "视": "S", "解": "J", "触": "C", "言": "Y", "警": "J",
        "计": "J", "认": "R", "让": "R", "议": "Y", "记": "J", "讲": "J", "论": "L", "设": "S", "证": "Z", "评": "P",
        "识": "S", "诉": "S", "词": "C", "试": "S", "话": "H", "该": "G", "语": "Y", "说": "S", "调": "D", "谈": "T",
        "象": "X", "负": "F", "财": "C", "责": "Z", "质": "Z", "购": "G", "资": "Z", "赋": "F", "赌": "D", "赛": "S",
        "赢": "Y", "走": "Z", "起": "Q", "超": "C", "越": "Y", "路": "L", "跳": "T", "身": "S", "车": "C", "转": "Z",
        "软": "R", "轻": "Q", "载": "Z", "较": "J", "辅": "F", "输": "S", "辩": "B", "达": "D", "过": "G", "运": "Y",
        "近": "J", "还": "H", "这": "Z", "进": "J", "远": "Y", "连": "L", "述": "S", "追": "Z", "退": "T", "送": "S",
        "选": "X", "透": "T", "通": "T", "速": "S", "造": "Z", "逻": "L", "遇": "Y", "道": "D", "遗": "Y", "那": "N",
        "部": "B", "都": "D", "配": "P", "释": "S", "里": "L", "重": "Z", "野": "Y", "量": "L", "金": "J", "针": "Z",
        "铁": "T", "银": "Y", "链": "L", "销": "X", "锁": "S", "长": "C", "门": "M", "闭": "B", "问": "W", "间": "J",
        "防": "F", "阳": "Y", "阶": "J", "阻": "Z", "附": "F", "际": "J", "陆": "L", "降": "J", "限": "X", "院": "Y",
        "除": "C", "险": "X", "隐": "Y", "障": "Z", "集": "J", "零": "L", "需": "X", "震": "Z", "青": "Q", "面": "M",
        "革": "G", "韧": "R", "音": "Y", "项": "X", "顺": "S", "预": "Y", "领": "L", "频": "P", "风": "F", "食": "S",
        "首": "S", "马": "M", "驱": "Q", "验": "Y", "高": "G", "鬼": "G", "魂": "H", "魔": "M", "鱼": "Y", "鲁": "L",
        "默": "M", "鼓": "G", "龙": "L",
    }
    _CHAR_INITIAL.update(ext)


def pinyin_initial(term: str) -> str:
    _build_char_initial()
    if not term:
        return "#"
    c = term.strip()[0]
    if c.isascii() and c.isalpha():
        return c.upper()
    if c.isdigit():
        return "#"
    return _CHAR_INITIAL.get(c, "#")


def slugify(term: str) -> str:
    s = re.sub(r"[^\w\u4e00-\u9fff]+", "-", term.strip())
    s = re.sub(r"-+", "-", s).strip("-").lower()
    if not s or s.isdigit():
        s = f"term-{abs(hash(term)) % 10**8}"
    return s[:80]


def parse_registry() -> list[dict]:
    text = REGISTRY.read_text(encoding="utf-8")
    mods = []
    for m in re.finditer(
        r"\{\s*id:\s*'([^']+)',\s*path:\s*'([^']+)',\s*group:\s*'([^']+)',\s*title:\s*'([^']+)',\s*subtitle:\s*'([^']+)'",
        text,
    ):
        mods.append({"id": m.group(1), "path": m.group(2), "group": m.group(3), "title": m.group(4), "subtitle": m.group(5)})
    return mods


def parse_index_keywords() -> list[str]:
    if not INDEX_MD.exists():
        return []
    text = INDEX_MD.read_text(encoding="utf-8")
    kws: set[str] = set()
    for m in re.finditer(r"\*\*关键词\*\*[：:]\s*(.+)", text):
        for part in re.split(r"[、，,；;·]", m.group(1)):
            t = re.sub(r"[（(].*?[）)]", "", part).strip()
            t = re.sub(r"\s+", "", t)
            if 2 <= len(t) <= 20 and not t.startswith("→"):
                kws.add(t)
    return sorted(kws)


def ctx(module_id: str, label: str | None = None):
    return {"moduleId": module_id, "label": label or module_id, "path": None}


def entry(
    term: str,
    category: str,
    definition: str,
    *,
    aliases: list[str] | None = None,
    context=None,
    related: list[str] | None = None,
    source: str = "",
    eid: str | None = None,
):
    if category not in CAT_IDS:
        category = "research"
    ctx_list = context or []
    resolved = []
    for c in ctx_list:
        if isinstance(c, str):
            resolved.append({"moduleId": c, "label": c, "path": None})
        else:
            resolved.append(c)
    return {
        "id": eid or slugify(term),
        "term": term,
        "aliases": aliases or [],
        "category": category,
        "definition": definition,
        "context": resolved,
        "related": related or [],
        "source": source,
        "initial": pinyin_initial(term),
    }


# ---------------------------------------------------------------------------
# 手工策展核心词条（调研系列 + 理论 + GY + 制度）
# ---------------------------------------------------------------------------
CURATED: list[dict] = [
    entry("收支倒挂", "politics", "地方财政收入不足以覆盖刚性支出，迫使土地财政、转移支付与债务扩张成为常态对冲机制。", aliases=["财政收支倒挂"], context=["powerlogic", "govsystem"], related=["土地财政", "分税制", "穿透式监管"], source="中国深度调研系列 · 权力运行逻辑"),
    entry("锦标赛竞争", "politics", "以相对绩效排名驱动地方官员晋升的激励结构，将增长指标工具化并放大区域间策略性竞争。", context=["powerlogic", "govsystem"], related=["压力体制", "央地关系"], source="中国深度调研系列"),
    entry("赛博反馈", "research", "数字治理闭环中，线上舆情、算法推荐与线下处置相互放大，形成对系统行为的实时校正回路。", aliases=["网络反馈"], context=["digitalGiantWeb", "powerlogic"], related=["语义防火墙", "数字利维坦"], source="中国深度调研系列"),
    entry("语义防火墙", "research", "通过话语规范、信息分层与平台规则，在公开语义空间过滤与重编敏感议题的治理技术。", context=["digitalGiantWeb", "yishixingtai"], related=["赛博反馈", "意识形态"], source="中国深度调研系列"),
    entry("数字利维坦", "politics", "国家以数据、算力与平台基础设施扩展监控与规训能力，降低大规模社会协调成本的治理形态隐喻。", context=["powerlogic", "governance"], related=["网格管理", "穿透式监管"], source="中国深度调研系列"),
    entry("全域安全化", "politics", "将经济、科技、文化、网络等议题纳入国家安全框架统筹，扩张「统筹发展与安全」的决策边界。", aliases=["大安全观"], context=["omnisecurity", "powerlogic"], related=["底线思维", "统筹发展与安全"], source="中国深度调研系列"),
    entry("核心集权", "politics", "决策权向核心集中、减少分散否决点的权力结构安排，以提高战略连贯性与执行穿透力。", context=["leadership", "powerlogic"], related=["单点架构", "压力体制"], source="中国深度调研系列 · 决策逻辑"),
    entry("底线思维", "politics", "在不确定环境中预设最坏情形并预留政策冗余，优先保障系统生存底线而非最优效率。", context=["omnisecurity", "powerlogic"], related=["统筹发展与安全", "大安全观"], source="中国深度调研系列"),
    entry("统筹发展与安全", "politics", "将增长目标与安全约束联合优化，在资源分配上对「发展」与「安全」进行动态再平衡。", context=["omnisecurity", "powerlogic"], related=["大安全观", "底线思维"], source="中国深度调研系列"),
    entry("集中力量办大事", "politics", "通过行政动员与资源集中，在关键工程与危机应对中实现超常规投入的制度能力。", context=["megaprojects", "leadership"], related=["国家能力", "超级工程"], source="中国深度调研系列"),
    entry("双系统耦合", "politics", "两种制度规则并存并相互传导（如普通法窗口与内地治理），形成过滤与纠偏并存的结构。", context=["offshore"], related=["离岸窗口", "功能性替代"], source="中国深度调研系列 · 一国两制"),
    entry("离岸窗口", "econ", "在主权框架内保留面向全球资本与规则的接口，使流动性与风险在可控边界内跨境流动。", aliases=["离岸RMB"], context=["offshore"], related=["双系统耦合", "资本通道"], source="中国深度调研系列"),
    entry("主权纠偏算法", "politics", "当离岸系统偏离主权底线时，通过立法、人事与功能性替代进行制度回调的运作逻辑。", context=["offshore"], related=["双系统耦合", "大湾区"], source="中国深度调研系列"),
    entry("功能性替代", "politics", "以内地城市或制度安排逐步承接离岸枢纽的部分功能，降低对单一窗口的路径依赖。", context=["offshore", "regional"], related=["离岸窗口", "统一大市场"], source="中国深度调研系列"),
    entry("岛链突破", "military", "突破第一岛链地理约束，扩展近海力量投送与战略通道的军事—地缘目标向量。", context=["straits", "military"], related=["A2/AD", "地缘引力"], source="中国深度调研系列 · 台海"),
    entry("地缘引力", "military", "经济质量、产业链位置与人口规模在地缘博弈中形成的结构性吸引或锁定效应。", context=["straits"], related=["产业链人质", "硅盾屏障"], source="中国深度调研系列 · 台海"),
    entry("A2/AD", "military", "反介入/区域拒止：通过导弹、潜艇与感知网限制外部力量进入关键海域的能力组合。", aliases=["反介入/区域拒止"], context=["straits", "military"], related=["岛链突破", "物理威慑"], source="中国深度调研系列 · 台海"),
    entry("产业链人质", "military", "关键产业环节对外部市场的深度嵌入，使冲突成本通过供应链反向传导的博弈杠杆。", context=["straits", "supplychain"], related=["地缘引力", "供应链韧性"], source="中国深度调研系列 · 台海"),
    entry("算力主权", "tech", "对算力基础设施、模型训练与数据治理的自主可控能力，构成数字时代的战略资源边界。", context=["computing", "aiplus"], related=["东数西算", "智算中心"], source="中国深度调研系列 · 科技主权"),
    entry("能源压舱石", "tech", "化石能源与基荷电源在转型期保障系统稳定的安全冗余，支撑可再生能源大规模并网。", context=["energy"], related=["双碳目标", "绿氢"], source="中国深度调研系列 · 能源"),
    entry("新质生产力", "econ", "以技术革命性突破与要素创新性配置驱动全要素生产率跃迁的发展范式。", context=["npf", "futureIndustry"], related=["未来产业", "原始创新"], source="中国深度调研系列 / 政府工作报告"),
    entry("全要素生产率", "econ", "产出增长中不能被资本与劳动投入解释的部分，反映技术、制度与组织效率。", aliases=["TFP"], context=["npf"], related=["新质生产力", "原始创新"], source="宏观经济学"),
    entry("原始创新", "tech", "在基础理论与底层技术上的首创性突破，而非跟踪式改良。", context=["basicResearch", "npf"], related=["新质生产力", "国家实验室"], source="中国深度调研系列"),
    entry("换道超车", "tech", "在新兴技术轨道避开既有路径锁定，以不同技术路线实现赶超的策略。", context=["automotive", "semiconductor"], related=["成熟制程筑底", "Chiplet"], source="中国深度调研系列 · 半导体/汽车"),
    entry("成熟制程筑底", "tech", "在成熟节点积累产能与工艺know-how，为先进封装与系统设计提供底座。", context=["semiconductor"], related=["Chiplet", "大基金"], source="中国深度调研系列 · 半导体"),
    entry("Chiplet", "tech", "芯粒/先进封装：将系统拆解为模块化芯片再封装集成，绕开部分制程约束。", aliases=["先进封装", "芯粒"], context=["semiconductor"], related=["换道超车", "成熟制程筑底"], source="半导体产业"),
    entry("东数西算", "tech", "将东部算力需求向西部能源富集区调度，实现算力与绿电协同的国家工程。", context=["computing", "dataElement"], related=["算力主权", "智算中心"], source="国家算力枢纽工程"),
    entry("智算中心", "tech", "面向大模型训练与推理的专用算力集群，区别于通用云计算数据中心。", context=["aiplus", "computing"], related=["东数西算", "人工智能+"], source="产业政策"),
    entry("双碳目标", "tech", "碳达峰与碳中和的时间表约束，驱动能源结构与产业技术系统重构。", aliases=["碳达峰碳中和"], context=["ecology", "energy"], related=["能源压舱石", "绿氢"], source="生态文明"),
    entry("绿氢", "tech", "以可再生能源电解水制氢，被视为深度脱碳与工业原料替代的关键路径。", context=["hydrogen", "energy"], related=["双碳目标", "CCUS"], source="能源转型"),
    entry("CCUS", "tech", "碳捕集、利用与封存，为难以电气化的行业提供减排选项。", aliases=["碳捕集"], context=["energy", "ecology"], related=["双碳目标", "绿氢"], source="能源转型"),
    entry("时空压缩", "research", "交通与通信基础设施缩短物理距离与时间成本，重塑要素流动与区域格局。", context=["infrastructure", "lowAltitude"], related=["轨道上的中国", "超级工程"], source="中国深度调研系列 · 基建"),
    entry("综合国家账本", "econ", "超越单一财务ROI，将战略外部性、安全冗余与区域再配置纳入国家投资评估框架。", context=["megaprojects"], related=["多维ROI", "逆周期调节"], source="中国深度调研系列 · 超级工程"),
    entry("分税制", "politics", "中央与地方按税种划分收入与责任的财政体制，深刻塑造土地财政与地方行为。", context=["govsystem", "powerlogic"], related=["土地财政", "收支倒挂"], source="中国深度调研系列 · 央地"),
    entry("土地财政", "econ", "地方政府依赖土地出让与相关收入支撑基建与支出的模式，与房地产周期高度耦合。", context=["housing", "govsystem"], related=["分税制", "收支倒挂"], source="中国深度调研系列"),
    entry("压力传导", "politics", "上级目标与考核通过层级体系向下分解，形成层层加压的执行机制。", aliases=["压力体制"], context=["govsystem", "socialgov"], related=["锦标赛竞争", "穿透式监管"], source="中国深度调研系列"),
    entry("穿透式监管", "politics", "借助数据与平台直连底层市场主体，缩短监管链条、提高可观测性的治理方式。", context=["governance", "govsystem"], related=["数字政府", "赛博反馈"], source="中国深度调研系列"),
    entry("要素自由流动", "econ", "劳动力、资本、数据等生产要素跨区域低摩擦配置，统一大市场的核心目标。", context=["unifiedMarket", "regional"], related=["统一大市场", "梯度转移"], source="中国深度调研系列 · 区域"),
    entry("诸侯经济", "econ", "地方保护与市场分割导致的经济碎片化，与统一大市场目标相对。", context=["unifiedMarket"], related=["统一大市场", "要素自由流动"], source="中国深度调研系列"),
    entry("算法治理", "society", "平台与公共部门以算法规则分配机会、定价与风险，重塑劳动与消费关系。", context=["gig", "digital"], related=["零工经济", "数字劳动力"], source="中国深度调研系列 · 零工经济"),
    entry("就业蓄水池", "society", "灵活就业与平台经济在正式就业收缩时吸收劳动力的社会缓冲机制。", context=["gig"], related=["零工经济", "算法治理"], source="中国深度调研系列"),
    entry("口粮绝对安全", "research", "主粮自给底线战略，与饲料粮对外依存形成「双重现实」。", context=["foodSecurity"], related=["耕地红线", "藏粮于地"], source="中国深度调研系列 · 粮食安全"),
    entry("藏粮于地", "research", "通过耕地保护与地力提升保障产能潜力的粮食战略。", context=["foodSecurity"], related=["耕地红线", "藏粮于技"], source="粮食安全政策"),
    entry("藏粮于技", "research", "以种业与农业技术进步保障粮食单产与抗风险能力。", context=["foodSecurity"], related=["藏粮于地", "大食物观"], source="粮食安全政策"),
    entry("大食物观", "research", "从主粮拓展到肉蛋奶、蔬果、微生物蛋白等多元食物供给体系。", context=["foodSecurity"], related=["口粮绝对安全", "供应链多元化"], source="粮食安全政策"),
    entry("耕地红线", "research", "18亿亩耕地保护底线，约束城市化与工业用地扩张。", context=["foodSecurity"], related=["藏粮于地", "口粮绝对安全"], source="国土空间规划"),
    entry("地理密室", "society", "半封闭地形与治水需求塑造的超大规模集权治理物理约束隐喻。", context=["civilization"], related=["治水帝国", "400毫米等降水线"], source="中国深度调研系列 · 文明地理"),
    entry("400毫米等降水线", "society", "划分农耕与游牧生态的关键地理界线，塑造农牧拉锯与长城功能。", aliases=["400mm线"], context=["civilization"], related=["地理密室", "天下体系"], source="中国深度调研系列 · 文明地理"),
    entry("天下体系", "society", "以同心圆秩序理解周边与世界的传统地缘文化框架，与威斯特伐利亚体系对照。", context=["civilization", "diplomacy"], related=["朝贡体系", "华夷之辨"], source="中国深度调研系列 · 文明地理"),
    entry("朝贡体系", "society", "历史上以礼仪与贸易维系中心—边缘关系的国际秩序模式。", context=["civilization", "diplomacy"], related=["天下体系", "华夷之辨"], source="中国深度调研系列"),
    entry("修昔底德陷阱", "econ", "守成大国与崛起大国之间的结构性冲突风险，由权力转移放大误判。", context=["thucydides"], related=["权力转移", "现实主义"], source="艾利森 · 修昔底德陷阱"),
    entry("纳什均衡", "econ", "各方在给定他人策略下均无单方面偏离激励的稳定状态。", context=["gametheory"], related=["重复博弈", "以牙还牙"], source="博弈论"),
    entry("重复博弈", "econ", "同一博弈方多次互动，使声誉与惩罚机制改变一次性博弈结论。", context=["gametheory"], related=["以牙还牙", "纳什均衡"], source="博弈论"),
    entry("以牙还牙", "econ", "重复博弈中的触发策略：首轮合作，之后复制对手上一轮行动。", aliases=["Tit for Tat"], context=["gametheory"], related=["重复博弈", "可信承诺"], source="博弈论 · 阿克塞尔罗德"),
    entry("可信承诺", "military", "使威胁或保证可验证、可执行的战略沟通与能力展示。", context=["deterrence", "gametheory"], related=["威慑战略", "边缘政策"], source="谢林 · 威慑"),
    entry("边缘政策", "military", "故意制造可控危机以迫使对手退让的高风险博弈策略。", context=["deterrence"], related=["可信承诺", "威慑战略"], source="谢林 · 威慑"),
    entry("委托代理", "econ", "委托人通过契约与激励让代理人行动，但面临信息不对称与道德风险。", context=["principalagent"], related=["激励相容", "道德风险"], source="经济学"),
    entry("激励相容", "econ", "机制设计使代理人自利行为与委托人目标一致的性质。", context=["principalagent"], related=["委托代理", "道德风险"], source="机制设计"),
    entry("道德风险", "econ", "契约签订后代理人因风险外部化而采取更高风险或更低努力的行为。", context=["principalagent"], related=["委托代理", "激励相容"], source="经济学"),
    entry("公地悲剧", "econ", "个体理性使用共享资源导致集体不可持续的过度消耗。", context=["commons"], related=["集体行动", "搭便车"], source="哈丁 · 公地悲剧"),
    entry("路径依赖", "econ", "历史选择通过报酬递增与锁定效应限制后续换道空间。", context=["pathdependence"], related=["锁定效应", "报酬递增"], source="路径依赖理论"),
    entry("耗散结构", "research", "开放系统通过负熵流维持有序结构，远离平衡态的自组织理论。", context=["dissipative"], related=["负熵流", "自组织"], source="普里高津"),
    entry("反脆弱性", "econ", "系统从波动与压力中获益而非仅抵抗损伤的性质（凸性效应）。", context=["antifragile"], related=["塔勒布", "凸性效应"], source="塔勒布 · 反脆弱"),
    entry("康波周期", "econ", "康德拉季耶夫长波：约45–60年一轮的技术—资本周期。", aliases=["康德拉季耶夫周期"], context=["cognition"], related=["长波", "创新潮"], source="康德拉季耶夫"),
    entry("中等收入陷阱", "econ", "人均GDP达中等水平后增长停滞的结构困境，跨越需制度与产业升级。", context=["middleincometrap"], related=["全要素生产率", "韩国跨越"], source="发展经济学"),
    entry("现实主义", "research", "国际政治中以权力、制衡与安全为首要解释变量的理论传统。", context=["realism"], related=["权力制衡", "米尔斯海默"], source="国际关系理论"),
    entry("建构主义", "research", "强调观念、规范与文化塑造国际行为主体身份与利益的范式。", context=["constructivism"], related=["无政府文化", "观念建构"], source="温特 · 建构主义"),
    entry("儒表法里", "politics", "表面伦理教化与底层法家治理术并存的权力运作传统。", context=["powerlogic"], related=["数字利维坦", "统治成本"], source="中国深度调研系列 · 权力逻辑"),
    entry("摸石过河", "politics", "改革通过试点、灰度迭代与经验总结逐步推广的方法论。", aliases=["摸石头"], context=["reform"], related=["试点", "灰度迭代"], source="改革开放叙事"),
    entry("枫桥经验", "society", "基层矛盾就地化解、综治中心与网格联动的社会治理样板。", context=["socialgov"], related=["网格管理", "基层治理"], source="社会治理"),
    entry("DRG", "society", "按疾病诊断相关分组付费，控制医保支出并改变医院行为。", aliases=["按病种付费"], context=["healthcare"], related=["药品集采", "分级诊疗"], source="医保改革"),
    entry("注册制", "econ", "以信息披露为核心、市场化定价的IPO审核制度。", context=["capitalMarket"], related=["耐心资本", "资本市场"], source="资本市场改革"),
    entry("耐心资本", "econ", "愿意长期持有、容忍短期波动的资本，支持硬科技与基础设施。", context=["capitalMarket"], related=["注册制", "创投"], source="金融政策"),
    entry("CIPS", "econ", "人民币跨境支付系统，支撑人民币国际化的清算基础设施。", aliases=["人民币跨境支付系统"], context=["financeRmb"], related=["人民币国际化", "e-CNY"], source="金融基础设施"),
    entry("e-CNY", "econ", "数字人民币，央行法定数字货币试点与跨境探索。", aliases=["数字人民币"], context=["financeRmb"], related=["CIPS", "人民币国际化"], source="央行数字货币"),
    entry("RCEP", "econ", "区域全面经济伙伴关系协定，亚太区域贸易一体化框架。", context=["foreignTrade"], related=["新三样", "跨境电商"], source="区域贸易"),
    entry("新三样", "econ", "电动载人车、锂电池、光伏产品构成的出口增长引擎。", context=["foreignTrade"], related=["RCEP", "换道超车"], source="外贸统计口径"),
    entry("56789", "econ", "民营经济贡献约50%税收、60%GDP、70%创新、80%就业、90%企业数的概括。", context=["private"], related=["两个毫不动摇", "民营经济"], source="民营经济论述"),
    entry("两个毫不动摇", "politics", "巩固公有制主体地位与鼓励非公有制经济发展并重的基本方针。", context=["private"], related=["56789", "公平竞争"], source="经济政策"),
    entry("专精特新", "tech", "专业化、精细化、特色化、新颖化的中小企业培育路径。", context=["manufacturing"], related=["制造强国", "隐形冠军"], source="产业政策"),
    entry("卡脖子", "tech", "关键核心技术对外依赖、受制于人形成的供应链断点风险。", context=["materials", "semiconductor"], related=["国产替代", "自主可控"], source="科技自立自强"),
    entry("国产替代", "tech", "以本土供应链替换进口关键部件与软件的系统工程。", context=["medequipment", "industrysoftware"], related=["卡脖子", "自主可控"], source="产业政策"),
    entry("华龙一号", "tech", "自主三代核电技术品牌，体现基荷能源主权。", context=["nuclear"], related=["固有安全性", "基荷主权"], source="核电产业"),
    entry("特高压", "tech", "±800kV及以上直流/1000kV交流输电，实现远距离大容量电力调度。", context=["smartgrid"], related=["源网荷储", "新型储能"], source="电网工程"),
    entry("源网荷储", "tech", "电源、电网、负荷、储能协同优化的新型电力系统架构。", context=["smartgrid", "energy"], related=["特高压", "新型储能"], source="能源政策"),
    entry("北斗组网", "tech", "自主全球卫星导航系统，提供定位、授时与短报文服务。", context=["space"], related=["商业航天", "深空探测"], source="航天产业"),
    entry("eVTOL", "tech", "电动垂直起降飞行器，低空经济与城市空中交通的核心载体。", context=["lowAltitude", "civilAviation"], related=["低空经济", "数字航路"], source="低空经济"),
    entry("隐性债务", "econ", "地方政府通过融资平台等形成的表外或有负债。", context=["debtHeatmap"], related=["化债方案", "专项债"], source="地方债研究"),
    entry("化债方案", "econ", "一揽子降低地方政府债务风险的重排、置换与纪律组合。", context=["debtHeatmap"], related=["隐性债务", "专项债"], source="财政政策"),
    entry("转移支付", "econ", "中央向地方的财政再分配，调节区域能力与均衡公共服务。", context=["regional"], related=["分税制", "四大板块"], source="财政体制"),
    entry("胡焕庸线", "society", "黑河—腾冲线，划分东南密集与西北稀疏人口格局。", context=["megaprojects", "civilization"], related=["地理密室", "区域协调"], source="经济地理"),
    entry("硅盾屏障", "military", "台湾半导体产业在全球供应链中的结构性防御价值隐喻。", context=["straits"], related=["产业链人质", "地缘引力"], source="China OS · 台海模块"),
    entry("物理威慑", "military", "以可验证的军事能力与部署改变对手成本计算的威慑形态。", context=["straits", "military"], related=["A2/AD", "岛链突破"], source="中国深度调研系列 · 台海"),
    entry("单点架构", "gy", "权力与决策高度集中于单一节点的体制结构，放大全局方差。", context=["guoyun", "leadership"], related=["变量B", "方差放大器"], source="GY-01 · 国运推演"),
    entry("变量A", "gy", "国运推演中经济对冲外部压力的成功度随机变量（GY-01）。", aliases=["经济对冲"], context=["guoyun"], related=["变量C", "到期交割"], source="GY-01 · 国运"),
    entry("变量B", "gy", "权力交接与健康冲击相关的全局方差放大器（GY-01）。", aliases=["权力交接"], context=["guoyun"], related=["单点架构", "2027节点"], source="GY-01 · 国运"),
    entry("变量C", "gy", "台海威慑均衡向冲突升级的条件触发变量，随A/B恶化而上升（GY-01）。", context=["guoyun", "straits"], related=["变量A", "变量B"], source="GY-01 · 国运"),
    entry("到期交割", "gy", "2012年以来制度赌局在时间轴上的结算窗口隐喻（GY-01基准叙事）。", context=["guoyun"], related=["单点架构", "康波红利"], source="GY-01 · 国运"),
    entry("合法性机器", "gy", "GY-02：将意识形态、叙事与仪式组件化以生产政治合法性的系统隐喻。", aliases=["GY-02"], context=["yishixingtai"], related=["张力T-01", "五组件"], source="GY-02 · 意识形态架构"),
    entry("张力T-01", "gy", "GY-02 中与国运变量A耦合的意识形态张力节点。", context=["yishixingtai", "guoyun"], related=["合法性机器", "变量A"], source="GY-02"),
    entry("GY-03", "gy", "青年模块代号：机器的盲区 · 概率的暗物质。", context=["qingnian"], related=["GY-04", "青年"], source="China OS · GY系列"),
    entry("GY-04", "gy", "性少数群像模块代号：挤压性存在 · 被允许的可见形态。", context=["xingshaoshu"], related=["GY-03", "可见形态"], source="China OS · GY系列"),
    entry("机器的盲区", "gy", "青年群体在统计与治理模型中被系统性低估的暗物质隐喻（GY-03）。", context=["qingnian"], related=["GY-03", "概率的暗物质"], source="GY-03 · 青年"),
    entry("概率的暗物质", "gy", "未被主流模型捕获但影响系统轨迹的青年行为与态度分布（GY-03）。", context=["qingnian"], related=["机器的盲区", "GY-03"], source="GY-03 · 青年"),
    entry("挤压性存在", "society", "性少数群体在公共空间中被迫压缩自我表达的社会结构描述（GY-04）。", context=["xingshaoshu"], related=["GY-04", "可见形态"], source="GY-04"),
    entry("行为优先", "module", "全局监测台纪律：以可观测行为与硬数据为准，话语视为噪声。", context=["watchtower"], related=["层间对照", "阈值即重判"], source="China OS · 监测台"),
    entry("层间对照", "module", "监测台纪律：单指标越线须与同域及跨域指标交叉验证。", context=["watchtower"], related=["行为优先", "红档≠预测"], source="China OS · 监测台"),
    entry("治国沙盒", "module", "人才配置、情景推演与政策模拟的交互训练环境。", context=["sandbox"], related=["全局监测台", "政令文库"], source="China OS"),
    entry("政令文库", "module", "政策文件与法律条文的结构化语料库与阅读器。", context=["policydocs"], related=["法治建设", "文本挖掘"], source="China OS"),
    entry("数据底座", "module", "IndexedDB 本地数据集管理：上传、解析、编辑与对账。", context=["foundation"], related=["世界银行", "人才精英"], source="China OS"),
    entry("全局监测台", "module", "六域先行指标、三档阈值与越线告警的遥测面板。", context=["watchtower"], related=["治国沙盒", "行为优先"], source="China OS"),
    entry("玻璃拟态", "module", "UI 审美：半透明层叠、模糊背景与深邃科技配色的视觉范式。", aliases=["Glassmorphism"], context=[], related=["权力冷锋", "语义墨"], source="China OS · 设计系统"),
    entry("权力冷锋", "module", "China OS 配色语义：铁锈红、钢灰、赛博青、语义墨等。", context=[], related=["玻璃拟态"], source="China OS · 设计系统"),
]

GY_EXTRA = [
    entry("基准情景", "gy", "国运推演四情景之一：僵局而非剧变，但方差被人为加宽。", context=["guoyun"], related=["上行情景", "尾部情景"], source="GY-01"),
    entry("上行情景", "gy", "经济对冲成功叠加权力平稳交接的较优路径（GY-01）。", context=["guoyun"], related=["基准情景", "康波红利"], source="GY-01"),
    entry("下行情景", "gy", "对冲失败与制度账单到期叠加的承压路径（GY-01）。", context=["guoyun"], related=["基准情景", "日本化"], source="GY-01"),
    entry("尾部情景", "gy", "小概率极端：冲突或无序交接触发系统跃迁（GY-01）。", context=["guoyun"], related=["变量C", "单点架构"], source="GY-01"),
    entry("观测哨", "gy", "国运/GY模块中用于跟踪硬信号、年度复盘概率的状态节点。", context=["guoyun", "yishixingtai"], related=["行为优先", "变量B"], source="GY系列"),
    entry("五组件", "gy", "合法性机器的意识形态架构组件划分（GY-02）。", context=["yishixingtai"], related=["合法性机器", "张力T-01"], source="GY-02"),
    entry("两谱系", "gy", "国运模块中并行梳理的两条历史—结构谱系框架。", context=["guoyun"], related=["时间轴", "推演"], source="GY-01"),
]

LEGAL_TYPES = [
    ("宪法", "legal", "国家根本法，具有最高法律效力。"),
    ("法律", "legal", "全国人大及其常委会制定的规范性文件。"),
    ("行政法规", "legal", "国务院制定的规范性文件。"),
    ("司法解释", "legal", "最高法院、最高检察院对法律适用问题的解释。"),
    ("党内法规", "legal", "党内制度性规范，与国家法律体系并行。"),
]

TALENT_CATS = [
    ("中国政要", "module", "talent 模块：结构化政要人物图谱。"),
    ("反腐透视", "module", "talent 模块：落马官员与案例结构化数据。"),
    ("知识生产", "module", "talent 模块：院士、学者、文化精英等。"),
    ("资本逻辑", "module", "talent 模块：商业精英与民企关联。"),
    ("外交与海外", "module", "talent 模块：外交官与海外华人精英。"),
]


def module_entries(mods: list[dict]) -> list[dict]:
    out = []
    group_cat = {
        "cognition": "econ",
        "institutions": "politics",
        "security": "military",
        "industry": "tech",
        "techtopics": "tech",
        "sim": "module",
        "foundation": "module",
        "population": "gy",
    }
    for m in mods:
        cat = group_cat.get(m["group"], "module")
        segs = [s.strip() for s in m["subtitle"].split("·") if s.strip()]
        related = segs[1:] if len(segs) > 1 else []
        out.append(
            entry(
                m["title"],
                cat,
                f"China OS 模块「{m['title']}」：{m['subtitle']}。",
                aliases=segs[:1] if segs and segs[0] != m["title"] else [],
                context=[{"moduleId": m["id"], "label": m["title"], "path": m["path"]}],
                related=related,
                source="China OS · registry.js",
                eid=f"mod-{m['id']}",
            )
        )
        for seg in segs:
            if seg == m["title"] or len(seg) < 2:
                continue
            if len(seg) > 12:
                continue
            out.append(
                entry(
                    seg,
                    cat,
                    f"模块「{m['title']}」副题关键词：{seg}。",
                    context=[{"moduleId": m["id"], "label": m["title"], "path": m["path"]}],
                    related=[m["title"]],
                    source=f"China OS · {m['title']}",
                    eid=f"mod-{m['id']}-{slugify(seg)}",
                )
            )
    return out


def index_keyword_entries(kws: list[str]) -> list[dict]:
    out = []
    for kw in kws:
        if any(c["term"] == kw for c in CURATED):
            continue
        out.append(
            entry(
                kw,
                "research",
                f"中国深度调研系列索引关键词：{kw}。",
                context=["depth"],
                related=[],
                source="中国深度调研系列_索引与恢复指令.md",
                eid=f"idx-{slugify(kw)}",
            )
        )
    return out


def build_all() -> list[dict]:
    mods = parse_registry()
    kws = parse_index_keywords()
    items: list[dict] = []
    items.extend(CURATED)
    items.extend(GY_EXTRA)
    items.extend(module_entries(mods))
    items.extend(index_keyword_entries(kws))
    for title, cat, defn in LEGAL_TYPES:
        items.append(entry(title, cat, defn, context=["policydocs"], source="政令文库 · 法律分类"))
    for title, cat, defn in TALENT_CATS:
        items.append(entry(title, cat, defn, context=["talent"], source="China OS · 人才精英库"))
    # 去重：同 id 保留定义更长者
    by_id: dict[str, dict] = {}
    for it in items:
        prev = by_id.get(it["id"])
        if not prev or len(it["definition"]) > len(prev["definition"]):
            by_id[it["id"]] = it
    return sorted(by_id.values(), key=lambda x: (x["initial"], x["term"]))


def emit_js(entries: list[dict]) -> str:
    cats_js = json.dumps(
        [{"id": i, "label": l} for i, l in CATEGORIES],
        ensure_ascii=False,
        indent=2,
    )
    body = json.dumps(entries, ensure_ascii=False, indent=2)
    return f"""// ============================================================================
// 术语词典 · 静态种子（由 scripts/genGlossarySeed.py 生成）
// ============================================================================
// eslint-disable-next-line no-unused-vars
export const GLOSSARY_META = {{
  id: 'glossary',
  label: '术语词典',
  asOf: '2026-06',
  count: {len(entries)},
  source: 'China OS 模块语料 + 深度调研系列索引 + 手工策展',
}};

export const GLOSSARY_CATEGORIES = {cats_js};

export const GLOSSARY_ENTRIES = {body};

export const GLOSSARY_COUNT = GLOSSARY_ENTRIES.length;
"""


def main():
    entries = build_all()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(emit_js(entries), encoding="utf-8")
    cats = {}
    for e in entries:
        cats[e["category"]] = cats.get(e["category"], 0) + 1
    print(f"Wrote {len(entries)} entries -> {OUT}")
    for k, v in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {CAT_LABEL.get(k, k)}: {v}")


if __name__ == "__main__":
    main()
