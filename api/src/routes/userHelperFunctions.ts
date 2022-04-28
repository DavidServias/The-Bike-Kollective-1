import {
  getAuthURL,
  get_tokens,
  getProfileInfo,
  printKeys,
  verifyAccessToken,
  get_renewed_access_token,
} from "../services/google_auth";
import {
  connectDB,
  addUsertoDB,
  findUserByIdentifier,
  findUserByID,
  findUserByAccessToekn,
  updateAccessTokeninDB,
  updateRefreshTokeninDB
} from "../db/db";

const verifyUserIdentity = (userFromDb:any,access_token:string) =>{

    return new Promise(async (resolve) => {
      if (userFromDb.length==0){
        resolve(400)
      }else if(userFromDb.length>1){
        resolve(500)
      }else if (userFromDb[0]['access_token']!=access_token){
        resolve(401)
      }
    
      const refreshTokenFromDB =userFromDb[0]['refresh_token'];
      console.log("refresh token from DB is:");
      console.log(refreshTokenFromDB);
    
      const identifierFromDB =userFromDb[0]['identifier'];
      console.log("identifier from DB is:");
      console.log(identifierFromDB);
    
      const idFromDB =userFromDb[0]['id'];
      console.log("idFromDB is:");
      console.log(idFromDB);
    
    
      // check validy of access token, and get a valid one if expired
      access_token = await verifyAccessToken(access_token, refreshTokenFromDB) as string;
    //   access_token = await get_renewed_access_token(access_token, refreshTokenFromDB) as string;
      console.log("new Access token is:");
      console.log(access_token);
    
    
      // verify user identity by checking identifier
      // TODO: keep or remove?
      const profileData = await getProfileInfo(access_token);
      
      const identifierFromGoogle =
          profileData["emailAddresses"]["0"]["metadata"]["source"]["id"];
    
      if(identifierFromGoogle==identifierFromDB){
        //update accesstoken in DB  
        await updateAccessTokeninDB(idFromDB,access_token)
        resolve(200)
      }else{
        resolve(400)
      }
    }) 
  }


  export{verifyUserIdentity}
  