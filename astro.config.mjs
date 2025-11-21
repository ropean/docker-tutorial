import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docker.aceapp.dev',
  integrations: [
    starlight({
      title: 'Docker 中文教程',
      logo: {
        src: './src/assets/docker-logo.svg',
      },
      favicon: '/docker-logo.svg',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: {
        github: 'https://github.com/ropean/docker-tutorial',
      },
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '欢迎', link: '/' },
            {
              label: '什么是 Docker',
              link: '/getting-started/what-is-docker/',
            },
            { label: '安装 Docker', link: '/getting-started/installation/' },
            { label: '快速开始', link: '/getting-started/quickstart/' },
          ],
        },
        {
          label: '基础概念',
          items: [
            { label: '镜像与容器', link: '/basics/images-and-containers/' },
            { label: '容器生命周期', link: '/basics/container-lifecycle/' },
            { label: 'Docker 命令详解', link: '/basics/commands/' },
            { label: 'Dockerfile 基础', link: '/basics/dockerfile-basics/' },
            { label: '镜像仓库', link: '/basics/registries/' },
          ],
        },
        {
          label: '实战操作',
          items: [
            { label: '构建第一个镜像', link: '/practice/build-first-image/' },
            { label: '容器网络', link: '/practice/networking/' },
            { label: '数据卷管理', link: '/practice/volumes/' },
            { label: '容器间通信', link: '/practice/container-communication/' },
            { label: 'Docker Compose', link: '/practice/docker-compose/' },
          ],
        },
        {
          label: '进阶技巧',
          items: [
            { label: '多阶段构建', link: '/advanced/multi-stage-builds/' },
            { label: '镜像优化', link: '/advanced/image-optimization/' },
            { label: '健康检查', link: '/advanced/health-checks/' },
            { label: '资源限制', link: '/advanced/resource-limits/' },
            { label: '日志管理', link: '/advanced/logging/' },
          ],
        },
        {
          label: '最佳实践',
          items: [
            { label: '安全最佳实践', link: '/best-practices/security/' },
            { label: '性能优化', link: '/best-practices/performance/' },
            { label: '开发环境配置', link: '/best-practices/development/' },
            { label: '生产环境部署', link: '/best-practices/production/' },
            { label: '常见问题排查', link: '/best-practices/troubleshooting/' },
          ],
        },
        {
          label: '实战项目',
          items: [
            { label: 'Node.js 应用容器化', link: '/projects/nodejs/' },
            { label: 'Python 应用容器化', link: '/projects/python/' },
            { label: '全栈应用部署', link: '/projects/fullstack/' },
            { label: '微服务架构', link: '/projects/microservices/' },
          ],
        },
        {
          label: '参考资料',
          items: [
            { label: '命令速查表', link: '/reference/cheatsheet/' },
            { label: 'Dockerfile 指令', link: '/reference/dockerfile/' },
            {
              label: 'docker-compose.yml 配置',
              link: '/reference/compose-file/',
            },
            { label: '常用镜像推荐', link: '/reference/popular-images/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        // 使用自定义组件覆盖默认组件
      },
    }),
  ],
});
