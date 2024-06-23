import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { getAbleGamingClient } from "../../modules/api/getClient";
import { GameCard } from "../../src/user/components/GameCard";
import { AbleGamingGameInfo } from "../../modules/api/client";
import { Typography } from "../../src/user/components/Typography";
import { Button } from "../../src/user/components/Button";

type Props = {
  games: AbleGamingGameInfo[],
  vendor_key: string
}

const Page = (props:Props) => {

  const { t } = useTranslation('common');

  const limit=12;
  let [offset, setOffset] = useState(2);
  const [games, setGames] = useState(props.games);
  const [loadMore, setLoadMore] = useState(true);
  const [slug, setSlug] = useState(props.vendor_key);

  useEffect(() => {
  }, [games, offset]);

  const viewMore = async (e) => {
    e.preventDefault();
    getGames();
  }

  const getGames = async () => {

    console.log('offset',offset)

    setLoadMore(false)

    fetch('/api/games/get-provider-games?offset='+offset+'&slug='+slug+'&limit='+limit, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
        
        setOffset(offset+1);
            
        if (json.length < limit)
          setLoadMore(false)

        if(json.length==limit)
          setLoadMore(true);

        let data=JSON.stringify(games)
        data=JSON.parse(data);

        for(var i=0;i<json.length;i++)
          data.push(json[i]);

        setGames(data);

      });

  }


  const play = async (game_key:string) => {
    //console.log(game_key)

    fetch('/api/games/get-game-url?game_key='+game_key, {
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
    
  return (
    <>
      {games && (
        <section style={{padding:0,margin:0}} >
          <div className="container ">
            <div className="py-3 px-3 d-sm-flex " style={{background:"#242424"}}>
              <Typography variant="h3" style={{margin:0}}>
                <Typography variant="span" animation>
                  {games?.[0]?.title}
                </Typography>
              </Typography>
            </div>

            <div className="row justify-content-center">
              {games.map((game,idx) => (
                <GameCard 
                  key={idx} 
                  buttonName={t('Play')} 
                  onClick={()=>play(game.game_key)} 
                  src={game.thumbnail}
                  title={game.title}
                />
              ))}

            </div>
                        
            <ul className="pagination m-0 mt-2">
              {loadMore && (
                <Button type="submit" size="large" onClick={viewMore} animation>
                  {t('Load_More')}
                </Button>
              )}
            </ul>

          </div>
        </section>
                
      )}
        
    </>);
    
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
  if (!session) return {
    redirect: {
            
      destination: "/"+context.locale+"/signin",
      permanent: false
    }
  };

  let user = null;
  let games = null;
  const vendor_key = context.query.vendor_key;
  const client = await getAbleGamingClient();
 

  user = session.user;
  //console.log(slug);

 
  const res = await client.getGames({
    limit: 12,
    page:1,
    vendor_key: vendor_key
  })

  return {props: { 
    user: JSON.parse(JSON.stringify(user)), 
    games: res?.data?.games ?? [], 
    vendor_key:vendor_key 
  }}

}
    
export default Page;