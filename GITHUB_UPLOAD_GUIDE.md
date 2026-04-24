# 🚀 GitHub 업로드 가이드

## 📋 준비 완료 체크리스트

✅ README.md - 프로젝트 설명서  
✅ .gitignore - Git 제외 파일 설정  
✅ LICENSE - MIT 라이선스  
✅ package.json - 프로젝트 메타데이터 업데이트  

---

## 🔧 Git 초기 설정 (최초 1회)

```bash
# Git 사용자 정보 설정 (아직 안 했다면)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

---

## 📤 GitHub에 업로드하기

### 방법 1: 커맨드 라인 (추천)

#### 1단계: GitHub에서 새 저장소 생성
1. GitHub.com 접속
2. 우측 상단 `+` 클릭 → `New repository`
3. Repository name: `banguard` 입력
4. Public/Private 선택
5. **❌ README, .gitignore, License 체크 해제** (이미 생성됨)
6. `Create repository` 클릭

#### 2단계: 로컬에서 Git 초기화 및 업로드

```bash
# 프로젝트 폴더로 이동
cd /path/to/banguard

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Banguard v1.0.0"

# GitHub 저장소 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/banguard.git

# main 브랜치로 변경 (GitHub 기본 브랜치)
git branch -M main

# GitHub에 업로드
git push -u origin main
```

#### 3단계: GitHub에서 확인
브라우저에서 `https://github.com/YOUR_USERNAME/banguard` 접속하여 확인!

---

### 방법 2: GitHub Desktop 사용

#### 1단계: GitHub Desktop 설치
https://desktop.github.com/ 에서 다운로드 및 설치

#### 2단계: 저장소 추가
1. GitHub Desktop 실행
2. `File` → `Add Local Repository`
3. 프로젝트 폴더 선택
4. Git 저장소가 없다는 메시지가 나오면 `Create a repository` 클릭

#### 3단계: 커밋 및 푸시
1. 좌측 하단에서 Summary 입력: `Initial commit: Banguard v1.0.0`
2. `Commit to main` 클릭
3. 상단 `Publish repository` 클릭
4. 저장소 이름 확인 후 `Publish Repository` 클릭

---

## 🌐 배포하기 (선택사항)

### Vercel로 무료 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

또는 Vercel 웹사이트에서:
1. https://vercel.com 접속
2. GitHub 계정 연동
3. `Import Project` → 저장소 선택
4. Framework: `Vite` 선택
5. `Deploy` 클릭

### Netlify로 무료 배포

1. https://www.netlify.com 접속
2. `Add new site` → `Import an existing project`
3. GitHub 저장소 연결
4. Build command: `npm run build`
5. Publish directory: `dist`
6. `Deploy site` 클릭

---

## 📝 업데이트 후 재업로드

```bash
# 변경사항 확인
git status

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "Update: 변경 내용 설명"

# GitHub에 푸시
git push
```

---

## 🔐 .env 파일 주의사항

만약 API 키나 비밀 정보를 사용하는 경우:

1. `.env` 파일 생성 (이미 .gitignore에 포함됨)
2. `.env.example` 파일 생성하여 샘플 제공

```bash
# .env.example
VITE_API_KEY=your_api_key_here
VITE_BACKEND_URL=http://localhost:3000
```

**❌ 절대 .env 파일을 Git에 커밋하지 마세요!**

---

## 🆘 문제 해결

### "remote origin already exists" 에러
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/banguard.git
```

### "Permission denied" 에러
1. GitHub Personal Access Token 생성:
   - GitHub.com → Settings → Developer settings → Personal access tokens → Generate new token
   - `repo` 권한 선택
2. 토큰을 비밀번호로 사용

### 파일이 너무 큰 경우
```bash
# Git LFS 설치 (대용량 파일용)
git lfs install
git lfs track "*.pdf"
git add .gitattributes
```

---

## 📚 추가 리소스

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ 최종 체크리스트

- [ ] README.md 내용 확인 및 수정 (이메일 주소 등)
- [ ] .gitignore 파일 확인
- [ ] package.json의 저장소 URL 업데이트 (선택)
- [ ] node_modules 폴더가 .gitignore에 포함되어 있는지 확인
- [ ] Git 초기화 및 첫 커밋
- [ ] GitHub에 푸시
- [ ] GitHub에서 업로드 확인
- [ ] (선택) Vercel/Netlify에 배포

---

<div align="center">
  <p>🎉 성공적인 업로드를 기원합니다! 🎉</p>
</div>
