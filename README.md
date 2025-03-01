# ACL Recovery Companion

A comprehensive web application designed to support individuals through their ACL recovery journey, providing progress tracking, exercise guidance, community support, and educational resources.

## Features

- **Recovery Journey Planner**: Personalized recovery plan and timeline
- **Progress Tracker**: Log and visualize your rehabilitation milestones
- **Exercise Library**: Curated collection of recommended exercises
- **Community Support**: Connect with others on similar recovery journeys
- **Resource Center**: Educational materials and recovery tips

## MongoDB Atlas Setup

### 1. Create a MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account
2. Verify your email address to activate your account

### 2. Set Up a Cluster

1. Click "Build a Database" and choose the free tier option
2. Select your preferred cloud provider and region (closest to your users)
3. Click "Create Cluster" (this may take a few minutes)

### 3. Database Configuration

1. In the Security menu, click "Database Access" and add a new database user
   - Create a username and secure password
   - Set appropriate permissions (read/write access)
2. In the Security menu, click "Network Access"
   - Add your IP address or set to allow access from anywhere for development (0.0.0.0/0)
3. Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Note your connection string for later use

### 4. Set Up App Services (formerly Realm)

1. Click "App Services" in the top navigation
2. Create a new app (use a descriptive name like "acl-recovery-app")
3. Connect it to your cluster
4. Enable authentication methods (Email/Password) in the Authentication tab
5. Note your App ID for configuration

## Connecting the App to MongoDB Atlas

1. Open the environment files in your project:
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

2. Replace the placeholder values with your MongoDB Atlas information:
   ```typescript
   mongodb: {
     appId: 'your-app-id', // Replace with your MongoDB App ID
     region: 'us-east-1'    // Replace with your app region
   }
   ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building for Production

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory with production optimizations.

## Important Notes

- The application uses MongoDB Realm Web SDK for authentication and data access
- For production deployment, ensure all MongoDB Atlas IP whitelist settings are properly configured
- Keep your MongoDB Atlas credentials secure and never commit them to version control

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [MongoDB Realm Web SDK Documentation](https://www.mongodb.com/docs/realm/web/)
