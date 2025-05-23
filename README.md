# Backend Developer Challenge – IP Location API

## Description

This project implements a REST API in TypeScript that receives an IP address and returns its geographic location (country, country code, and city) based on a dataset containing numeric IP ranges.

---

## Requirements
- Node.js v18+
- package manager npm or yarn
- [K6](https://grafana.com/docs/k6/next/) for load testing (optional)
> If you don't have K6 installed, follow the installation guide at https://grafana.com/docs/k6/next/get-started/write-your-first-test/

## How to Run

**Install dependencies:**

```bash
npm install
```
**Start the server:**
```bash
npm run dev
```
The application will be running at http://localhost:3000

## Endpoint

``` GET /ip/location?ip=1.0.1.1 ```

**Query Parameters**
- ```ip``` (string): IPv4 address to be located

**Example 200 response:**
```json
{
  "country": "China",
  "countryCode": "CN",
  "city": "Fuzhou"
}
```
**Example 404 response:**
```json
{
  "message": "IP not found"
}
```

## Architecture 

The project follows a modular and scalable structure with:
- **Service**: Handles CSV loading and binary IP lookup
- **Command**: Encapsulates the execution logic
- **Factory**: Manages service injection into the command
- **Route**: Registers API endpoints using Fastify

## Tests
### Unit Tests
**Run With**:
```bash
npm run test
```

### Load Testing with K6
**Start the server:**
```bash
npm run dev
```
**Run K6 with:**
```bash
k6 run test.js
```
In the root of project

## Technical Decisions

- Binary search is used for performance on large datasets (~3 million rows).
- The dataset is loaded once at startup and kept in memory for fast lookups.
- Code is organized using Command and Factory patterns to improve scalability and separation of concerns.
