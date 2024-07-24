import {PrismaClient} from "@prisma/client"
import bcrypt from 'bcryptjs'
import { sendVerifcationMail } from "@/helpers/sendVerificationMail"

const client=new PrismaClient()

export async function POST(req:Request){
    try{
        const {email,password,username}=await req.json()
        const user=await client.user.findFirst({
            select:{
                email:true,
                isVerified:true
            },
            where:{
                email,
            }
        })

        const verifyCode=Math.floor(10000 + Math.random()* 900000).toString()
        
        if(user&&user.isVerified){
            return Response.json({
                    success:false,
                    message:"Username already taken"
                },{
                    status:400
                })
        }
        else if(user&&!user.isVerified){
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            await client.user.update({
                where:{
                    email
                },
                data:{
                    email,
                    password:hashedPassword,
                    username,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isAcceptingMessage:true
                }
            })

        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser=await client.user.create({
                data:{
                    email,
                    password:hashedPassword,
                    username,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isAcceptingMessage:true}
                })
                const emailResponse=await sendVerifcationMail(email,username,verifyCode)
                if(!emailResponse.success){
                    return Response.json({
                        success:false,
                        message:"error while sending mail"
                    },{
                        status:500
                    })
                }else{
                    return Response.json({
                        success:true,
                        message:"Check your inbox and verify your account"
                    },{
                        status:200
                    })
                }
            }
    }catch(error){
        console.log('Error while signing up ',error) 
        return Response.json({
            success:false,
            message:"Error while signing up"
        },{
            status:500
        })
    }
}