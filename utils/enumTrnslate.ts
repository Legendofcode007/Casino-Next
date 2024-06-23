import { BettingResult, GameType } from "../entities/betting_history";
import { CustomerServiceStatus } from "../entities/customer_services";




export const BettingResultToKorean = (result: BettingResult) => {
  if(result === 'bet') return '배팅';
  else if (result === 'lost') return '패배';
  else if (result === 'bonus') return '보너스';
  else if (result === 'cancelled') return '취소';
  else if (result === 'won') return '승리';
  else return '??'
} 

export const gameTypeToKorean = (type: GameType) => {
  if(type === 'live') return '카지노';
  else if(type === 'slot') return '슬롯';
  else return '??';
}

export const CustomerServiceStatusToKorean = (status:CustomerServiceStatus) => {
  if(status === 'success') return '답변완료';
  else return '답변대기'
}