# Production Environment Variables Required for EasyPanel

## Core Configuration
- `PORT=3006` - Must match Dockerfile EXPOSE and NODE_ENV port
- `NODE_ENV=production` - Ensures production optimizations

## Security & Authentication
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL=https://yourdomain.com` - Base URL of live application
- `FIREBASE_CONFIG` - Firebase Admin SDK JSON credentials

## Services Integration
- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Email service API key
- `WEASYPRINT_PATH=/usr/bin/weasyprint` - PDF renderer path in container

## Domain Configuration  
- `NEXT_PUBLIC_API_BASE=https://yourdomain.com/api`
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

## File Storage
- `PDF_SAVE_DIR=/app/pdf-storage` - Absolute path in container
- `FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com`
