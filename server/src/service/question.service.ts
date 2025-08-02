import { QuestionsModel } from '@/models/summary.model';
import { ObjectId } from 'mongodb';
export const Question = async ({params:{id}} : {params:{id:string}})=>{
  try {
    const item = await QuestionsModel.findOne({ _id: new ObjectId(id) })

    if (!item) {
      return{
        status:400,
        body:{error : "Item not found"}
      }
    }

    //return status(200).json(item)
    return {
      status: 200 ,
      body:item
    }
  } catch (error) {
    console.error('GET /api/questions error:', error)
    return {
      status:500 ,
      body:{error: "Internal Server Error"}
    }
  }
}