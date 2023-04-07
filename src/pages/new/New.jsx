import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { DriveFolderUploadOutlined } from "@mui/icons-material"
import { useState } from "react"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";

const New = ({inputs, title}) => {
  const [file,setFile] = useState("")
  const [data,setData] = useState({})

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({...data, [id]: value })
  }

  console.log(data)

  const handleAdd = async (e) =>{
    e.preventDefault()
    try {
      const res = await createUserWithEmailAndPassword(auth,data.email,data.password)
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timeStamp: serverTimestamp()
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>{title}</h1>
          </div>
          <div className="bottom">
            <div className="left">
              <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
            </div>
            <div className="right">
              <form onSubmit={handleAdd}>
                <div className="formInput">
                  Image: <label htmlFor="file"><DriveFolderUploadOutlined className="icon"/></label>
                  <input type="file" id="file" onChange={(e)=>setFile(e.target.files[0])} style={{display: "none",}}/>
                </div>

                {inputs.map(input=>(
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput}/>
                  </div>
                ))}
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default New

{/* <div className="formInput">
<label>Name and Surname</label>
<input type="text" placeholder="John Doe" />
</div>
<div className="formInput">
<label>Email</label>
<input type="email" placeholder="john_doe@gmail.com" />
</div>
<div className="formInput">
<label>Phone</label>
<input type="text" placeholder="+1 123 345 6798" />
</div>
<div className="formInput">
<label>Password</label>
<input type="password" />
</div>
<div className="formInput">
<label>Address</label>
<input type="text" placeholder="Elton St. 216 New York" />
</div>
<div className="formInput">
<label>Country</label>
<input type="text" placeholder="USA" />
</div> */}