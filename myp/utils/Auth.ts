import storage from './Storage';

const Auth = {
  token:'',
  update:
    async (type,id,body)=>{

    const url ='https://buben-sha.herokuapp.com/api/records/'+type+'/'+id;
      return  await fetch(url, {
        method: "PUT",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ Auth.token
        },
        // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body:body
      }
      );

    },
check:
 async ()=>{
  return  storage
      .load({
        key: 'loginState',

        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,

        // syncInBackground (default: true) means if data expired,
        // return the outdated data first while invoking the sync method.
        // If syncInBackground is set to false, and there is expired data,
        // it will wait for the new data and return only after the sync completed.
        // (This, of course, is slower)
        syncInBackground: true,


        }
      )
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });







  }
,
  // maximum capacity, default 1000 key-ids
 login : async (e='ap@facereplays.com23',p='Pompon_22')=>{
   const url = 'https://buben-sha.herokuapp.com/oauth/token';
 const a =   await fetch(url, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
   // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
     body:JSON.stringify( {
       grant_type: 'password',
       client_id: '2',
       client_secret: 'YfIZVVJH5OMQ1R4XDm8eC7BNG49q3L5lWVVlZjTy',
       username: e,
       password: p,
       scope: ''
     }), // body data type must match "Content-Type" header
   })

await a.json().then(json=>{
json.email=e;
  Auth.token = json['access_token'];
  storage.save({
  key: 'loginState', // Note: Do not use underscore("_") in key!
  data: json,

  expires: 10000000 * 3600
});
  return json;
});





}
};

export default Auth;
