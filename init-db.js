#!/usr/bin/env node

import('./lib/db.js').then(({ getPool, initDatabase }) => {
  initDatabase().then(() => {
    console.log('✅ Database initialized successfully')
    process.exit(0)
  }).catch((err) => {
    console.error('❌ Failed to initialize database:', err)
    process.exit(1)
  })
}).catch((err) => {
  console.error('❌ Failed to load database module:', err)
  process.exit(1)
})
