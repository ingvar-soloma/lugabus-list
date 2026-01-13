# LugaBus.ua — Public Oversight Platform

LugaBus.ua is an innovative web application for monitoring the political positions of public figures in Ukraine. The platform allows citizens to track the statements and actions of politicians, bloggers, and celebrities regarding the war and the sovereignty of Ukraine.

## 🚀 Technology Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Containerization:** Docker, Docker Compose

## 🛠 Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development without Docker)

## 📦 Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ingvar-soloma/lugabus-list.git
    cd lugabus.ua
    ```

2.  **Create a `.env` file** from the `.env.example` at the root of the project and fill in the required environment variables.

3.  **Run the application using Docker Compose:**
    ```bash
    docker-compose up --build
    ```

    - The frontend will be available at `http://localhost:3000`.
    - The backend will be available at `http://localhost:8080`.
    - The PostgreSQL database will be available at `localhost:5432`.

## 🏗 Project Structure

- `backend/`: Contains the Node.js backend application.
- `frontend/`: Contains the React frontend application.
- `docker-compose.yml`: Defines the services, networks, and volumes for the application.
- `DEPLOYMENT.md`: Contains instructions for deploying the application to a production environment.

## 🛡 Mission

We believe in transparency and accountability. Our goal is to create an indelible digital history of the actions of everyone who influences public opinion in Ukraine. The platform guarantees the anonymity of users who offer evidence and the openness of information sources.

**Glory to Ukraine! 🇺🇦**
