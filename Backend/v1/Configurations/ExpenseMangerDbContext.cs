using Microsoft.EntityFrameworkCore;
using v1.Models;

namespace v1.Configurations
{
    public class ExpenseMangerDbContext : DbContext
    {
        public ExpenseMangerDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<MonthsData> MonthsData { get; set; }
    }
}
