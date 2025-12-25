const title = '是超超捏的博客'
const currentYear = new Date().getFullYear()
const blogRoutes = [
  {
    text: '奇奇怪怪的工具',
    collapsed: false,
    items: [
      { text: 'watt Toolkit', link: '/blog/tool/watt' },
    ]
  },
  {
    text: 'vitepress',
    collapsed: false,
    items: [
      { text: 'vitepress基本配置', link: '/blog/vitepress/base' },
      { text: 'github部署vitepress', link: '/blog/vitepress/arrange' },
    ]
  },
  {
    text: '微信公众号开发',
    collapsed: false,
    items: [
      { text: '微信公众号h5授权', link: '/blog/wechatOfficialAccount/wechatEmpower' },
    ]
  },
  {
    text: '微信小程序',
    collapsed: false,
    items: [
      { text: '小程序web-view页面分享问题', link: '/blog/wechatMP/wechatMPShare' },
    ]
  },
  {
    text: 'electron',
    collapsed: false,
    items: [
      { text: 'electron与vue结合', link: '/blog/electron/electron-vue' },
    ]
  },
  {
    text: 'jenkins与gitlab',
    collapsed: false,
    items: [
      { text: 'jenkins与gitlab自动化部署', link: '/blog/jenkins/jenkins-and-gitlab' },
    ]
  },
  {
    text: 'micro-app',
    collapsed: false,
    items: [
      { text: '微前端micro-app搭建流程', link: '/blog/micro-app/micro-app-build' },
    ]
  },
]

const comicRoutes = [
  {
    text: '写在前面',
    collapsed: false,
    items: [
      { text: '常用动漫网站', link: '/comic/writeBefore/comicWeb' },
    ]
  },
  {
    text: '悬疑',
    collapsed: false,
    items: [
      { text: '命运石之门', link: '/comic/suspense/steins' },
      { text: '寒蝉鸣泣之时', link: '/comic/suspense/whenTheyCry' },
      { text: '夏日重现', link: '/comic/suspense/summerTimeRendering' },
      { text: '天国大魔境', link: '/comic/suspense/heavenAndMagicRealm' },
      { text: '约定的梦幻岛 第一季', link: '/comic/suspense/thePromisedNeverland' },
      { text: '弹丸论破系列', link: '/comic/suspense/danganronpa' },
      { text: 'another', link: '/comic/suspense/another' },
    ]
  },
  {
    text: '转生',
    collapsed: false,
    items: [
      { text: 're：从零开始的异世界生活', link: '/comic/reincarnation/re0' },
      { text: '无职转生', link: '/comic/reincarnation/unemployedReincarnation' },
    ]
  },
  {
    text: '恋爱',
    collapsed: false,
    items: [
      { text: '我的青春恋爱物语果然有问题', link: '/comic/love/chunwu' },
      { text: '中二病也要谈恋爱', link: '/comic/love/middleTwoDiseases' },
    ]
  },
  {
    text: '治愈',
    collapsed: false,
    items: [
      { text: 'CLANNAD', link: '/comic/cure/CLANNAD' },
      { text: '86-不存在的战区', link: '/comic/cure/86' },
      { text: '青春猪头少年不会梦到兔女郎学姐', link: '/comic/cure/youthPig' },
    ]
  },
  {
    text: '致郁',
    collapsed: false,
    items: [
      { text: 'school days', link: '/comic/causeDepression/schoolDays' },
      { text: '白色相簿1 2', link: '/comic/causeDepression/whiteAlbum' },
      { text: '家有女友', link: '/comic/causeDepression/homeGirlfriend' },
    ]
  },
  {
    text: '轻松',
    collapsed: false,
    items: [
      { text: '孤独摇滚', link: '/comic/relax/BocchiTheRock!' },
      { text: '轻音少女', link: '/comic/relax/KON' },
      { text: '玉子市场', link: '/comic/relax/tamakoMarket' },
    ]
  },
  {
    text: '燃系',
    collapsed: false,
    items: [
      { text: '进击的巨人', link: '/comic/burn/attackOnTitan' },
      { text: '文豪野犬', link: '/comic/burn/bungoStrayDogs' },
      { text: 'fate/zero', link: '/comic/burn/fateZero' },
      { text: 'fate/stay night', link: '/comic/burn/fateStayNight' },
      { text: '罪恶王冠', link: '/comic/burn/evilCrown' },
      { text: '钢之炼金术师FA', link: '/comic/burn/fullmetalAlchemist' },
    ]
  },
]
export default {
  lang: 'zh-CN',
  title, // 标题
  base: '/vitepress/',
  titleTemplate: '咚咚', // 标题的后缀
  description: '世界更美好',
  i18nRouting: false,
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: true, // 生成干净的url
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '博客',
        link: blogRoutes[0].items[0].link,
      },
      {
        text: '动漫',
        link: comicRoutes[0].items[0].link,
      },
      {
        text: '友链',
        link: '/friends/',
      },
      {
        text: '其他站点',
        items: [
          { text: 'b站首页',link: 'https://space.bilibili.com/32769241?spm_id_from=333.1007.0.0' },
        ],
      }
    ], // 右上角导航栏
    sidebar: {
      '/blog/': blogRoutes,
      '/comic/': comicRoutes,
    }, // 侧边栏菜单
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/tlc123321'
      },
      {
        icon: {
          svg: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1701067346104" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4098" xmlns:xlink="http://www.w3.org/1999/xlink" width="257.03125" height="200"><path d="M643.181714 247.698286l154.916572-123.172572L643.181714 0.256 643.072 0l-154.660571 124.269714 154.660571 123.245715 0.109714 0.182857z m0 388.461714h0.109715l399.579428-315.245714-108.361143-87.04-291.218285 229.888h-0.146286l-0.109714 0.146285L351.817143 234.093714l-108.251429 87.04 399.433143 315.136 0.146286-0.146285z m-0.146285 215.552l0.146285-0.146286 534.893715-422.034285 108.397714 87.04-243.309714 192L643.145143 1024 10.422857 525.056 0 516.754286l108.251429-86.893715L643.035429 851.748571z" fill="#1E80FF" p-id="4099"></path></svg>'
        },
        link: 'https://juejin.cn/user/2615075777810108'
      },
    ], // 右上角带有图标的链接
    lastUpdatedText: '最后更新时间', // 最后更新时间
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${currentYear}-present ${title}`
    },
    search: {
      provider: 'local'
    }, // 搜索
    outline:[2,3], // 大纲显示2-3级标题
    outlineTitle:'当前页大纲', // 大纲顶部标题
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    }, // 上一篇下一篇
  }
}
