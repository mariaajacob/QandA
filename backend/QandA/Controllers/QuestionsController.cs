using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QandA.Data;
using QandA.Data.Models;

namespace QandA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        public QuestionsController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("getQuestion/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Question))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task <ActionResult<Question>>GetQuestion(int id)
        {
            Question question = await _dataRepository.GetQuestion(id);
            if (question == null)
            {
                return NotFound();
            }
            return Ok(question);
        }

        [HttpGet]
        public async Task<IEnumerable<QuestionsOnly>> GetQuestions()
        {
            IEnumerable<QuestionsOnly> questions = await _dataRepository.GetQuestions();
            return questions;
        }

        [HttpGet("getQuestionBySearch")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<QuestionsOnly>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<QuestionsOnly>> GetQuestionsBySearch(string search)
        {
            if (string.IsNullOrEmpty(search))
            {
                return await _dataRepository.GetQuestions();
            }
            else
            {
                return await _dataRepository.GetQuestionsBySearch(search);
            }
        }

        [HttpGet("getUnansweredQuestions")]
        public async Task<IEnumerable<QuestionsOnly>> GetUnansweredQuestions()
        {
            IEnumerable<QuestionsOnly> questions = await _dataRepository.GetUnansweredQuestions();
            return questions;
        }

        [HttpGet("getAnswer/{answerId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Answer))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Answer>> GetAnswer(int answerId)
        {
            Answer answer = await _dataRepository.GetAnswer(answerId);
            if (answer == null)
            {
                return NotFound();
            }

            return Ok(answer);
        }

        [HttpPut("putQuestion/{questionId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Answer))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> postQuestion(int questionId, QuestionsOnly questionsOnly)
        {
            if(await _dataRepository.QuestionExists(questionId))
            {
                Question updatedQuestion = await _dataRepository.UpdateQuestion(questionId, questionsOnly);
                return Ok(updatedQuestion);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpDelete("deleteQuestion/{questionId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteQuestion(int questionId)
        {
            if (await _dataRepository.QuestionExists(questionId)){
                await _dataRepository.DeleteQuestion(questionId);
                return Ok(NoContent());
            }

            return NotFound();
        }

        [HttpPost("postQuestion")]
        public async Task<ActionResult<Question>> PostQuestion(Question newQuestion)
        {
            Question savedQuestion = await _dataRepository.PostQuestion(newQuestion);

            return RedirectToAction("GetQuestion", new { id = savedQuestion.QuestionId.ToString() });
            //return CreatedAtAction(nameof(GetQuestion), new { questionId = savedQuestion.QuestionId }, savedQuestion);
        }

        [HttpPost("postAnswer/{questionId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Answer))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PostAnswer(int questionId, Answer newAnswer)
        {
            if (await _dataRepository.QuestionExists(questionId))
            {
                Answer answer = await _dataRepository.AddAnswer(questionId, newAnswer);
                return Ok(answer);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
