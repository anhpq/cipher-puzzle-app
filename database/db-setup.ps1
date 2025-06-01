$env:PGPASSWORD = "postgres"
$dbName = "cipher-puzzle-game"
$dbUser = "postgres"

psql -U $dbUser -d $dbName -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'cipher-puzzle-game' AND pid <> pg_backend_pid();"
dropdb -U $dbUser $dbName
createdb -U $dbUser $dbName
psql -U $dbUser -d $dbName -f ./database/schema.sql
psql -U $dbUser -d $dbName -f ./database/seed.sql

npx prisma db pull         # Lấy schema từ DB (nếu bạn có sẵn DB)
npx prisma generate