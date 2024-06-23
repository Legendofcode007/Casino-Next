import { useMutation } from "react-query"
import { Button } from "../components/Button"
import { HttpError } from "react-admin"
import { CreateCustomerServiceBodyDto } from "../../../dto/CustomerServiceDto"
import { useCreateCustomerService } from "../hooks/useCreateCustomerService"
import { useRouter } from "next/router"

export type RequestDepositAccountButtonPorps = {
  label?: string
}

export const RequestDepositAccountButton = ({label}: RequestDepositAccountButtonPorps) => {
  const {mutate, mutateAsync, isLoading} = useCreateCustomerService();

  const router = useRouter();

  return <Button animation type="button" size="medium" color="success" disabled={isLoading} onClick={(e)=>{
    e.stopPropagation();
    if(!confirm('입금계좌 문의하시겠습니까?')) return;
    mutate({
      title: '[계좌문의] 입금계좌 문의합니다.',
      description:'입금 계좌 문의합니다.'
    },{
      onSuccess:()=> {
        alert('계좌문의가 등록되었습니다.')
        router.push('/cs')
      },
      onError: () => {

      }
    })
  }}>
    { isLoading ? <div className="spinner-border text-danger" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    :label}
  </Button>
}