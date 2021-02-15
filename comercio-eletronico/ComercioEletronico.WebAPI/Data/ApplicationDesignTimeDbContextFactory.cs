using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ComercioEletronico.WebAPI.Data
{
    public class ApplicationDesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
#if RELEASE
            var connectionStringBuilder = new SqlConnectionStringBuilder("server=.;database=comercio_eletronico;user id=sa;trusted_connection=false;")
            {
                Password = "4e5de1cf-b4b0-4316-9bad-3dc36f905d8f"
            };
#endif

            var connectionStringBuilder = new SqliteConnectionStringBuilder
            {
                DataSource = $"{typeof(ApplicationDbContext).FullName}.db"
            };

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>()
#if RELEASE
                .UseSqlServer(connectionStringBuilder.ConnectionString)
#endif
#if !RELEASE
                .UseSqlite(connectionStringBuilder.ConnectionString)
#endif
                ;

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
