# Inventory Management System

A Next.js application for managing product inventory.

## Prerequisites

- **Node.js**

  ```bash
  # macOS
  brew install node

  # or download from https://nodejs.org/
  ```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   ```bash
   npm run db:reset

   ```

3. Set up the database:

   ```bash
   npm run db:push
   ```

4. Seed the database:

   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and re-seed (drops all data)
