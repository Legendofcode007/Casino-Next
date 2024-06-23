import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
//import { findUserById } from "../../database/users";
import { getSession } from "next-auth/react";

const App = dynamic(() => import("../../src/admin/App"), { ssr: false });

const AdminPage = (props) => {
  return (
    <>
    
      <App props={props} />
    </>
  
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  //console.log('locale',context.locale)

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"+context.locale+"/signin",
      },
    };
  }

  if (session.user.role == "user") {
    return {
      redirect: {
        permanent: false,
        destination: "/"+context.locale,
      },
    };
  }

  //const id = session.user.id;
  //let user = await findUserById(id);

  let user = session.user;

  return { props: { user: JSON.parse(JSON.stringify(user)) } };
};

export default AdminPage;
