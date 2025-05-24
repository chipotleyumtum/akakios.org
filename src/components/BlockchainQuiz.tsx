import React, { useState, useEffect } from 'react';

interface BlockchainQuizProps {
  onComplete: (score: number) => void;
}

const BlockchainQuiz: React.FC<BlockchainQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      question: "What is the primary purpose of blockchain technology?",
      options: [
        "To create cryptocurrencies only",
        "To provide a decentralized and immutable ledger",
        "To replace traditional databases in all applications",
        "To increase processing speed of transactions"
      ],
      correctAnswer: 1
    },
    {
      question: "What makes blockchain secure?",
      options: [
        "Government regulations",
        "Centralized control by tech companies",
        "Cryptographic hashing and consensus mechanisms",
        "Simple password protection"
      ],
      correctAnswer: 2
    },
    {
      question: "What are smart contracts?",
      options: [
        "Legal documents stored on blockchain",
        "Self-executing contracts with terms written in code",
        "Contracts that use AI to negotiate terms",
        "Traditional contracts signed digitally"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is NOT a common consensus mechanism in blockchain?",
      options: [
        "Proof of Work",
        "Proof of Stake",
        "Proof of Authority",
        "Proof of Intelligence"
      ],
      correctAnswer: 3
    },
    {
      question: "How does blockchain help with data security?",
      options: [
        "By storing all data in a single secure location",
        "By making data immutable and transparent",
        "By restricting access to authorized users only",
        "By encrypting data so no one can read it"
      ],
      correctAnswer: 1
    }
  ];

  useEffect(() => {
    if (!quizStarted || showResult || !isAnswered) return;

    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      handleNextQuestion();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, quizStarted, showResult, isAnswered]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Pause for 1.5 seconds to show the result before moving to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      onComplete(score);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setQuizStarted(false);
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) return "tech-quiz-option";
    
    if (index === questions[currentQuestion].correctAnswer) {
      return "tech-quiz-option correct";
    }
    
    if (index === selectedAnswer && index !== questions[currentQuestion].correctAnswer) {
      return "tech-quiz-option incorrect";
    }
    
    return "tech-quiz-option";
  };

  if (!quizStarted) {
    return (
      <div className="tech-card p-8 text-center">
        <h3 className="text-2xl font-bold mb-6 text-secondary">Blockchain Knowledge Quiz</h3>
        <p className="mb-6">Test your knowledge about blockchain technology with this quick quiz. You'll have 30 seconds to answer each question.</p>
        <button onClick={startQuiz} className="glow-button">Start Quiz</button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="tech-card p-8 text-center">
        <h3 className="text-2xl font-bold mb-6 text-secondary">Quiz Completed!</h3>
        <p className="text-xl mb-4">Your Score: <span className="text-accent font-bold">{score}</span> out of {questions.length}</p>
        
        {score === questions.length ? (
          <p className="mb-6">Perfect score! You're a blockchain expert!</p>
        ) : score >= questions.length * 0.7 ? (
          <p className="mb-6">Great job! You have a solid understanding of blockchain technology.</p>
        ) : score >= questions.length * 0.4 ? (
          <p className="mb-6">Good effort! You have some knowledge about blockchain, but there's room to learn more.</p>
        ) : (
          <p className="mb-6">Thanks for participating! Blockchain can be complex - keep learning!</p>
        )}
        
        <button onClick={resetQuiz} className="glow-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="tech-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-secondary">Question {currentQuestion + 1}/{questions.length}</h3>
        <div className="bg-background/50 px-4 py-2 rounded-full border border-circuit-color">
          <span className={timeLeft <= 10 ? "text-accent" : "text-foreground"}>Time: {timeLeft}s</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-xl mb-6">{questions[currentQuestion].question}</h4>
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={getButtonClass(index)}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm text-foreground/70">Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}</p>
      </div>
    </div>
  );
};

export default BlockchainQuiz;
