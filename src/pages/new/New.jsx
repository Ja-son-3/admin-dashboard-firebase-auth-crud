import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { DriveFolderUploadOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const New = ({inputs, title}) => {
  const [file,setFile] = useState("")
  const [data,setData] = useState({})
  const [per, setPerc] = useState(null)

  useEffect(()=>{
    const uploadFile = ()=>{

      const name = new Date().getTime() + file.name
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = 
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setPerc(progress)
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          }, 
          (error) => {
            console.log(error)  
          }, 
          () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData((prev)=>({...prev, img:downloadURL}))
                  });
                }
      );
    }
    file && uploadFile()
  },[file])

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({...data, [id]: value })
  }

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
                <button disabled={per !== null && per < 100} type="submit">Send</button>
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