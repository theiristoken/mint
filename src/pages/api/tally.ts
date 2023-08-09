import { getFirestore, collection, getDocs, orderBy, query  } from "firebase/firestore";
import app from "../../firebase";
import type { NextApiRequest, NextApiResponse } from "next";

const firestore = getFirestore(app);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {

    

    const emoteRef = collection(firestore, "emotes");
    const emoteQuery = query(emoteRef, orderBy("open", "desc"));

    try {
      const emoteSnapshot = await getDocs(emoteQuery);
      if (!emoteSnapshot.empty){
        const data = emoteSnapshot.docs.map((doc) => (
          { 
            open: doc.data().open.seconds*1000,
            total: doc.data().total,
            e1: doc.data().e1?? 0,
            e1close: doc.data().e1close?.seconds?? 0,
            e2: doc.data().e2?? 0,
            e2close: doc.data().e2close?.seconds?? 0,
            e3: doc.data().e3?? 0,
            e3close: doc.data().e3close?.seconds?? 0,
            e4: doc.data().e4?? 0,
            e4close: doc.data().e4close?.seconds?? 0,
            e5: doc.data().e5?? 0,
            e5close: doc.data().e5close?.seconds?? 0,
            e6: doc.data().e6?? 0,
            e6close: doc.data().e6close?.seconds?? 0,
          }
        ));
        res.status(200).json(data);
      } else {
        res.status(201).json({data: "empty"});
      }
      
    } catch (error) {
      res.status(400).end();
    }
}