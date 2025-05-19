# Node.js 18버전 기반 이미지 사용
FROM node:18

# 앱 디렉토리 생성
WORKDIR /app

# 종속성 설치를 위한 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 앱 소스 전체 복사
COPY . .

# 앱이 사용할 포트 오픈
EXPOSE 3000

# 서버 실행
CMD ["node", "server.js"]
