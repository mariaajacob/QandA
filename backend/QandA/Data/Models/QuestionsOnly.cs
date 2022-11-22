using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QandA.Data.Models
{
    public class QuestionsOnly
    {
        public int QuestionId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }

        public QuestionsOnly()
        {
        }

        public QuestionsOnly(Question question)
        {
            QuestionId = question.QuestionId.Value;
            Title = question.Title;
            Content = question.Content;
            UserName = question.UserName;
            Created = question.Created;
        }
    }
}
