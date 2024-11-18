## Running Migrations from the CLI

Create an wrangler.toml file with the following content:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
migrations_dir = "drizzle"
```

Then, run the following command:

```shell
pnpm exec wrangler d1 migrations apply my-database --remote
```
