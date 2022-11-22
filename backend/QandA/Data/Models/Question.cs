using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace QandA.Data.Models
{
    public partial class Question
    {
        public Question()
        {
            Answers = new HashSet<Answer>();
        }
        [Key]
        public int? QuestionId { get; set; }
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [Required(ErrorMessage = "Please include some content for question")]
        public string Content { get; set; }
        public string UserId { get; set; } = "666";
        public string UserName { get; set; } = "Hugh.Mantu@a.test";
        public DateTime Created { get; set; }
        public virtual ICollection<Answer> Answers { get; set; }
    }
}
