// import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button/index';
import { RoomCode } from '../../components/RoomCode/index';
import { Question } from '../../components/Question';

import { database } from '../../services/firebase';

// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'


import '../../styles/room.scss';

type RoomParams = {
    id: string,
}

export function AdminRoom() {
    // const [ newQuestion, setNewQuestion ] = useState('')

    const navigate = useNavigate()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    // const { user } = useAuth();
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}`).update({
                endedAd: new Date(),
            })
        }

        navigate('/')
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswared: true,
        });
    }

    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !isHighlighted,
        });
    }

    async function handleDeleteQuestion(questionId:string) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div> 
                
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}      
                                isAnswared={question.isAnswared}
                                isHighlighted={question.isHighlighted}      
                            >
                                {!question.isAnswared && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )} 
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button> 
                            </Question>
                        )
                    })}
                </div>
                
            </main>
        </div>
    );
}