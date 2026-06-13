import { moduleById } from '../../app/registry.js';
import { GY_MODULES } from '../gy/registry.js';
import { ATLAS_AXES, ATLAS_CLUSTERS } from './atlasData.js';

/** @param {AtlasSliceMeta} meta */
function resolveSlice(meta) {
  const gy = GY_MODULES[meta.num];
  if (!gy) return null;
  const mod = moduleById(gy.id);
  const code = `GY-${meta.num}`;
  return {
    code,
    route: gy.path,
    title: mod?.title ?? gy.label,
    blurb: meta.blurb ?? mod?.subtitle ?? gy.label,
    axes: meta.axes,
    sens: meta.sens,
    extremal: meta.extremal,
  };
}

/** @param {ReturnType<typeof resolveSlice>} slice */
function renderSliceCard(slice) {
  if (!slice) return '';
  const cls = ['at-slice', slice.extremal && 'is-extremal'].filter(Boolean).join(' ');
  const sens = slice.sens ? `<span class="at-slice-sens">${slice.sens}</span>` : '';
  const axes = slice.axes.map((a) => `<span>${a}</span>`).join('');
  return `<div class="${cls}" data-code="${slice.code}" data-route="${slice.route}" tabindex="0" role="link">
    <div class="at-slice-code"><span>${slice.code}</span><span class="at-slice-dot" title="切换点亮"></span></div>
    ${sens}
    <h4>${slice.title}</h4>
    <p>${slice.blurb}</p>
    <div class="at-slice-axes">${axes}</div>
  </div>`;
}

export function renderAtlasClustersHtml() {
  return ATLAS_CLUSTERS.map((cluster) => {
    const cards = cluster.slices.map((meta) => renderSliceCard(resolveSlice(meta))).join('');
    return `<div class="at-cluster">
      <div class="at-cluster-head">${cluster.head}</div>
      <div class="at-grid">${cards}</div>
    </div>`;
  }).join('');
}

export function renderAtlasAxesHtml() {
  return ATLAS_AXES.map((axis) => {
    const nodes = axis.nodes
      .map(({ num, short }) => {
        const gy = GY_MODULES[num];
        if (!gy) return '';
        const code = `GY-${num}`;
        return `<span class="at-axis-node" data-code="${code}" data-route="${gy.path}"><b>${num}</b>${short}</span>`;
      })
      .join('');
    return `<div class="at-axis"><div class="at-axis-name"><h5>${axis.name}</h5><small>${axis.sub}</small></div><div class="at-axis-nodes">${nodes}</div></div>`;
  }).join('');
}

/**
 * 将图谱 / 八轴 DOM 挂载到 HTML 骨架，并校验与 registry 切片集一致。
 * @param {HTMLElement} root
 */
export function mountAtlasDom(root) {
  const clustersMount = root.querySelector('#at-atlas-clusters');
  if (clustersMount) clustersMount.innerHTML = renderAtlasClustersHtml();

  const axesMount = root.querySelector('#at-axes-mount');
  if (axesMount) axesMount.innerHTML = renderAtlasAxesHtml();
}
