import {
  Datagrid,
  TextField,
  FunctionField,
  SimpleShowLayout,
  TopToolbar,
  CreateButton
  /*
  Form,
  SaveButton,
  TextInput,
  SelectInput,
  Button
  */
} from "react-admin";

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { useRecordContext } from 'react-admin';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { Stack } from "@mui/material";
import { List } from "../components/DataGrid";


export const ViewNotice = () => {

  const { t } = useTranslation('common');

  const router = useRouter();
  
  return (
    <Stack direction={"column"}>
      <BreadCrumbs items={[{name:"공지사항"},{name:"공지사항 보기"}]} />
      <List 
        // filters={[
        //   <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
        //   <QuickFilter key={2}  label="밴유저만" source="isBanned" defaultValue={true}/>,
        //   <QuickFilter key={3}  label="승인대기중만" source="isApproved" defaultValue={false}/>
        // ]}
       
        actions={<TopToolbar>
          {/* <FilterButton disableSaveQuery /> */}
          <CreateButton label="추가"/>
        </TopToolbar>}
        className="mt-0 py-0"
        sort={{ field: "id", order: "DESC" }}
        datagridProps={
          {bulkActionButtons:false}
        }
      >
        <TextField label={t('ID')} source="id" />
        <FunctionField
          label={t('Subject')}
          render={(record) => (
            <a href={`/${router.locale}/admin#/view-notice-details/${record.id} `}>
              <u>
                {" "}
                <TextField label={t('Subject')} source="subject" />
              </u>
            </a>
          )}
        />
        <TextField label={t('Created_At')} source="created_at" />
          
      </List>
    </Stack>
  );
};

export default ViewNotice;
