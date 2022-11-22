using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

#nullable disable

namespace QandA.Data.Models
{
    public partial class Answer
    {
        [Key]
        [Required]
        public int AnswerId { get; set; }
        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; } = "14";
        public string UserName { get; set; } = "Chris P Bacon";
        public DateTime Created { get; set; } = new DateTime();
        [JsonIgnore]
        public virtual Question Question { get; set; }
    }
}
