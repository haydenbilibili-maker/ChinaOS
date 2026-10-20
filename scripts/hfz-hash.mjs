#!/usr/bin/env node
/**
 * 生成荒废斋访问密钥的 SHA-256 摘要，供 Worker secret HFZ_PASSWORD_SHA256 使用。
 *
 *   printf '%s' '你的密钥' | npm run -s hfz:hash
 *   printf '%s' '你的密钥' | npm run -s hfz:hash | npx wrangler secret put HFZ_PASSWORD_SHA256
 *
 * 从标准输入读取，避免密钥留在 shell 历史里；输出仅为摘要。
 */
import { createHash } from 'crypto';

let input = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) input += chunk;
const password = input.replace(/\r?\n$/, '');
if (!password) {
  console.error('未读到密钥：请通过标准输入传入。');
  process.exit(1);
}
process.stdout.write(createHash('sha256').update(password).digest('hex'));
