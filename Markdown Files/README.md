# TYBCA SEM-6 Advanced Web Development Materials

This repository provides structured, self-contained learning materials aligned with the syllabus.

## File Structure

- `UNIT-1` ... `UNIT-4`: Unit-wise topic markdown files
- `assets`: Mermaid diagrams and supporting assets
- `code-samples`: Standalone example files

## How to Use

- Start with each unit `INDEX.md` and follow topic files in order.
- Read objectives, then study key concepts and definitions.
- Execute code examples in a browser or Node.js (as applicable).
- Use lab tips and exercises to reinforce learning.

## Prerequisites

- Basic programming knowledge (JavaScript/TypeScript)
- Node.js v18+ recommended
- Modern browser for HTML/CSS/JS examples

## Units Overview

- Unit 1: Fundamentals of Angular (v17) for Single Page Applications
- Unit 2: Introduction to Express.js and Server-Side Basics with Node.js
- Unit 3: Building Web App Components and Backend Integration
- Unit 4: Firebase and React Integration

## Course Syllabus

### Unit 1: Fundamentals of Angular (v17) for Single Page Applications

- 1.1 Angular Recap & Project Setup
    - 1.1.1 Brief Recap of Angular 17 core concepts: Components, Services, Routing
    - 1.1.2 Setting up a scalable Angular project using Angular CLI with Standalone Components
    - 1.1.3 Folder structure and module organization for large projects
- 1.2 Advanced Routing & State Handling
    - 1.2.1 Implementing Lazy Loading with Feature Modules
    - 1.2.2 Route Guards: CanActivate, CanDeactivate for securing routes
    - 1.2.3 Route Resolvers for preloading data
    - 1.2.4 Introduction to advanced state handling using RxJS Subjects and Behavior Subjects

- 1.3 Reactive Forms in Real Applications
    - 1.3.1 Dynamic form generation using FormArray
    - 1.3.2 Custom Validators and Asynchronous Validation
    - 1.3.3 Centralized error handling and displaying validation messages
    - 1.3.4 Submitting forms to APIs and form state management
- 1.4 Building Reusable UI Components & Design Patterns
    - 1.4.1 Creating reusable card, modal, and alert components
    - 1.4.2 Component interaction with RxJS and Shared Services
    - 1.4.3 Use of ng-template, ng-container, ng-content for structural flexibility
    - 1.4.4 Smart vs Dumb Components: Best practices
- 1.5 Application Deployment & Performance Optimization
    - 1.5.1 Angular build process, environments, and optimization flags
    - 1.5.2 Deploying Angular applications using Firebase Hosting
    - 1.5.3 Performance tuning: trackBy, OnPush change detection, lazy loading routes/components

### Unit 2: Introduction to Express.js and Server-Side Basics with Node.js

- 2.1 Introduction to Node.js and Express.js
    - 2.1.1 Installing Node.js (v20+) and setting up Express server
    - 2.1.2 Creating a RESTful backend using Express.js
    - 2.1.3 Introduction to nodemon and project structuring
- 2.2 Handling Routes and HTTP Methods
    - 2.2.1 Defining routes using GET, POST, PUT, DELETE
    - 2.2.2 Sending responses and working with route/query parameters
    - 2.2.3 Connecting routes to controller logic
- 2.3 Middleware and API Basics
    - 2.3.1 Understanding middleware in Express
    - 2.3.2 Using built-in and custom middleware (e.g., body-parser, static files)
    - 2.3.3 Introduction to CORS and environment variables


### Unit 3: Building Web App Components and Backend Integration

- 3.1 Working with Forms and APIs
    - 3.1.1 Handling form submissions in Express
    - 3.1.2 Sending JSON responses and extracting request data
    - 3.1.3 Connecting Angular forms to Express APIs
- 3.2 Organizing Code with Models and Controllers
    - 3.2.1 Structuring backend with models, services, and controllers
    - 3.2.2 Creating data models for users/products using MongoDB (Mongoose)
    - 3.2.3 Basic CRUD operations using Express and MongoDB
- 3.3 Authentication and Security Basics
    - 3.3.1 Introduction to Firebase Authentication (Email & Password)
    - 3.3.2 Adding user registration and login to Angular frontend
    - 3.3.3 Securing backend routes with Firebase Admin SDK and JWT

### Unit 4: Firebase and React Integration

- 4.1 Firebase Firestore and Realtime Database
    - 4.1.1 Setting up Firebase project and Firestore database
    - 4.1.2 Performing basic CRUD operations on Firestore (add, read, update, delete)
    - 4.1.3 Structuring collections and subcollections
- 4.2 Connecting Firebase with Angular and Express
    - 4.2.1 Integrating Firebase SDK in Angular to fetch/store data
    - 4.2.2 Connecting Firebase Admin SDK in Express for backend access
    - 4.2.3 Basic deployment using Firebase Hosting (for frontend)
- 4.3 Overview of React Frontend for Full Stack Developers
    - 4.3.1 Setting up a basic React app using Vite or Create React App
    - 4.3.2 Understanding JSX, functional components, and hooks (useState, useEffect)
    - 4.3.3 Integrating Firebase in a React app for data access and authentication
