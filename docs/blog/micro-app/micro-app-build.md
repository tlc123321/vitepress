# micro-app 微前端搭建文档

## 一、主应用配置（Vue 3）

### 1. 安装依赖

```bash
pnpm add @micro-zoe/micro-app
```

### 2. 初始化 micro-app

**文件：`src/bootstrap.ts`**

```typescript
import microApp from '@micro-zoe/micro-app';

async function bootstrap(namespace: string) {
  // ... 其他初始化代码

  // 初始化 micro-app
  microApp.start({
    'disable-memory-router': true, // 关闭虚拟路由系统
    'disable-patch-request': true, // 开启对子应用请求的拦截
  });
  
  console.log('✅ micro-app 已初始化');

  app.mount('#app');
}
```

### 3. 创建子应用配置

**文件：`src/config/micro-app.config.ts`**

```typescript
export interface MicroAppConfig {
  url: string;
  baseroute: string;
  name?: string;
}

const DEFAULT_MICRO_APP_CONFIG: MicroAppConfig = {
  url: 'http://localhost:3000',
  baseroute: '/mold',
  name: 'sub-app',
};

function isLocalEnvironment(): boolean {
  return !window.location.hostname.includes('shensizaowu');
}

export function getMicroAppConfig(): MicroAppConfig {
  const isLocal = isLocalEnvironment();
  
  if (isLocal) {
    return DEFAULT_MICRO_APP_CONFIG;
  }
  
  return {
    url: import.meta.env.VITE_SUB_APP_URL || DEFAULT_MICRO_APP_CONFIG.url,
    baseroute: import.meta.env.VITE_SUB_APP_BASEROUTE || DEFAULT_MICRO_APP_CONFIG.baseroute,
    name: import.meta.env.VITE_SUB_APP_NAME || DEFAULT_MICRO_APP_CONFIG.name,
  };
}
```

### 4. 配置路由

**文件：`src/router/routes/core.ts`**

```typescript
{
  name: 'HomeLayout',
  path: '/mold',
  component: HomeLayout,
  meta: {
    title: '首页',
    ignoreAccess: true, // 不需要权限控制
  },
  children: [
    {
      name: 'Mold',
      path: ':pathMatch(.*)*', // 匹配所有子路由
      component: () => import('#/views/home/index.vue'),
      meta: {
        title: '首页',
        ignoreAccess: true,
      },
    }
  ],
}
```

### 5. 使用 micro-app 组件

**文件：`src/layouts/home.vue`**

```vue
<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-hidden">
      <micro-app
        :name="microAppConfig.name"
        :url="subAppUrl"
        :baseroute="baseroute"
        :data="microAppData"
        class="w-full h-full"
      ></micro-app>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { useUserStore, useAccessStore } from '@vben/stores';
import { useAuthStore } from '#/store';
import { getMicroAppConfig } from '#/config/micro-app.config';
import { useRouter } from 'vue-router';
import { LOGIN_PATH } from '#/utils/constants';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();

const microAppConfig = getMicroAppConfig();

const subAppUrl = computed(() => microAppConfig.url);
const baseroute = computed(() => microAppConfig.baseroute);

async function handleLogout() {
  await authStore.logout(false);
}

function goLogin(redirectPath?: string) {
  router.push({
    path: LOGIN_PATH,
    query: redirectPath
      ? { redirect: encodeURIComponent(redirectPath) }
      : {},
    replace: true,
  });
}

const microAppData = computed(() => {
  return {
    userInfo: toRaw(userStore.userInfo),
    accessToken: accessStore.accessToken,
    refreshToken: accessStore.refreshToken,
    handleLogout,
    goLogin,
  };
});
</script>
```

### 6. Vite 配置

**文件：`vite.config.mts`**

```typescript
import { defineConfig } from '@vben/vite-config';

const config: any = defineConfig(async () => {
  return {
    vite: {
      vue: {
        template: {
          compilerOptions: {
            // 告诉 Vue 将 micro-app 视为自定义元素
            isCustomElement: (tag) => tag === 'micro-app',
          },
        },
      },
      server: {
        proxy: {
          // 子应用 API 代理
          '/mold-api': {
            changeOrigin: true,
            target: 'http://localhost:3000',
            rewrite: (path) => path.replace(/^\/mold-api/, '/api'),
            ws: true,
          },
        },
      },
    },
  };
});

export default config;
```

### 7. TypeScript 类型声明

**文件：`src/vue-shims.d.ts`**

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'micro-app': {
      name?: string;
      url?: string;
      baseroute?: string;
      data?: Record<string, any>;
      class?: string;
      onMounted?: () => void;
      onUnmount?: () => void;
      onError?: (e: any) => void;
    };
  }
}

declare global {
  interface Window {
    microApp?: {
      getData: () => any;
      setData: (data: any) => void;
      dispatch: (data: any) => void;
      addDataListener: (callback: (data: any) => void) => void;
      removeDataListener: (callback: (data: any) => void) => void;
    };
    __MICRO_APP_ENVIRONMENT__?: boolean;
    __MICRO_APP_BASE_ROUTE__?: string;
    __MICRO_APP_PUBLIC_PATH__?: string;
  }
}
```

---

## 二、子应用配置（React + Rsbuild）

### 1. 入口文件配置

**文件：`src/index.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 微前端环境配置
if (window.__MICRO_APP_ENVIRONMENT__) {
  // 设置静态资源路径
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
  
  // 设置 base 标签
  const base = document.createElement('base');
  base.href = window.__MICRO_APP_PUBLIC_PATH__;
  document.head.appendChild(base);
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
```

### 2. Rsbuild 配置

**文件：`rsbuild.config.ts`**

```typescript
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  dev: {
    assetPrefix: 'http://localhost:3000/',
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
});
```

### 3. 路由配置（React Router）

**文件：`src/App.tsx`**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={window.__MICRO_APP_BASE_ROUTE__ || '/mold'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. 获取主应用数据

**文件：`src/utils/microApp.ts`**

```typescript
export function getMainAppData() {
  if (window.microApp) {
    return window.microApp.getData();
  }
  return null;
}

// 使用示例
const mainAppData = getMainAppData();
const accessToken = mainAppData?.accessToken;
const userInfo = mainAppData?.userInfo;

// 调用主应用方法
mainAppData?.goLogin('/mold/upload');
mainAppData?.handleLogout();
```

### 5. 监听主应用数据变化

```typescript
useEffect(() => {
  if (window.microApp) {
    const handleDataChange = (data: any) => {
      console.log('收到主应用数据:', data);
      // 更新本地状态
    };
    
    window.microApp.addDataListener(handleDataChange);
    
    return () => {
      window.microApp?.removeDataListener(handleDataChange);
    };
  }
}, []);
```

---

## 三、环境变量配置

### 主应用环境变量

**文件：`.env.development`**

```bash
# 子应用配置
VITE_SUB_APP_URL=http://localhost:3000
VITE_SUB_APP_BASEROUTE=/mold
VITE_SUB_APP_NAME=sub-app
```

---

## 四、关键说明

1. **路由配置**：主应用使用 `/mold` 作为子应用的基础路由，子应用需要设置 `basename="/mold"`
2. **数据传递**：主应用通过 `:data` 属性传递数据，子应用通过 `window.microApp.getData()` 获取
3. **CORS 配置**：子应用需要在开发服务器配置 CORS 头，或使用主应用的代理
4. **静态资源**：子应用需要配置 `assetPrefix` 确保资源路径正确
5. **路由拦截**：主应用路由已设置 `ignoreAccess: true`，子应用需要自己实现路由拦截

---

## 五、常见问题

### 1. 子应用无法加载
- 检查子应用服务是否启动
- 检查 `micro-app` 的 `url` 配置是否正确
- 检查浏览器控制台错误信息

### 2. 静态资源加载失败
- 检查子应用的 `assetPrefix` 配置
- 检查 `__webpack_public_path__` 是否设置

### 3. CORS 错误
- 在子应用的开发服务器配置 CORS 头
- 或使用主应用的代理配置

### 4. 路由不匹配
- 确保子应用的 `basename` 与主应用的 `baseroute` 一致
- 确保主应用路由使用通配符匹配子路由

