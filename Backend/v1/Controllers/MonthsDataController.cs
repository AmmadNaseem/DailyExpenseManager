using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using v1.Configurations;
using v1.Models;

namespace v1.Controllers
{
    [Route("api")]
    [ApiController]
    public class MonthsDataController : ControllerBase
    {
        public readonly ExpenseMangerDbContext dbContext;

        public MonthsDataController(ExpenseMangerDbContext _context)
        {
            this.dbContext = _context;
        }

        //WILL RETURN LIST OF MONTH NAMES WITH YEAR IN ASCENDING ORDER
        [HttpGet("GetListOfMonths")]
        public IActionResult GetListOfMonths()
        {
            var monthList=(from x in dbContext.MonthsData 
                           group x by new
                           {
                               monthYear=x.MonthYear,
                               monthNumber=x.MonthNumber
                           }
                           into monthsGroup
                           orderby 
                           monthsGroup.Key.monthYear.Length ascending,
                           monthsGroup.Key.monthYear ascending,
                           monthsGroup.Key.monthNumber.Length ascending,
                           monthsGroup.Key.monthNumber ascending
                           select monthsGroup.Key).ToList();
                          

            return Ok(monthList);
        }

        //=====RETURN ALL THE ROWS OF SPECIFIED TABLE
        [HttpGet("GetTableData")]
        public IActionResult GetTableData(string monthYear,string monthNumber,string tableName)
        {
            var tableData = (from x in dbContext.MonthsData
                             where x.MonthYear == monthYear && x.MonthNumber == monthNumber && x.TableName == tableName
                             select new
                             {
                                 id=x.ID,
                                 date = x.Date,
                                 name = x.Name,
                                 amount = x.Amount

                             }).ToList();

            return Ok(tableData);
        }

        //=====INSERTING DATA OF ROWS IN DATABASE
        [HttpPost("InsertTableRow")]
        public IActionResult InsertTableRow(MonthsData monthsDataFromFrontEnd)
        {
            dbContext.MonthsData.Add(monthsDataFromFrontEnd);
            dbContext.SaveChanges();
            var id = dbContext.MonthsData.OrderByDescending(p => p.ID).FirstOrDefault().ID;
            return Ok(id);
        }

        //====FOR DELETING ROW FROM DB
        [HttpDelete("DeleteTableRow/{id}")]
        public IActionResult DeleteTableRow(int id)
        {
            var x = dbContext.MonthsData.Where(item => item.ID == id).FirstOrDefault();
            dbContext.MonthsData.Remove(x);
            dbContext.SaveChanges();
            return Ok("success");
        }
    
    }
}
