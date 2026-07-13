import { describe, expect, it } from 'vitest';
import {
  clampScore,
  extractProvince,
  scoreEducation,
  scoreCareer,
  scoreRegion,
  scoreInstitution,
  scoreRelation,
  computeFigureRadarScores,
  computeCohortAverage,
  buildFigureRadarOption,
} from '../figureRadar.js';

const sampleFigure = {
  id: 'f1',
  name: '测试官员',
  level: '省部级',
  province: '广东',
  sector: '地方',
  org: '广东省委',
  fields: {
    native: '山东济南',
    edu: '清华大学本科、北京大学硕士',
    rank: '二十届中央委员',
    institutionType: '部委',
  },
  career: [
    { from: '2010', to: '2015', desc: '任山东省委常委' },
    { from: '2015', to: '2020', desc: '任山东省委副书记、省长' },
    { from: '2020', to: '', desc: '任广东省委书记' },
  ],
  tags: ['二十届', '书记'],
  relatedEntities: ['同僚甲', '同僚乙'],
};

const peers = [
  sampleFigure,
  {
    id: 'f2',
    name: '同乡官员',
    province: '广东',
    fields: { native: '山东青岛' },
    career: [{ from: '2018', to: '', desc: '任广东省副省长' }],
  },
  {
    id: 'f3',
    name: '他省官员',
    province: '浙江',
    fields: { native: '浙江杭州' },
    career: [],
  },
];

describe('clampScore', () => {
  it('clamps to 0-100', () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(42.6)).toBe(43);
  });
});

describe('extractProvince', () => {
  it('parses province from native string', () => {
    expect(extractProvince('山东济南')).toBe('山东');
    expect(extractProvince('北京市')).toBe('北京');
    expect(extractProvince('')).toBeNull();
  });
});

describe('scoreEducation', () => {
  it('rewards C9 and graduate degrees', () => {
    const { score, rationale } = scoreEducation(sampleFigure);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(rationale).toMatch(/C9|985|清华|北大/);
  });

  it('returns baseline when edu missing', () => {
    const { score } = scoreEducation({ fields: {} });
    expect(score).toBeGreaterThanOrEqual(20);
    expect(score).toBeLessThan(40);
  });
});

describe('scoreCareer', () => {
  it('increases with career depth', () => {
    const shallow = scoreCareer({ career: [{ from: '2020', to: '', desc: '任市长' }] });
    const deep = scoreCareer(sampleFigure);
    expect(deep.score).toBeGreaterThan(shallow.score);
  });
});

describe('scoreRegion', () => {
  it('detects cross-province mobility', () => {
    const { rationale } = scoreRegion(sampleFigure, { allFigures: peers });
    expect(rationale).toMatch(/跨省|任职/);
  });
});

describe('scoreInstitution', () => {
  it('weights central ministry higher', () => {
    const local = scoreInstitution({ sector: '地方', org: '某市委' });
    const central = scoreInstitution({ sector: '党中央', org: '中央办公厅', province: '中央' });
    expect(central.score).toBeGreaterThan(local.score);
  });
});

describe('scoreRelation', () => {
  it('infers ties from native and province peers', () => {
    const { score, graph } = scoreRelation(sampleFigure, { allFigures: peers });
    expect(score).toBeGreaterThan(15);
    expect(graph.some((n) => n.name === '同乡官员')).toBe(true);
  });
});

describe('computeFigureRadarScores', () => {
  it('returns all core dimensions', () => {
    const { scores, breakdown } = computeFigureRadarScores(sampleFigure, { allFigures: peers });
    expect(scores).toMatchObject({
      relation: expect.any(Number),
      career: expect.any(Number),
      education: expect.any(Number),
      region: expect.any(Number),
      institution: expect.any(Number),
    });
    expect(breakdown.education.rationale).toBeTruthy();
    expect(scores.anticorruption).toBeUndefined();
  });

  it('includes anticorruption when names set', () => {
    const names = new Set(['测试官员']);
    const { scores } = computeFigureRadarScores(sampleFigure, {
      allFigures: peers,
      antiCorruptionNames: names,
      includeAnticorruption: true,
    });
    expect(scores.anticorruption).toBeGreaterThan(80);
  });
});

describe('computeCohortAverage', () => {
  it('averages dimension scores', () => {
    const rows = peers.map((f) => computeFigureRadarScores(f, { allFigures: peers }).scores);
    const avg = computeCohortAverage(rows);
    expect(avg.relation).toBeGreaterThan(0);
    expect(avg.career).toBeLessThanOrEqual(100);
  });
});

describe('buildFigureRadarOption', () => {
  it('produces radar series for primary and compare', () => {
    const p = { name: 'A', scores: computeFigureRadarScores(sampleFigure).scores };
    const c = { name: 'B', scores: computeFigureRadarScores(peers[1]).scores };
    const opt = buildFigureRadarOption({ primary: p, compare: c });
    expect(opt.series[0].data).toHaveLength(2);
    expect(opt.radar.indicator).toHaveLength(5);
  });
});
