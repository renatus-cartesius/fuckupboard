# Fuckup Board Monitoring Stack

This directory contains the monitoring setup for Fuckup Board using Prometheus and Grafana.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Node Exporter │
│   (Port 3000)   │    │   (Port 8080)   │    │   (Port 9100)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Prometheus    │
                    │   (Port 9090)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Grafana      │
                    │   (Port 3001)   │
                    └─────────────────┘
```

## Business Metrics

The monitoring stack tracks the following business metrics:

### Core Business Metrics
- **Total Fuckups Created** (`fuckups_total`) - Counter of all fuckups created
- **Total Likes** (`fuckups_liked_total`) - Counter of all likes given
- **Total Unlikes** (`fuckups_unliked_total`) - Counter of all unlikes given
- **Backend Health** (`backend_health`) - Gauge showing backend status (1=healthy, 0=unhealthy)

### Technical Metrics
- **HTTP Request Rate** (`http_requests_total`) - Request rate by method and route
- **HTTP Request Duration** (`http_request_duration_seconds`) - Response time histograms
- **System Metrics** - CPU, memory, disk usage via Node Exporter

## Setup Instructions

### 1. Create Monitoring Network

```bash
docker network create monitoring
```

### 2. Start Monitoring Stack

```bash
cd monitoring
docker-compose up -d
```

### 3. Start Application Stack

```bash
cd ..
docker-compose up -d
```

## Access Points

### Grafana Dashboard
- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: admin123

### Prometheus
- **URL**: http://localhost:9090

### Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## Dashboard Features

The Grafana dashboard includes:

1. **Business Overview**
   - Total fuckups created
   - Total likes/unlikes
   - Backend health status

2. **Trends Over Time**
   - Fuckups creation rate
   - Likes vs unlikes comparison
   - HTTP request patterns

3. **Performance Metrics**
   - Request rates by endpoint
   - Response time distributions
   - System resource usage

## Metrics Endpoints

### Frontend Metrics
- **URL**: http://localhost:3000/metrics
- **Format**: Prometheus text format

### Backend Metrics (if implemented)
- **URL**: http://localhost:8080/metrics
- **Format**: Prometheus text format

## Customization

### Adding New Metrics

1. **Frontend**: Add new metrics in `frontend/server.js`
2. **Prometheus**: Update `prometheus/prometheus.yml` if needed
3. **Grafana**: Create new panels in the dashboard

### Example: Adding User Registration Metric

```javascript
// In frontend/server.js
const userRegistrations = new promClient.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

// In API route
app.post('/api/register', async (req, res) => {
  // ... registration logic
  userRegistrations.inc();
  res.json(response.data);
});
```

## Troubleshooting

### Prometheus Not Scraping
1. Check if services are running: `docker-compose ps`
2. Verify network connectivity: `docker network ls`
3. Check Prometheus targets: http://localhost:9090/targets

### Grafana No Data
1. Verify Prometheus datasource is configured
2. Check if metrics are being collected: http://localhost:3000/metrics
3. Ensure time range is appropriate

### High Resource Usage
1. Adjust scrape intervals in `prometheus.yml`
2. Reduce retention period if needed
3. Monitor system resources with Node Exporter

## Security Notes

- Default Grafana credentials should be changed in production
- Consider using HTTPS for all endpoints
- Restrict network access to monitoring ports
- Use secrets management for sensitive configuration

## Production Deployment

For production deployment:

1. **Use proper secrets management**
2. **Enable authentication for Grafana**
3. **Set up alerting rules**
4. **Configure persistent storage**
5. **Use reverse proxy for HTTPS**
6. **Set up log aggregation** 