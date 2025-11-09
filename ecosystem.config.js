module.exports = {
  apps: [{
    name: 'canvas-playground',
    script: 'pnpm start',
    cwd: '/home/tyange/dev/deploy/canvas-playground',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true,
    merge_logs: true,
    max_memory_restart: '500M',
    watch: false,
    ignore_watch: [
      'node_modules',
      'logs',
      '.git',
    ],
    restart_delay: 1000,
    max_restarts: 5,
    min_uptime: '10s',
  }],
}
