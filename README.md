# SPA with VanillaJS

> **목차**
> ---
> 1. [라우터 구현](#라우터)
> 2. [컴포넌트 시스템](#컴포넌트)
> 3. [전역 상태 관리](#전역-상태-관리)


## 라우터

### 주요 기능
1. 📱 History API 기반 네비게이션
2. 🔒 인증을 위한 라우터 가드 지원
3. 🎯 설정 가능한 404 처리
4. 🔄 브라우저 뒤로가기/앞으로가기 지원
5. 💡 의존성 없음

### 핵심 개념
- 싱글톤 패턴: 일관된 라우팅 상태 관리를 위해 라우터 인스턴스를 싱글톤으로 내보냄
- 브라우저 History API: 클라이언트 사이드 네비게이션을 위해 history.pushState() 활용
- 이벤트 처리: 브라우저 네비게이션 지원을 위한 popstate 이벤트 리스너 구현
- 가드 패턴: 인증 및 권한 부여 로직을 위한 라우트 가드 지원

### 코드

<details>
<summary>src/router.js</summary>

```js
class Router {
  constructor() {
    this.routes = [];
    this.notfound = () => {};
    window.addEventListener("popstate", () => {
      const path = window.location.pathname;

      this.push(path);
    });
  }

  currentPath() {
    return window.location.pathname;
  }

  addRoute(path, handler, routerGuard = null) {
    this.routes[path] = { handler, routerGuard };
  }

  addNotFoundRoute(handler) {
    this.notfound = handler;
  }

  push(path) {
    const route = this.routes[path];
    if (route) {
      const validPath = route.routerGuard ? route.routerGuard(path) : path;
      history.pushState({}, "", validPath);

      const handler = this.routes[validPath]?.handler;
      if (handler) {
        handler();
      } else {
        this.notfound();
      }
    } else {
      this.notfound();
    }
  }
}

const router = new Router();

export default router;

```

</details>

## 컴포넌트

### 주요 기능
- 📦 추상 클래스를 활용한 컴포넌트 구조화
- 🔄 컴포넌트 생명주기 메서드 지원
- 🎨 선언적 템플릿 시스템
- 🎯 이벤트 핸들링 추상화
- 💡 의존성 없는 순수 구현

### 구현 특징
> 컴포넌트 생명주기
컴포넌트는 다음과 같은 생명주기를 가집니다:

- constructor: 초기 설정 및 props 전달
- beforeMount: 마운트 전 실행될 로직
- render: 템플릿 렌더링
- mount: 마운트 후 실행될 로직
- attachEventListeners: 이벤트 리스너 설정

### 컴포넌트 API
> AbstractComponent 클래스 메서드
#### constructor($root, ...args)
- 컴포넌트를 초기화하고 props를 설정합니다.

#### $root
- 컴포넌트가 마운트될 DOM 요소

#### args
- props로 전달될 인자들

#### beforeMount()
- DOM에 마운트되기 전 실행될 로직을 정의합니다.

#### mount()
- DOM에 마운트된 후 실행될 로직을 정의합니다.

#### template()
- 컴포넌트의 HTML 템플릿을 반환합니다.

#### attachEventListeners()
- 이벤트 리스너를 설정합니다.

#### render()
- 컴포넌트 렌더링 프로세스를 관리합니다.

### 코드

<details>
<summary>src/abstract/AbstractComponent.js</summary>

```js
export default class AbstractComponent {
  constructor($root, ...args) {
    this.$root = $root;
    this.props = args[0];

    this.render();
  }

  beforeMount() {}

  mount() {}

  template() {}

  attachEventListeners() {}

  render() {
    if (!this.$root) {
      return;
    }
    this.beforeMount();
    this.$root.innerHTML = this.template();
    this.mount();
    this.attachEventListeners();
  }
}

```

</details>

<details>
<summary>src/pages/LoginPage.js</summary>

```js
import router from "../router";
import { PROFILE_PAGE, USERNAME } from "../constants";

import userStore from "../store/userStore";
import AbstractComponent from "../abstract/AbstractComponent";

export default class LoginPage extends AbstractComponent {
  constructor($root) {
    super($root);
  }

  template() {
    return `
      <main class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 class="text-2xl font-bold text-center text-blue-600 mb-8">항해플러스</h1>
          <form id="login-form">
            <div class="mb-4">
              <input id="username" type="text" placeholder="이메일 또는 전화번호" class="w-full p-2 border rounded">
            </div>
            <div class="mb-6">
              <input id="password" type="password" placeholder="비밀번호" class="w-full p-2 border rounded">
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded font-bold">로그인</button>
          </form>
          <div class="mt-4 text-center">
            <a href="#" class="text-blue-600 text-sm">비밀번호를 잊으셨나요?</a>
          </div>
          <hr class="my-6">
          <div class="text-center">
            <button class="bg-green-500 text-white px-4 py-2 rounded font-bold">새 계정 만들기</button>
          </div>
        </div>
      </main>
    `;
  }

  attachEventListeners() {
    const $usernameInput = document.getElementById("username");

    // 로그인 시
    const $loginForm = document.getElementById("login-form");
    $loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      userStore.setState({ [USERNAME]: $usernameInput.value });

      router.push(PROFILE_PAGE);
    });
  }
}


```

</details>

## 전역 상태 관리
> 프레임워크 없이 순수 자바스크립트로 구현한 상태 관리 시스템입니다. Redux와 유사한 중앙 집중식 상태 관리와 Observer 패턴을 활용하여 반응형 상태 관리를 구현했습니다.

### 주요 기능
- 📦 Observer 패턴을 활용한 반응형 상태 관리
- 💾 LocalStorage를 활용한 영구 저장소 연동
- 🔄 구독 기반 상태 업데이트
- 🛡️ 상태 접근 제어와 유효성 검사
- 💡 의존성 없는 순수 구현

### 구현 특징
- Store: 중앙 집중식 상태 관리자
- Observer Pattern: 상태 변경 구독 및 알림
- Persistence Layer: LocalStorage 기반 영구 저장소
- Immutable Updates: 불변성을 지키는 상태 업데이트

## 상태 관리 API
> Store 클래스

#### constructor(initialState)
- 초기 상태로 스토어를 생성합니다.

#### initialState
- 초기 상태 객체

#### getState()
- 현재 상태를 반환합니다.

#### setState(newState)
- 상태를 업데이트하고 구독자들에게 알립니다.

#### newState
- 새로운 상태 객체

#### subscribe(listener)
- 상태 변경을 구독합니다.

#### listener
- 상태 변경 시 호출될 컴포넌트

#### clear()
- 상태를 초기화합니다.

### 코드

<details>
<summary>src/store/thinkStroe.js</summary>

```js
import { USERNAME } from "../constants";
import userStore from "./userStore";

const getRandomId = () => {
  return Math.round(Math.random() * 1000);
};

const initialState = () => {
  return [
    {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: "홍길동",
      ago: 5,
      think: "오늘 날씨가 정말 좋네요. 다들 좋은 하루 보내세요!",
    },
    {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: "김철수",
      ago: 15,
      think: "새로운 프로젝트를 시작했어요. 열심히 코딩 중입니다!",
    },
    {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: "이영희",
      ago: 30,
      think: "오늘 점심 메뉴 추천 받습니다. 뭐가 좋을까요?",
    },
    {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: "박민수",
      ago: 66,
      think: "주말에 등산 가실 분 계신가요? 함께 가요!",
    },
    {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: "정수연",
      ago: 120,
      think: "새로 나온 영화 재미있대요. 같이 보러 갈 사람?",
    },
  ];
};

class Store {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(think) {
    const newThink = {
      id: getRandomId(),
      imgUrl: "https://via.placeholder.com/40",
      name: userStore.getState()[USERNAME],
      ago: 5,
      think,
    };
    this.state = [newThink, ...this.getState()];

    this.listeners.forEach((listener) => listener.render());
  }

  clear() {
    this.setState(initialState());

    this.listeners.forEach((listener) => listener.render());
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }
}

const thinkStore = new Store(initialState());

export default thinkStore;

}

```

</details>

<details>
<summary>src/pages/HomePage.js</summary>

```js
import Footer from "../components/Footer";
import Header from "../components/Header";
import ThinkCard from "../components/ThinkCard";

import AbstractComponent from "../abstract/AbstractComponent";
import thinkStore from "../store/thinkStore";
import userStore from "../store/userStore";
import { LOGIN_PAGE, USERNAME } from "../constants";
import router from "../router";

export default class HomePage extends AbstractComponent {
  constructor(elementId) {
    super(elementId);
  }

  beforeMount() {
    this.userStore = userStore;

    this.thinkStore = thinkStore;
    thinkStore.subscribe(this);

    this.thinkCardTemplate = this.thinkStore.getState().map((think) => {
      return `<div id=think-${think.id}></div>`;
    });
  }

  mount() {
    const $header = document.getElementById("header");
    new Header($header);

    this.thinkStore.getState().forEach((think) => {
      const $thinkCard = document.getElementById(`think-${think.id}`);
      new ThinkCard($thinkCard, think);
    });

    const $footer = document.getElementById("footer");
    new Footer($footer);
  }

  template() {
    const isLogin = !!this.userStore.getState()[USERNAME];
    const textareaPlaceholder = isLogin
      ? "무슨 생각을 하고 계신가요?"
      : "로그인을 먼저 해주세요";
    const submitBtnColor = isLogin ? "bg-blue-600" : "bg-green-600";

    return `
      <div class="bg-gray-100 min-h-screen flex justify-center">
        <div class="max-w-md w-full">
        <div id="header"></div>

        <main class="p-4">
          <div class="mb-4 bg-white rounded-lg shadow p-4">
            <form id="think-form">
              <textarea 
                id="think" class="w-full p-2 border rounded" 
                placeholder="${textareaPlaceholder}"
                ${isLogin ? null : "disabled"}></textarea>
              <button 
                type="submit"
                class="mt-2 ${submitBtnColor} text-white px-4 py-2 rounded" 
              >${isLogin ? "게시" : "로그인하러 가기"}</button>
            </form>
          </div>

          <div class="space-y-4">
            ${this.thinkCardTemplate.map((template) => template).join("")}
          </div>
        </main>

        <footer id="footer"></footer>
      </div>
    `;
  }

  attachEventListeners() {
    const $thinkTextarea = document.getElementById("think");
    const $thinkForm = document.getElementById("think-form");

    $thinkForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isLogin = !!this.userStore.getState()[USERNAME];

      if (isLogin) {
        this.thinkStore.setState($thinkTextarea.value);
      } else {
        router.push(LOGIN_PAGE);
      }
    });
  }
}

```

</details>