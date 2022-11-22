using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using QandA.Data.Models;

namespace QandA.Data
{
    public class DataRepository : IDataRepository
    {
        QandAContext db = new QandAContext();

        public async Task<Answer> GetAnswer(int answerId)
        {
            Answer requestedAnswer = await db.Answers.FirstOrDefaultAsync(a => a.AnswerId == answerId);
            return requestedAnswer;
        }

        public async Task<Question> GetQuestion(int questionId)
        {
            var questions = await db.Questions.Where(q => q.QuestionId == questionId).Include(q => q.Answers).FirstOrDefaultAsync();

            return questions;
        }

        public async Task<IEnumerable<QuestionsOnly>> GetQuestions()
        {
            var questions = await (from q in db.Questions select q).ToListAsync();
            QuestionsOnly[] questionsOnly = new QuestionsOnly[questions.Count()];

            int indexCount = 0;
            foreach(Question q in questions)
            {
                var questionOnly = new QuestionsOnly(q);
                questionsOnly[indexCount] = questionOnly;

                indexCount++;
            }

            return questionsOnly.Take(10);
        }

        public async Task<IEnumerable<QuestionsOnly>> GetQuestionsBySearch(string search)
        {
            var matchingQuestions = await db.Questions.Where(q => q.Title.Contains(search) || q.Content.Contains(search)).ToListAsync();
            QuestionsOnly[] questionsOnly = new QuestionsOnly[matchingQuestions.Count()];

            int indexCount = 0;
            foreach (Question q in matchingQuestions)
            {
                var questionOnly = new QuestionsOnly(q);
                questionsOnly[indexCount] = questionOnly;

                indexCount++;
            }

            return questionsOnly.Take(10);
        }

        public async Task<IEnumerable<QuestionsOnly>> GetUnansweredQuestions()
        {
            List<Question> unansweredQuestions = await db.Questions.Include(q => q.Answers).Where(q => q.Answers.Count() == 0).ToListAsync();
            //var unansweredQuestions = from q in db.Questions where q.Answers == null select q;
            QuestionsOnly[] questionsOnly = new QuestionsOnly[unansweredQuestions.Count()];

            int indexCount = 0;
            foreach (Question q in unansweredQuestions)
            {
                var questionOnly = new QuestionsOnly(q);
                questionsOnly[indexCount] = questionOnly;

                indexCount++;
            }

            return questionsOnly.Take(10);
        }

        public async Task<bool> QuestionExists(int questionId)
        {
            var questions = await db.Questions.FirstOrDefaultAsync(q => q.QuestionId == questionId);
            Boolean exists = (questions != null);

            return exists;
        }

        public async Task DeleteQuestion(int questionId)
        {
            Question question = await db.Questions.FirstOrDefaultAsync(q => q.QuestionId == questionId);
            db.Questions.Remove(question);

            db.SaveChanges();
        }

        public async Task<Question> PostQuestion(Question newQuestion)
        {
            Question question = new Question();

            question.Content = newQuestion.Content;
            question.Title = newQuestion.Title;
            question.UserId = newQuestion.UserId;
            question.Created = DateTime.Now;

            db.Questions.Add(question);

            await db.SaveChangesAsync();

            return await GetQuestion(question.QuestionId.Value);
        }

        public async Task<Question> UpdateQuestion(int questionId, QuestionsOnly questionsOnly)
        {
            Question existingQuestion = await db.Questions.FirstOrDefaultAsync(q => q.QuestionId == questionId);

            existingQuestion.Title = string.IsNullOrEmpty(questionsOnly.Title) ? existingQuestion.Title : questionsOnly.Title;
            existingQuestion.Content = string.IsNullOrEmpty(questionsOnly.Content) ? existingQuestion.Content : questionsOnly.Content;

            await db.SaveChangesAsync();

            return existingQuestion;
        }

        public async Task<Answer> AddAnswer(int questionId, Answer newAnswer)
        {
            Question existingQuestion = db.Questions.FirstOrDefault(q => q.QuestionId == questionId);

            newAnswer.Question = existingQuestion;
            newAnswer.QuestionId = existingQuestion.QuestionId.Value;

            existingQuestion.Answers.Add(newAnswer);

            await db.SaveChangesAsync();

            return await GetAnswer(newAnswer.AnswerId);
        }
    }
}
