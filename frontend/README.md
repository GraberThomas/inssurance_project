# Frontend Application

## Overview
This project is the frontend component of a larger microservices architecture. It's built with React, TypeScript, and Bootstrap, providing a modern and responsive user interface for insurance cost prediction and management.

## Key Features

### 1. Insurance Cost Prediction
- Multi-step form for gathering client information
- Input validation and error handling
- Real-time prediction using machine learning models
- Customizable prediction parameters:
  - Personal information (name, age, sex)
  - Geographic location
  - Health metrics (BMI)
  - Lifestyle factors (smoking status)
  - Family composition (number of children)
- GDPR-compliant data saving options

### 2. Model Management
- View and select different prediction models
- Compare model performance metrics
  - R-squared (R²) values
  - Mean Absolute Error (MAE)
- Real-time model switching
- Model performance tracking

### 3. Prediction History
- Comprehensive history tracking
- Advanced filtering capabilities:
  - Model-based filtering
  - Demographic filters
  - Date-based filtering
  - Health metrics filtering
- Detailed prediction records
- Pagination and sorting options
- Export functionality for data analysis

## Dependencies
This frontend application is part of a larger system and requires the following services to function properly:
- `api` service
- `backend_persistence` service

## Prerequisites
- Node.js (LTS version recommended)
- npm
- Docker and Docker Compose (if running with the complete stack)

## Installation

### Local Development Setup
```
bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173` by default.

### Environment Variables
If you want run the app standalone, make sure to properly configure your environment variables before running the application.

sample:
```dotenv
VITE_API_MODEL_URL=http://localhost:8000
VITE_API_PERSISTANCE_URL=http://localhost:8001
VITE_MODEL_ROUTE=/models
VITE_MODEL_PREDICT_SUBROUTE=/predict
```

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm run lint`: Runs ESLint to check code quality
- `npm run preview`: Previews the production build locally
- `npm test`: Runs the test suite

## Technology Stack

- React 19.0.0
- TypeScript 5.7.2
- Bootstrap 5.3.5
- React Router DOM 7.5.1
- Axios 1.8.4
- Vite 6.3.1
- Jotai 2.12.3
- SASS

## Contributing
Please refer to the repository's CONTRIBUTING.md file for guidelines on how to contribute to this project.

## Important Notes
- This frontend is designed to work in conjunction with other microservices. Running it standalone will result in limited functionality.
- Always refer to the main repository's documentation for the complete setup instructions.
- Make sure all required services are running before starting the frontend application.
