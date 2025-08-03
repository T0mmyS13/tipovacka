# 🎯 Tipovačka - Sports Betting Tips Platform

A modern web application for sports betting tips and analysis, built with Next.js 15, TypeScript, and Prisma. The platform allows users to view expert betting tips, build betting tickets, and track their betting performance.

## 🚀 Features

- **📊 Expert Tips**: View curated sports betting tips with detailed analysis
- **🎫 Ticket Builder**: Create and manage betting tickets with multiple selections
- **👤 User Authentication**: Secure registration and login system
- **📈 Odds Tracking**: Real-time odds monitoring and movement tracking
- **🏆 Multiple Sports**: Support for various sports and leagues
- **📱 Responsive Design**: Mobile-first design with dark/light theme support
- **🔒 Admin Panel**: Administrative interface for tip management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Icons**: Lucide React
- **Themes**: next-themes for dark/light mode
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tipovacka
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
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/tipovacka"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Next.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
tipovacka/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── admin/         # Admin dashboard
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── ...config files
```

## 🎯 Key Components

### Core Features
- **TipsContainer**: Displays filtered betting tips
- **TicketBuilder**: Interactive betting slip builder
- **TipCard**: Individual tip display with analysis
- **Hero**: Landing page hero section
- **Navbar**: Navigation with authentication

### Database Models
- **User**: User accounts with roles (USER/ADMIN)
- **Tip**: Betting tips with odds, analysis, and tracking
- **Ticket**: User-created betting combinations
- **Comment**: User comments and feedback

## 🔐 Authentication

The app uses JWT-based authentication with the following endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

## 📊 API Endpoints

- `GET /api/tips` - Fetch betting tips
- `POST /api/tips` - Create new tip (admin)
- `GET /api/tickets` - User betting tickets
- `POST /api/tickets` - Create betting ticket

## 🎨 Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **next-themes** for dark/light mode switching
- **Lucide React** for consistent iconography

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the application: `npm start`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Issues & Support

For issues and support, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
