/*
 * @Date: 2023-09-25 15:12:54
 * @Description: description
 */
import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist/esm' },
  // cjs: { output: 'dist/cjs' },
  umd: { output: 'dist/umd' }
});
