/**
 * Butterfly
 * 1. Merge CDN
 * 2. Capitalize the first letter of comment name
 */

'use strict'

const { version } = require('../../package.json')
const path = require('path')

hexo.extend.filter.register('before_generate', () => {
  const themeConfig = hexo.theme.config
  const { CDN, comments } = themeConfig

  /**
   * Merge CDN
   */

  const internalSrcCDN = {
    main_css: '/css/index.css',
    main: `https://cdn.cbd.int/hexo-theme-butterfly@${version}/source/js/main.js`,
    utils: `https://cdn.cbd.int/hexo-theme-butterfly@${version}/source/js/utils.js`,
    translate: `https://cdn.cbd.int/hexo-theme-butterfly@${version}/source/js/tw_cn.js`,
    local_search: `https://cdn.cbd.int/hexo-theme-butterfly@${version}/source/js/search/local-search.js`,
    algolia_js: `https://cdn.cbd.int/hexo-theme-butterfly@${version}/source/js/search/algolia.js`,
  }

  const internalSrcLocal = {
    main_css: '/css/index.css',
    main: '/js/main.js',
    utils: '/js/utils.js',
    translate: '/js/tw_cn.js',
    local_search: '/js/search/local-search.js',
    algolia_js: '/js/search/algolia.js',
  }

  const thirdPartySrcCDN = {
    algolia_search_v4: 'https://cdn.cbd.int/algoliasearch@4/dist/algoliasearch-lite.umd.js',
    instantsearch_v4: 'https://cdn.cbd.int/instantsearch.js@4/dist/instantsearch.production.min.js',
    pjax: 'https://cdn.cbd.int/pjax/pjax.min.js',
    gitalk: 'https://cdn.cbd.int/gitalk/dist/gitalk.js',
    gitalk_css: 'https://cdn.cbd.int/gitalk/dist/gitalk.css',
    blueimp_md5: 'https://cdn.cbd.int/blueimp-md5/js/md5.min.js',
    valine: 'https://cdn.cbd.int/valine/dist/Valine.min.js',
    disqusjs: 'https://cdn.cbd.int/disqusjs@1/dist/disqus.js',
    disqusjs_css: 'https://cdn.cbd.int/disqusjs@1/dist/disqusjs.css',
    twikoo: 'https://cdn.cbd.int/twikoo/dist/twikoo.min.js',
    waline_js: 'https://cdn.cbd.int/@waline/client/dist/waline.js',
    waline_css: 'https://cdn.cbd.int/@waline/client/dist/waline.css',
    sharejs: 'https://cdn.cbd.int/dist/js/social-share.min.js',
    sharejs_css: 'https://cdn.cbd.int/social-share.js/dist/css/share.min.css',
    mathjax: 'https://cdn.cbd.int/mathjax@3/es5/tex-mml-chtml.js',
    katex: 'https://cdn.cbd.int/katex/dist/katex.min.css',
    katex_copytex: 'https://cdn.cbd.int/katex/dist/contrib/copy-tex.min.js',
    katex_copytex_css: 'https://cdn.jsdelivr.net/npm/katex@latest/dist/contrib/copy-tex.css',
    mermaid: 'https://cdn.cbd.int/mermaid/dist/mermaid.min.js',
    canvas_ribbon: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/canvas-ribbon.min.js',
    canvas_fluttering_ribbon: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/canvas-fluttering-ribbon.min.js',
    canvas_nest: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/canvas-nest.min.js',
    activate_power_mode: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/activate-power-mode.min.js',
    fireworks: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/fireworks.min.js',
    click_heart: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/click-heart.min.js',
    ClickShowText: 'https://cdn.cbd.int/butterfly-extsrc@1/dist/click-show-text.min.js',
    lazyload: 'https://cdn.cbd.int/vanilla-lazyload/dist/lazyload.iife.min.js',
    instantpage: 'https://cdn.cbd.int/instant.page@5/instantpage.js',
    typed: 'https://cdn.cbd.int/typed.js/dist/typed.umd.js',
    pangu: 'https://cdn.cbd.int/pangu@4/dist/browser/pangu.min.js',
    fancybox_css_v4: 'https://cdn.cbd.int/@fancyapps/ui/dist/fancybox/fancybox.css',
    fancybox_v4: 'https://cdn.cbd.int/@fancyapps/ui/dist/fancybox/fancybox.umd.js',
    medium_zoom: 'https://cdn.cbd.int/medium-zoom/dist/medium-zoom.min.js',
    snackbar_css: 'https://cdn.cbd.int/node-snackbar/dist/snackbar.min.css',
    snackbar: 'https://cdn.cbd.int/node-snackbar/dist/snackbar.min.js',
    fontawesomeV6: 'https://cdn.cbd.int/@fortawesome/fontawesome-free@6/css/all.min.css',
    flickr_justified_gallery_js: 'https://cdn.cbd.int/flickr-justified-gallery@2/dist/fjGallery.min.js',
    flickr_justified_gallery_css: 'https://cdn.cbd.int/flickr-justified-gallery@2/dist/fjGallery.css',
    aplayer_css: 'https://cdn.cbd.int/aplayer@1/dist/APlayer.min.css',
    aplayer_js: 'https://cdn.cbd.int/aplayer@1/dist/APlayer.min.js',
    meting_js: 'https://cdn.cbd.int/meting/dist/Meting.min.js',
    prismjs_js: 'https://cdn.cbd.int/prismjs@1/prism.js',
    prismjs_lineNumber_js: 'https://cdn.cbd.int/prismjs@1/plugins/line-numbers/prism-line-numbers.min.js',
    prismjs_autoloader: 'https://cdn.cbd.int/prismjs@1/plugins/autoloader/prism-autoloader.min.js',
  }

  // delete null value
  const deleteNullValue = obj => {
    if (!obj) return
    for (const i in obj) {
      obj[i] === null && delete obj[i]
    }
    return obj
  }

  const defaultVal = (obj, choose) => {
    if (obj === 'internal') {
      if (choose === 'local') return internalSrcLocal
      else return internalSrcCDN
    }

    if (obj === 'external') {
      if (choose === 'local') {
        let result = {}
        try {
          const data = path.join(hexo.plugin_dir,'hexo-butterfly-extjs/plugins.yml')
          result = hexo.render.renderSync({ path: data, engine: 'yaml'})
          Object.keys(result).map(key => {
            result[key] = '/pluginsSrc/' + result[key]
          })
        } catch (e) {}
        return result
      } else return thirdPartySrcCDN
    }
  }

  themeConfig.asset = Object.assign(defaultVal('internal', CDN.internal_provider),
    defaultVal('external', CDN.third_party_provider), deleteNullValue(CDN.option))

  /**
   * Capitalize the first letter of comment name
   */

  let { use } = comments

  if (!use) return

  if (typeof use === 'string') {
    use = use.split(',')
  }

  const newArray = use.map(item => item.toLowerCase().replace(/\b[a-z]/g, s => s.toUpperCase()))

  themeConfig.comments.use = newArray
})
