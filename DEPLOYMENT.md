# Deployment Guide

This document describes how to deploy the Fuckup Board application using Docker, GitHub Actions, and Ansible.

## Architecture

The application consists of:
- **Backend**: Golang API server (port 8080)
- **Frontend**: React application served by Node.js serve (port 80)
- **Database**: SQLite file (persisted via bind mount)

## Prerequisites

### For Local Development
- Docker and Docker Compose
- Go 1.21+
- Node.js 18+

### For Production Deployment
- Ubuntu server (20.04+ recommended)
- SSH access with sudo privileges
- GitHub repository with GitHub Actions enabled

## Local Development

### Using Docker Compose

1. **Build and start services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Manual Development

1. **Start backend:**
   ```bash
   ./back.sh
   ```

2. **Start frontend:**
   ```bash
   ./front.sh
   ```

## Production Deployment

### 1. GitHub Repository Setup

1. **Enable GitHub Actions** in your repository settings
2. **Add repository secrets:**
   - `SSH_PRIVATE_KEY`: Your SSH private key for server access
   - `SERVER_HOST`: Your server's IP address or domain
   - `SERVER_USER`: SSH username (usually `ubuntu` or `root`)

### 2. Server Preparation

1. **Create SSH key pair:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "deployment-key"
   ```

2. **Add public key to server:**
   ```bash
   ssh-copy-id -i ~/.ssh/id_deployment.pub user@your-server
   ```

3. **Add private key to GitHub secrets** (the content of `~/.ssh/id_deployment`)

### 3. Automated Deployment

The deployment is fully automated via GitHub Actions:

1. **Push to main branch** triggers the pipeline
2. **Tests run** on both backend and frontend
3. **Docker images are built** and pushed to GitHub Container Registry
4. **Ansible playbook deploys** the application to your server

### 4. Manual Deployment

If you need to deploy manually:

1. **Install Ansible:**
   ```bash
   pip install ansible
   ```

2. **Install Ansible collections:**
   ```bash
   cd ansible
   ansible-galaxy collection install -r requirements.yml
   ```

3. **Set environment variables:**
   ```bash
   export SERVER_HOST=your-server-ip
   export SERVER_USER=your-username
   ```

4. **Run deployment:**
   ```bash
   cd ansible
   ansible-playbook deploy.yml \
     -e "backend_image=ghcr.io/your-username/fckupboard-backend:latest" \
     -e "frontend_image=ghcr.io/your-username/fckupboard-frontend:latest"
   ```

## Configuration

### Environment Variables

- `GIN_MODE`: Set to `release` for production
- `APP_DOMAIN`: Your domain name (optional)

### Ports

- **Backend**: 8080 (configurable in `ansible/inventory.yml`)
- **Frontend**: 80 (configurable in `ansible/inventory.yml`)

### Database

The SQLite database is persisted at `/opt/fuckupboard/data/fuckups.db` on the server.

## Monitoring

### Health Checks

Both containers include health checks:
- **Backend**: Checks `/list` endpoint
- **Frontend**: Checks root endpoint `/`

### Logs

View container logs:
```bash
# Backend logs
docker logs fuckupboard-backend

# Frontend logs
docker logs fuckupboard-frontend
```

## Rollback

To rollback to a previous version:

```bash
cd ansible
ansible-playbook rollback.yml \
  -e "previous_backend_image=ghcr.io/your-username/fckupboard-backend:previous-tag" \
  -e "previous_frontend_image=ghcr.io/your-username/fckupboard-frontend:previous-tag"
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80 and 8080 are available
2. **Permission issues**: Check SSH key permissions and sudo access
3. **Image pull failures**: Verify GitHub Container Registry access
4. **Database issues**: Check volume mounts and file permissions

### Debug Commands

```bash
# Check container status
docker ps -a

# Check network connectivity
docker network ls
docker network inspect fuckupboard-network

# Check volumes
docker volume ls

# Access container shell
docker exec -it fuckupboard-backend sh
docker exec -it fuckupboard-frontend sh
```

## Security Considerations

1. **Firewall**: Configure firewall to allow only necessary ports
2. **SSL/TLS**: Use reverse proxy (nginx/traefik) for HTTPS
3. **Secrets**: Store sensitive data in environment variables or secrets
4. **Updates**: Regularly update base images and dependencies

## Scaling

For production scaling, consider:
- Load balancer for multiple instances
- Database migration to PostgreSQL/MySQL
- Redis for session management
- CDN for static assets 