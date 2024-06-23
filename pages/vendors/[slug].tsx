import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState, useEffect, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { getAbleGamingClient } from "../../modules/api/getClient";
import clsx from "clsx";
import { CasinoCard, SlotCard, SlotCardList, CasinoCardList } from "../../src/user/components/VendorCard";
import { AbleGamingVendorInfo, GameType } from "../../modules/api/client";
import { VisualBox } from "../../src/user/components/VisualBox";
import { Typography } from "../../src/user/components/Typography";


type Props = {
  vendors: AbleGamingVendorInfo[],
  type: GameType
}

const Page = (props:Props) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const title = props.type === 'casino' ? 'CASINO':'SLOT';
  const subTitle = props.type === 'casino' ? '화끈한 한판승부':'돌려라! 잭팟을 터트려라!' 
  const src = props.type === 'casino' ? '/images/visual_entity_casino.png':'/images/visual_entity_slot.png';

  const mobileTitle = props.type === 'casino' ? '라이브카지노':'슬롯 게임';
  const mobileSubTitle = props.type === 'casino' ? 'live casino':'slotgame'

  const play = async (vendor_key: string) => {
    fetch('/api/games/get-lobby-url?vendor_key='+vendor_key, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
                    
        try {
          if (json.error == null) {
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=auto,height=auto,left=-1000,top=-1000`;

            window.open(json.data.url, 'game', params);
                
          }

          else {
            alert('An error occured. Please try again!')
          }
        }
        catch (err) {
          alert('An error occured. Please try again!')
        }

      });

  }

  const CardList = useMemo(()=>{
    if(props.type === 'casino') return <CasinoCardList> 
      {props.vendors.map((v)=><CasinoCard 
      key={v.id}
      title={v.title_ko} 
      subTitle={v.title} 
      logo_src={`/images/vendors/catxt_${v.id}.png`}
      src={`/images/vendors/ca_${v.id}.png`}
      onClick={()=>play(v.vendor_key)}
    />)}
    </CasinoCardList>;

    return <SlotCardList>
      
     {props.vendors.map((v=><SlotCard
      key={v.id}
      title={v.title_ko}
      logo_src={`/images/vendors/sl_${v.id}.png`}
      onClick={()=> router.push(`/games?vendor_key=${v.vendor_key}`)}
    />))}
    </SlotCardList>
  },[props.type,router])

  return (
    <section className="d-flex flex-column py-0 m-0 gap-4">
      <VisualBox title={title} subTitle={subTitle} src={src} className="d-none d-md-flex">
      </VisualBox>
      <div className="py-3 px-3 d-sm-flex d-md-none" style={{background:"#242424"}}>
        <Typography variant="h3" style={{margin:0}}>
          <Typography variant="span" animation>
            {mobileTitle}
          </Typography>
          <Typography variant="span" style={{color:'rgb(124, 115, 115)',fontSize:14,paddingLeft:3}}>
            {mobileSubTitle}
          </Typography>
        </Typography>

      </div>
      <section className="d-flex flex-column align-items-center p-0 px-2">
        {CardList}
      </section>
    </section>
  )
    
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
  const client = getAbleGamingClient();
  if (!session) return {
    redirect: {    
      destination: "/"+context.locale+"/signin",
      permanent: false
    }
  };

  let user = null;
  let games = null;
  let slug = context.params.slug;

  user = session.user;
   
  const result = await client.getVendors();
  const vendors = result?.data?.vendors?.filter(v=>v.type === slug) ?? []

  return { props: { user: JSON.parse(JSON.stringify(user)), vendors, type:slug } }

}
    
export default Page;