import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props)=>{

    const notesInitial =[
            {
              "_id": "61595e88eade6a9154ec039c",
              "user": "6155cd35e351cd66258fdfa0",
              "title": "My Title 2",
              "description": "First Note by me",
              "tag": "personal",
              "date": "2021-10-03T07:40:56.829Z",
              "__v": 0
            },
            {
              "_id": "616ae9f84ceb8bf3862bb565",
              "user": "6155cd35e351cd66258fdfa0",
              "title": "My Title",
              "description": "description",
              "tag": "personal",
              "date": "2021-10-16T15:04:24.873Z",
              "__v": 0
            }
          ]
    const [notes, setNotes] = useState(notesInitial)
    return (
        <NoteContext.Provider value={{notes,setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;