# Affiliate Postback System

## Overview

This project is an affiliate marketing postback system designed to track clicks and conversions accurately via server-to-server notifications (postbacks). The backend is built with Node.js and PostgreSQL, and the frontend is a simple dashboard to view tracked data.

A **postback** is an automated server-to-server callback used in affiliate marketing to confirm when conversions happen, providing reliable tracking beyond browser limitations.

## Features

- Record affiliate clicks via API.
- Record conversions via postback API.
- Retrieve all clicks and conversions via REST endpoints.
- Frontend dashboard to visualize click and conversion data.
- Uses PostgreSQL for data persistence.

## Prerequisites

- Node.js and npm
- PostgreSQL installed and running
- Python 3 (optional) or VSCode Live Server for frontend

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   cd affiliate-postback-backend



2. Install dependencies:

npm install

3. Update your PostgreSQL connection details (user, password, database) inside `index.js`.

4. Start the backend server:

node index.js

### Database Setup

1. Create a PostgreSQL database named `affiliate_system`.

2. Create the following tables:

CREATE TABLE clicks (
id SERIAL PRIMARY KEY,
affiliate_id VARCHAR(255),
campaign_id VARCHAR(255),
click_id VARCHAR(255),
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE conversions (
id SERIAL PRIMARY KEY,
click_id VARCHAR(255),
amount NUMERIC,
currency VARCHAR(10),
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Frontend Setup

1. Navigate to the frontend folder:


cd ../frontend

2. Start a simple HTTP server (Python 3):


python -m http.server 8080

3. Open your browser and go to:


http://localhost:8080

## Example API Requests

- Track a Click:


GET http://localhost:3000/click?affiliate_id=1&campaign_id=10&click_id=abc123

- Track a Conversion (Postback):


GET http://localhost:3000/postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD

- Get all Clicks:


GET http://localhost:3000/api/clicks

- Get all Conversions:

GET http://localhost:3000/api/conversions

## Contribution

Feel free to fork this repository and open pull requests for improvements and new features.

## License

Specify your license here (e.g., MIT License).

---

*Last updated: August 2025*

