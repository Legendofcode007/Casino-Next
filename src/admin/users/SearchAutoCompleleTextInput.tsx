import { useEffect, useMemo, useState } from "react"
import { ExcluedSuperAdminUserRole } from "../../../entities/user";
import { useGetUserSearch } from "../hooks/useGetUserSearch";
import { AutocompleteArrayInput } from "react-admin";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

// export type SearchAutoCompleteTextInputProps = {
//     role?: ExcluedSuperAdminUserRole
// }
// export const SearchAutoCompleteTextInput = (props:SearchAutoCompleteTextInputProps) => {
//     const [text,setText] = useState('');

//     const {data,isLoading,refetch} = useGetUserSearch({q:text,role:props.role},{
//         enabled: !!text
//     })

//     useEffect(()=>{
//         refetch();
//     },[text])
//     const options = useMemo(()=>{
//         return (data ?? []).map((u)=>({
//             label: u.name,
//             id:u.id
//         })) 
//     },[data])

//     return <Stack>
//         <Autocomplete
//         // value={value}
//         // onChange={(event: any, newValue: string | null) => {
//         //   setValue(newValue);
//         // }}
//         // inputValue={inputValue}
//         onInputChange={(event, newInputValue) => {
//             setText(newInputValue);
//         }}
        
//         id="controllable-states-demo"
//         options={options}

//         sx={{ width: 300 }}
//         renderInput={(params) => <TextField 
//             {...params} 
//             label="사용자 검색" 
//             inputProps={{
//             ...params.inputProps,
//             endAdornment: (
//                 <>
//                 {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//                 </>
//             ),
//             }}
//         />
//     </Stack> }
//   />
// }