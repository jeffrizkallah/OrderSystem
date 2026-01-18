# Quick Start Guide

Get your Restaurant Order System up and running in minutes!

## For Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
```

Get your Neon database URL from: https://console.neon.tech

### 3. Initialize Database
```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your application!

## First Time Using the System

### Step 1: Add Suppliers
1. Go to "Suppliers" in the navigation
2. Click "Add Supplier"
3. Fill in supplier details (name is required, others optional)
4. Save

### Step 2: Add Ingredients
1. Go to "Ingredients"
2. Click "Add Ingredient"
3. Fill in:
   - Name (e.g., "Tomatoes")
   - Unit (e.g., "kg", "lbs", "box")
   - Default Price
   - Category (select from dropdown)
   - Supplier (select from dropdown)
4. Save

Repeat for all your ingredients!

### Step 3: Create Your First Order
1. Go to "Orders" → "New Order"
2. Enter quantities for ingredients you need
3. Prices are pre-filled but can be adjusted
4. Add notes if needed
5. Click "Save as Draft" or "Submit Order"

### Step 4: (Optional) Create Templates
1. Go to "Templates" → "New Template"
2. Give it a name (e.g., "Monday Order")
3. Set default quantities
4. Save

Now you can quickly load this template when creating orders!

## Deployment to Production

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Vercel.

## Tips for Daily Use

### Quick Order Creation
- Use templates for recurring orders
- Copy quantities from a previous similar order
- Keep ingredient prices updated in the ingredient manager

### Order Management
- Mark orders as "Submitted" when sent to suppliers
- Mark as "Received" when ingredients arrive
- Keep draft orders for planning future purchases

### Tracking Spending
- Check the dashboard for weekly/monthly totals
- See which ingredients you order most frequently
- Use this data to negotiate better prices with suppliers

## Troubleshooting

### Can't connect to database
- Check your `.env` file has the correct `DATABASE_URL`
- Verify your Neon database is active
- Make sure you ran `npx prisma generate`

### Changes not showing up
- For development: The page should auto-refresh
- If not, refresh your browser (Ctrl+R or Cmd+R)

### Build errors
- Make sure all dependencies are installed: `npm install`
- Delete `.next` folder and rebuild: `npm run build`

## Need Help?

- Check [README.md](./README.md) for full documentation
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help

## Features Overview

✅ **Suppliers** - Manage supplier contacts and information
✅ **Ingredients** - Organize by category with pricing
✅ **Orders** - Create, track, and manage orders
✅ **Templates** - Save time with reusable order templates
✅ **Dashboard** - Track spending and analyze trends
✅ **Responsive** - Works on phone, tablet, and desktop

---

Happy ordering! 🍽️
