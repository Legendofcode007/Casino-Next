import axios from 'axios';
import getConfig from 'next/config'
import { AbleGamingClient } from "./client"

const { serverRuntimeConfig } = getConfig();

let client:AbleGamingClient; 




export const getAbleGamingClient = () => {
  if(client) { 
    return client;
  }
  client = new AbleGamingClient({
    apiKey: serverRuntimeConfig.API_KEY,
    callbackSecretKey: serverRuntimeConfig.CALLBACK_SECRET,
    url: serverRuntimeConfig.API_URL
  })

  return client;
}