import React, { useState,useEffect } from 'react';
import shuffle from 'shuffle-array';
import {v4 as uuidv4} from 'uuid';

export default function App() {
	const [questions,setQuestions] = useState([]);

	useEffect(()=>{
		const fetchData=async ()=>{
			const response = await fetch('https://opentdb.com/api.php?amount=10');
			const responseJson=await response.json();
			const data= responseJson.results;
			data.forEach((single)=>{
				single.incorrect_answers.push(single.correct_answer)
				return shuffle(single.incorrect_answers);
			})
			setQuestions(data.map((question)=>(question)))
		}
		fetchData();
	},[])

	const [currentQuestion,setCurrentQuestion]=useState(0);
	const [showScore,setShowScore]=useState(false);
	const [score,setScore]=useState(0);

	const handleAnswerOptionClick=(e,answer)=>{
		if(questions[currentQuestion].correct_answer===answer){
			setScore(score+1);
		}
		const nextQuestion=currentQuestion+1;
		if(nextQuestion<questions.length){
			setCurrentQuestion(nextQuestion)
		}else{
			setShowScore(true);
		}
	}

	const reloadGame = ()=>{
		window.location.reload();
	}

	return (
		<div>
			{questions.length>0 ? (
				<div className='app'>
					{showScore ? (
						<React.Fragment>
						<div className='score-section'>You scored {score} out of {questions.length}</div>
						<span><button onClick={reloadGame} className='reload-button'>Reload</button></span>
						</React.Fragment>
					) : (
						<React.Fragment>
							<div className='question-section'>
								<div className='question-count'>
									<span>Question {currentQuestion+1}</span>/{questions.length}
								</div>
								<div className='question-text'>{questions[currentQuestion].question}</div>
								<div className='scoreDiv'>Score: {score}</div>
							</div>
							<div className='answer-section'>
								{questions[currentQuestion].incorrect_answers.map((answer)=>(
									<button key={uuidv4()} 
									onClick={(e)=>handleAnswerOptionClick(e,answer)}>{answer}</button>
								))}
							</div>
						</React.Fragment>
					)}
				</div>
			):(
				<div>Loading...</div>
			)}
		</div>
	);
}
