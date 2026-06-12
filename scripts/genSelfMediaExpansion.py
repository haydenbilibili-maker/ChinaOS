#!/usr/bin/env python3
"""Curated self-media expansion: B站百大UP主 (2018-2025) + 抖音千万粉+创作者."""
from __future__ import annotations

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXISTING_JS = ROOT / "app/src/lib/db/figureSelfMedia2026.js"
CULTURAL_JS = ROOT / "app/src/lib/db/figureCulturalElite2026.js"


def _norm(name: str) -> str:
    return re.sub(r"\s+", "", (name or "").strip().lower())


def _load_names(path: Path, pattern: str) -> set[str]:
    if not path.exists():
        return set()
    text = path.read_text(encoding="utf-8")
    return {_norm(n) for n in re.findall(pattern, text)}


def _slug(name: str, prefix: str = "exp") -> str:
    h = hashlib.md5(name.encode("utf-8")).hexdigest()[:10]
    return f"sm-{prefix}-{h}"


def E(
    name: str,
    platform: str,
    niche: str,
    category: str,
    followers: str,
    bio: str,
    works: str,
    tier: str = "A",
    source: str = "公开报道",
    notes: str = "",
) -> tuple:
    return (
        _slug(name),
        name,
        platform,
        niche,
        category,
        followers,
        bio,
        works,
        "—",
        tier,
        source,
        notes,
    )


# fmt: off
# ── B站百大 / 头部UP主（2018-2025 公开名单 + 分区代表，去重后合并） ──
BILIBILI_BAIDDA = [
    # 2018 百大
    E("敖厂长", "bilibili", "游戏解说", "entertainment", "B站800万+", "游戏区元老UP主；《囧的呼唤》系列创作者。", "《囧的呼唤》", "S", notes="百大2018"),
    E("ilem", "bilibili", "Vocaloid音乐", "entertainment", "B站300万+", "中文Vocaloid代表；《普通DISCO》《达拉崩吧》。", "《普通DISCO》", "A", notes="百大2018"),
    E("KBShinya", "bilibili", "翻唱音乐", "entertainment", "B站200万+", "音乐区翻唱UP主；辨识度高。", "翻唱系列", "B", notes="百大2018"),
    E("纯黑", "bilibili", "游戏攻略", "entertainment", "B站300万+", "游戏攻略实况UP主；《战神4》等。", "《战神4》攻略", "A", notes="百大2018"),
    E("逗川", "bilibili", "游戏创意", "entertainment", "B站200万+", "游戏多玩法探索；裸体战队队长。", "游戏创意玩法", "B", notes="百大2018"),
    E("极客湾", "bilibili", "数码评测", "tech", "B站200万+", "数码科技UP主；《弯评》系列。", "《弯评》", "A", notes="百大2018; 与种子极客湾合并去重"),
    E("杰里德Jared", "bilibili", "跨文化生活", "lifestyle", "B站300万+", "中外文化差异小剧场创作者。", "《老外刚来中国》", "A", notes="百大2018"),
    E("神秘店长A", "bilibili", "游戏盘点", "entertainment", "B站200万+", "游戏盘点与情怀向内容。", "游戏盘点", "B", notes="百大2018"),
    E("神奇的老皮", "bilibili", "特效创意", "entertainment", "B站500万+", "特效与游戏跨界创意视频。", "特效系列", "A", notes="百大2018"),
    E("小可儿", "bilibili", "鬼畜音乐", "entertainment", "B站200万+", "鬼畜音乐制作人；《念诗之王》。", "《念诗之王》", "A", notes="百大2018"),
    E("欣小萌", "bilibili", "舞蹈", "entertainment", "B站500万+", "舞蹈区人气UP主。", "舞蹈翻跳", "A", notes="百大2018/2025"),
    E("六道", "bilibili", "动画配音", "entertainment", "B站300万+", "动画配音杂谈；《六道笑点》。", "《六道笑点》", "B", notes="百大2018"),
    E("hey信誓蛋蛋", "bilibili", "跨文化生活", "lifestyle", "B站300万+", "中法情侣生活创意视频。", "生活创意", "B", notes="百大2018"),
    E("Vivekatt", "bilibili", "美妆", "lifestyle", "B站200万+", "技术流美妆教程UP主。", "美妆教程", "B", notes="百大2018"),
    E("茶几君梦二", "bilibili", "鬼畜", "entertainment", "B站100万+", "鬼畜区老牌UP主。", "鬼畜作品", "B", notes="百大2018"),
    E("茶理理", "bilibili", "翻唱音乐", "entertainment", "B站200万+", "清亮声线翻唱UP主。", "翻唱", "B", notes="百大2018"),
    E("活蹦乱跳的肥曈", "bilibili", "生活时尚", "lifestyle", "B站200万+", "生活时尚Vlog创作者。", "生活Vlog", "B", notes="百大2018"),
    E("酒客小丑", "bilibili", "动画杂谈", "entertainment", "B站100万+", "新番吐槽杂谈UP主。", "《新番吐个爽》", "B", notes="百大2018"),
    E("努巴尼守望先锋", "bilibili", "游戏集锦", "entertainment", "B站200万+", "守望先锋精彩集锦栏目。", "《精彩集锦》", "B", notes="百大2018"),
    E("女孩为何穿短裙", "bilibili", "鬼畜", "entertainment", "B站200万+", "鬼畜区代表UP主。", "鬼畜剧", "B", notes="百大2018"),
    E("千户长生", "bilibili", "美妆", "lifestyle", "B站200万+", "男性美妆UP主。", "美妆", "B", notes="百大2018"),
    E("王咩阿", "bilibili", "创意手工", "lifestyle", "B站200万+", "创意实验与手工内容。", "《一千度刀》", "B", notes="百大2018"),
    E("小熊绅士", "bilibili", "绘画教程", "culture", "B站200万+", "绘画入门教程UP主。", "《角虫繁殖计划》", "B", notes="百大2018"),
    # 2019 百大 / 十周年
    E("LexBurner", "bilibili", "动画杂谈", "entertainment", "B站900万+", "动画区顶流杂谈UP主。", "动画杂谈", "S", notes="百大2019"),
    E("黑桐谷歌", "bilibili", "游戏解说", "entertainment", "B站200万+", "游戏解说与实况UP主。", "游戏解说", "A", notes="百大2019"),
    E("伊丽莎白鼠", "bilibili", "鬼畜", "entertainment", "B站200万+", "鬼畜区知名UP主。", "鬼畜", "B", notes="百大2019"),
    E("咬人猫", "bilibili", "舞蹈", "entertainment", "B站300万+", "舞蹈区元老UP主。", "舞蹈", "A", notes="百大2019"),
    E("墨韵Moyun", "bilibili", "古筝音乐", "culture", "B站200万+", "古筝演奏与传统文化。", "古筝演奏", "A", notes="百大2019"),
    E("山下智博", "bilibili", "跨文化", "international", "B站300万+", "日本博主在华生活内容。", "跨文化", "A", notes="百大2019"),
    E("阿吗粽", "bilibili", "生活美妆", "lifestyle", "B站500万+", "生活区仿妆与Vlog创作者。", "仿妆Vlog", "A", notes="百大2019"),
    E("翔翔大作战", "bilibili", "生活搞笑", "entertainment", "B站300万+", "生活搞笑早期顶流。", "生活搞笑", "A", notes="百大2019"),
    E("办公室小野", "bilibili", "创意美食", "lifestyle", "B站500万+", "办公室创意美食短视频。", "办公室美食", "A", notes="百大2019"),
    E("徐大sao", "bilibili", "美食吃播", "lifestyle", "B站500万+", "农村美食吃播UP主。", "吃播", "A", notes="百大2019"),
    E("纳豆奶奶", "bilibili", "跨文化生活", "lifestyle", "B站200万+", "日本生活Vlog创作者。", "日本生活", "B", notes="百大2019"),
    E("花少北", "bilibili", "游戏娱乐", "entertainment", "B站500万+", "游戏区UP主。", "游戏实况", "A", notes="百大2019; 种子已有"),
    E("老E", "bilibili", "游戏解说", "entertainment", "B站300万+", "游戏解说元老UP主。", "游戏解说", "A", notes="百大2019"),
    E("C君", "bilibili", "恐怖游戏", "entertainment", "B站500万+", "恐怖游戏实况UP主。", "恐怖游戏", "A", notes="百大2019"),
    E("凉风Kaze", "bilibili", "动画杂谈", "entertainment", "B站800万+", "动画区「凉风」；新番推荐。", "《这期视频到这就结束》", "S", notes="百大2019"),
    E("六道轮回", "bilibili", "动画配音", "entertainment", "B站200万+", "四川话配音搞笑UP主。", "配音", "B", notes="百大2019"),
    E("怕上火暴王菊", "bilibili", "游戏解说", "entertainment", "B站300万+", "王老菊；独立游戏解说。", "独立游戏", "A", notes="百大2019/2024"),
    E("籽岷", "bilibili", "Minecraft", "entertainment", "B站600万+", "MC生存与模组长期创作者。", "MC生存", "S", notes="百大2019/2024"),
    E("泛式", "bilibili", "动画杂谈", "entertainment", "B站500万+", "动画区杂谈UP主；连续百大。", "动画杂谈", "A", notes="百大2019/2024"),
    E("逍遥散人", "bilibili", "游戏解说", "entertainment", "B站800万+", "游戏区顶流；连续七年百大。", "游戏解说", "S", notes="百大2019/2024"),
    # 2020 百大
    E("毕导", "bilibili", "科学科普", "tech", "B站500万+", "清华博士；科学趣味科普。", "《毕导》", "S", notes="百大2020"),
    E("卡特亚", "bilibili", "游戏", "entertainment", "B站300万+", "游戏区UP主。", "游戏", "B", notes="百大2020"),
    E("盒子酸奶", "bilibili", "游戏", "entertainment", "B站200万+", "游戏区UP主。", "游戏", "B", notes="百大2020/2025"),
    E("鹤吱菌", "bilibili", "生活", "lifestyle", "B站200万+", "生活区UP主。", "生活Vlog", "B", notes="百大2020"),
    E("小翔哥", "bilibili", "美食", "lifestyle", "B站300万+", "美食区UP主。", "美食", "B", notes="百大2020"),
    E("假美食po主", "bilibili", "美食", "lifestyle", "B站200万+", "美食创意UP主。", "美食", "B", notes="百大2020"),
    E("女胖胖", "bilibili", "美食", "lifestyle", "B站200万+", "美食区UP主。", "美食", "B", notes="百大2020"),
    E("食贫道", "bilibili", "美食纪录片", "lifestyle", "B站500万+", "美食纪录片团队；深度探店。", "《食贫道》", "S", notes="百大2020/2024"),
    E("老爸评测", "bilibili", "消费测评", "tech", "B站800万+", "消费品安全测评自媒体。", "《老爸评测》", "S", notes="百大2021"),
    E("芳斯塔夫", "bilibili", "古生物科普", "tech", "B站300万+", "古生物与演化科普UP主。", "古生物科普", "A", notes="百大2024/2025"),
    E("无穷小亮", "bilibili", "生物科普", "tech", "B站500万+", "中科院背景；生物分类科普。", "《鉴定网络热门生物》", "S", notes="知识区头部"),
    E("所长林超", "bilibili", "跨学科知识", "tech", "B站500万+", "跨学科通识科普UP主。", "《所长林超》", "A", notes="知识区头部"),
    E("小Lin说", "bilibili", "财经科普", "finance", "B站500万+", "财经与国际政治科普。", "《小Lin说》", "A", notes="百大2024/2025"),
    E("智能路障", "bilibili", "人文社科", "culture", "B站300万+", "人文社科深度解读。", "《智能路障》", "A", notes="百大2024"),
    E("思维实验室", "bilibili", "科学思维", "tech", "B站300万+", "科学思维与宇宙科普。", "《思维实验室》", "A", notes="百大2024/2025"),
    E("历史调研室", "bilibili", "历史讲述", "history", "B站400万+", "历史事件深度调研讲述。", "《历史调研室》", "A", notes="百大2024/2025"),
    E("正直讲史", "bilibili", "历史讲述", "history", "B站300万+", "李正；明清历史讲述。", "《正直讲史》", "A", notes="百大2024/2025"),
    E("木鱼水心", "bilibili", "影视解说", "culture", "B站800万+", "经典影视深度解说。", "《木鱼微剧场》", "S", notes="百大2024/2025"),
    E("电影最TOP", "bilibili", "影视盘点", "culture", "B站500万+", "电影盘点与解说。", "《电影最TOP》", "A", notes="百大2024"),
    E("迷影至下", "bilibili", "影视评论", "culture", "B站200万+", "电影深度评论UP主。", "影视评论", "A", notes="百大2024/2025"),
    E("HOPICO", "bilibili", "音乐评论", "culture", "B站200万+", "流行音乐深度评论。", "《HOPICO》", "A", notes="百大2024/2025"),
    E("JKAI杰凯", "bilibili", "音乐Reaction", "culture", "B站300万+", "音乐反应与乐评。", "《杰凯》", "A", notes="百大2024/2025"),
    E("陶喆的音乐产房", "bilibili", "音乐制作", "culture", "B站200万+", "陶喆音乐创作分享。", "音乐制作", "B", notes="百大2024"),
    E("浑元Rysn", "bilibili", "乐器演奏", "entertainment", "B站300万+", "唢呐等民乐演奏出圈。", "唢呐演奏", "A", notes="百大2024/2025"),
    E("BBoxer酋长", "bilibili", "Beatbox", "entertainment", "B站200万+", "Beatbox与口技表演。", "《口技》", "A", notes="百大2023"),
    E("啊粥粥啊粥", "bilibili", "影视精讲", "culture", "B站300万+", "经典影视深度精讲。", "《人民的名义》精讲", "A", notes="百大2023"),
    E("宝剑嫂", "bilibili", "生活Vlog", "lifestyle", "B站500万+", "生活区情侣Vlog。", "生活Vlog", "A", notes="百大2022"),
    E("极速拍档", "bilibili", "汽车", "lifestyle", "B站300万+", "汽车评测与赛车文化。", "《极速拍档》", "A", notes="百大2022/2024"),
    E("浮生一日", "bilibili", "旅行Vlog", "lifestyle", "B站200万+", "环球旅行Vlog创作者。", "旅行Vlog", "B", notes="百大2022"),
    E("衣戈猜想", "bilibili", "人文纪实", "culture", "B站200万+", "《二舅》等人文纪实短片。", "《二舅》", "A", notes="百大2022"),
    E("盗月社食遇记", "bilibili", "美食探店", "lifestyle", "B站500万+", "盗月社主账号；美食探店。", "《盗月社》", "A", notes="百大2022; 种子有盗月社"),
    E("超级外卖员", "bilibili", "美食创意", "lifestyle", "B站200万+", "盗月社「超级外卖员」栏目。", "《超级外卖员》", "B", notes="百大2022"),
    # 2024 百大（续）
    E("Chubbyemu", "bilibili", "医学科普", "tech", "B站200万+", "医学案例科普；海外华人医生。", "医学科普", "A", notes="百大2024/2025"),
    E("DarkCarrot", "bilibili", "影视解说", "culture", "B站200万+", "影视解说UP主。", "影视解说", "B", notes="百大2024/2025"),
    E("HuangFuRen", "bilibili", "物理科普", "tech", "B站500万+", "物理竞赛与科普UP主。", "物理科普", "A", notes="百大2024/2025"),
    E("KerryDowdle", "bilibili", "人文地理", "culture", "B站200万+", "美国人文地理科普。", "人文地理", "A", notes="百大2024/2025"),
    E("Linksphotograph", "bilibili", "摄影", "culture", "B站200万+", "摄影技巧与器材分享。", "摄影", "B", notes="百大2024/2025"),
    E("Mr迷瞪", "bilibili", "家装消费", "lifestyle", "B站300万+", "家装避坑与消费指南。", "家装指南", "A", notes="百大2024"),
    E("The梁某人", "bilibili", "动画杂谈", "entertainment", "B站200万+", "动画区杂谈UP主。", "动画杂谈", "B", notes="百大2024/2025"),
    E("Upspeed盛嘉成", "bilibili", "汽车", "lifestyle", "B站200万+", "汽车文化UP主。", "汽车", "B", notes="百大2024/2025"),
    E("保镖的车库", "bilibili", "汽车", "lifestyle", "B站200万+", "经典车与汽车文化。", "汽车文化", "B", notes="百大2024/2025"),
    E("布锅锅", "bilibili", "游戏", "entertainment", "B站200万+", "游戏区UP主。", "游戏", "B", notes="百大2024/2025"),
    E("超Carry的柴西", "bilibili", "科技数码", "tech", "B站200万+", "科技数码评测。", "数码评测", "B", notes="百大2024"),
    E("大狸子切切里", "bilibili", "数码评测", "tech", "B站300万+", "PC硬件与数码评测。", "硬件评测", "A", notes="百大2024"),
    E("大物是也", "bilibili", "社会观察", "culture", "B站200万+", "社会议题讨论UP主。", "社会观察", "B", notes="百大2024/2025"),
    E("逗比的雀巢", "bilibili", "搞笑配音", "entertainment", "B站300万+", "搞笑配音与短剧。", "搞笑配音", "A", notes="百大2024/2025"),
    E("尴尬的铁根er", "bilibili", "游戏搞笑", "entertainment", "B站500万+", "王者荣耀搞笑解说。", "王者搞笑", "A", notes="百大2024"),
    E("汉森白JW", "bilibili", "音乐", "entertainment", "B站100万+", "音乐区UP主。", "音乐", "B", notes="百大2024"),
    E("河野华", "bilibili", "绘画", "culture", "B站200万+", "绘画与二次元创作。", "绘画", "B", notes="百大2024"),
    E("黑镖客梦回", "bilibili", "游戏解说", "entertainment", "B站300万+", "游戏解说与吐槽。", "游戏解说", "A", notes="百大2024"),
    E("幾加乘", "bilibili", "数学科普", "tech", "B站200万+", "数学趣味科普。", "数学科普", "B", notes="百大2024/2025"),
    E("剑客范十三", "bilibili", "传统武术", "culture", "B站300万+", "传统剑术与武术展示。", "剑术", "A", notes="百大2024/2025"),
    E("进击的金厂长", "bilibili", "动画创作", "entertainment", "B站200万+", "原创动画短剧。", "原创动画", "B", notes="百大2024/2025"),
    E("九三", "bilibili", "游戏", "entertainment", "B站200万+", "游戏区UP主。", "游戏", "B", notes="百大2024/2025"),
    E("九冢嵬", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2024"),
    E("兰音Reine", "bilibili", "虚拟UP主", "entertainment", "B站200万+", "虚拟歌手/VTuber。", "虚拟歌姬", "B", notes="百大2024/2025"),
    E("老戴在此", "bilibili", "游戏攻略", "entertainment", "B站300万+", "单机游戏攻略UP主。", "游戏攻略", "A", notes="百大2024"),
    E("老李船长", "bilibili", "海钓生活", "lifestyle", "B站200万+", "海钓与户外生活。", "海钓", "B", notes="百大2024/2025"),
    E("利维坦mY", "bilibili", "科幻评论", "culture", "B站200万+", "科幻电影与文学评论。", "科幻评论", "B", notes="百大2024/2025"),
    E("芦苇十三少", "bilibili", "历史", "history", "B站100万+", "历史讲述UP主。", "历史", "B", notes="百大2024"),
    E("鹿火CAVY", "bilibili", "音乐", "entertainment", "B站100万+", "音乐区UP主。", "音乐", "B", notes="百大2024"),
    E("萝太永不破防", "bilibili", "游戏", "entertainment", "B站300万+", "植物大战僵尸等游戏。", "PVZ", "A", notes="百大2024"),
    E("马里奥红叔", "bilibili", "Minecraft", "entertainment", "B站300万+", "MC多人生存UP主。", "MC生存", "A", notes="百大2024"),
    E("猛男舞团IconX", "bilibili", "舞蹈", "entertainment", "B站300万+", "菲律宾猛男舞团；反差舞蹈。", "猛男舞", "A", notes="百大2024"),
    E("魔法Zc目录", "bilibili", "游戏攻略", "entertainment", "B站200万+", "明日方舟等游戏攻略。", "游戏攻略", "B", notes="百大2024/2025"),
    E("你的影月月", "bilibili", "游戏攻略", "entertainment", "B站500万+", "原神等游戏攻略。", "原神攻略", "A", notes="百大2024/2025"),
    E("诺子喵呜", "bilibili", "生活", "lifestyle", "B站100万+", "视障博主生活记录。", "生活记录", "B", notes="百大2024"),
    E("哦呼w", "bilibili", "动画杂谈", "entertainment", "B站200万+", "动画区杂谈。", "动画杂谈", "B", notes="百大2024/2025"),
    E("帕梅拉", "bilibili", "健身", "lifestyle", "B站500万+", "德国健身博主；居家训练。", "帕梅拉健身", "A", notes="百大2024"),
    E("培根悖论", "bilibili", "影视评论", "culture", "B站200万+", "电影评论双人组。", "《培根悖论》", "B", notes="百大2024/2025"),
    E("企鹅带带北极熊", "bilibili", "游戏", "entertainment", "B站200万+", "游戏区UP主。", "游戏", "B", notes="百大2024"),
    E("潜艇伟伟迷", "bilibili", "游戏二创", "entertainment", "B站300万+", "植物大战僵尸改版。", "PVZ改版", "A", notes="百大2024"),
    E("敲萌豹风党", "bilibili", "动画", "entertainment", "B站100万+", "动画区UP主。", "动画", "B", notes="百大2024"),
    E("瑞克Zero", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2024"),
    E("上班族的便当", "bilibili", "美食教程", "lifestyle", "B站300万+", "快手便当与便当教程。", "便当教程", "A", notes="百大2024/2025"),
    E("上海滩许Van强", "bilibili", "游戏搞笑", "entertainment", "B站300万+", "英雄联盟搞笑解说。", "LOL搞笑", "A", notes="百大2024/2025"),
    E("神奇菌汤锅", "bilibili", "科普", "tech", "B站200万+", "科学科普UP主。", "科普", "B", notes="百大2024"),
    E("史蒂猪", "bilibili", "生活", "lifestyle", "B站100万+", "生活区UP主。", "生活", "B", notes="百大2024"),
    E("水无月菌", "bilibili", "游戏", "entertainment", "B站200万+", "游戏区UP主。", "游戏", "B", notes="百大2024/2025"),
    E("塑料叉", "bilibili", "生活", "lifestyle", "B站200万+", "生活区UP主。", "生活Vlog", "B", notes="百大2024"),
    E("所长Wy", "bilibili", "科普", "tech", "B站200万+", "科学科普UP主。", "科普", "B", notes="百大2024/2025"),
    E("特效小哥", "bilibili", "影视特效", "entertainment", "B站300万+", "影视特效解析与制作。", "特效解析", "A", notes="百大2024/2025"),
    E("图灵的猫", "bilibili", "AI科技", "tech", "B站200万+", "AI与机器学习科普。", "AI科普", "B", notes="百大2024"),
    E("虾仁不眨眼", "bilibili", "游戏直播", "entertainment", "B站200万+", "游戏直播UP主。", "游戏直播", "B", notes="百大2024"),
    E("乡村教师日记", "bilibili", "乡村教育", "culture", "B站200万+", "乡村教师日常记录。", "乡村教育", "A", notes="百大2024"),
    E("小Q不是导盲犬", "bilibili", "国际关系", "international", "B站300万+", "国际关系科普。", "国际科普", "A", notes="百大2024/2025"),
    E("小鹿Lawrence", "bilibili", "旅行Vlog", "lifestyle", "B站200万+", "旅行与生活Vlog。", "旅行Vlog", "B", notes="百大2024/2025"),
    E("小片片说大片", "bilibili", "影视解说", "culture", "B站500万+", "电影解说UP主。", "电影解说", "A", notes="百大2024/2025"),
    E("小透明明", "bilibili", "社会观察", "culture", "B站200万+", "社会与法律议题。", "社会观察", "B", notes="百大2024/2025"),
    E("星有野", "bilibili", "动画", "entertainment", "B站200万+", "原创动画UP主。", "原创动画", "B", notes="百大2024"),
    E("学过石油的语文老师", "bilibili", "高考语文", "tech", "B站300万+", "高考语文辅导。", "高考语文", "A", notes="百大2024/2025"),
    E("学姐圆", "bilibili", "学习", "tech", "B站200万+", "学习方法与高考。", "学习", "B", notes="百大2024/2025"),
    E("伢伢gagako", "bilibili", "舞蹈", "entertainment", "B站200万+", "舞蹈区UP主。", "舞蹈", "B", notes="百大2024/2025"),
    E("燕子堡BBQ", "bilibili", "烧烤美食", "lifestyle", "B站200万+", "美式BBQ教程。", "BBQ", "B", notes="百大2024/2025"),
    E("鹦鹉梨", "bilibili", "时尚", "lifestyle", "B站200万+", "时尚穿搭UP主。", "时尚", "B", notes="百大2024"),
    E("硬件茶谈", "bilibili", "硬件评测", "tech", "B站200万+", "PC硬件评测。", "硬件评测", "B", notes="百大2024"),
    E("与山0v0", "bilibili", "游戏", "entertainment", "B站300万+", "游戏区UP主。", "游戏", "A", notes="百大2024/2025"),
    E("雨说体育徐静雨", "bilibili", "体育评论", "lifestyle", "B站300万+", "NBA与体育评论。", "《雨说体育》", "A", notes="百大2024/2025"),
    E("圆某人", "bilibili", "游戏攻略", "entertainment", "B站200万+", "游戏攻略UP主。", "游戏攻略", "B", notes="百大2024"),
    E("知了解压萌物", "bilibili", "动物科普", "tech", "B站300万+", "动物科普与解压。", "动物科普", "A", notes="百大2024/2025"),
    E("自动鬼畜中的WZ", "bilibili", "鬼畜", "entertainment", "B站200万+", "鬼畜区UP主。", "鬼畜", "B", notes="百大2024/2025"),
    # 2025 百大（新增/延续）
    E("BuriedAlien", "bilibili", "影视评论", "culture", "B站200万+", "漫威等超级英雄影视评论。", "漫威评论", "B", notes="百大2025"),
    E("不善言辞的秃秃", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2025"),
    E("菜菜子Nanako", "bilibili", "虚拟UP主", "entertainment", "B站100万+", "虚拟UP主。", "虚拟UP", "B", notes="百大2025"),
    E("初夏ChuXXia", "bilibili", "生活", "lifestyle", "B站100万+", "生活区UP主。", "生活", "B", notes="百大2025"),
    E("GenJi", "bilibili", "设计教程", "tech", "B站200万+", "设计软件教程UP主。", "设计教程", "B", notes="百大2025"),
    E("海棠家的大肥鱼", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2025"),
    E("HOLA小测佬", "bilibili", "美食测评", "lifestyle", "B站200万+", "美食测评UP主。", "美食测评", "B", notes="百大2025"),
    E("红豆稀饭中", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2025"),
    E("火山哥哥", "bilibili", "独立游戏", "entertainment", "B站200万+", "独立游戏开发者。", "独立游戏", "B", notes="百大2025"),
    E("杰克小兔", "bilibili", "生活", "lifestyle", "B站100万+", "生活区UP主。", "生活", "B", notes="百大2025"),
    E("尽墨for车", "bilibili", "汽车", "lifestyle", "B站100万+", "汽车内容UP主。", "汽车", "B", notes="百大2025"),
    E("绝命墨菲", "bilibili", "影视解说", "culture", "B站200万+", "悬疑影视解说。", "悬疑解说", "B", notes="百大2025"),
    E("KL_qiqi", "bilibili", "Minecraft", "entertainment", "B站200万+", "MC UP主。", "MC", "B", notes="百大2025"),
    E("赖导AboutLai", "bilibili", "旅行", "lifestyle", "B站100万+", "旅行Vlog。", "旅行", "B", notes="百大2025"),
    E("蓝飘飘fly", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2025"),
    E("老飞宇66", "bilibili", "游戏", "entertainment", "B站200万+", "FPS游戏UP主。", "FPS", "B", notes="百大2025"),
    E("卢格杜努姆的奥古斯丁", "bilibili", "历史", "history", "B站100万+", "罗马史科普。", "罗马史", "B", notes="百大2025"),
    E("迷影区间", "bilibili", "影视", "culture", "B站100万+", "影视评论UP主。", "影视", "B", notes="百大2025"),
    E("摸鱼事务所", "bilibili", "生活", "lifestyle", "B站200万+", "办公室摸鱼生活。", "摸鱼", "B", notes="百大2025"),
    E("幕川北", "bilibili", "动画", "entertainment", "B站100万+", "动画区UP主。", "动画", "B", notes="百大2025"),
    E("瓶子君152", "bilibili", "动画杂谈", "entertainment", "B站300万+", "动画区杂谈UP主。", "动画杂谈", "A", notes="百大2025"),
    E("晴姐有美有物理", "bilibili", "物理科普", "tech", "B站100万+", "物理科普UP主。", "物理", "B", notes="百大2025"),
    E("三三三元", "bilibili", "游戏", "entertainment", "B站100万+", "游戏区UP主。", "游戏", "B", notes="百大2025"),
    E("世界记忆大师龙雅", "bilibili", "记忆法", "tech", "B站200万+", "记忆法与脑力训练。", "记忆法", "B", notes="百大2025"),
    E("食事史馆", "bilibili", "美食历史", "culture", "B站100万+", "美食与历史结合。", "美食史", "B", notes="百大2025"),
    E("STN工作室", "bilibili", "游戏新闻", "entertainment", "B站200万+", "游戏新闻评论。", "《STN》", "A", notes="百大2025"),
    E("温竣岩", "bilibili", "汽车", "lifestyle", "B站100万+", "汽车UP主。", "汽车", "B", notes="百大2025"),
    E("小王Albert", "bilibili", "国际关系", "international", "B站200万+", "国际时事科普。", "国际时事", "A", notes="百大2025"),
    E("一数", "bilibili", "高中数学", "tech", "B站500万+", "高中数学免费课程。", "高中数学", "S", notes="百大2025"),
    E("一条闲木鱼", "bilibili", "历史", "history", "B站200万+", "历史讲述UP主。", "历史", "B", notes="百大2025"),
    E("折纸姬", "bilibili", "军事模型", "military", "B站200万+", "军事模型与历史。", "军事模型", "B", notes="百大2025"),
    # B站头部（非百大但粉丝500万+）
    E("大祥哥来了", "bilibili", "美食探店", "lifestyle", "B站500万+", "高端美食探店UP主。", "美食探店", "A", notes="美食区头部"),
    E("食梦者Carl", "bilibili", "美食", "lifestyle", "B站300万+", "美食区UP主。", "美食", "B", notes="美食区"),
    E("记录生活的蛋黄派", "bilibili", "生活搞笑", "lifestyle", "B站500万+", "生活搞笑UP主。", "生活搞笑", "A", notes="生活区头部"),
    E("力元君", "bilibili", "生活挑战", "lifestyle", "B站400万+", "生活挑战类视频。", "生活挑战", "A", notes="生活区; 种子已有"),
    E("雨哥到处跑", "bilibili", "生活挑战", "lifestyle", "B站500万+", "生活挑战UP主。", "生活挑战", "A", notes="种子已有"),
    E("力哥", "bilibili", "生活", "lifestyle", "B站200万+", "生活区UP主。", "生活", "B", notes="生活区"),
    E("杨和苏", "bilibili", "音乐", "entertainment", "B站200万+", "说唱歌手UP主。", "说唱", "B", notes="音乐区"),
    E("某幻君", "bilibili", "游戏音乐", "entertainment", "B站800万+", "游戏与音乐内容。", "游戏音乐", "A", notes="种子已有"),
    E("花少北", "bilibili", "游戏", "entertainment", "B站500万+", "游戏实况UP主。", "游戏", "A", notes="种子已有"),
    E("老番茄", "bilibili", "游戏", "entertainment", "B站2000万+", "B站首位千万粉UP主。", "游戏实况", "S", notes="种子已有"),
    E("中国BOY", "bilibili", "生活游戏", "entertainment", "B站800万+", "生活与游戏内容。", "生活游戏", "A", notes="种子已有"),
    E("某幻", "bilibili", "游戏", "entertainment", "B站800万+", "游戏区UP主。", "游戏", "A", notes="别名"),
    E("散人", "bilibili", "游戏", "entertainment", "B站800万+", "逍遥散人简称。", "游戏", "S", notes="别名"),
    E("UP-Super", "bilibili", "综合", "entertainment", "B站100万+", "B站综合类UP主。", "综合", "C", notes=""),
    E("罗翔", "bilibili", "法律科普", "culture", "B站3000万+", "刑法科普顶流。", "刑法科普", "S", notes="种子已有"),
    E("半佛仙人", "bilibili", "商业科普", "finance", "B站700万+", "商业消费主义科普。", "半佛仙人", "S", notes="种子已有"),
    E("巫师财经", "bilibili", "财经揭秘", "finance", "B站300万+", "财经行业揭秘。", "巫师财经", "A", notes="种子已有"),
    E("硬核的半佛", "bilibili", "商业", "finance", "B站700万+", "半佛仙人账号。", "半佛", "A", notes="种子已有"),
    E("芳斯塔夫", "bilibili", "古生物", "tech", "B站300万+", "古生物科普。", "古生物", "A", notes="dup test"),
]

# ── 抖音千万粉+创作者（不含政务/媒体号） ──
DOUYIN_10M_PLUS = [
    E("陈翔六点半", "douyin", "搞笑短剧", "entertainment", "抖音7000万+", "搞笑短剧团队；「陈翔六点半」系列。", "《陈翔六点半》", "S", notes="抖音头部"),
    E("广东夫妇", "douyin", "直播带货", "lifestyle", "抖音7000万+", "郑建鹏言真夫妇；电商直播。", "直播带货", "S", notes="抖音头部"),
    E("陈赫", "douyin", "明星娱乐", "entertainment", "抖音6000万+", "演员；搞笑短视频。", "明星动态", "S", notes="抖音头部"),
    E("涂磊", "douyin", "情感主持", "lifestyle", "抖音5000万+", "情感节目主持人。", "情感", "A", notes="抖音头部"),
    E("祝晓晗", "douyin", "搞笑剧情", "entertainment", "抖音5000万+", "父女搞笑短剧。", "祝晓晗系列", "S", notes="抖音头部"),
    E("唐艺", "douyin", "户外唱歌", "entertainment", "抖音4000万+", "户外直播唱歌。", "户外唱歌", "A", notes="抖音头部"),
    E("邓紫棋", "douyin", "音乐", "entertainment", "抖音4000万+", "歌手；音乐短视频。", "音乐", "S", notes="抖音头部"),
    E("开心锤锤", "douyin", "原创动画", "entertainment", "抖音4000万+", "原创搞笑动画账号。", "《开心锤锤》", "A", notes="抖音头部"),
    E("赵露思", "douyin", "明星", "entertainment", "抖音4000万+", "演员；生活短视频。", "明星", "A", notes="抖音头部"),
    E("贾乃亮", "douyin", "明星", "entertainment", "抖音4000万+", "演员；直播与短视频。", "明星", "A", notes="抖音头部"),
    E("迪丽热巴", "douyin", "明星", "entertainment", "抖音4000万+", "演员。", "明星", "A", notes="抖音头部"),
    E("陈三废姐弟", "douyin", "搞笑剧情", "entertainment", "抖音4000万+", "姐弟搞笑短剧。", "搞笑短剧", "A", notes="抖音头部"),
    E("梅尼耶", "douyin", "创意短视频", "entertainment", "抖音3000万+", "创意反转短视频。", "创意短视频", "A", notes="抖音头部"),
    E("唐唐", "douyin", "影视解说", "entertainment", "抖音3000万+", "搞笑影视解说。", "影视解说", "A", notes="抖音头部"),
    E("多余和毛毛姐", "douyin", "搞笑剧情", "entertainment", "抖音3000万+", "反串搞笑剧情。", "毛毛姐", "A", notes="抖音头部"),
    E("阿悠悠", "douyin", "音乐", "entertainment", "抖音3000万+", "歌手；翻唱与原创。", "音乐", "A", notes="抖音头部"),
    E("大logo", "douyin", "高端探店", "lifestyle", "抖音3000万+", "高端消费探店。", "高端探店", "A", notes="抖音头部"),
    E("倪海杉", "douyin", "户外直播", "lifestyle", "抖音3000万+", "户外直播与带货。", "户外直播", "A", notes="抖音头部"),
    E("张庭", "douyin", "直播带货", "lifestyle", "抖音3000万+", "TST创始人；直播带货。", "直播", "A", notes="抖音头部"),
    E("林依轮", "douyin", "美食生活", "lifestyle", "抖音2000万+", "歌手转型美食直播。", "美食", "A", notes="抖音头部"),
    E("潘长江", "douyin", "明星", "entertainment", "抖音2000万+", "喜剧演员；直播带货。", "直播", "A", notes="抖音头部"),
    E("许华升", "douyin", "搞笑", "entertainment", "抖音2000万+", "广西搞笑短视频。", "搞笑", "A", notes="抖音头部"),
    E("小阿Giao", "douyin", "搞笑", "entertainment", "抖音2000万+", "草根搞笑网红。", "giao语", "B", notes="抖音头部"),
    E("姜十七", "douyin", "短剧", "entertainment", "抖音2000万+", "都市短剧创作者。", "短剧", "A", notes="抖音头部"),
    E("朱一旦", "douyin", "讽刺短剧", "entertainment", "抖音2000万+", "「有钱人的枯燥生活」。", "《朱一旦》", "A", notes="抖音头部"),
    E("毛光光", "douyin", "反串搞笑", "entertainment", "抖音2000万+", "反串角色搞笑。", "反串", "A", notes="抖音头部"),
    E("李蠕蠕", "douyin", "模仿", "entertainment", "抖音2000万+", "名人模仿与配音。", "模仿", "A", notes="抖音头部"),
    E("小沈龙", "douyin", "搞笑", "entertainment", "抖音2000万+", "东北搞笑脱口秀。", "搞笑", "A", notes="抖音头部"),
    E("蜀中桃子姐", "douyin", "乡村美食", "lifestyle", "抖音2000万+", "四川乡村美食。", "乡村美食", "A", notes="抖音头部"),
    E("丁郑美", "douyin", "乡村生活", "lifestyle", "抖音2000万+", "乡村家庭美食。", "乡村生活", "A", notes="抖音头部"),
    E("牛爱芳", "douyin", "乡村生活", "lifestyle", "抖音2000万+", "农村生活记录。", "农村生活", "B", notes="抖音头部"),
    E("听泉赏宝", "douyin", "直播鉴宝", "culture", "抖音3000万+", "2024年涨粉最多；直播鉴宝。", "鉴宝直播", "S", notes="2024黑马"),
    E("郭有才", "douyin", "草根唱歌", "entertainment", "抖音1000万+", "2024草根现象级；菏泽南站。", "《诺言》", "A", notes="2024黑马"),
    E("黄子韬", "douyin", "明星", "entertainment", "抖音3000万+", "艺人；2024年末涨粉。", "明星", "A", notes="2024涨粉"),
    E("雷军", "douyin", "企业家", "tech", "抖音2000万+", "小米创始人；2024入驻抖音。", "科技", "S", notes="2024涨粉"),
    E("与辉同行", "douyin", "直播带货", "culture", "抖音2000万+", "董宇辉独立账号；农产品+文化。", "与辉同行", "S", notes="2024涨粉"),
    E("k总", "douyin", "直播带货", "lifestyle", "抖音1500万+", "抽象风格直播带货。", "直播", "A", notes="2024涨粉"),
    E("陈泽", "douyin", "游戏直播", "entertainment", "抖音2000万+", "游戏主播；2024转战抖音。", "游戏直播", "A", notes="游戏头部"),
    E("旭旭宝宝", "douyin", "游戏直播", "entertainment", "抖音2000万+", "DNF顶级主播。", "DNF直播", "A", notes="游戏头部"),
    E("童锦程", "douyin", "户外直播", "lifestyle", "抖音1500万+", "户外搭讪直播；大海星辰MCN。", "户外直播", "A", notes="MCN头部"),
    E("瑜大公子", "douyin", "直播带货", "lifestyle", "抖音1000万+", "快手转抖音；美妆带货。", "直播带货", "A", notes="电商"),
    E("东方甄选", "douyin", "直播带货", "culture", "抖音3000万+", "新东方转型；知识型直播。", "东方甄选", "S", notes="直播电商"),
    E("相宜", "douyin", "文化直播", "culture", "抖音2000万+", "文化讲解直播；曾引发争议。", "文化直播", "A", notes="文化直播"),
    E("刘思瑶", "douyin", "颜值", "entertainment", "抖音2000万+", "颜值博主。", "颜值", "A", notes="抖音头部"),
    E("临界十缨", "douyin", "情侣", "lifestyle", "抖音2000万+", "情侣Vlog。", "情侣", "A", notes="抖音头部"),
    E("爆胎草莓粥", "douyin", "颜值", "entertainment", "抖音2000万+", "颜值博主。", "颜值", "B", notes="抖音头部"),
    E("七舅脑爷", "douyin", "悬疑短剧", "entertainment", "抖音2000万+", "悬疑推理短剧。", "悬疑短剧", "A", notes="抖音头部"),
    E("井胧", "douyin", "音乐", "entertainment", "抖音2000万+", "歌手；抖音音乐人。", "音乐", "A", notes="抖音头部"),
    E("等什么君", "douyin", "国风音乐", "culture", "抖音2000万+", "国风翻唱歌手。", "国风音乐", "A", notes="抖音头部"),
    E("小阿枫", "douyin", "音乐", "entertainment", "抖音2000万+", "翻唱歌手。", "翻唱", "A", notes="抖音头部"),
    E("刘德华", "douyin", "明星", "entertainment", "抖音7000万+", "天王巨星；抖音入驻。", "明星", "S", notes="抖音头部"),
    E("张柏芝", "douyin", "明星", "entertainment", "抖音2000万+", "演员。", "明星", "A", notes="抖音头部"),
    E("冯巩", "douyin", "相声", "entertainment", "抖音2000万+", "相声演员。", "相声", "A", notes="抖音头部"),
    E("潘长江", "douyin", "喜剧", "entertainment", "抖音2000万+", "喜剧演员。", "喜剧", "A", notes="dup"),
    E("张大大", "douyin", "娱乐", "entertainment", "抖音1500万+", "主持人；直播。", "直播", "B", notes="抖音"),
    E("小杨哥", "douyin", "搞笑", "entertainment", "抖音1亿+", "疯狂小杨哥简称。", "搞笑", "S", notes="别名"),
    E("三只羊", "douyin", "MCN", "lifestyle", "抖音5000万+", "疯狂小杨哥MCN。", "三只羊", "A", notes="MCN"),
    E("交个朋友", "douyin", "直播带货", "lifestyle", "抖音1000万+", "罗永浩直播账号。", "交个朋友", "A", notes="直播"),
    E("刘畊宏", "douyin", "健身", "lifestyle", "抖音7000万+", "毽子操直播。", "毽子操", "S", notes="种子已有"),
    E("李子柒", "douyin", "非遗文化", "culture", "抖音5000万+", "田园非遗短视频。", "非遗", "S", notes="种子已有"),
    E("董宇辉", "douyin", "文化直播", "culture", "抖音2000万+", "东方甄选前主播。", "文化直播", "S", notes="种子已有"),
    E("李佳琦", "douyin", "直播带货", "lifestyle", "抖音1亿+", "直播带货顶流。", "直播带货", "S", notes="种子已有"),
    E("薇娅", "douyin", "直播带货", "lifestyle", "抖音8000万+", "前直播带货女王。", "直播", "S", notes="种子已有"),
    E("疯狂小杨哥", "douyin", "搞笑", "entertainment", "抖音1亿+", "搞笑剧情顶流。", "小杨哥", "S", notes="种子已有"),
    E("张大仙", "douyin", "游戏", "entertainment", "抖音5000万+", "王者荣耀主播。", "游戏", "S", notes="种子已有"),
    E("张同学", "douyin", "乡村生活", "lifestyle", "抖音1000万+", "东北乡村短视频。", "乡村", "A", notes="种子已有"),
    E("白冰", "douyin", "探店", "lifestyle", "抖音3000万+", "高端探店。", "探店", "A", notes="种子已有"),
    E("痞幼", "douyin", "汽车", "lifestyle", "抖音3000万+", "汽车博主。", "汽车", "A", notes="种子已有"),
    E("猴哥说车", "douyin", "汽车", "lifestyle", "抖音2000万+", "汽车知识。", "汽车", "A", notes="种子已有"),
    E("樊登", "douyin", "读书", "culture", "抖音7000万+", "帆书讲书。", "樊登读书", "S", notes="种子已有"),
    E("papi酱", "douyin", "搞笑", "entertainment", "抖音3000万+", "短视频鼻祖。", "papi酱", "S", notes="种子已有"),
    E("李雪琴", "douyin", "脱口秀", "entertainment", "抖音2000万+", "脱口秀演员。", "脱口秀", "S", notes="种子已有"),
    E("马未都", "douyin", "收藏", "culture", "抖音1000万+", "观复博物馆。", "收藏", "S", notes="种子已有"),
    E("罗永浩", "douyin", "直播", "lifestyle", "抖音1000万+", "交个朋友直播。", "直播", "S", notes="种子已有"),
    E("开封干娘", "douyin", "相亲", "lifestyle", "抖音1000万+", "2024现象级；开封万岁山。", "相亲", "A", notes="2024黑马"),
    E("帝师", "douyin", "户外", "lifestyle", "抖音1000万+", "户外直播。", "户外", "B", notes="抖音"),
    E("药水哥", "douyin", "游戏直播", "entertainment", "抖音1000万+", "游戏抽象直播。", "游戏", "B", notes="抖音"),
    E("温精灵", "douyin", "时尚", "lifestyle", "抖音1000万+", "时尚博主。", "时尚", "B", notes="抖音"),
    E("深夜徐老师", "douyin", "时尚", "lifestyle", "抖音1000万+", "时尚自媒体。", "时尚", "B", notes="抖音"),
    E("深夜放毒", "douyin", "美食", "lifestyle", "抖音1000万+", "美食短视频。", "美食", "B", notes="抖音"),
    E("夏叔厨房", "douyin", "美食教程", "lifestyle", "抖音2000万+", "快手美食教程。", "美食", "A", notes="抖音美食"),
    E("特别乌啦啦", "douyin", "美食探店", "lifestyle", "抖音2000万+", "全国美食探店。", "美食探店", "A", notes="抖音美食"),
    E("密子君", "douyin", "吃播", "lifestyle", "抖音1000万+", "大胃王吃播。", "吃播", "A", notes="跨平台"),
    E("半吨兄弟", "douyin", "美食", "lifestyle", "抖音2000万+", "大份量美食。", "美食", "A", notes="抖音美食"),
    E("老饭骨", "douyin", "烹饪", "lifestyle", "抖音2000万+", "国宴厨师团队。", "老饭骨", "A", notes="抖音美食"),
    E("李子柒", "douyin", "田园", "culture", "抖音5000万+", "田园美学。", "田园", "S", notes="dup"),
    # 多平台 / 微博 / 小红书头部
    E("papi酱", "multi", "短视频", "entertainment", "多平台3000万+", "短视频开创者。", "papi酱", "S", notes="多平台"),
    E("罗振宇", "multi", "知识", "culture", "多平台1000万+", "得到App创始人。", "得到", "S", notes="多平台"),
    E("刘畊宏", "multi", "健身", "lifestyle", "多平台7000万+", "跨平台健身。", "健身", "S", notes="多平台"),
]
# fmt: on


def _dedupe_expansion(entries: list[tuple]) -> list[tuple]:
    existing = _load_names(EXISTING_JS, r"SM\('[^']+', '([^']+)'")
    cultural = _load_names(CULTURAL_JS, r"name: '([^']+)'")
    skip = existing | cultural

    seen_name: set[str] = set()
    seen_id: set[str] = set()
    out: list[tuple] = []
    skipped = 0

    for e in entries:
        if len(e) < 12:
            e = e + ("",) * (12 - len(e))
        id_, name = e[0], e[1]
        nk = _norm(name)
        if nk in skip or nk in seen_name or id_ in seen_id:
            skipped += 1
            continue
        seen_name.add(nk)
        seen_id.add(id_)
        out.append(e[:12])

    return out, skipped


RAW_EXPANSION = BILIBILI_BAIDDA + DOUYIN_10M_PLUS
EXPANSION_ENTRIES, _SKIPPED = _dedupe_expansion(RAW_EXPANSION)

if __name__ == "__main__":
    print(f"Raw expansion: {len(RAW_EXPANSION)}")
    print(f"After dedup vs existing/cultural: {len(EXPANSION_ENTRIES)} (skipped {_SKIPPED})")
