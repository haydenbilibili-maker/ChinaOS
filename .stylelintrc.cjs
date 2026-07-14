/** China OS · CSS 色值收敛（警告级，不阻断 CI/部署） */
module.exports = {
  rules: {
    // 新样式优先语义令牌；存量 hex 允许警告，逐步收敛
    'color-no-hex': [true, { severity: 'warning' }],
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.wrangler/**',
    // 设计令牌与主题源定义允许 hex
    'app/src/index.css',
    'app/src/modules/shared/gy/tokens.css',
  ],
};
