# Security Roadmap & Best Practices

## Completed Hardening

We have applied the following security measures to the project:

### 1. Dependency Hygiene

- **Action**: Added `express-rate-limit` to `package.json`.
- **Reason**: Protects the application from brute-force attacks and Denial of Service (DoS) by limiting the number of requests an IP can make in a given timeframe.

### 2. Container Security (Dockerfile)

- **Action**: Implemented multi-stage builds.
- **Action**: Added `dumb-init` as the entrypoint.
- **Reason**: Ensures proper signal handling (SIGTERM/SIGINT) so the Node.js process shuts down gracefully without zombie processes.
- **Action**: Configured the container to run as a non-root user (`USER node`).
- **Reason**: Prevents potential privilege escalation attacks. If an attacker compromises the application, they are limited to the `node` user's permissions, not `root`.

### 3. Infrastructure Security (docker-compose.yml)

- **Action**: Removed external port exposure (`5432`) for the PostgreSQL database.
- **Reason**: The database should only be accessible by the backend service within the internal Docker network, reducing the attack surface.
- **Action**: Replaced hardcoded passwords with environment variables (`${DB_PASSWORD}`, etc.).
- **Reason**: Secrets should never be committed to version control.
- **Action**: Added `depends_on` with `condition: service_healthy` for the backend.
- **Reason**: Ensures the backend only starts when the database is fully ready to accept connections.

## Security Roadmap: Future Advices

### Short-term Actions

1.  **Environment Variables**:
    - Create a `.env` file (based on `.env.example`) on the server. **Do not commit it**.
    - Generate strong, random passwords for `DB_PASSWORD` and `JWT_SECRET`.
2.  **CORS Configuration**:
    - Restrict `CORS_ORIGIN` to the specific frontend domain in production, rather than `*`.
3.  **Security Headers**:
    - Review `helmet` configuration. Ensure `Content-Security-Policy` (CSP) is configured correctly for your frontend needs.

### Mid-term Goal

1.  **Vulnerability Scanning**:
    - Integrate `npm audit` or tools like **Snyk** into your CI/CD pipeline to catch vulnerable dependencies automatically.
    - Use Docker image scanning (e.g., `trivy`) to find vulnerabilities in the base OS image.
2.  **Secrets Management**:
    - Consider using Docker Secrets or a dedicated manager like HashiCorp Vault for handling production credentials instead of plain environment variables.
3.  **Logging & Monitoring**:
    - Ensure sensitive data (passwords, tokens) is stripped from logs.
    - Set up alerting for the rate limiter. If an IP hits the limit frequently, it might be an attack.

### Long-term Goals

1.  **API Security**:
    - Implement strict input validation using `zod` (already in dependencies, ensure it's used for ALL inputs).
    - Consider implementing OAuth2 / OpenID Connect if scaling authentication.
2.  **Network Policies**:
    - If moving to Kubernetes, use Network Policies to restrict traffic between pods even further (e.g., only backend can talk to db, nothing else).

## Development vs Production

The updated `docker-compose.yml` is designed for **production security**.
For local development, you may want to create a `docker-compose.override.yml` to:

- Mount local source code volumes.
- Expose the DB port (5432) if you need to use a GUI tool like DBeaver.
- Override the `command` to run `nodemon`.
