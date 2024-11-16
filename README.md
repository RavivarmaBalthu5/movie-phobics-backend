# Movie-Phobics Backend

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node Version](https://img.shields.io/badge/node-20.x-blue)

The backend API service for **Movie-Phobics**, an application designed to provide tailored movie information based on user preferences. This backend serves as an API provider for the Movie-Phobics UI.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Contributing](#contributing)

## Features

- Fetches and serves movie data tailored to user preferences.
- Optimized caching with `node-cache` for faster responses.
- MongoDB integration for persistent data storage.
- Hosted via Netlify Functions for scalable serverless deployment.
- Uses `axios` for HTTP requests to external APIs.
- Modular structure with utility functions for data manipulation using `lodash`.

## Requirements

- **Node.js** v20.x
- **MongoDB** for data persistence
- **Netlify CLI** for local testing and serverless deployment

## Installation

Follow these steps to set up and run the Movie-Phobics Backend on your local machine.

### Prerequisites

- **Node.js** v20.x or higher
- **MongoDB** (locally or through a service like MongoDB Atlas)
- **Netlify CLI** for local testing and deployment

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone git@github.com:RavivarmaBalthu5/movie-phobics-backend.git
cd movie-phobics-backend
```

### 2. Install Dependencies

Use npm to install all project dependencies:

```bash
npm install
```

### 3.Start Netlify Dev Server

The backend is designed to run as serverless functions on Netlify. Use the Netlify CLI to start the local server:

```bash
netlify dev
```

This will start the server at http://localhost:8888, where the serverless function environment will be emulated locally.

### 4. Access the API Locally

You can now access the backend endpoints on http://localhost:8888/.netlify/functions/fetchMovieData.

Example request:

```bash
curl "http://localhost:8888/.netlify/functions/fetchMovieData?now_playing_current_page=1"
```

Your Movie-Phobics backend should now be up and running locally. You can test and modify it as needed!

## Dependencies

- **axios** - For handling HTTP requests to external APIs.
- **lodash** - Utility functions for data manipulation.
- **mongodb** - MongoDB Node.js driver for database interactions.
- **netlify-cli** - CLI for deploying and testing Netlify functions.
- **node-cache** - Provides in-memory caching to improve data retrieval performance.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.

## Reporting Bugs

To report a bug, [open an issue on GitHub](https://github.com/RavivarmaBalthu5/movie-phobics-backend/issues).

## Request Features

To request a feature, please [open a feature request](https://github.com/RavivarmaBalthu5/movie-phobics-backend/issues).
