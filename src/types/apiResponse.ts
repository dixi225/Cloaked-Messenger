
interface message{
    content:string,
    createdAt:Date
}

export default interface apiResponse{
    success:boolean,
    message:string,
    messages?:message[]
}