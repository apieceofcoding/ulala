#!/bin/bash

# Ulala 프론트엔드 배포 스크립트
# SSH를 통해 ulala 서버에 React Router 애플리케이션을 배포합니다.

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 설정
SSH_HOST="ulala"
REMOTE_DIR="/home/opc/ulala-web"  # 서버의 배포 디렉토리 (필요시 수정)
BUILD_DIR="build"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Ulala 프론트엔드 배포 시작${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. 환경 체크 및 빌드 준비
echo -e "\n${YELLOW}[1/3] 환경 확인 및 빌드 준비 중...${NC}"
if [ ! -f ".env.production" ]; then
    echo -e "${RED}에러: .env.production 파일이 없습니다.${NC}"
    exit 1
fi

if ! ssh -q $SSH_HOST exit; then
    echo -e "${RED}에러: SSH 연결에 실패했습니다. 'ssh $SSH_HOST' 명령이 작동하는지 확인해주세요.${NC}"
    exit 1
fi

npm install
echo -e "${GREEN}✓ 환경 확인 및 준비 완료${NC}"

# 2. 프로덕션 빌드
echo -e "\n${YELLOW}[2/3] 프로덕션 빌드 중...${NC}"
npm run build
echo -e "${GREEN}✓ 빌드 완료${NC}"

# 3. 서버에 배포
echo -e "\n${YELLOW}[3/3] 서버에 배포 중...${NC}"

# 빌드 파일 전송
echo "빌드 파일 전송 중..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env.development' \
  --exclude='.env.example' \
  $BUILD_DIR/ $SSH_HOST:$REMOTE_DIR/

# .env.production 파일을 .env로 복사하여 전송
echo ".env.production 파일 전송 중..."
scp .env.production $SSH_HOST:$REMOTE_DIR/.env

echo -e "${GREEN}✓ 배포 완료${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}배포가 성공적으로 완료되었습니다!${NC}"
echo -e "${GREEN}========================================${NC}"
