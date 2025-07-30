# Contributing to Sportfolio

First off, thank you for considering contributing to Sportfolio! It's people like you that make Sportfolio such a great platform for the Indian sports community.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment details (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Why this enhancement would be useful
- Possible implementation approach

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a clear commit message

## Development Process

1. **Setup Development Environment**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sportfolio-platform.git
   cd sportfolio-platform
   npm install
   npm run dev
   ```

2. **Make Your Changes**
   - Follow the TypeScript style guide
   - Use meaningful variable and function names
   - Comment complex logic
   - Update documentation if needed

3. **Test Your Changes**
   - Test all affected features
   - Ensure no existing functionality is broken
   - Add new tests for new features

4. **Submit Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable names
- Add JSDoc comments for functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow the existing component structure

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests

## Project Structure

```
sportfolio-platform/
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types and schemas
├── mobile-app/       # React Native app
├── attached_assets/  # Static assets
└── docs/            # Documentation
```

## Questions?

Feel free to contact the maintainers at mysportfolioindia@gmail.com or open an issue for discussion.

Thank you for contributing to Sportfolio! 🏆