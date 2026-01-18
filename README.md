# Restaurant Ingredient Order System

A modern web application for managing daily ingredient orders for restaurants, built with Next.js and deployed on Vercel with Neon PostgreSQL.

## Features

- **Supplier Management**: Add and manage supplier information with contact details
- **Ingredient Management**: Organize ingredients by category with pricing and supplier assignment
- **Order Creation**: Create daily orders with real-time cost calculations
- **Order Templates**: Save frequently used orders as templates for quick ordering
- **Order History**: Track all orders with status management (draft, submitted, received)
- **Dashboard Analytics**: View spending trends and most-ordered ingredients
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend/Backend**: Next.js 15 with App Router and Server Actions
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database account (free tier available at https://neon.tech)
- A Vercel account (free tier available at https://vercel.com)

### Local Development

1. **Clone the repository** (or you're already in the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your database**:
   - Create a new project on [Neon](https://neon.tech)
   - Copy your database connection string
   - Create a `.env` file in the root directory:
     ```
     DATABASE_URL="your-neon-connection-string-here"
     ```

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:3000`

## Deployment to Vercel

### Step 1: Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it should look like: `postgresql://user:password@host/database`)

### Step 2: Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "Add New Project" and import your repository

4. Configure your project:
   - **Framework Preset**: Next.js
   - **Build Command**: Leave as default (`next build`)
   - **Install Command**: Leave as default (`npm install`)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add `DATABASE_URL` with your Neon connection string
   - Make sure it's available for Production, Preview, and Development

6. Click "Deploy"

### Step 3: Run Database Migrations

After your first deployment:

1. In your Vercel project dashboard, go to the "Settings" tab
2. Click "Environment Variables"
3. Verify your `DATABASE_URL` is set correctly
4. In your local terminal, run:
   ```bash
   npx prisma migrate deploy
   ```
   Or set up a post-build command in your `package.json`:
   ```json
   "scripts": {
     "build": "prisma generate && prisma migrate deploy && next build"
   }
   ```

Your application should now be live!

## Usage Guide

### 1. First-Time Setup

1. **Add Suppliers**: Start by adding your ingredient suppliers with their contact information
2. **Add Ingredients**: Add ingredients and assign them to suppliers and categories
3. **Create Templates** (Optional): Set up order templates for recurring orders

### 2. Daily Ordering

1. Go to "Orders" → "New Order"
2. Either load a template or manually select quantities for each ingredient
3. Adjust prices if needed (default prices are pre-filled)
4. Add notes if necessary
5. Save as draft or submit the order

### 3. Order Management

- View all orders in the "Orders" page
- Click on any order to view details
- Update order status (Draft → Submitted → Received)
- Delete orders if needed

### 4. Dashboard

- Monitor weekly and monthly spending
- View most-ordered ingredients
- Access recent orders quickly

## Database Schema

The application uses the following main tables:

- **Suppliers**: Supplier information and contact details
- **Ingredients**: Ingredient catalog with pricing and categories
- **Orders**: Order records with status and totals
- **OrderItems**: Individual items in each order
- **OrderTemplates**: Saved order templates
- **TemplateItems**: Items in each template

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx            # Dashboard with analytics
│   ├── orders/             # Order management pages
│   ├── ingredients/        # Ingredient management
│   ├── suppliers/          # Supplier management
│   └── templates/          # Order templates
├── components/             # Reusable React components
├── lib/
│   ├── prisma.ts          # Prisma client setup
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Prisma Documentation](https://www.prisma.io/docs)
- Check the [Neon Documentation](https://neon.tech/docs)

## License

This project is open source and available under the MIT License.
