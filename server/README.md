# IBL Ecommerce Node.js Server Setup

## Prerequisites
- Node.js and npm installed
- MySQL installed (using MySQL Workbench recommended)

## Installation Steps

1. **Download the project**  
   Extract the attached ZIP file.

2. **Install Node Modules**
   ```bash
   npm install
   ```

3. **Run the Server**
   ```bash
   npm run dev
   ```

4. **Import Database**
   - Open MySQL Workbench
   - Import the file `IBL Ecommerce.sql`

5. **Configure Environment Variables (.env file in root folder)**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_PASSWORD
   DB_NAME=ecommerce_app
   ```

6. **Done! Your server is running on http://localhost:3000**

---

If any issue occurs, check your database connection or missing dependencies.
