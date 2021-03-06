import copyImg from "../../assets/images/copy.svg";
import { RoomCodeStyled } from "./styled";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <RoomCodeStyled onClick={copyRoomCodeClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </RoomCodeStyled>
  );
}
