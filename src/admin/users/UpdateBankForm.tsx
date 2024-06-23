import { Stack, Stepper, Typography,CircularProgress } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, RadioButtonGroupInput, BooleanInput, useGetOne, useUpdate } from 'react-admin';
import { User, UserRole, UserRolez } from "../../../entities/user";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { UpdateBankBodyDtoZ } from "../../../dto/AdminBankDto";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { Bank } from "../../../entities/bank";



export type UpdateBankFormProps = {
    user: User
}
export const UpdateBankForm = ({user}:UpdateBankFormProps) => { 
  const {data,isLoading,refetch} = useGetOne<Bank>('/banks',{
    id: user.id,
  })
  const notify = useNotify();

  const [update,] = useUpdate()
  return <Form onSubmit={async (data)=>{
    update('/banks',{
      id: user.id,
      data
    },{
      onSuccess(data, variables, context) {
        notify('은행 업데이트 완료',{
          type:'success'
        });
        refetch();
      },
      onError(error, variables, context) {
        notify(err.message?.message ?? err?.message,{
          type:'error'
        })
        
      },
     
    })
    refetch();
  }} validate={zodReactAdminValidate(UpdateBankBodyDtoZ)}   >
    <Stack direction={'column'} justifyContent={'space-between'} alignItems={'space-between'}>
      {isLoading 
        ?  <CircularProgress color="success"/>
        :  <Grid2 container spacing={1}>
              <Grid2 xs={12} >
                <TextInput  fullWidth variant="outlined" label="은행이름" source="bank_name"  defaultValue={data?.bank_name}></TextInput>
              </Grid2>
              <Grid2 xs={12} >
                <TextInput fullWidth variant="outlined" label='소유주' source="acc_name"  defaultValue={data?.acc_name} required/> 
              </Grid2>
              <Grid2 xs={12} >
                <TextInput  fullWidth variant="outlined" label="은행계좌" source="acc_num" defaultValue={data?.acc_num}></TextInput>
              </Grid2>
          </Grid2>
        }
    </Stack>
    <SaveButton label={"저장"} />

  </Form>
}