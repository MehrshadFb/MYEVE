# EECS4413 Project - Full Stack Web Application
Guide by Hamzah Alhafi

A full-stack web application built with React (frontend) and Node.js/Express (backend) with MySQL database.

### Prerequisites

- **Node.js** (v16 or higher)
- **Docker** and **Docker Compose** (for MySQL database)
- **Git**

## Instructions

### 1. Database Setup

1. **Start MySQL Database:**
   ```bash
   # From the project root directory
   docker-compose up -d mysql
   ```

2. **Verify Database Setup:**
   ```bash
   # Check if the container is running
   docker ps
   
   # Check database logs
   docker logs eecs4413-mysql
   ```

   **Login**
   ```
   docker exec -it eecs4413-mysql mysql -u eecsuser -p
   ```
   Enter the password (eecspassword123)

### 2. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/MehrshadFb/eecs4413.git
cd eecs4413

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install


### 3. Environment Configuration

**Important:** You need to create two `.env` files for the application to work properly.

#### Create Root `.env` File

Create a `.env` file in the project root directory (`eecs4413/.env`) with the following content:

```env
DB_NAME=eecs4413
DB_USER=eecsuser
DB_PASSWORD=eecspassword123
```

#### Create Backend `.env` File

Create a `.env` file in the backend directory (`eecs4413/backend/.env`) with the following content:

```env
DB_NAME=eecs4413
DB_USER=eecsuser
DB_PASSWORD=eecspassword123
DB_HOST=localhost
DB_PORT=3307
AWS_ACCESS_KEY_ID=AKIAQA7VRQMSPOOJ7ICK
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-2
AWS_BUCKET_NAME=eecs4413-mehrshad
```

### 3. Start the Application

#### Start Backend Server

```bash
# From the backend directory
cd backend
npm run dev
```

The backend server will start on `http://localhost:3001`

#### Start Frontend Application

```bash
# From the frontend directory (in a new terminal)
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:5173`

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database**: MySQL on localhost:3307

## Available Scripts

### Backend Scripts
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Database Management


Start it with:
```bash
docker-compose up -d
```

Access phpMyAdmin at: http://localhost:8080

### Database Commands

```bash
# Start database
docker-compose up -d mysql

# Stop database
docker-compose down

# View database logs
docker-compose logs mysql

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d mysql
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `backend/server.js`
   - Frontend: Change port in `frontend/vite.config.js`
   - Database: Change port in `docker-compose.yml`

2. **Database Connection Issues**
   - Ensure Docker is running
   - Check if MySQL container is started: `docker ps`
   - Verify both `.env` files exist:
     - Root directory: `eecs4413/.env` (for Docker Compose)
     - Backend directory: `eecs4413/backend/.env` (for backend API)
   - Ensure database user exists: `docker exec -it eecs4413-mysql mysql -u root -prootpassword123 -e "SELECT User FROM mysql.user WHERE User='appuser';"`

3. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 3001
   - Check CORS configuration in `backend/app.js`
   - Verify API_BASE_URL in `frontend/src/services/api.js`
  
4. **Internal server error**
   - Sometimes when adding a vehicle it gives internal server error.
   - This can happen due to a mismatch of the database tables. 
   - Change the False to true in `await syncDatabase(false);` located in `Backend/server.js`


### Development Tips

- Use `npm run dev` for both frontend and backend during development
- The backend will automatically restart when you make changes (nodemon)
- The frontend will hot-reload when you make changes (Vite)
- Check the browser console and terminal for error messages
