## Packages
framer-motion | Complex animations for scanning and results
recharts | Circular progress visualization for reality score
clsx | Utility for conditional class names
tailwind-merge | Utility for merging tailwind classes

## Notes
API endpoints:
- POST /api/analyze (multipart/form-data for files, or JSON for URLs if implemented that way - prompt implies upload)
- GET /api/scans (list recent)
- GET /api/scans/:id (details)
- POST /api/tts (text to speech)

Design:
- Dark mode default
- Glassmorphism
- Cyberpunk/Security aesthetic
