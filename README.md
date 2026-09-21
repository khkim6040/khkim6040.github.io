# gwanho.com

개인 사이트. [Academic Pages](https://github.com/academicpages/academicpages.github.io) 템플릿에서 출발했습니다.

## 로컬 실행

```bash
docker compose up
# 또는
bundle exec jekyll serve -l -H localhost
```

`localhost:4000`에서 확인합니다.

## JS 빌드

`assets/js/_main.js`를 수정한 뒤 `npm run build:js`로 `assets/js/main.min.js`를 다시 생성합니다.
