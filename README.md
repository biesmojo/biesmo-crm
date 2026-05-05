# Biesmo CRM

A modern customer relationship management system built with Next.js for managing client relationships and business operations.

**Live Demo:** https://biesmo-crm.vercel.app/

## Features

- 👥 **Customer Management** - Track and organize client information
- 🔐 **Secure Authentication** - NextAuth.js integration with password encryption
- 📊 **Data Persistence** - Prisma ORM with database support
- 🎨 **Modern UI** - Built with React and Tailwind CSS
- ⚡ **Performance** - Server-side rendering with Next.js 16
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 16.2.3
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** [Configure your database in `.env.local`]
- **Authentication:** [NextAuth.js](https://next-auth.js.org) 5.0
- **Form Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Security:** bcryptjs for password hashing
- **Deployment:** [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun
- A database (PostgreSQL, MySQL, or SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/biesmojo/biesmo-crm.git
   cd biesmo-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following in `.env.local`:
   ```env
   DATABASE_URL="your_database_connection_string"
   NEXTAUTH_SECRET="your_secret_key_for_auth"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server with webpack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
app/               - Next.js app directory (pages & layouts)
components/        - Reusable React components
lib/               - Utility functions and helpers
prisma/
  ├── schema.prisma - Database schema
  └── migrations/   - Database migrations
public/            - Static assets
.env.local         - Environment variables (local only)
```

### Making Changes

1. Edit files in `app/` or `components/` directories
2. Changes auto-reload in development mode
3. Build and test before deploying

## Deployment

This project is deployed on **Vercel** and automatically deploys on push to the main branch.

### Deploy on Vercel (First Time)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Set environment variables in Vercel dashboard
5. Click "Deploy"

### Environment Variables on Vercel

Set the following in your Vercel project settings:
- `DATABASE_URL` - Your production database connection
- `NEXTAUTH_SECRET` - A secure random string for authentication
- `NEXTAUTH_URL` - Your production domain (e.g., https://biesmo-crm.vercel.app)

See [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private. All rights reserved.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/biesmojo/biesmo-crm/issues) on GitHub.

---

**Built with ❤️ by Biesmo**
