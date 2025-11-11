# Database Migration Required

After pulling these changes, you need to run the database migration to add the `ScheduledMessage` table:

```bash
npx prisma migrate dev --name add-scheduled-messages
```

Or if you're in production:

```bash
npx prisma migrate deploy
```

This will create the `ScheduledMessage` table which is required for the automated messaging system to work.

If you encounter any issues with Prisma binaries during migration, you can alternatively use:

```bash
npx prisma db push
```

This will sync your database schema without creating migration files.
