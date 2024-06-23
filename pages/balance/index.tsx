import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { findOneById } from "../../database/users";
import useTranslation from 'next-translate/useTranslation';
import { connectToDatabase } from "../../database/connection";

const Page: NextPage = (props) => {

  const { t } = useTranslation('common');

  return (
    <>
      {props.user && (
        <section className="relative pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-3 md:pb-3">
                <h1 className="h1">{t('My_Balance')}</h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <div className="flex items-center my-6">
                  <div
                    className="border-t border-gray-700 border-dotted grow mr-3"
                    aria-hidden="true"
                  ></div>

                  <div
                    className="border-t border-gray-700 border-dotted grow ml-3"
                    aria-hidden="true"
                  ></div>
                </div>



                <form className="w-full mb-12 max-w-lg">

                  <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">{t('Current_Balance_Cash')}</label>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="current_balance_cash" name="current_balance_cash" value={(!props.user.length ? 0 : props.user[0].current_balance_cash)} type="text" disabled />

                    </div>
                  </div>

                </form>

              </div>
              {/* END Form */}


                            







            </div>
          </div>
        </section>
      )}

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);

  if (!session) return {
    redirect: {
      destination: "/"+context.locale+"/signin",
      permanent: false
    }
  };
  const pool = await connectToDatabase();
  let userId = session.user.id;
  let user = await findOneById(userId);
    

  return { props: {user: JSON.parse(JSON.stringify(user))} }

};

export default Page;