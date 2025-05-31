module.exports = {
  apps: [
    {
      name: 'aiscorecard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3007',
      cwd: '/root/newfixsg',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3007
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3007
      },
      max_memory_restart: '1G',
      error_file: '/root/logs/aiscorecard-error.log',
      out_file: '/root/logs/aiscorecard-out.log',
      log_file: '/root/logs/aiscorecard-combined.log',
      time: true,
      merge_logs: true
    }
  ]
}; 