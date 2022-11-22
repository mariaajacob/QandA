using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QandA.Data.Models;

namespace QandA.Data
{
    public interface IDataRepository
    { 
        Task<IEnumerable<QuestionsOnly>> GetQuestions();
        Task<IEnumerable<QuestionsOnly>> GetQuestionsBySearch(string search);
        Task<IEnumerable<QuestionsOnly>> GetUnansweredQuestions();
        Task<Question> GetQuestion(int questionId);
        Task<bool> QuestionExists(int questionId);
        Task<Answer> GetAnswer(int answerId);
        Task<Question> UpdateQuestion(int questionId, QuestionsOnly questionsOnly);
        Task<Answer> AddAnswer(int questionId, Answer newAnswer);
        Task<Question> PostQuestion(Question question);
        Task DeleteQuestion(int questionId);
    }
}
