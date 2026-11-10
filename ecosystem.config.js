module.exports = {
  apps: [
    {
      name: 'rankers-backend',
      script: 'server.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      }
    }
  ]
};
