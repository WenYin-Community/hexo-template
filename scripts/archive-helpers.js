'use strict';

const fs = require('fs');
const path = require('path');

// 归档页自定义模板：年份分组保持不变，年份下新增月份二级分组。
// 说明：NexT 通过 nunjucks 的 {% import %} 直接读取主题物理文件，
// 只有由 Hexo 视图系统加载的顶层模板（archive.njk）可以被 setView 覆盖。
hexo.extend.filter.register('before_generate', () => {
  const overridePath = path.join(hexo.base_dir, 'templates', 'archive.njk');
  if (fs.existsSync(overridePath)) {
    hexo.theme.setView('archive.njk', fs.readFileSync(overridePath, 'utf-8'));
  }
});

// 月份分组计数：post_count_month('2026-08')
hexo.extend.helper.register('post_count_month', function(ym) {
  return this.site.posts.filter(post => this.date(post.date, 'YYYY-MM') === ym).count();
});
