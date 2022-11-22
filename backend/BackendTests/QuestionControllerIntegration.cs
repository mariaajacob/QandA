using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using QandA.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BackendTests
{
    public class QuestionControllerIntegration
    {
        [Fact]
        public async void test_posting_a_question()
        {
            //var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase();
            var result = (1 + 1);
            Assert.Equal(2, result);
        }
    }
}
