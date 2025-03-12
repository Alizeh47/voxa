---
description: Apply these rules when creating the project
globs:
alwaysApply: true
---
## Project Overview

*   **Type:** cursor_project_rules
*   **Description:** Voxa is a real-time messaging web app designed for businesses, digital marketers, and content creators to enhance communication, streamline collaboration, and improve brand engagement. It provides instant messaging, media sharing, voice/video calling, and actionable insights, all wrapped in a clean, modern, and minimalistic interface.
*   **Primary Goal:** Build a secure, scalable, and feature-rich communication platform that delivers seamless real-time messaging and collaboration, including advanced file sharing, voice/video integrations via third-party services, and intelligent analytics to empower user engagement and business growth.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   **React Router 6:** Utilize a structure based on `src/routes/` to define and manage client-side routing. Components are organized by feature with nested routes where appropriate.
    *   Example: "React Router 6" → `src/routes/chatRoutes.js` pattern for grouping related chat components.

### Core Directories

*   **Versioned Structure:**

    *   **src/components:** Contains reusable React components with version-specific implementations following the latest best practices.
    *   **src/routes:** Hosts route definitions and page components, adhering to React Router 6 conventions.
    *   **server/api:** Contains Express route handlers and middleware for API endpoints tied closely with real-time features.

### Key Files

*   **Stack-Versioned Patterns:**

    *   **src/App.js:** Main entry point for the React application, integrating routing and global state management.
    *   **server/index.js:** Initializes the Node.js/Express server with Socket.io for real-time communication.
    *   **src/routes/chatRoutes.js:** Defines chat-specific routes and lazy-loads related components for an optimized user experience.

## Tech Stack Rules

*   **Version Enforcement:**

    *   **react@latest:** Enforce component-based architecture using functional components and hooks.
    *   **nodejs@current:** Implement asynchronous non-blocking operations and maintain code modularity.
    *   **express@latest:** Use middleware for security, error handling, and route organization.
    *   **socket.io@latest:** Ensure robust real-time communication with proper event handling and error recovery.
    *   **mongodb@latest:** Use schema validation, indexes, and secure connection practices.
    *   **amazon s3@latest:** Follow best practices for bucket configuration and secure file storage.
    *   **oauth2@latest:** Implement secure authentication flows with token expiration and refresh mechanisms.
    *   **twilio@latest:** Integrate third-party voice/video APIs with secure storage of API keys and proper webhook usage.
    *   **google_drive_api@latest:** Ensure secure OAuth scopes and handle rate limiting.
    *   **dropbox_api@latest:** Validate tokens and adhere to SDK guidelines for file integration.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Voxa is a real-time messaging web application built specifically for businesses, digital marketers, and content creators." – This mandates a secure, high-performance, and multi-feature platform that supports media sharing, real-time chat, and third-party integrations (Twilio/Agora for calls, Google Drive and Dropbox for file management).

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: React-based chat view in `src/routes/chatRoutes.js` uses Socket.io for real-time messaging. Voice and video call components integrate Twilio APIs, while file sharing seamlessly connects to Amazon S3, Google Drive, and Dropbox services.

## Best Practices

*   **react**

    *   Utilize a component-based architecture with functional components and hooks.
    *   Maintain state immutability and leverage context or state management libraries for global state.
    *   Optimize performance through code splitting and lazy-loading of routes.

*   **nodejs**

    *   Write asynchronous, non-blocking code with proper error handling.
    *   Keep server-side logic modular and segregated via middleware and service layers.
    *   Regularly update dependencies and monitor for security vulnerabilities.

*   **express**

    *   Structure APIs following RESTful conventions and use middleware for authentication and error handling.
    *   Validate incoming requests rigorously to prevent security issues.
    *   Organize routes logically and document endpoints.

*   **socket.io**

    *   Handle connection events gracefully and implement reconnection strategies.
    *   Use namespaces and rooms for organizing real-time events and scaling efficiently.
    *   Ensure proper error and disconnect handling to maintain a robust communication channel.

*   **mongodb**

    *   Design schemas with indexing and data normalization where applicable.
    *   Secure database connections and use environment variables for sensitive information.
    *   Regularly backup data and monitor performance metrics.

*   **amazon s3**

    *   Enforce bucket policies and proper access controls to secure file storage.
    *   Use versioning and logging to maintain data integrity.
    *   Optimize file uploads/downloads for performance and efficiency.

*   **oauth2**

    *   Implement secure token handling with proper expiration and refresh protocols.
    *   Follow industry best practices for secure authentication flows.
    *   Ensure user data and permissions are strictly controlled during OAuth transactions.

*   **twilio**

    *   Secure API keys and implement robust error handling for call services.
    *   Use reliable webhooks to monitor call statuses and feedback.
    *   Integrate call logs and analytics to monitor performance and usage trends.

*   **google_drive_api**

    *   Ensure proper OAuth scopes and manage API rate limiting effectively.
    *   Secure user data during file transfers and access operations.
    *   Follow Google’s best practices for integration and error management.

*   **dropbox_api**

    *   Validate tokens and restrict permissions to necessary scopes.
    *   Handle API errors and rate limits gracefully.
    *   Adhere to Dropbox SDK guidelines for secure file access and integration.

## Rules

*   Derive folder/file patterns directly from tech stack documented versions and best practices.
*   For React projects using React Router 6: Enforce a `src/routes/` directory structure for all route definitions.
*   Maintain a clear separation between frontend (React) and backend (Node.js/Express) components.
*   Mirror the logic for real-time communication by isolating Socket.io integration within dedicated modules.
*   Ensure no mixing of routing patterns (e.g., avoid combining Next.js conventions with React Router patterns) to maintain consistency and clarity.
