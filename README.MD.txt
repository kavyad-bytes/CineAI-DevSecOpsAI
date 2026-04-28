# CineAI — AI-Powered Netflix Clone with DevSecOps

CineAI is a production-grade Netflix-style video streaming platform built with:

- Spring Boot 3 / Java 21
- React + Vite + Tailwind CSS
- PostgreSQL
- MinIO object storage
- Ollama AI
- Docker
- Kubernetes
- GitHub Actions CI
- GHCR container registry
- ArgoCD GitOps
- Prometheus + Grafana monitoring

---

## Features

- Upload movies with title, genre, description, poster and video file
- Store videos in MinIO
- Store metadata in PostgreSQL
- Stream videos from backend
- Search movies by keyword
- AI-powered movie search using Ollama
- AI-generated movie summary
- Netflix-style React UI
- Kubernetes deployment
- GitOps deployment using ArgoCD
- Monitoring using Prometheus and Grafana
- DevSecOps pipeline with build, scan and container image push

---

## Architecture

```text
User
 ↓
React Frontend
 ↓
Spring Boot Backend
 ↓
PostgreSQL + MinIO + Ollama
 ↓
Kubernetes
 ↓
ArgoCD + Prometheus + Grafana