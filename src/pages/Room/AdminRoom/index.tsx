import { useHistory, useParams } from "react-router-dom";

import { Button } from "../../../components/Button/index";
import { Question } from "../../../components/Question/index";
import { RoomCode } from "../../../components/RoomCode/index";
import { useRoom } from "../../../hooks/useRoom";
import { database } from "../../../services/firebase";

import logoImg from "../../../assets/images/logo.svg";
import checkImg from "../../../assets/images/check.svg";
import answerImg from "../../../assets/images/answer.svg";
import deleteImg from "../../../assets/images/delete.svg";
import {
  RoomStyled,
  RoomHeaderStyled,
  RoomMainContentStyled,
  RoomMainContentTitleStyled,
  RoomMainContentQuestionsStyled,
} from "../styled";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleClosedRoom() {
    database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });
    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <RoomStyled>
      <RoomHeaderStyled>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleClosedRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </RoomHeaderStyled>
      <RoomMainContentStyled>
        <RoomMainContentTitleStyled>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </RoomMainContentTitleStyled>
        <RoomMainContentQuestionsStyled>
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </RoomMainContentQuestionsStyled>
      </RoomMainContentStyled>
    </RoomStyled>
  );
}
