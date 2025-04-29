# 1. node.js WAS
FROM node:20 AS build
WORKDIR /app

# 2. 파일 컨테이너로 복사
COPY . .

# 3. 패키지 설치 및 빌드 실행
RUN yarn install
RUN yarn build

# 4. React 앱 실행

CMD ["yarn", "dev"]