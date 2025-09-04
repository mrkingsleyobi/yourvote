# AI-Native Election Voting System

This is an AI native Election Voting System to prevent Fraud, maintain availability

## Branching Strategy

This repository follows the Git branching strategy:

- **main**: Production-ready code
- **develop**: Integration branch for ongoing development
- **feature/***: Individual feature branches
- **release/***: Release preparation branches
- **hotfix/***: Urgent production fixes

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Testing**: Unit tests, integration tests, and end-to-end tests
- **Code Quality**: Linting, formatting, and security scanning
- **Deployment**: Automated deployment to staging and production environments

## Getting Started

```bash
# Clone the repository
git clone https://github.com/mrkingsleyobi/yourvote.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Write tests
4. Submit a pull request to `develop`
5. After review and approval, merge to `develop`
6. Changes will be merged to `main` through release branches