#!/bin/bash

# TimeFlow Pro Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: netlify, vercel, cloudflare, all

set -e

PLATFORM=${1:-"all"}

echo "🚀 TimeFlow Pro Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}Checking dependencies...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependencies check passed${NC}"
}

# Build the application
build_app() {
    echo -e "${BLUE}Building TimeFlow Pro...${NC}"
    
    # Install dependencies
    npm ci
    
    # Run linting
    echo -e "${YELLOW}Running linter...${NC}"
    npm run lint
    
    # Run type checking
    echo -e "${YELLOW}Running type check...${NC}"
    npm run type-check
    
    # Build application
    echo -e "${YELLOW}Building application...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ Build completed successfully${NC}"
}

# Deploy to Netlify
deploy_netlify() {
    echo -e "${BLUE}Deploying to Netlify...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}Installing Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    # Check if site is linked
    if [ ! -f ".netlify/state.json" ]; then
        echo -e "${YELLOW}Site not linked. Please run 'netlify link' first${NC}"
        exit 1
    fi
    
    netlify deploy --prod --dir=dist
    echo -e "${GREEN}✅ Deployed to Netlify${NC}"
}

# Deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}Deploying to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    vercel --prod
    echo -e "${GREEN}✅ Deployed to Vercel${NC}"
}

# Deploy to Cloudflare Pages
deploy_cloudflare() {
    echo -e "${BLUE}Deploying to Cloudflare Pages...${NC}"
    
    if ! command -v wrangler &> /dev/null; then
        echo -e "${YELLOW}Installing Wrangler CLI...${NC}"
        npm install -g wrangler
    fi
    
    wrangler pages deploy dist
    echo -e "${GREEN}✅ Deployed to Cloudflare Pages${NC}"
}

# Main deployment logic
deploy() {
    check_dependencies
    build_app
    
    case $PLATFORM in
        "netlify")
            deploy_netlify
            ;;
        "vercel")
            deploy_vercel
            ;;
        "cloudflare")
            deploy_cloudflare
            ;;
        "all")
            echo -e "${YELLOW}Deploying to all platforms...${NC}"
            deploy_netlify
            deploy_vercel
            deploy_cloudflare
            ;;
        *)
            echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
            echo "Available platforms: netlify, vercel, cloudflare, all"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}"
    echo "🎉 Deployment completed successfully!"
    echo "=================================="
    echo -e "${NC}"
}

# Show usage if help is requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "TimeFlow Pro Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [platform]"
    echo ""
    echo "Platforms:"
    echo "  netlify     Deploy to Netlify only"
    echo "  vercel      Deploy to Vercel only" 
    echo "  cloudflare  Deploy to Cloudflare Pages only"
    echo "  all         Deploy to all platforms (default)"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh netlify    # Deploy to Netlify"
    echo "  ./deploy.sh all        # Deploy to all platforms"
    echo "  ./deploy.sh            # Deploy to all platforms (default)"
    exit 0
fi

# Run deployment
deploy