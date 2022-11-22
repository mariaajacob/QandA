using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Xunit;
using Moq;
using QandA.Controllers;
using QandA.Data;
using QandA.Data.Models;

namespace BackendTests
{
    public class QuestionsControllerUnit
    {
        Answer sharedAnswer = new Answer
        {
            AnswerId = 12,
            Content = "My mocked Answer",
            UserId = "21",
            UserName = "test@a.test"
        };

        Question sharedQuestion = new Question
        {
            QuestionId = 1,
            Title = "Test",
            Content = "My test content",
            UserId = "41",
            UserName = "iam@a.test"
        };

        [Fact]
        public async void test_retrieving_question_by_ID()
        {
            //Given: a mock question, a mocked data repository and the questions controller
            var mockQuestion = sharedQuestion;
            mockQuestion.Answers = new Answer[] { sharedAnswer };

            var mockDataRespsitory = new Mock<IDataRepository>();
            mockDataRespsitory
                .Setup(repo => repo.GetQuestion(mockQuestion.QuestionId.Value))
                .Returns(() => Task.FromResult(mockQuestion));

            var questionsController = new QuestionsController(mockDataRespsitory.Object);

            //When: the get questions method is called
            var result = await questionsController.GetQuestion(mockQuestion.QuestionId.Value);

            //Then: the expect result type was returned and the mocked repository was called once
            Assert.IsType<ActionResult<Question>>(result);
            var actionResult = result.Result as OkObjectResult;
            Assert.IsType<Question>(actionResult.Value);

            //Below works but not useful for a unit test where mocked data is provided
            //Assert.Equal(sharedQuestion.QuestionId, questionResult.QuestionId);
            //Assert.Equal(sharedQuestion.Title, questionResult.Title);
            //Assert.Equal(sharedQuestion.Content, questionResult.Content);
            //Assert.Equal(sharedQuestion.UserId, questionResult.UserId);
            //Assert.Equal(mockQuestion.Answers, questionResult.Answers);
            mockDataRespsitory.Verify(mock =>
                mock.GetQuestion(mockQuestion.QuestionId.Value),
                Times.Once()
            );
        }

        [Fact]
        public async void test_retrieving_a_not_found_question_by_ID()
        {
            //Given: a mock question, a mocked data repository, question controller and a non existant id
            var nonExistantId = 99;
            var mockDataRespsitory = new Mock<IDataRepository>();
            mockDataRespsitory
                .Setup(repo => repo.GetQuestion(99))
                .Returns(() => Task.FromResult(default( Question)));

            var questionsController = new QuestionsController(mockDataRespsitory.Object);

            //When: the get questions method is called
            var result = await questionsController.GetQuestion(nonExistantId);

            //Then: the expected number of results are returned and the method was called once
            var actionResult = Assert.IsType<ActionResult<Question>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async void test_retrieving_answer_by_ID()
        {
            //Given: a mock answer, a mocked data repository and the questions controller
            var mockAnswer = sharedAnswer;

            var mockDataRespsitory = new Mock<IDataRepository>();
            mockDataRespsitory
                .Setup(repo => repo.GetAnswer(mockAnswer.AnswerId))
                .Returns(() => Task.FromResult(mockAnswer));

            var questionsController = new QuestionsController(mockDataRespsitory.Object);

            //When: the get questions method is called
            var result = await questionsController.GetAnswer(mockAnswer.AnswerId);

            //Then: the expected number of results are returned and the method was called once
            Assert.IsType<ActionResult<Answer>>(result);
            var actionResult = Assert.IsType<ActionResult<Answer>>(result).Result as OkObjectResult;
            Assert.IsType<Answer>(actionResult.Value);

            mockDataRespsitory.Verify(mock =>
                mock.GetAnswer(mockAnswer.AnswerId),
                Times.Once()
            );
        }

        [Fact]
        public async void test_retrieving_a_not_found_answer()
        {
            //Given: a mock question, a mocked data repository, question controller and a non existant id
            var nonExistantId = 99;
            var mockDataRespsitory = new Mock<IDataRepository>();
            mockDataRespsitory
                .Setup(repo => repo.GetAnswer(99))
                .Returns(() => Task.FromResult(default(Answer)));

            var questionsController = new QuestionsController(mockDataRespsitory.Object);

            //When: the get questions method is called
            var result = await questionsController.GetAnswer(nonExistantId);

            //Then: the expected number of results are returned and the method was called once
            var actionResult = Assert.IsType<ActionResult<Answer>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }


        [Fact]
        public async void calling_questions_search_will_result_in_a_full_questions_search()
        {
            //Given: a list of mocked questions, a mocked dataRepository and the questions controller
            var mockQuestions = new List<QuestionsOnly>();
            for (int i = 1; i <= 10; i++)
            {
                mockQuestions.Add(new QuestionsOnly
                {
                    QuestionId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test content {i}",
                    UserName = "User1"
                });
            }

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
              .Setup(repo => repo.GetQuestions())
              .Returns(() => Task.FromResult(mockQuestions.AsEnumerable()));

            var questionsController = new QuestionsController(mockDataRepository.Object);

            //When: the questions controller is called with no search parameters
            var result = await questionsController.GetQuestionsBySearch(null);

            //Then: All 10 results are returned and the getQuestions method in the DataRepository was successfully called once.
            Assert.Equal(10, result.Count());
            mockDataRepository.Verify(mock => mock.GetQuestions(), Times.Once());
        }


        [Fact]
        public async void calling_questions_search_with_search_string_results_in_a_propper_questions_search_call()
        {
            //Given: a list of mocked questions, a mocked dataRepository and the questions controller
            var mockQuestions = new List<QuestionsOnly>();
            mockQuestions.Add(new QuestionsOnly
            {
                QuestionId = 1,
                Title = "Test",
                Content = "Test content",
                UserName = "User1"
            });

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
              .Setup(repo => repo.GetQuestionsBySearch("Test"))
              .Returns(() => Task.FromResult(mockQuestions.AsEnumerable()));

            var questionsController = new QuestionsController(mockDataRepository.Object);

            //When: the questions controller is called with search parameters
            var result = await questionsController.GetQuestionsBySearch("Test");

            //Then: a single result is returned and the GetQuestionsBySearch method in the DataRepository was called once
            Assert.Single(result);
            mockDataRepository.Verify(mock => mock.GetQuestionsBySearch("Test"), Times.Once());
        }
    }
}
