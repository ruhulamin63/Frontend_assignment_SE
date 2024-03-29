module.exports = {
  apps: [
    {
      name: 'e-RPL-ui', // Change 'my-nuxt-app' to your app's name
      script: 'npm',
      args: 'start',
      exec_mode: 'fork', // Change 'cluster' to 'fork' for a single instance
      instances: 1,      // Set the number of instances to 1 if using 'fork' mode
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
