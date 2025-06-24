import { useEffect, useState } from "react"
import api from "../services/Api"
interface summsrizesType{
    id:number;
    content:string;
    CreatedAt:string;
    Language:string;
    FileId:number;
}
//להוסיף גם את המרצה ואת הקישור להרצאה
function ShowSummarizes(){

    const[summsrizes,setSummsrizes]=useState<summsrizesType[]>([])
    const[isLoading,setIsLoading]=useState(false)
    const[error,setError]=useState<string|null>()
   
    useEffect(()=>{
       const fetchSummarizes = async() =>{
           setIsLoading(true)
           setError(null)
           try{
           const response=await api.get<summsrizesType[]>('/Summary')
           setSummsrizes(response.data)
           }catch(error){
            setError('שגיאה בטעינת הסיכומים')
            console.log({error});
           }finally{
            setIsLoading(false)
           }
       }     
       fetchSummarizes()  
    },[])
    if(isLoading)return <div>טוען קבצים</div>
    if(error)return <div>{error}</div>
    if(summsrizes.length===0)return <div>אין קבצים להעלה</div>
    return(
    <>
    <div>
        <h3>הרצאות מסוכמות</h3>
        <ul>
            {summsrizes.map(summsrize=>(
                <li key={summsrize.id}>
                    <strong>Language</strong>:{summsrize.Language}
                    - {new Date(summsrize.CreatedAt).toLocaleString()}<br />
                      <strong>content</strong>:{summsrize.content}
                </li>
                
            ))}
        </ul>
    </div>
    </>
    )
}
export default ShowSummarizes